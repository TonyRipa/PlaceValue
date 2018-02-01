
// Author:  Anthony John Ripa
// Date:    1/31/2018
// Polynomial: a datatype for representing polynomials; an application of the WholePlaceValue datatype

class polynomial extends abstractpolynomial {

    constructor(arg) {
        var base, pv;
        if (arguments.length == 0)[base, pv] = [1, new wholeplacevalue(rational)];      //  2018.1
        if (arguments.length == 1) {                                                    //  2018.1
            if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new wholeplacevalue(arg)];    //  2017.11 rationalcomplex
            else[base, pv] = [arg, new wholeplacevalue(rational)];
        }
        if (arguments.length == 2)[base, pv] = arguments;
        //if (arguments.length < 1) arg = 1;                      //  2017.9
        //if (arguments.length < 2) pv = new wholeplacevalue();   //  2017.9
        //console.log('polynomial : arguments.length=' + arguments.length);
        if (Array.isArray(base)) alert('polynomial expects argument 1 (base) to be a string but found array: ' + typeof base);
        if (!(pv instanceof wholeplacevalue)) { var s = 'Polynomial expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        //if (pv instanceof Object && JSON.stringify(pv).indexOf('mantisa') != -1)  // 2015.8
        //    this.pv = pv;
        //else if (typeof pv == 'number') {
        //    console.log("polynomial: typeof pv == 'number'");
        //    this.pv = new wholeplacevalue([pv])
        //    console.log(this.pv.toString());
        //}
        //else
        //    { var s = 'Polynomial expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        super();
        this.base = base;
        this.pv = pv;
    }

    parse(strornode) { //  2017.9
        console.log('<strornode>')
        console.log(strornode)
        console.log('</strornode>')
        if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomial(a.base, this.pv.parse(JSON.stringify(a.pv))) } //  2017.10
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            console.log('SymbolNode')
            //var base = node.name;
            //var pv = this.pv.parse(10);
            if (node.name.match(this.pv.datatype.regexfull())) {    //  2018.1
                var base = 1;
                var pv = this.pv.parse(node.name);
            } else {
                var base = node.name;
                var pv = this.pv.parse('10');
            }
            return new polynomial(base, pv);
        } else if (node.type == 'OperatorNode') {
            console.log('OperatorNode')
            var kids = node.args;
            var a = this.parse(kids[0]);        // 2018.1   this.parse
            if (node.fn == 'unaryMinus') {
                var c = new polynomial(1, this.pv.parse(0)).sub(a); //  2018.1  this.pv
            } else if (node.fn == 'unaryPlus') {
                var c = new polynomial(1, this.pv.parse(0)).add(a); //  2018.1  this.pv
            } else {
                var b = this.parse(kids[1]);    //  2018.1  this.parse
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            return c
        } else if (node.type == 'ConstantNode') {
            return new polynomial(1, this.pv.parse('(' + Number(node.value) + ')'));    //  2018.1 this.pv
        }
    }

    //polynomial.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    //    return this.pv.tohtml(true) + ' base ' + this.base;
    //}
    //
    //polynomial.prototype.toString = function () {
    //    return polynomial.toStringXbase(this.pv, this.base);
    //}
    //
    //polynomial.prototype.add = function (other) { this.align(other); return new polynomial(this.base, this.pv.add(other.pv)); }
    //polynomial.prototype.sub = function (other) { this.align(other); return new polynomial(this.base, this.pv.sub(other.pv)); }
    //polynomial.prototype.times = function (other) { this.align(other); return new polynomial(this.base, this.pv.times(other.pv)); }
    //polynomial.prototype.divide = function (other) { this.align(other); return new polynomial(this.base, this.pv.divide(other.pv)); }
    //polynomial.prototype.divideleft = function (other) { this.align(other); return new polynomial(this.base, this.pv.divideleft(other.pv)); }
    //polynomial.prototype.dividemiddle = function (other) { this.align(other); return new polynomial(this.base, this.pv.dividemiddle(other.pv)); }
    //polynomial.prototype.pointadd = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointadd(other.pv)); }
    //polynomial.prototype.pointsub = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointsub(other.pv)); }
    //polynomial.prototype.pointtimes = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointtimes(other.pv)); }
    //polynomial.prototype.pointdivide = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointdivide(other.pv)); }
    //polynomial.prototype.pointpow = function (other) { this.align(other); return new polynomial(this.base, this.pv.pointpow(other.pv)); }

    align(other) {    // Consolidate alignment    2015.9
        if (this.pv.mantisa.length == 1) this.base = other.base;
        if (other.pv.mantisa.length == 1) other.base = this.base;
        if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomial(1, new wholeplacevalue(['%'])) }
    }

    //polynomial.prototype.pow = function (other) { // 2015.6
    //    return new polynomial(this.base, this.pv.pow(other.pv));
    //}

    toString() {
        var pv = this.pv;
        var base = this.base;
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
            //var digit = Math.round(1000 * str[power].toreal()) / 1000;      // toreal  2016.7 
            var digit = str[power].toString(false, true);
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

    //polynomial.prototype.eval = function (base) {   //  rational    2016.7
    //    var sum = new rational(0);
    //    for (var i = 0; i < this.pv.mantisa.length; i++) {
    //        sum = sum.add(this.pv.get(i).times(base.pv.get(0).pow(i)));
    //    }
    //    return new polynomial(1, new wholeplacevalue([sum]));
    //}

}