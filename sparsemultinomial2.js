
// Author : Anthony John Ripa
// Date : 2/28/2017
// SparseMultinomial2 : a 2D datatype for representing sparse multinomials; an application of the SparsePlaceValue2 datatype

function sparsemultinomial2(base, pv) { //  2017.2
    if (arguments.length < 2) alert('sparsemultinomial2 expects 2 arguments');
    if (!Array.isArray(base)) alert('sparsemultinomial2 expects argument 1 (base) to be an array but found ' + typeof base);
    if (!(pv instanceof sparseplacevalue2)) alert('sparsemultinomial2 expects argument 2 (pv) to be a sparseplacevalue2');
    this.base = base
    this.pv = pv;
}

sparsemultinomial2.parse = function (strornode) {
    console.log('new sparsemultinomial2 : ' + JSON.stringify(strornode))
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsemultinomial2(a.base, new sparseplacevalue2(a.pv.points)) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('new sparsemultinomial2 : SymbolNode')
        var base = [node.name, null];
        var pv = sparseplacevalue2.parse("1E1");  //new sparseplacevalue2([[0, 1]]);
        return new sparsemultinomial2(base, pv);
    } else if (node.type == 'OperatorNode') {
        console.log('new sparsemultinomial2 : OperatorNode')
        var kids = node.args;
        var a = sparsemultinomial2.parse(kids[0]);       // sparsemultinomial2 handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new sparsemultinomial2([1, null], sparseplacevalue2.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsemultinomial2([1, null], sparseplacevalue2.parse(0)).add(a);
        } else {
            var b = sparsemultinomial2.parse(kids[1]);   // sparsemultinomial2 handles unpreprocessed kid   2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c;
    } else if (node.type == 'ConstantNode') {
        return new sparsemultinomial2([1, null], sparseplacevalue2.parse(Number(node.value)));
    } else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
        alert('Syntax Error: sparsemultinomial2 expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
        return sparsemultinomial2.parse(node.args[0]);
    }
}

sparsemultinomial2.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
    console.log(trace + ' sparsemultinomial2.prototype.tohtml');
    var ret = this.pv.toString() + ' Base ' + this.base;
    console.log(trace + ' sparsemultinomial2.prototype.tohtml : ' + ret);
    return ret;
}

sparsemultinomial2.prototype.toString = function () {
    if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
    return sparsemultinomial2.toStringXbase2(this.pv, this.base);
}

sparsemultinomial2.prototype.add = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.add(other.pv, 'sparsemultinomial2.prototype.add >'));
}

sparsemultinomial2.prototype.pointadd = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.pointadd(other.pv));
}

sparsemultinomial2.prototype.sub = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.sub(other.pv));
}

sparsemultinomial2.prototype.pointsub = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.pointsub(other.pv));
}

sparsemultinomial2.prototype.times = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.times(other.pv));
}

sparsemultinomial2.prototype.pointtimes = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.pointtimes(other.pv));
}

sparsemultinomial2.prototype.divide = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.divide(other.pv));
}

sparsemultinomial2.prototype.divideleft = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.divideleft(other.pv));
}

sparsemultinomial2.prototype.dividemiddle = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.dividemiddle(other.pv));
}

sparsemultinomial2.prototype.pointdivide = function (other) {
    this.align(other);
    return new sparsemultinomial2(this.base, this.pv.pointdivide(other.pv));
}

sparsemultinomial2.prototype.align = function (other) {    // obviate need for different kinds of addition 2015.7
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.points, other.pv.points)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
    //  function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }    //  2017.2
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

sparsemultinomial2.prototype.pow = function (other) { // 2015.7
    return new sparsemultinomial2(this.base, this.pv.pow(other.pv));
}

sparsemultinomial2.toStringXbase2 = function(pv, base) {   // Added namespace  2015.9
    var points = pv.points;
    var ret = '';
    for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
        var powerx = points[i][1][0];
        var powery = points[i][1][1];
        var digit = Math.round(points[i][0] * 1000) / 1000; // get() 2015.7
        if (points[i][0] != 0) {
            ret += '+';
            if (powerx == 0 && powery == 0)
                ret += digit;
            else {
                ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                if (powerx != 0) ret += base[0] + sup(powerx);
                if (powerx == 1 && powery != 0) ret += '*';
                if (powery != 0) ret += base[1] + sup(powery);
                //console.log('sparsemultinomial2.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
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

sparsemultinomial2.prototype.eval = function (base) {
    if (isNaN(this.base[1]))
        return new sparsemultinomial2([this.base[0], null], this.pv.eval(base.pv));
    else {
        var me = new sparsemultinomial2([null, null], sparseplacevalue2.parse(0));
        me.pv.points = this.pv.transpose().points;
        return new sparsemultinomial2([null, null], me.pv.eval(base.pv));
    }
}
