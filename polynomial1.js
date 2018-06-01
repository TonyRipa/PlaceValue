
// Author:  Anthony John Ripa
// Date:    5/31/2018
// Polynomial1: a 1-D datatype for representing polynomials; an application of the WholePlaceValue datatype

class polynomial1 extends abstractpolynomial {  //  2018.5  Rename polynomial

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
        //console.log('polynomial1 : arguments.length=' + arguments.length);
        if (Array.isArray(base)) alert('polynomial1 expects argument 1 (base) to be a string but found array: ' + typeof base);
        if (!(pv instanceof wholeplacevalue)) { var s = 'Polynomial1 expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        super();
        this.base = base;
        this.pv = pv;
    }

    parse(strornode) { //  2017.9
        console.log('<strornode>')
        console.log(strornode)
        console.log('</strornode>')
        if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomial1(a.base, this.pv.parse(JSON.stringify(a.pv))) } //  2017.10
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2018.4
        console.log('<node>')
        console.log(node)
        console.log('</node>')
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
            return new polynomial1(base, pv);
        } else if (node.type == 'OperatorNode') {
            console.log('OperatorNode')
            var kids = node.args;
            var a = this.parse(kids[0]);        // 2018.1   this.parse
            if (node.fn == 'unaryMinus') {
                var c = new polynomial1(1, this.pv.parse(0)).sub(a); //  2018.1  this.pv
            } else if (node.fn == 'unaryPlus') {
                var c = new polynomial1(1, this.pv.parse(0)).add(a); //  2018.1  this.pv
            } else {
                var b = this.parse(kids[1]);    //  2018.1  this.parse
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            return c
        } else if (node.type == 'ConstantNode') {
            console.log('ConstantNode: ' + node.value)
            return new polynomial1(1, this.pv.parse('(' + Number(node.value) + ')'));    //  2018.1 this.pv
        }
    }

    //polynomial1.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    //    return this.pv.tohtml(true) + ' base ' + this.base;
    //}
    //
    //polynomial1.prototype.toString = function () {
    //    return polynomial1.toStringXbase(this.pv, this.base);
    //}
    //
    //polynomial1.prototype.add = function (other) { this.align(other); return new polynomial1(this.base, this.pv.add(other.pv)); }
    //polynomial1.prototype.sub = function (other) { this.align(other); return new polynomial1(this.base, this.pv.sub(other.pv)); }
    //polynomial1.prototype.times = function (other) { this.align(other); return new polynomial1(this.base, this.pv.times(other.pv)); }
    //polynomial1.prototype.divide = function (other) { this.align(other); return new polynomial1(this.base, this.pv.divide(other.pv)); }
    //polynomial1.prototype.divideleft = function (other) { this.align(other); return new polynomial1(this.base, this.pv.divideleft(other.pv)); }
    //polynomial1.prototype.dividemiddle = function (other) { this.align(other); return new polynomial1(this.base, this.pv.dividemiddle(other.pv)); }
    //polynomial1.prototype.pointadd = function (other) { this.align(other); return new polynomial1(this.base, this.pv.pointadd(other.pv)); }
    //polynomial1.prototype.pointsub = function (other) { this.align(other); return new polynomial1(this.base, this.pv.pointsub(other.pv)); }
    //polynomial1.prototype.pointtimes = function (other) { this.align(other); return new polynomial1(this.base, this.pv.pointtimes(other.pv)); }
    //polynomial1.prototype.pointdivide = function (other) { this.align(other); return new polynomial1(this.base, this.pv.pointdivide(other.pv)); }

    align(other) {    // Consolidate alignment    2015.9
        if (this.pv.mantisa.length == 1) this.base = other.base;
        if (other.pv.mantisa.length == 1) other.base = this.base;
        if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomial1(1, new wholeplacevalue(['%'])) }
    }

    //polynomial1.prototype.pow = function (other) { // 2015.6
    //    return new polynomial1(this.base, this.pv.pow(other.pv));
    //}

    toString() {
        var pv = this.pv;
        var base = this.base;
        console.log('polynomial1: pv = ' + pv);
        var x = pv.mantisa;
        console.log('polynomial1.toStringXbase: x=' + x);
        if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
            x.pop();                                    // Replace shift with pop because L2R 2015.7
            return polynomial1.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
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
            console.log('polynomial1.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
        }
        ret = ret.replace(/\+\-/g, '-');
        if (ret[0] == '+') ret = ret.substring(1);
        if (ret == '') ret = '0';
        return ret;
        function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
    }

    //polynomial1.prototype.eval = function (base) {   //  rational    2016.7
    //    var sum = new rational(0);
    //    for (var i = 0; i < this.pv.mantisa.length; i++) {
    //        sum = sum.add(this.pv.get(i).times(base.pv.get(0).pow(i)));
    //    }
    //    return new polynomial1(1, new wholeplacevalue([sum]));
    //}

}
