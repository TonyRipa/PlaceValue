
// Author : Anthony John Ripa
// Date : 2/28/2017
// SparsePolynomial : a datatype for representing sparse polynomials; an application of the SparsePlaceValue1 datatype

function sparsepolynomial(base, pv) {
    if (arguments.length < 2) alert('sparsepolynomial expects 2 arguments');
    if (Array.isArray(base)) alert('sparsepolynomial expects argument 1 (base) to be a string but found array: ' + typeof base);
    if (!(pv instanceof sparseplacevalue1)) {   //  2017.2
        alert('sparsepolynomial expects argument 2 (pv) to be a sparseplacevalue1 but found arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
        console.trace();
    }
    this.base = base;
    this.pv = pv;
}

sparsepolynomial.parse = function (strornode) {
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomial(a.base, sparseplacevalue1.parse(JSON.stringify(a.pv))) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        var base = node.name;
        //var pv = [0, 1];
        return new sparsepolynomial(base, sparseplacevalue1.parse('1e1'));
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        var a = sparsepolynomial.parse(kids[0]);        // sparsepolynomial handles unpreprocessed kid    2015.11
        if (node.fn == 'unaryMinus') {
            var c = new sparsepolynomial(1, sparseplacevalue1.parse(0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsepolynomial(1, sparseplacevalue1.parse(0)).add(a);
        } else {
            var b = sparsepolynomial.parse(kids[1]);    // sparsepolynomial handles unpreprocessed kid    2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new sparsepolynomial(1, sparseplacevalue1.parse(Number(node.value)));
    }
}

sparsepolynomial.prototype.tohtml = function () {       // Replacement for toStringInternal 2015.7
    return this.pv.toString(true) + ' base ' + this.base;
}

sparsepolynomial.prototype.toString = function () {
    return sparsepolynomial.toStringXbase(this.pv, this.base);
}

sparsepolynomial.prototype.add = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.add(other.pv)); }
sparsepolynomial.prototype.sub = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.sub(other.pv)); }
sparsepolynomial.prototype.times = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.times(other.pv)); }
sparsepolynomial.prototype.divide = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.divide(other.pv)); }
sparsepolynomial.prototype.divideleft = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.divideleft(other.pv)); }
sparsepolynomial.prototype.dividemiddle = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.dividemiddle(other.pv)); }
sparsepolynomial.prototype.pointadd = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointadd(other.pv)); }
sparsepolynomial.prototype.pointsub = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointsub(other.pv)); }
sparsepolynomial.prototype.pointtimes = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointtimes(other.pv)); }
sparsepolynomial.prototype.pointdivide = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointdivide(other.pv)); }
sparsepolynomial.prototype.pointpow = function (other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointpow(other.pv)); }

sparsepolynomial.prototype.align = function (other) {   // Consolidate alignment    2015.9
    if (this.pv.points.length == 1 & this.pv.points[0][1] == 0) this.base = other.base;
    if (other.pv.points.length == 1 & other.pv.points[0][1] == 0) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomial(1, new sparseplacevalue1(['%', 0])); }
}

sparsepolynomial.prototype.pow = function (other) {     // 2015.6
    return new sparsepolynomial(this.base, this.pv.pow(other.pv));
}

sparsepolynomial.toStringXbase = function (pv, base) {  // added namespace  2015.7
    console.log('sparsepolynomial: pv = ' + pv);
    var x = pv.points;
    console.log('sparsepolynomial.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {         // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                        // Replace shift with pop because L2R 2015.7
        return sparsepolynomial.toStringXbase(new sparseplacevalue1(x, 0), base);   // added namespace  2015.7
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
        console.log('sparsepolynomial.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
}

sparsepolynomial.prototype.eval = function (base) {
    return new sparsepolynomial(1, this.pv.eval(base.pv));
}
