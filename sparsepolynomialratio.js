
// Author:  Anthony John Ripa
// Date:    8/31/2017
// SparsePolynomialRatio : a datatype for representing rational expressions; an application of the PlaceValueRatio datatype

function sparsepolynomialratio(arg, pv) {
    console.log('sparsepolynomialratio : arguments.length=' + arguments.length);
    this.base = arg;
    if (pv instanceof sparseplacevalueratio)  // 2017.6
        this.pv = pv;
    else if (typeof pv == 'number') {
        console.log("sparsepolynomialratio: typeof pv == 'number'");
        this.pv = new wholeplacevalue([pv])
        console.log(this.pv.toString());
    }
    else
        alert('sparsepolynomialratio: bad arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
}

sparsepolynomialratio.parse = function (strornode) {
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialratio(a.base, sparseplacevalueratio.parse(JSON.stringify(a.pv))) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        var base = node.name;
        var pv = '1e1'//10;
        return new sparsepolynomialratio(base, sparseplacevalueratio.parse(pv));
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        var a = sparsepolynomialratio.parse(kids[0]);        // sparsepolynomialratio handles unpreprocessed kid    2015.11
        if (node.fn == 'unaryMinus') {
            var c = new sparsepolynomialratio(1, sparseplacevalueratio.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsepolynomialratio(1, sparseplacevalueratio.parse(0)).add(a);
        } else {
            var b = sparsepolynomialratio.parse(kids[1]);    // sparsepolynomialratio handles unpreprocessed kid    2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new sparsepolynomialratio(1, sparseplacevalueratio.parse(node.value));
    }
}

sparsepolynomialratio.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    return this.pv.toString() + ' base ' + this.base;
}

sparsepolynomialratio.prototype.toString = function () {
    var num = sparsepolynomialratio.toStringXbase(this.pv.num, this.base);
    if (this.pv.den.is1()) return num;
    num = (count(this.pv.num.points) < 2) ? num : '(' + num + ')';
    var den = sparsepolynomialratio.toStringXbase(this.pv.den, this.base);
    den = (count(this.pv.den.points) < 2) ? den : '(' + den + ')';
    return num + '/' + den;
    function count(array) {
        return array.length;
        //return array.reduce(function (prev, curr) { return prev + Math.abs(Math.sign(curr)) }, 0);
    }
}

sparsepolynomialratio.prototype.add = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.add(other.pv));
}

sparsepolynomialratio.prototype.sub = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.sub(other.pv));
}

sparsepolynomialratio.prototype.times = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.times(other.pv));
}

sparsepolynomialratio.prototype.divide = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.divide(other.pv));
}

sparsepolynomialratio.prototype.divideleft = function (other) {   //  2016.8
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.divideleft(other.pv));
}

sparsepolynomialratio.prototype.pointadd = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointadd(other.pv));
}

sparsepolynomialratio.prototype.pointsub = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointsub(other.pv));
}

sparsepolynomialratio.prototype.pointtimes = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointtimes(other.pv));
}

sparsepolynomialratio.prototype.pointdivide = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointdivide(other.pv));
}

sparsepolynomialratio.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
    if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomialratio(1, sparseplacevalueratio.parse('%')) }
}

sparsepolynomialratio.prototype.pow = function (other) { // 2015.6
    return new sparsepolynomialratio(this.base, this.pv.pow(other.pv));
}

sparsepolynomialratio.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    //alert(JSON.stringify([pv, base]));
    console.log('sparsepolynomialratio: pv = ' + pv);
    var x = pv.points;
    console.log('sparsepolynomialratio.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return sparsepolynomialratio.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1// + exp;
    for (var i = maxbase; i >= 0; i--) {
        //var digit = Math.round(1000 * str[power].toreal()) / 1000;  // toreal  2016.8
        var digit = str[i][0];
        var power = str[i][1];
        if (!digit.is0()) {
            ret += '+';
            if (power.is0())
                ret += digit;
            else if (power.is1())
                ret += coefficient(digit) + base;
            else
                ret += coefficient(digit) + base + '^' + power;
        }
        console.log('sparsepolynomialratio.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit.is1() ? '' : digit.negate().is1() ? '-' : digit).toString(false, true) + (isFinite(digit.toreal()) ? '' : '*') }    //  2017.8
}

sparsepolynomialratio.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.pv.mantisa.length; i++) {
        sum += this.pv.get(i) * Math.pow(base, i);
    }
    return new sparsepolynomialratio(1, new wholeplacevalue([sum]));
}
