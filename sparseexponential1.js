
// Author:  Anthony John Ripa
// Date:    8/31/2017
// SparseExponential1 : a datatype for representing sparse complex exponentials; an application of the SparsePlaceValueRational1 datatype

class sparseexponential1 extends abstractpolynomial1 {

    constructor(base, pv) {
        if (arguments.length < 2) alert('sparseexponential1 expects 2 arguments');
        if (!(base instanceof String || typeof base == 'string' || base instanceof Number || typeof base == 'number'))
            { var s = 'sparseexponential1 expects arg1 (base) to be a string or number not ' + typeof base + ': ' + JSON.stringify(base); alert(s); throw new Error(s); }
        if (!(pv instanceof sparseplacevaluerational1)) alert('sparseexponential1 expects argument 2 (pv) to be a sparseplacevaluerational1');
        super();
        this.base = base
        this.pv = pv;
    }

    tohtml() {
        return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
    }

    static parse(strornode) {
        console.log('new sparseexponential1 : ' + JSON.stringify(strornode))
        if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponential1(a.base, sparseplacevaluerational1.parse(JSON.stringify(a.pv))) }
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
        if (node.type == 'SymbolNode') {
            console.log('new sparseexponential1 : SymbolNode')
            //if (node.name == 'i') return new sparseexponential1([], sparseplacevaluerational1.parse('i'));
            { var s = 'Syntax Error: sparseexponential1 expects input like 1, exp(x), cosh(y), exp(z), sinh(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
            //var base = [node.name];
            //var pv = sparseplacevaluerational1.parse("1E1");  //new sparseplacevaluerational1([[0, 1]]);
            //return new sparseexponential1(base, pv);
        } else if (node.type == 'OperatorNode') {
            console.log('new sparseexponential1 : OperatorNode')
            var kids = node.args;
            var a = sparseexponential1.parse(kids[0]);       // sparseexponential1 handles unpreprocessed kid   2015.11
            if (node.fn == 'unaryMinus') {
                var c = new sparseexponential1([], sparseplacevaluerational1.parse(0)).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new sparseexponential1([], sparseplacevaluerational1.parse(0)).add(a);
            } else {
                var b = sparseexponential1.parse(kids[1]);   // sparseexponential1 handles unpreprocessed kid   2015.11
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            return c;
        } else if (node.type == 'ConstantNode') {
            //return new sparseexponential1([1, null], sparseplacevaluerational1.parse(Number(node.value)));
            return new sparseexponential1(1, sparseplacevaluerational1.parse(Number(node.value)));
        } else if (node.type == 'FunctionNode') {
            console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
            console.log(node)
            var fn = node.name;
            var kids = node.args;
            //var kidaspoly = complexlaurent.parse(kids[0])
            var kidaspoly = sparsepolynomialrational.parse(kids[0])
            var base = kidaspoly.base;
            var ten = sparseplacevaluerational1.parse('1E1');   // exp is 2D    2016.1
            //var iten = sparseplacevaluerational1.parse('1Ei');   // exp is 2D    2016.1
            //alert(JSON.stringify([kidaspoly, ones, tens, itens]));
            var exp = kidaspoly.pv//sparseplacevaluerational1.parse('2.718').pow(kidaspoly.pv);  //  2017.5
            var exp = sparseplacevaluerational1.parse('2.718').pow(kidaspoly.pv);  //  2017.5
            //alert(JSON.stringify(exp))
            //var expi = sparseplacevaluerational1.parse('2.718').pow(kidaspoly.pv.times(sparseplacevaluerational1.parse('i')));  //  2017.5
            var exp2 = exp.pow(-1)
            //var expi2 = expi.pow(-1)
            //alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
            //alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
            if (fn == 'exp') var pv = exp;
            //else if (fn == 'cis') var pv = expi;
            //else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
            else if (fn == 'cosh') var pv = exp.add(exp2).scale(.5);
            //else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
            //else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
            else if (fn == 'sinh') var pv = exp.sub(exp2).scale(.5);
            //else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
            else alert('Syntax Error: sparseexponential1 expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');    //  Check   2015.12
            return new sparseexponential1(base, pv);
        } else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
            alert('Syntax Error: sparseexponential1 expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
            return sparseexponential1.parse(node.args[0]);
        }
    }

    //align(other) {
    //    if (this.pv.points.length == 1 && this.pv.points[0][1].is0()) this.base = other.base;
    //    if (other.pv.points.length == 1 && other.pv.points[0][1].is0()) other.base = this.base;
    //    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomialratio(1, sparseplacevalueratio.parse('%')) }
    //}

    toString() {
        return sparseexponential1.toStringCosh(this.pv, this.base)
    }

    static toStringCosh(pv, base) { // 2015.11
        var s = pv.clone();
        var ret = '';
        hyper('cosh(', +1);
        hyper('sinh(', -1);
        //ret += sparseexponential1.toStringCos(s, base);
        ret += sparseexponential1.toStringXbase(s, base);
        //alert([JSON.stringify(s), JSON.stringify(ret)]);
        return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
        function hyper(name, sign) {
            for (var i = 4; i >= -4; i--) {
                if (i == 0) continue;
                //var l = s.get([0, i]).r;
                //var r = s.get([0, -i]).r;
                var l = s.get(i).toreal();
                var r = s.get(-i).toreal();
                var m = Math.min(l, sign * r);
                var al = Math.abs(l);
                var ar = Math.abs(r);
                //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
                if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
                    var n = m * 2;
                    ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                    //s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [i, 0]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [-i, 0]).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
                    //alert(JSON.stringify(s));
                    s = s.sub(sparseplacevaluerational1.parse('1E' + i).add(sparseplacevaluerational1.parse('1E' + (-i)).scale(sign)).scale(m));
                    //alert(JSON.stringify(s));
                }
            }
            ret = ret.replace(/\+\-/g, '-');
        }
    }

