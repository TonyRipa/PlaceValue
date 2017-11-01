
// Author:  Anthony John Ripa
// Date:    10/31/2017
// SparsePolynomial: a datatype for representing sparse polynomials; an application of the SparsePlaceValue1 datatype

class sparsepolynomial extends abstractpolynomial {

    constructor(arg) {
        var base, pv;
        if (arguments.length == 0)[base, pv] = [1, new sparseplacevalue1(rational)];    //  2017.10
        if (arguments.length == 1) {                                                    //  2017.10
            if (arg === rational || arg === complex)[base, pv] = [1, new sparseplacevalue1(arg)];
            else[base, pv] = [arg, new sparseplacevalue1(rational)];
        }
        if (arguments.length == 2)[base, pv] = arguments;
        //if (arguments.length < 1) base = 1;                     //  2017.9
        //if (arguments.length < 2) pv = new sparseplacevalue1(); //  2017.9
        if (Array.isArray(base)) alert('sparsepolynomial expects argument 1 (base) to be a string but found array: ' + typeof base);
        if (!(pv instanceof sparseplacevalue1)) { var s = 'SparsePolynomial expects arg 2 to be SparsePlaceValue1 not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        super();
        this.base = base;
        this.pv = pv;
    }

    parse(strornode) {   //  2017.9
        console.log('<strornode>')
        console.log(strornode)
        console.log('</strornode>')
        if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomial(a.base, this.pv.parse(JSON.stringify(a.pv))) } //  2017.10
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            console.log('SymbolNode: node.name = ' + node.name);
            if (node.name.match(this.pv.datatype.regex())) {    //  2017.10
                var base = 1;
                var pv = this.pv.parse(node.name);  //  2017.10
            } else {
                var base = node.name;
                var pv = this.pv.parse('1e1');  //  2017.10
            }
            return new sparsepolynomial(base, pv);
        } else if (node.type == 'OperatorNode') {
            console.log('OperatorNode')
            var kids = node.args;
            var a = this.parse(kids[0]);        // sparsepolynomial handles unpreprocessed kid    2015.11
            if (node.fn == 'unaryMinus') {
                var c = new sparsepolynomial(1, this.pv.parse(0)).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new sparsepolynomial(1, this.pv.parse(0)).add(a);
            } else {
                var b = this.parse(kids[1]);    // sparsepolynomial handles unpreprocessed kid    2015.11
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            return c
        } else if (node.type == 'ConstantNode') {
            //alert(JSON.stringify(this.pv.points))
            return new sparsepolynomial(1, this.pv.parse(Number(node.value)));
        }
    }

    //tohtml() {       // Replacement for toStringInternal 2015.7
    //    //return this.pv.toString(true) + ' base ' + this.base;
    //    return JSON.stringify(this.pv.points) + ' base ' + this.base;
    //}

    //toString() {
    //    return sparsepolynomial.toStringXbase(this.pv, this.base);
    //}

    //add(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.add(other.pv)); }
    //sub(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.sub(other.pv)); }
    //times(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.times(other.pv)); }
    //divide(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.divide(other.pv)); }
    //divideleft(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.divideleft(other.pv)); }
    //dividemiddle(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.dividemiddle(other.pv)); }
    //pointadd(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointadd(other.pv)); }
    //pointsub(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointsub(other.pv)); }
    //pointtimes(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointtimes(other.pv)); }
    //pointdivide(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointdivide(other.pv)); }
    //pointpow(other) { this.align(other); return new sparsepolynomial(this.base, this.pv.pointpow(other.pv)); }

    //align(other) {   // Consolidate alignment    2015.9
    //    if (this.pv.points.length == 1 & this.pv.points[0][1] == 0) this.base = other.base;
    //    if (other.pv.points.length == 1 & other.pv.points[0][1] == 0) other.base = this.base;
    //    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomial(1, new sparseplacevalue1(['%', 0])); }
    //}

    //pow(other) {     // 2015.6
    //    return new sparsepolynomial(this.base, this.pv.pow(other.pv));
    //}

    toString() {
        var pv = this.pv;
        var base = this.base;
        console.log('sparsepolynomial: pv = ' + pv);
        var x = pv.points;
        console.log('sparsepolynomial.toStringXbase: x=' + x);
        //if (x[x.length - 1] == 0 && x.length > 1) {         // Replace 0 w x.length-1 because L2R 2015.7
        //    x.pop();                                        // Replace shift with pop because L2R 2015.7
        //    return sparsepolynomial.toStringXbase(new sparseplacevalue1(x, 0), base);   // added namespace  2015.7
        //}
        var ret = '';
        var maxbase = x.length - 1
        for (var i = maxbase; i >= 0; i--) {
            //var digit = Math.round(1000 * x[i][0]) / 1000;
            var digit = x[i][0];    //  2017.10
            var power = x[i][1]
            if (digit != 0) {
                ret += '+';
                if (power == 0)
                    ret += digit.toString(false, true);
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
        function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString(false, true) + (isFinite(digit) ? '' : '*') }
    }

    //eval(base) {
    //    return new sparsepolynomial(1, this.pv.eval(base.pv));
    //}

}
