
// Author : Anthony John Ripa
// Date : 9/30/2017
// Polynomial : a datatype for representing polynomials; an application of the WholePlaceValue datatype

function polynomial(arg, pv) {
    if (arguments.length < 1) arg = 1;                      //  2017.9
    if (arguments.length < 2) pv = new wholeplacevalue();   //  2017.9
    console.log('polynomial : arguments.length=' + arguments.length);
    this.base = arg;
    if (pv instanceof Object && JSON.stringify(pv).indexOf('mantisa') != -1)  // 2015.8
        this.pv = pv;
    else if (typeof pv == 'number') {
        console.log("polynomial: typeof pv == 'number'");
        this.pv = new wholeplacevalue([pv])
        console.log(this.pv.toString());
    }
    else
        { var s = 'Polynomial expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        //alert('polynomial: bad arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
}

polynomial.prototype.parse = function (strornode) { //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomial(a.base, wholeplacevalue.parse(JSON.stringify(a.pv))) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        var base = node.name;
        //var pv = [0, 1];
        return new polynomial(base, new wholeplacevalue().parse(10));
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        var a = new polynomial().parse(kids[0]);        // polynomial handles unpreprocessed kid    2015.11
        if (node.fn == 'unaryMinus') {
            var c = new polynomial(1, wholeplacevalue.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new polynomial(1, wholeplacevalue.parse(0)).add(a);
        } else {
            var b = new polynomial().parse(kids[1]);    // polynomial handles unpreprocessed kid    2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new polynomial(1, new wholeplacevalue().parse('(' + Number(node.value) + ')'));
    }
}

polynomial.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base ' + this.base;
}

polynomial.prototype.toString = function () {
    return polynomial.toStringXbase(this.pv, this.base);
}

polynomial.prototype.add = function (other) { this.align(other); return new polynomial(this.base, this.pv.add(other.pv)); }
polynomial.prototype.sub = function (other) { this.align(other); return new polynomial(this.base, this.pv.sub(other.pv)); }
polynomial.prototype.times = function (other) { this.align(other); return new polynomial(this.base, this.pv.times(other.pv)); }
polynomial.prototype.divide = function (other) { this.align(other); return new polynomial(this.base, this.pv.divide(other.pv)); }
polynomial.prototype.divideleft = function (other) { this.align(other); return new polynomial(this.base, this.pv.divideleft(other.pv)); }
polynomial.prototype.dividemiddle = function (other) { this.align(other); return new polynomial(this.base, this.pv.dividemiddle(other.pv)); }
polynomial.prototype.pointadd = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointadd(other.pv)); }
polynomial.prototype.pointsub = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointsub(other.pv)); }
polynomial.prototype.pointtimes = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointtimes(other.pv)); }
polynomial.prototype.pointdivide = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointdivide(other.pv)); }
polynomial.prototype.pointpow = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointpow(other.pv)); }

polynomial.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.mantisa.length == 1) this.base = other.base;
    if (other.pv.mantisa.length == 1) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomial(1, new wholeplacevalue(['%'])) }
}

polynomial.prototype.pow = function (other) { // 2015.6
    return new polynomial(this.base, this.pv.pow(other.pv));
}

polynomial.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    console.log('polynomial: pv = ' + pv);
    var x = pv.mantisa;
    console.log('polynomial.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return polynomial.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1
    for (var power = maxbase; power >= 0; power--) {                    // power is index because whole is L2R  2015.7 
        var digit = Math.round(1000 * str[power].toreal()) / 1000;      // toreal  2016.7 
        if (digit != 0) {
            ret += '+';
            if (power == 0)
                ret += digit;
            else if (power == 1)
                ret += coefficient(digit) + base;
            else
                ret += coefficient(digit) + base + '^' + power;
        }
        console.log('polynomial.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
}

polynomial.prototype.eval = function (base) {   //  rational    2016.7
    var sum = new rational(0);
    for (var i = 0; i < this.pv.mantisa.length; i++) {
        sum = sum.add(this.pv.get(i).times(base.pv.get(0).pow(i)));
    }
    return new polynomial(1, new wholeplacevalue([sum]));
}
