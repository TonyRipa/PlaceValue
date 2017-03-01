
// Author : Anthony John Ripa
// Date : 2/28/2017
// SparseMultinomial : a datatype for representing sparse multinomials; an application of the sparseplacevalue datatype

function sparsemultinomial(base, pv) {
    if (arguments.length < 2) alert('sparsemultinomial expects 2 arguments');
    if (!Array.isArray(base)) alert('sparsemultinomial expects argument 1 (base) to be an array but found ' + typeof base);
    if (!(pv instanceof sparseplacevalue)) alert('sparsemultinomial expects argument 2 (pv) to be a sparseplacevalue');
    this.base = base
    this.pv = pv;
    return;
}

sparsemultinomial.parse = function (strornode) {
    console.log('new sparsemultinomial : ' + JSON.stringify(strornode))
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsemultinomial(a.base, new sparseplacevalue(a.pv.points)) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
    if (node.type == 'SymbolNode') {
        console.log('new sparsemultinomial : SymbolNode')
        //var base = [node.name, null];
        var base = [node.name];
        var pv = sparseplacevalue.parse("1E1");  //new sparseplacevalue([[0, 1]]);
        return new sparsemultinomial(base, pv);
    } else if (node.type == 'OperatorNode') {
        console.log('new sparsemultinomial : OperatorNode')
        var kids = node.args;
        var a = sparsemultinomial.parse(kids[0]);       // sparsemultinomial handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new sparsemultinomial([], sparseplacevalue.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsemultinomial([], sparseplacevalue.parse(0)).add(a);
        } else {
            var b = sparsemultinomial.parse(kids[1]);   // sparsemultinomial handles unpreprocessed kid   2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c;
    } else if (node.type == 'ConstantNode') {
        //return new sparsemultinomial([1, null], sparseplacevalue.parse(Number(node.value)));
        return new sparsemultinomial([], sparseplacevalue.parse(Number(node.value)));
    } else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
        alert('Syntax Error: sparsemultinomial expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
        return sparsemultinomial.parse(node.args[0]);
    }
}

sparsemultinomial.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
    console.log(trace + ' sparsemultinomial.prototype.tohtml');
    var ret = this.pv.toString() + ' Base ' + this.base;
    console.log(trace + ' sparsemultinomial.prototype.tohtml : ' + ret);
    return ret;
}

sparsemultinomial.prototype.toString = function () {
    if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
    return sparsemultinomial.toStringXbase2(this.pv, this.base);
}

sparsemultinomial.prototype.add = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.add(other.pv));
}

sparsemultinomial.prototype.pointadd = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.pointadd(other.pv));
}

sparsemultinomial.prototype.sub = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.sub(other.pv));
}

sparsemultinomial.prototype.pointsub = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.pointsub(other.pv));
}

sparsemultinomial.prototype.times = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.times(other.pv));
}

sparsemultinomial.prototype.pointtimes = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.pointtimes(other.pv));
}

sparsemultinomial.prototype.divide = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.divide(other.pv));
}

sparsemultinomial.prototype.divideleft = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.divideleft(other.pv));
}

sparsemultinomial.prototype.dividemiddle = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.dividemiddle(other.pv));
}

sparsemultinomial.prototype.pointdivide = function (other) {
    this.align(other);
    return new sparsemultinomial(this.base, this.pv.pointdivide(other.pv));
}

sparsemultinomial.prototype.align = function (other) {  // 2017.2
    var base1 = this.base.slice();
    var base2 = other.base.slice();
    var base = [...new Set([...base1, ...base2])];
    //base.sort().reverse();
    //if (base[0] == 1) base.shift();
    //alert(JSON.stringify([base1, base2, base]));
    alignmulti2base(this, base);
    alignmulti2base(other, base);
    this.pv = new sparseplacevalue(this.pv.points);     //  2017.2  Clean this's zeros
    function alignmulti2base(multi, basenew) {
        for (var i = 0; i < multi.pv.points.length; i++)
            alignmultidigit2base(multi, i, basenew);
        function alignmultidigit2base(multi, index, basenew) {
            var digitnew = [];
            var baseold = multi.base;
            var digitold = multi.pv.points[index]
            var digitpowerold = digitold[1];
            for (var i = 0; i < basenew.length; i++) {
                var letter = basenew[i];
                var posinold = baseold.indexOf(letter);
                if (posinold == -1) { digitnew.push(0); }
                else {
                    var temp = digitpowerold[posinold] | 0;
                    //alert(JSON.stringify([basenew,digitpowerold,posinold,temp]));
                    digitnew.push(digitpowerold[posinold] | 0);
                }
            }
            if (digitnew.length != basenew.length) alert('bad');
            //alert(digitnew)
            multi.pv.points[index][1] = digitnew;
        }
        multi.base = basenew;
    }
}

sparsemultinomial.prototype.alignold = function (other) {    // obviate need for different kinds of addition 2015.7
        //alert(JSON.stringify([this, other]));
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.points, other.pv.points)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
    function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }
    function flip(me, it) {
        it.base = me.base = [me.base[1], me.base[0]];
        me.pv = me.pv.transpose();
        it.pv = it.pv.transpose();
    }
    function alignHelper(it, me) {
        function isnum(x) { return !isNaN(x) }
        try {
            if (isnum(it.base[0]) && isnum(it.base[1])) {
                it.base = me.base;
            } else if (it.base[0] == me.base[0] && isnum(it.base[1])) {
                it.base = me.base;
            } else if (it.base[1] == me.base[1] && isnum(it.base[0])) {
                it.base = me.base;
            } else if (it.base[0] == me.base[1] && it.base[1] == me.base[0]) {
                it.base = me.base;
                it.pv = it.pv.transpose();  // mathjs transpose 2015.7
                return true	// signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && isnum(it.base[1])) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv = it.pv.transpose();  // mathjs transpose 2015.7
                return true	// signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && it.base[1] == me.base[0]) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv = it.pv.transpose();  // mathjs transpose 2015.7
                return true	// signal flip	2015.8
            }
        } catch (e) { alert(e.stack); }
    }
}

sparsemultinomial.prototype.pow = function (other) { // 2015.7
    return new sparsemultinomial(this.base, this.pv.pow(other.pv));
}

sparsemultinomial.toStringXbase2 = function (pv, base) {   // Added namespace  2015.9
    var letters = ['x', 'y', 'z', 't', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
    var points = pv.points;
    var ret = '';
    for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
        var power = points[i][1];
        var digit = Math.round(points[i][0] * 1000) / 1000; // get() 2015.7
        if (digit != 0) {
            ret += '+';
            if (power.every(function (x) { return x == 0; }))
                ret += digit;
            else {
                ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                for (var j = 0; j < power.length; j++) {
                    if (power[j] != 0) ret += base[j] + sup(power[j]);
                    if (power[j] == 1) ret += '*';
                }
                if (ret.slice(-1) == '*') ret = ret.slice(0, -1);
                //if (powerx != 0) ret += base[0] + sup(powerx);
                //if (powerx == 1 && powery != 0) ret += '*';
                //if (powery != 0) ret += base[1] + sup(powery);
            }
        }
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function sup(x) {
        if (x == 1) return '';
        return (x != 1) ? '^' + x : '';
    }
}

sparsemultinomial.prototype.eval = function (base) {    //  2017.2
    return new sparsemultinomial(this.base.slice(0,-1), this.pv.eval(base.pv));
}
