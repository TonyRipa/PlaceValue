
// Author:  Anthony John Ripa
// Date:    10/31/2017
// SparsePolynomialNumber : a datatype for representing sparse polynomials; an application of the SparsePlaceValueNumber1 datatype

function sparsepolynomialnumber(base, pv) {
    //if (arguments.length < 2) alert('sparsepolynomialnumber expects 2 arguments');
    if (arguments.length < 1) base = 1;                     //  2017.9
    if (arguments.length < 2) pv = new sparseplacevaluenumber1(); //  2017.9
    if (Array.isArray(base)) alert('sparsepolynomialnumber expects argument 1 (base) to be a string but found array: ' + typeof base);
    if (!(pv instanceof sparseplacevaluenumber1)) { var s = 'sparsepolynomialnumber expects arg 2 to be sparseplacevaluenumber1 not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
    this.base = base;
    this.pv = pv;
}

sparsepolynomialnumber.prototype.parse = function (strornode) {   //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialnumber(a.base, new sparseplacevaluenumber1().parse(JSON.stringify(a.pv))) } //  2017.10
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        var base = node.name;
        var pv = this.pv.parse('1e1');
        return new sparsepolynomialnumber(base, pv);
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        var a = this.parse(kids[0]);        // sparsepolynomialnumber handles unpreprocessed kid    2015.11
        if (node.fn == 'unaryMinus') {
            var c = new sparsepolynomialnumber(1, sparseplacevaluenumber1.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsepolynomialnumber(1, sparseplacevaluenumber1.parse(0)).add(a);
        } else {
            var b = this.parse(kids[1]);    // sparsepolynomialnumber handles unpreprocessed kid    2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new sparsepolynomialnumber(1, new sparseplacevaluenumber1().parse(Number(node.value)));
    }
}

sparsepolynomialnumber.prototype.tohtml = function () {       // Replacement for toStringInternal 2015.7
    return this.pv.toString(true) + ' base ' + this.base;
}

sparsepolynomialnumber.prototype.toString = function () {
    return sparsepolynomialnumber.toStringXbase(this.pv, this.base);
}

sparsepolynomialnumber.prototype.add = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.add(other.pv)); }
sparsepolynomialnumber.prototype.sub = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.sub(other.pv)); }
sparsepolynomialnumber.prototype.times = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.times(other.pv)); }
sparsepolynomialnumber.prototype.divide = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.divide(other.pv)); }
sparsepolynomialnumber.prototype.divideleft = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.divideleft(other.pv)); }
sparsepolynomialnumber.prototype.dividemiddle = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.dividemiddle(other.pv)); }
sparsepolynomialnumber.prototype.pointadd = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.pointadd(other.pv)); }
sparsepolynomialnumber.prototype.pointsub = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.pointsub(other.pv)); }
sparsepolynomialnumber.prototype.pointtimes = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.pointtimes(other.pv)); }
sparsepolynomialnumber.prototype.pointdivide = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.pointdivide(other.pv)); }
sparsepolynomialnumber.prototype.pointpow = function (other) { this.align(other); return new sparsepolynomialnumber(this.base, this.pv.pointpow(other.pv)); }

sparsepolynomialnumber.prototype.align = function (other) {   // Consolidate alignment    2015.9
    if (this.pv.points.length == 1 & this.pv.points[0][1] == 0) this.base = other.base;
    if (other.pv.points.length == 1 & other.pv.points[0][1] == 0) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomialnumber(1, new sparseplacevaluenumber1(['%', 0])); }
}

sparsepolynomialnumber.prototype.pow = function (other) {     // 2015.6
    return new sparsepolynomialnumber(this.base, this.pv.pow(other.pv));
}

sparsepolynomialnumber.toStringXbase = function (pv, base) {  // added namespace  2015.7
    console.log('sparsepolynomialnumber: pv = ' + pv);
    var x = pv.points;
    console.log('sparsepolynomialnumber.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {         // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                        // Replace shift with pop because L2R 2015.7
        return sparsepolynomialnumber.toStringXbase(new sparseplacevaluenumber1(x, 0), base);   // added namespace  2015.7
    }
    var ret = '';
    var maxbase = x.length - 1
    for (var i = maxbase; i >= 0; i--) {
        var digit = Math.round(1000 * x[i][0]) / 1000;
        var power = x[i][1]
        if (digit != 0) {
            ret += '+';
            if (power == 0)
                ret += digit;
            else if (power == 1)
                ret += coefficient(digit) + base;
            else
                ret += coefficient(digit) + base + '^' + power;
        }
        console.log('sparsepolynomialnumber.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
}

sparsepolynomialnumber.prototype.eval = function (base) {
    return new sparsepolynomialnumber(1, this.pv.eval(base.pv));
}
