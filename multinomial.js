
// Author : Anthony John Ripa
// Date : 9/27/2015
// Multinomial : a datatype for representing multinomials; an application of the WholePlaceValue2 datatype

function multinomial(arg, pv) {
    console.log('new multinomial : arguments.length=' + arguments.length);
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
                console.log("new multinomial1 : ");
            } else {
                parse(this, arg);
                console.log("new multinomial2 : " + JSON.stringify(this));
                return;
            }
        } else {
            this.base = [1, null];
            this.pv = new wholeplacevalue2([[arg]], 'new multinomial3 >');;
            console.log("new multinomial3 : " + JSON.stringify(this));
            return;
        }
        this.base = base;
        this.pv = new wholeplacevalue2(pv, 'new multinomial4 >');
        console.log("new multinomial4 : " + JSON.stringify(this));
    } else {
        this.base = arg;
        if (pv instanceof wholeplacevalue2){
            this.pv = pv;
            console.log("new multinomial5 : " + JSON.stringify(this));
        }
        else if (typeof pv == 'number') {
            this.pv = new wholeplacevalue2(pv, 'new multinomial >')
            console.log("new multinomial6 : " + JSON.stringify(this));
        }
        else
            alert('multinomial: bad arg typeof(arg2)=' + typeof (pv));
    }
    function parse(me, strornode) {
        console.log('new multinomial : ' + JSON.stringify(strornode))
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            console.log('new multinomial : SymbolNode')
            base = [node.name, null];
            pv = 10;
            me.base = base;
            me.pv = new wholeplacevalue2(pv, 'new multinomial >');
            console.log('new multinomial : parse1 : base = ' + JSON.stringify(me.base));
        } else if (node.type == 'OperatorNode') {
            console.log('new multinomial : OperatorNode')
            var kids = node.args;
            var a = new multinomial(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
            if (node.fn == 'unaryMinus') {
                var c = new multinomial(0).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new multinomial(0).add(a);
            } else {
                var b = new multinomial(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) :(node.op == '|') ? a.eval(b) : a.pow(b);
            }
            me.base = c.base;
            me.pv = c.pv;
            console.log('new multinomial : parse2 : base = ' + JSON.stringify(me.base));
        }
    }
}

multinomial.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
    console.log(trace + ' multinomial.prototype.tohtml');
    var ret = this.pv.tohtml(trace + ' multinomial.prototype.tohtml >') + ' Base ' + this.base;
    console.log(trace + ' multinomial.prototype.tohtml : ' + ret);
    return ret;
}

multinomial.prototype.toString = function () {
    if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
    return multinomial.toStringXbase2(this.pv, this.base);
}

multinomial.prototype.add = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.add(other.pv, 'multinomial.prototype.add >'));
}

multinomial.prototype.pointadd = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.pointadd(other.pv));
}

multinomial.prototype.sub = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.sub(other.pv));
}

multinomial.prototype.pointsub = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.pointsub(other.pv));
}

multinomial.prototype.times = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.times(other.pv));
}

multinomial.prototype.pointtimes = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.pointtimes(other.pv));
}

multinomial.prototype.divide = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.divide(other.pv));
}

multinomial.prototype.pointdivide = function (other) {
    this.align(other);
    return new multinomial(this.base, this.pv.pointdivide(other.pv));
}

multinomial.prototype.align = function (other) {    // obviate need for different kinds of addition 2015.7
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.mantisa, other.pv.mantisa)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
    function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }
    function flip(me, it) {
        it.base = me.base = [me.base[1], me.base[0]];
        me.pv.mantisa = math.transpose(me.pv.mantisa);
        it.pv.mantisa = math.transpose(it.pv.mantisa);
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
                it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
		return true	// signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && isnum(it.base[1])) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
		return true	// signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && it.base[1] == me.base[0]) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
		return true	// signal flip	2015.8
            }
        } catch (e) { alert(e.stack); }
    }
}

multinomial.prototype.pow = function (other) { // 2015.7
    return new multinomial(this.base, this.pv.pow(other.pv));
}

multinomial.toStringXbase2 = function(pv, base) {   // Added namespace  2015.9
    var man = pv.mantisa;
    console.log('multinomial.toStringXbase2: man=' + man);
    var ret = '';
    var row = man[0]//.toString().replace('.', '');
    for (var c = row.length - 1; c >= 0; c--) {
        for (var r = 0; r < man.length; r++) {
            var powerx = c;      // power is index because whole is L2R  2015.7
            var powery = r;      // power is index because whole is L2R  2015.7
            var digit = Math.round(pv.get(r, c) * 1000) / 1000; // get() 2015.7
            if (pv.get(r, c) != 0) {
                ret += '+';
                if (powerx == 0 && powery == 0)
                    ret += digit;
                else {
                    ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                    if (powerx != 0) ret += base[0] + sup(powerx);
                    if (powerx == 1 && powery != 0) ret += '*';
                    if (powery != 0) ret += base[1] + sup(powery);
                    //console.log('multinomial.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
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

multinomial.prototype.eval = function (base) {	// 2015.8
    if (isNaN(this.base[1]))
	return new multinomial([this.base[0], null], this.pv.eval(base));
    else {
	var me = new multinomial(0);
	me.pv.mantisa = math.transpose(this.pv.mantisa);
	return new multinomial([null, null], me.pv.eval(base));
    }
}
