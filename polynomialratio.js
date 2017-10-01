
// Author : Anthony John Ripa
// Date : 9/30/2017
// PolynomialRatio : a datatype for representing rational expressions; an application of the PlaceValueRatio datatype

function polynomialratio(arg, pv) {
    if (arguments.length < 1) base = 1;                     //  2017.9
    if (arguments.length < 2) pv = new placevalueratio();   //  2017.9
    console.log('polynomialratio : arguments.length=' + arguments.length);
    this.base = arg;
    if (pv instanceof Object && JSON.stringify(pv).indexOf('mantisa') != -1)  // 2015.8
        this.pv = pv;
    else if (typeof pv == 'number') {
        console.log("polynomialratio: typeof pv == 'number'");
        this.pv = new wholeplacevalue([pv])
        console.log(this.pv.toString());
    }
    else
        { var s = 'PolynomialRatio expects arg 2 to be PlaceValueRatio not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        //alert('polynomialratio: bad arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
}

polynomialratio.prototype.parse = function (strornode) {    //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomialratio(a.base, placevalueratio.parse(JSON.stringify(a.pv))) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        var base = node.name;
        var pv = 10;
        return new polynomialratio(base, new placevalueratio().parse(pv));
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        //var a = new polynomialratio(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        var a = polynomialratio.parse(kids[0]);        // polynomialratio handles unpreprocessed kid    2015.11
        if (node.fn == 'unaryMinus') {
            var c = new polynomialratio(1, placevalueratio.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new polynomialratio(1, placevalueratio.parse(0)).add(a);
        } else {
            //var b = new polynomialratio(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = polynomialratio.parse(kids[1]);    // polynomialratio handles unpreprocessed kid    2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new polynomialratio(1, new placevalueratio(new wholeplacevalue().parse('(' + Number(node.value) + ')'), new wholeplacevalue().parse(1)));
    }
}

polynomialratio.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    return this.pv.toString() + ' base ' + this.base;
}

polynomialratio.prototype.toString = function () {
    var num = polynomialratio.toStringXbase(this.pv.num, this.base);
    if (this.pv.den.is1()) return num;
    num = (count(this.pv.num.mantisa) < 2) ? num : '(' + num + ')';
    var den = polynomialratio.toStringXbase(this.pv.den, this.base);
    den = (count(this.pv.den.mantisa) < 2) ? den : '(' + den + ')';
    return num + '/' + den;
    function count(array) {
        return array.reduce(function (prev, curr) { return prev + Math.abs(Math.sign(curr)) }, 0);
    }
}

polynomialratio.prototype.add = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.add(other.pv));
}

polynomialratio.prototype.sub = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.sub(other.pv));
}

polynomialratio.prototype.times = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.times(other.pv));
}

polynomialratio.prototype.divide = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.divide(other.pv));
}

polynomialratio.prototype.divideleft = function (other) {   //  2016.8
    this.align(other);
    return new polynomialratio(this.base, this.pv.divideleft(other.pv));
}

polynomialratio.prototype.pointadd = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.pointadd(other.pv));
}

polynomialratio.prototype.pointsub = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.pointsub(other.pv));
}

polynomialratio.prototype.pointtimes = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.pointtimes(other.pv));
}

polynomialratio.prototype.pointdivide = function (other) {
    this.align(other);
    return new polynomialratio(this.base, this.pv.pointdivide(other.pv));
}

polynomialratio.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.num.mantisa.length == 1) this.base = other.base;
    if (other.pv.num.mantisa.length == 1) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomialratio(1, placevalueratio.parse('%')) }
}

polynomialratio.prototype.pow = function (other) { // 2015.6
    return new polynomialratio(this.base, this.pv.pow(other.pv));
}

polynomialratio.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    console.log('polynomialratio: pv = ' + pv);
    var x = pv.mantisa;
    console.log('polynomialratio.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return polynomialratio.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1// + exp;
    for (var power = maxbase; power >= 0; power--) {                // power is index because whole is L2R  2015.7 
        var digit = Math.round(1000 * str[power].toreal()) / 1000;  // toreal  2016.8
        if (digit != 0) {
            ret += '+';
            if (power == 0)
                ret += digit;
            else if (power == 1)
                ret += coefficient(digit) + base;
            else
                ret += coefficient(digit) + base + '^' + power;
        }
        console.log('polynomialratio.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
}

polynomialratio.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.pv.mantisa.length; i++) {
        sum += this.pv.get(i) * Math.pow(base, i);
    }
    return new polynomialratio(1, new wholeplacevalue([sum]));
}
