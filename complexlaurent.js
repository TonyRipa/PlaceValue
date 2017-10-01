
// Author : Anthony John Ripa
// Date : 9/30/2017
// ComplexLaurent : a 2d datatype for representing Complex Laurent multinomials; an application of the ComplexPlaceValue datatype

function complexlaurent(base, pv) {
    //if (arguments.length < 2) alert('complexlaurent expects 2 arguments');
    if (arguments.length < 1) base = [];                    //  2017.9
    if (arguments.length < 2) pv = new complexplacevalue(); //  2017.9
    if (!Array.isArray(base)) { var s = "complexlaurent expects argument 1 (base) to be an array not " + typeof pv; alert(s); throw new Error(s); }
    if (!(pv instanceof complexplacevalue)) { var s = "complexlaurent expects argument 2 (pv) to be a complexplacevalue not " + typeof pv; alert(s); throw new Error(s); }
    this.base = base
    this.pv = pv;
}

complexlaurent.prototype.parse = function (strornode) { //  2017.9
    var me = new complexlaurent([null, null], complexplacevalue[0]);
    console.log('new complexlaurent : ' + JSON.stringify(strornode))
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new complexlaurent(a.base, new complexplacevalue(new wholeplacevaluecomplex2(a.pv.whole.mantisa), a.pv.exp)) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('new complexlaurent : SymbolNode')
        if (node.name == 'i') {
            me.base = [1, null];
            me.pv = new complexplacevalue(new wholeplacevaluecomplex2([[{ 'r': 0, 'i': 1 }]]), [0, 0]);
        } else {
            base = [node.name, null];
            me.base = base;
            me.pv = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);    // exp is 2D    2015.10
            console.log('new complexlaurent : parse1 : base = ' + JSON.stringify(me.base));
        }
    } else if (node.type == 'OperatorNode') {
        console.log('new complexlaurent : OperatorNode')
        var kids = node.args;
        //var a = new complexlaurent(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        var a = new complexlaurent().parse(kids[0]);      // complexlaurent handles unpreprocessed kid  2015.11
        if (node.fn == 'unaryMinus') {
            var c = new complexlaurent([null, null], complexplacevalue[0]).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new complexlaurent([null, null], complexplacevalue[0]).add(a);
        } else {
            //var b = new complexlaurent(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = new complexlaurent().parse(kids[1]);  // complexlaurent handles unpreprocessed kid  2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        me.base = c.base;
        me.pv = c.pv;
        console.log('new complexlaurent : parse2 : base = ' + JSON.stringify(me.base));
    } else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
        if (node.name == 'i') { var i = math.parse('i*q'); i.args[1] = node.args[0]; return new complexlaurent().parse(i) } // interpret function i(x) as product i*x     2016.2
        alert('Syntax Error: complexlaurent expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
        var k = complexlaurent.parse(node.args[0]);
        me.base = k.base;
        me.pv = k.pv;
    } else if (node.type == 'ConstantNode') {
        me.base = [1, null];
        me.pv = new complexplacevalue(new wholeplacevaluecomplex2([[Number(node.value)]]), [0, 0]);
    }
    return me;
}

complexlaurent.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
    console.log(trace + ' complexlaurent.prototype.tohtml');
    var ret = this.pv.tohtml(trace + ' complexlaurent.prototype.tohtml >') + ' Base ' + this.base;
    console.log(trace + ' complexlaurent.prototype.tohtml : ' + ret);
    return ret;
}

complexlaurent.prototype.toString = function () {
    if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
    return complexlaurent.toStringXbase2(this.pv, this.base);
}

complexlaurent.prototype.add = function (other) {
    //alert(JSON.stringify([this, other]));
    this.align(other);
    return new complexlaurent(this.base, this.pv.add(other.pv, 'complexlaurent.prototype.add >'));
}

complexlaurent.prototype.pointadd = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.pointadd(other.pv));
}

complexlaurent.prototype.sub = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.sub(other.pv));
}

complexlaurent.prototype.pointsub = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.pointsub(other.pv));
}

complexlaurent.prototype.times = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.times(other.pv));
}

complexlaurent.prototype.pointtimes = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.pointtimes(other.pv));
}

complexlaurent.prototype.divide = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.divide(other.pv));
}

complexlaurent.prototype.pointdivide = function (other) {
    this.align(other);
    return new complexlaurent(this.base, this.pv.pointdivide(other.pv));
}

complexlaurent.prototype.align = function (other) {    // obviate need for different kinds of addition 2015.7
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.mantisa, other.pv.mantisa)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('ComplexLaurent Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
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
            alert('complexlaurent.align: Error\n\nStackTrace:\n' + e.stack);
        }
    }
}

complexlaurent.prototype.pow = function (other) { // 2015.7
    return new complexlaurent(this.base, this.pv.pow(other.pv));
}

complexlaurent.toStringXbase2 = function(pv, base) {
    console.log('complexlaurent.toStringXbase2: pv=' + JSON.stringify(pv));
    var man = pv.whole.mantisa;
    var exp = pv.exp;   // 2015.10
    var ret = '';
    var row = man[0]//.toString().replace('.', '');
    for (var c = row.length - 1; c >= 0; c--) {
        for (var r = 0; r < man.length; r++) {
            var powerx = c + exp[0];    // power is index because whole is L2R  2015.7  // + exp[0] 2015.10
            var powery = r + exp[1];    // power is index because whole is L2R  2015.7  // + exp[1] 2015.10
            var real = Math.round(pv.whole.getreal(r, c) * 1000) / 1000; // get() 2015.7
            var imag = Math.round(pv.whole.getimag(r, c) * 1000) / 1000; // get() 2015.7
            var digit = imag == 0 ? real : real == 0 ? (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i' : real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i';
            //var digit = Math.round(pv.whole.get(r, c) * 1000) / 1000; // get() 2015.7
            if (real != 0 || imag != 0) {
                ret += '+';
                if (powerx == 0 && powery == 0)
                    ret += digit;
                else {
                    //ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                    //ret += '(' + digit + ')';
                    if (imag == 0) ret += coefficient(real);
                    else if (real == 0) ret += (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i*';
                    else ret += '(' + real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i)';
                    if (powerx != 0) ret += base[0] + sup(powerx);
                    if (powerx == 1 && powery != 0) ret += '*';
                    if (powery != 0) ret += base[1] + sup(powery);
                    //console.log('complexlaurent.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
                }
            }
        }
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*'); }
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

complexlaurent.prototype.eval = function (base) {	// 2015.8
    //alert(JSON.stringify(base))
    if (isNaN(this.base[1])) {
        //alert('isnan')
        return new complexlaurent([this.base[0], null], this.pv.eval(base.pv));
    }
    else {
        //alert('isntnan')
        var me = new complexlaurent([null, null], complexplacevalue[0]);
        me.pv.whole.mantisa = (this.pv.whole.mantisa[0].length > 0) ? math.transpose(this.pv.whole.mantisa) : [[]]; //  mathJS can't transpose [[]] 2015.12
        me.pv.exp = this.pv.exp.slice(0);   //  Infuse me w/ this's exp 2015.11
        me.pv.exp.push(me.pv.exp.shift());  //  Exp transposed like Mantisa
        //alert(JSON.stringify(base))
        return new complexlaurent([null, null], me.pv.eval(base.pv));
    }
}
