
// Author : Anthony John Ripa
// Date : 11/30/2015
// Laurent2 : a 2d datatype for representing Laurent multinomials; an application of the PlaceValue2 datatype

function laurent2(arg, pv) {
    console.log('new laurent2 : arguments.length=' + arguments.length);
    if (arguments.length < 2) {
        var base;
        var pv;
        if (isNaN(arg)) {
            if ((arg instanceof String || typeof (arg) == 'string') && arg.indexOf('base') != -1) {    // if arg is json of polynomial-object
                var argObj = JSON.parse(arg);
                console.log('argObj=' + JSON.stringify(argObj));
                base = argObj.base;
                console.log('argObj.base=' + JSON.stringify(argObj.base));
                pv = argObj.pv;
                console.log('argObj.pv=' + JSON.stringify(argObj.pv));
                console.log("new laurent21 : ");
            } else {
                parse(this, arg);
                console.log("new laurent22 : " + JSON.stringify(this));
                return;
            }
        } else {
            this.base = [1, null];
            this.pv = new placevalue2([[arg]], [0, 0]); // exp is 2D    2015.10
            console.log("new laurent23 : " + JSON.stringify(this));
            return;
        }
        this.base = base;
        this.pv = new placevalue2(pv, 'new laurent24 >');
        console.log("new laurent24 : " + JSON.stringify(this));
    } else {
        this.base = arg;
        if (pv instanceof placevalue2){
            this.pv = pv;
            console.log("new laurent25 : " + JSON.stringify(this));
        }
        else if (typeof pv == 'number') {
            this.pv = new placevalue2(pv, 'new laurent2 >')
            console.log("new laurent26 : " + JSON.stringify(this));
        }
        else
            alert('laurent2: bad arg typeof(arg2)=' + typeof (pv));
    }
    function parse(me, strornode) {
        console.log('new laurent2 : ' + JSON.stringify(strornode))
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            console.log('new laurent2 : SymbolNode')
            base = [node.name, null];
            //pv = 10;
            me.base = base;
            me.pv = new placevalue2(1, [1, 0]);    // exp is 2D    2015.10
            console.log('new laurent2 : parse1 : base = ' + JSON.stringify(me.base));
        } else if (node.type == 'OperatorNode') {
            console.log('new laurent2 : OperatorNode')
            var kids = node.args;
            //var a = new laurent2(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
            var a = new laurent2(kids[0]);      // laurent2 handles unpreprocessed kid  2015.11
            if (node.fn == 'unaryMinus') {
                var c = new laurent2(0).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new laurent2(0).add(a);
            } else {
                //var b = new laurent2(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
                var b = new laurent2(kids[1]);  // laurent2 handles unpreprocessed kid  2015.11
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            me.base = c.base;
            me.pv = c.pv;
            console.log('new laurent2 : parse2 : base = ' + JSON.stringify(me.base));
        }
    }
}

laurent2.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
    console.log(trace + ' laurent2.prototype.tohtml');
    var ret = this.pv.tohtml(trace + ' laurent2.prototype.tohtml >') + ' Base ' + this.base;
    console.log(trace + ' laurent2.prototype.tohtml : ' + ret);
    return ret;
}

laurent2.prototype.toString = function () {
    if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
    return laurent2.toStringXbase2(this.pv, this.base);
}

laurent2.prototype.add = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.add(other.pv, 'laurent2.prototype.add >'));
}

laurent2.prototype.pointadd = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.pointadd(other.pv));
}

laurent2.prototype.sub = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.sub(other.pv));
}

laurent2.prototype.pointsub = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.pointsub(other.pv));
}

laurent2.prototype.times = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.times(other.pv));
}

laurent2.prototype.pointtimes = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.pointtimes(other.pv));
}

laurent2.prototype.divide = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.divide(other.pv));
}

laurent2.prototype.pointdivide = function (other) {
    this.align(other);
    return new laurent2(this.base, this.pv.pointdivide(other.pv));
}

laurent2.prototype.align = function (other) {    // obviate need for different kinds of addition 2015.7
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.mantisa, other.pv.mantisa)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
    //function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }
    function flip(me, it) {
        it.base = me.base = [me.base[1], me.base[0]];
        me.pv.whole.mantisa = math.transpose(me.pv.whole.mantisa);
        it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa);
        me.pv.exp.push(me.pv.exp.shift())  // flip exp // 2015.10
        it.pv.exp.push(it.pv.exp.shift())  // flip exp // 2015.10
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
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && isnum(it.base[1])) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && it.base[1] == me.base[0]) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            }
        } catch (e) {
            alert(e.stack);
        }
    }
}

laurent2.prototype.pow = function (other) { // 2015.7
    return new laurent2(this.base, this.pv.pow(other.pv));
}

laurent2.toStringXbase2 = function(pv, base) {
    var man = pv.whole.mantisa;
    var exp = pv.exp;   // 2015.10
    console.log('laurent2.toStringXbase2: man=' + man);
    var ret = '';
    var row = man[0]//.toString().replace('.', '');
    for (var c = row.length - 1; c >= 0; c--) {
        for (var r = 0; r < man.length; r++) {
            var powerx = c + exp[0];    // power is index because whole is L2R  2015.7  // + exp[0] 2015.10
            var powery = r + exp[1];    // power is index because whole is L2R  2015.7  // + exp[1] 2015.10
            var digit = Math.round(pv.whole.get(r, c) * 1000) / 1000; // get() 2015.7
            if (pv.whole.get(r, c) != 0) {
                ret += '+';
                if (powerx == 0 && powery == 0)
                    ret += digit;
                else {
                    ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                    if (powerx != 0) ret += base[0] + sup(powerx);
                    if (powerx == 1 && powery != 0) ret += '*';
                    if (powery != 0) ret += base[1] + sup(powery);
                    //console.log('laurent2.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
                }
            }
        }
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function sup(x) {
	if (x == 1) return '';
        return ugly(x);
        function ugly(x) { return (x != 1) ? '^' + x : ''; }
        function pretty(x) {
            return x.toString().split('').map(
                function (x) { return { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[x]; }).join('');
        }
    }
}

laurent2.prototype.eval = function (base) {	// 2015.8
    if (isNaN(this.base[1]))
        return new laurent2([this.base[0], null], this.pv.eval(base));
    else {
        var me = new laurent2(0);
        me.pv.whole.mantisa = math.transpose(this.pv.whole.mantisa);
        me.pv.exp = this.pv.exp.slice(0);   //  Infuse me w/ this's exp 2015.11
        return new laurent2([null, null], me.pv.eval(base));
    }
}