    //static toStringCos(pv, base) { // 2015.11
    //    //alert(JSON.stringify(['pv', pv]));
    //    var s = pv.clone();
    //    //alert(JSON.stringify(['complexexponential.toStringCosh', pv, s]));
    //    var ret = '';
    //    hyper('cos(', +1, 0);
    //    hyper('sin(', -1, 1);
    //    ret += sparseexponential1.toStringXbase(s, base);
    //    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    //    function hyper(name, sign, ind) {//alert('hyper')
    //        for (var b = 0; b < 3; b++) {   //  2017.5
    //            for (var i = 5; i >= -5; i--) {
    //                if (i == 0) continue;
    //                //var l = (ind == 0) ? s.get(i, 0).r : s.get(i, 0).i;
    //                //var r = (ind == 0) ? s.get(-i, 0).r : s.get(-i, 0).i;
    //                var l = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).i;   //  2017.5
    //                var r = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).i; //  2017.5
    //                var m = Math.min(l, sign * r);
    //                var al = Math.abs(l);
    //                var ar = Math.abs(r);
    //                //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
    //                if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
    //                    //alert('if')
    //                    var n = m * 2 * sign;
    //                    ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
    //                    //s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': sign, /'i': /0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
    //                    s = s.sub(sparseplacevaluerational1.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(sparseplacevaluerational1.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale//({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
    //                }
    //            }
    //        }
    //        ret = ret.replace(/\+\-/g, '-');
    //    }
    //}

    static toStringXbase(pv, base) {
        //return sparseexponential1.toStringXbase(this.pv, this.base)
        var points = pv.points;
        var ret = '';
        for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
            var power = points[i][1];
            var digit = points[i][0]//.toString(false, true);//Math.round(points[i][0] * 1000) / 1000; // get() 2015.7
            if (!digit.is0()) {
                ret += '+';
                if (power.is0())
                    ret += digit.toreal();
                else {
                    ret += coef(digit.toreal()).toString();
                    ret += 'exp(';
                    //for (var j = 0; j < power.length; j++) {
                    ret += coef(power.toString(false, true)) + base + '+';
                    //}
                    if (ret.slice(-1) == '+') ret = ret.slice(0, -1);
                    ret += ')';
                }
            }
        }
        ret = ret.replace(/\+\-/g, '-');
        if (ret[0] == '+') ret = ret.substring(1);
        if (ret == '') ret = '0';
        return ret;
        function coef(x) {
            return x == 1 ? '' : x == -1 ? '-' : x;
        }
        function sup(x) {
            if (x == 1) return '';
            return (x != 1) ? '^' + x : '';
        }
    }

    eval(base) {    //  2017.5
        return new this.constructor(this.base.slice(0, -1), this.pv.eval(sparseplacevaluerational1.parse('2.718').pow(base.pv)));
    }

}
