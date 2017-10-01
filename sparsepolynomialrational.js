
// Author:  Anthony John Ripa
// Date:    9/30/2017
// SparsePolynomialRational : a datatype for representing sparse polynomials; an application of the SparsePlaceValueRational1 datatype

class sparsepolynomialrational extends abstractpolynomial1 {

    constructor(base, pv) {
        //if (arguments.length < 2) alert('sparsepolynomialrational expects 2 arguments');
        if (arguments.length < 1) base = 1;                             //  2017.9
        if (arguments.length < 2) pv = new sparseplacevaluerational1(); //  2017.9
        if (!(base instanceof String || typeof base == 'string' || typeof base == 'number'))
            { var s = 'SparsePolynomialRational arg1 (base) wants string not ' + typeof base + JSON.stringify(base); alert(s); throw new Error(s); }  //  2017.8
        if (!(pv instanceof sparseplacevaluerational1)) { var s = "sparsepolynomialrational expects arg 2 (pv) to be a sparsePVrational not " + typeof pv; alert(s); throw new Error(s); } //  2017.7
        super();
        this.base = base
        this.pv = pv;
    }

    parse(strornode) {  //  2017.9
        console.log('new sparsepolynomialrational : ' + JSON.stringify(strornode))
        if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialrational(a.base, sparseplacevaluerational1.parse(JSON.stringify(a.pv))) }
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
        if (node.type == 'SymbolNode') {
            console.log('new sparsepolynomialrational : SymbolNode')
            //var base = [node.name, null];
            var base = node.name;
            var pv = new sparseplacevaluerational1().parse("1E1");  //new sparseplacevaluerational1([[0, 1]]);
            return new sparsepolynomialrational(base, pv);
        } else if (node.type == 'OperatorNode') {
            console.log('new sparsepolynomialrational : OperatorNode')
            var kids = node.args;
            var a = sparsepolynomialrational.parse(kids[0]);       // sparsepolynomialrational handles unpreprocessed kid   2015.11
            if (node.fn == 'unaryMinus') {
                var c = new sparsepolynomialrational(1, sparseplacevaluerational1.parse(0)).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new sparsepolynomialrational(1, sparseplacevaluerational1.parse(0)).add(a);
            } else {
                var b = sparsepolynomialrational.parse(kids[1]);   // sparsepolynomialrational handles unpreprocessed kid   2015.11
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            return c;
        } else if (node.type == 'ConstantNode') {
            //return new sparsepolynomialrational([1, null], sparseplacevaluerational1.parse(Number(node.value)));
            return new sparsepolynomialrational(1, new sparseplacevaluerational1().parse(Number(node.value)));
        } else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
            alert('Syntax Error: sparsepolynomialrational expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
            return sparsepolynomialrational.parse(node.args[0]);
        }
    }

    //align(other) {
    //    if (this.pv.points.length == 1 & this.pv.points[0][1].is0()) this.base = other.base;
    //    if (other.pv.points.length == 1 & other.pv.points[0][1].is0()) other.base = this.base;
    //    if (this.base != other.base) { alert('Different bases : ' + JSON.stringify(this.base) + ' & ' + JSON.stringify(other.base)); return new sparsepolynomialrational(1, new //sparseplacevaluerational1(['%', 0])); }
    //}

    toString() {
        var points = this.pv.points;
        var ret = '';
        for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
            var power = points[i][1];
            //var digit = Math.round(points[i][0] * 1000) / 1000; // get() 2015.7
            var digit = points[i][0];
            if (!digit.is0()) {
                ret += '+';
                //if (power.every(function (x) { return x == 0; }))
                if (power.is0())
                    ret += digit.toString(false, true);
                else
                    ret += coefficient(digit) + this.base + sup(power);
            }
        }
        ret = ret.replace(/\+\-/g, '-');
        if (ret[0] == '+') ret = ret.substring(1);
        if (ret == '') ret = '0';
        return ret;
        function coefficient(digit) { return (!digit.is1() ? (!digit.negate().is1() ? digit : '-') : '').toString(false, true) }
        function sup(x) { return x.is1() ? '' : (!x.is1()) ? '^' + x.toString(false, true) : ''; }
    }

}
