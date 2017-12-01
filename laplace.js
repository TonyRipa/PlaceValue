
// Author:  Anthony John Ripa
// Date:    11/30/2017
// Laplace: a datatype for representing the Laplace Transform; an application of the PlaceValueComplex datatype

function laplace(base, pv) {
    //if (arguments.length < 2) alert('laplace expects 2 arguments');
    if (arguments.length < 1) base = 1; //  2017.10
    if (arguments.length < 2) pv = new placevaluecomplex(); //  2017.10
    if (Array.isArray(base)) alert('laplace expects argument 1 (base) to be StringOrNumber but found ' + typeof base);
    if (!(pv instanceof placevaluecomplex)) { var s = 'laplace expects argument 2 (pv) to be a placevaluecomplex but found ' + typeof pv + ': ' + JSON.stringify(pv); alert(s); throw new Error(s); }
    this.base = base
    this.pv = pv;
}

laplace.prototype.parse = function (strornode) {    //  2017.10
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new laplace(a.base, new placevaluecomplex(this.pv.whole.parse(JSON.stringify(a.pv.whole.mantisa)), a.pv.exp)) }
    //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'ConstantNode') {
        return new laplace(1, new placevaluecomplex(new wholeplacevalue(complex).parse('(' + Number(node.value) + ')'), 0));  //  Add paren for 2 digit numbers   2016.7
    } else if (node.type == 'SymbolNode') {
        var base = node.name;
        if (base == 'i') {
            return new laplace(1, new placevaluecomplex(new wholeplacevalue(complex).parse('i'), 0));   //  2016.6
        } else {
            //alert('Syntax Error: laplace expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');
            console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            //me.base = base;
            //me.pv = new placevaluecomplex(1, 1);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            var pv = this.pv.parse('1E1');  //  2017.10
            return new laplace(base, pv);
        }
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
        console.log(node)
        var kids = node.args;
        //var a = new laplace(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        var a = new laplace().parse(kids[0]);       // laplace handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new laplace(1, new placevaluecomplex(new wholeplacevalue(complex).parse('0'), 0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new laplace(1, new placevaluecomplex(new wholeplacevalue(complex).parse('0'), 0)).add(a);
        } else {
            //var b = new laplace(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = new laplace().parse(kids[1]);   // laplace handles unpreprocessed kid   2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c;
        //me.pv = c.pv;
    } else if (node.type == 'FunctionNode') {
        console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
        console.log(node)
        var fn = node.name;
        var kids = node.args;
        var kidaspoly = laurent.parse(kids[0])
        //alert(kidaspoly)
        var base = kidaspoly.base;
        var ten = new placevaluecomplex(new wholeplacevalue(complex).parse('1'), 1);
        var tens = kidaspoly.pv.get(1)
        var one = kidaspoly.pv.get(0)
        var exp = ten.pow(tens)
        if (one) exp = exp.scale(Math.exp(one));
        var exp2 = ten.pow(-tens)
        //alert(exp2)
        if (one) exp2 = exp2.scale(1 / Math.exp(one));
        //alert([exp, exp2]);
        if (fn == 'cis') var pv = exp;
        else if (fn == 'cos') var pv = exp.add(exp2).scale([.5, 0]);
        else if (fn == 'sin') var pv = exp.sub(exp2).scale([0, -.5]);
        else alert('Syntax Error: laplace expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
        return new laplace(base, pv);
    } else {
        alert('othertype')
    }
}

laplace.prototype.tohtml = function () {                                // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base ' + this.base;    // tohtml(true) includes <s>    2015.11
}

laplace.prototype.toString = function () {
    return laplace.toStringCosh(this.pv, this.base);    // 2015.11
}

laplace.prototype.add = function (other) {
    //alert(JSON.stringify([this, other]));
    this.align(other);
    return new laplace(this.base, this.pv.add(other.pv));
}

laplace.prototype.sub = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.sub(other.pv));
}

laplace.prototype.times = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.times(other.pv));
}

laplace.prototype.inverse = function () {
    return new laplace(this.base, this.pv.inverse());
}

laplace.prototype.divide = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.divide(other.pv));
}

laplace.prototype.pointadd = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.pointadd(other.pv));
}

laplace.prototype.pointsub = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.pointsub(other.pv));
}

laplace.prototype.pointtimes = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.pointtimes(other.pv));
}

laplace.prototype.pointdivide = function (other) {
    this.align(other);
    return new laplace(this.base, this.pv.pointdivide(other.pv));
}

laplace.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.whole.mantisa.length == 1 && this.pv.exp == 0) this.base = other.base;
    if (other.pv.whole.mantisa.length == 1 && other.pv.exp == 0) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return laplace.parse('0/0') }
}

laplace.prototype.pow = function (other) { // 2015.6
    return new laplace(this.base, this.pv.pow(other.pv));
}

laplace.prototype.pointpow = function (other) { // 2015.12
    return new laplace(this.base, this.pv.pointpow(other.pv));
}

laplace.toStringCosh = function (pv, base) { // 2015.11
    var s = pv.clone();
    //var extra = new placevaluecomplex(new wholeplacevalue([0]), -1);
    var trigreal = '';
    var trigimag = '';
    //alert(JSON.stringify(s))
    [s, trigreal] = trig(s.times(new placevaluecomplex(new wholeplacevalue(complex).parse('1'), 0)), '');
    [s, trigimag] = trig(s.times(new placevaluecomplex(new wholeplacevalue(complex).parse('(0,-1)'), 0)), ''); //  2016.4
    var ret = trigreal + (trigimag != '' ? ('i(' + trigimag + ')') : '');
    ret += '+' + laplace.toStringXbase(s, base);
    if (ret[0] == '+') ret = ret.slice(1);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function trig(s, ret) {
        var r = new placevaluecomplex(new wholeplacevalue(complex).parse('1'), 0).divide(s);
        //alert(JSON.stringify([s, r]));
        var s0, s1, s2, s3, s4, s5, s6, s7;
        [s0, s1, s2, s3, s4, s5, s6, s7] = [s.getreal(0), s.getreal(-1), s.getreal(-2), s.getreal(-3), s.getreal(-4), s.getreal(-5), s.getreal(-6), s.getreal(-7)];
        var c = 1;
        var k = 1;
        if (s0 != 0 && s1 == 0 && s2 == 0) { c = s0; ret += '+' + c + "δ'(x)"; sub([c, 0, 0, 0, 0, 0, 0, 0]); }
        if (s1 != 0 && (s2 / s1 == s3 / s2)) { c = s1; k = s2 / s1; ret += '+' + c + 'exp(' + k + 'x)'; sub([0, 0, c * k * k * k * k, c * k * k * k, c * k * k, c * k, c]); }
        if (s1 != 0 && s3 * s1 > 0) { c = s1; k = s3 / s1; ret += '+' + c + 'cosh(' + root(k) + 'x)'; sub([0, 0, c * k * k, 0, c * k, 0, c]); }
        if (s1 == 0 && s2 != 0 && s3 == 0 && s4 * s2 > 0) { c = s2; k = s4 / s2; ret += '+' + c + 'sinh(' + root(k) + 'x)'; sub([0,0, 0, c * k, 0, c, 0]); }
        if (s1 != 0 && s3 * s1 < 0 && s1 * s5 == s3 * s3) { c = s1; k = -s3 / s1; ret += '+' + c + 'cos(' + root(k) + 'x)'; sub([-c * k * k * k, 0, c * k * k, 0, -c * k, 0, c]); }
        if (s1 == 0 && s2 == 0 && s3 != 0 && s5 != 0 && (s3 / 2) * (s7 / 6) == (s5 / 4) * (s5 / 4)) { c = (s3 / 2); k = -(s5 / 4) / (s3 / 2); ret += '+' + rnd(c / root(k)) + 'xsin(' + root(k) + 'x)'; sub([6 * c * k * k, 0, -4 * c * k, 0, 2 * c, 0, 0]); }
        if (s1 == 0 && s2 != 0 && s4 != 0 && (s2 / 2) * (s6 / 6) == (s4 / 4) * (s4 / 4)) { c = (s2 / 2); k = -(s4 / 4) / (s2 / 2); ret += '+' + rnd(c / root(k)) + '(sin(' + root(k) + 'x)' + '+' + root(k) + 'xcos(' + root(k) + 'x))'; sub([0, 6 * c * k * k, 0, -4 * c * k, 0, 2 * c, 0]); }
        if (s1 == 0 && s2 != 0 && s3 == 0 && s4 * s2 < 0 && s2 * s6 == s4 * s4) { c = s2; k = -s4 / s2; ret += '+' + rnd(c / root(k)) + 'sin(' + root(k) + 'x)'; sub([0, c * k * k, 0, -c * k, 0, c, 0]); }
        if (s1 == 0 && s2 != 0 && s3 == 0 && s4 * s2 < 0 && (s2 / 1) * (s6 / 5) == (s4 / 3) * (s4 / 3)) { c = s2; k = -(s4 / 3) / (s2 / 1); ret += '+' + c + 'xcos(' + root(k) + 'x)'; sub([0, 5 * c * k * k, 0, 3 * -c * k, 0, c, 0]); }
        if (s1 != 0 && s2 == 0 && s3 * s1 < 0 && (s1 / 1) * (s5 / 5) == (s3 / 3) * (s3 / 3)) { c = s1; k = -(s3 / 3) / (s1 / 1); ret += '+' + c + '(cos(' + root(k) + 'x)-' + root(k) + 'xsin(' + root(k) + 'x))'; sub([0, 0, 5 * c * k * k, 0, 3 * -c * k, 0, c]); }
        ret = ret.replace('+-', '-');
        return [s, ret];
        function rnd(num) { return Math.round(num * 1000) / 1000 }
        function root(num) { return Math.round(Math.sqrt(num) * 1000) / 1000 }
        function sub(array) { s = s.sub(new placevaluecomplex(new wholeplacevalue(array.map(function (x) { return new complex(x);})), -7));[s0, s1, s2, s3, s4, s5, s6, s7] = [s.getreal(0), s.getreal(-1), s.getreal(-2), s.getreal(-3), s.getreal(-4), s.getreal(-5), s.getreal(-6), s.getreal(-7)]; }
    }
    //function hyper(name, sign, ind) {
    //    for (var i = 5; i >= -5; i--) {
    //        if (i == 0) continue;
    //        var l = s.get(i)[ind];
    //        var r = s.get(-i)[ind];
    //        var m = Math.min(l, sign * r);
    //        var al = Math.abs(l);
    //        var ar = Math.abs(r);
    //        if (Math.sign(l) * Math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {//alert([i,l,r,m,al,ar])
    //            var n = m * 2 * sign;
    //            ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
    //            s = s.sub(new placevaluecomplex(new wholeplacevaluecomplex([1]), i).add(new placevaluecomplex(new wholeplacevaluecomplex([1]), -i).scale([sign, 0])).scale(ind == 0 ? [m, 0] : [0, m]));
    //        }
    //    }
    //    ret = ret.replace(/\+\-/g, '-');
    //}
}

laplace.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    console.log('laplace: pv = ' + pv);
    //alert(JSON.stringify([pv, pv.get(-2), pv.whole.get(0)]));
    var x = pv.whole.mantisa;
    var exp = pv.exp;						// exp for negative powers	2015.8
    console.log('laplace.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return laplace.toStringXbase(new placevaluecomplex(new wholeplacevalue([x]), 0), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
    for (var i = str.length - 1; i >= 0 ; i--) {        // power is index because whole is L2R  2015.7 
        var power = i + exp;
        if (power < -5) continue;    // Prevents roundoff errors 2016.2
        var digit = str[i]
        if (digit.norm() > .001) {
            //coef = coefficient(digit);
            var pow = Math.abs(power) - 1
            coef = new placevaluecomplex(new wholeplacevalue(complex).parse('('+digit+')'), 0).scale(new complex(1 / math.factorial(pow))).toString(false, true);
            if (coef == 0) continue;    // Prevents 0 times -s  2016.2
            if (coef == 1) coef = '';
            if (coef == 'NaN') coef += '*';
            //alert(JSON.stringify([digit, new placevaluecomplex([digit]), new placevaluecomplex([digit]).toString(true), new placevaluecomplex([digit]).tohtml(true)]));
            exp1 = ''; if (pow != 0) exp1 = 'x^' + pow; if (pow == 1) exp1 = 'x'; if (pow == -1) exp1 = '-' + base;
            //exp2 = '';
            ret += '+';
            ret += exp1 ? (coef + exp1) : coef ? coef : '1';
        }
        console.log('laplace.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret.slice(-1) == '*') ret = ret.slice(0, -1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) || isNaN(digit) || !isFinite(digit) ? '' : '*'); }
    function sup(x) {
	    if (x == 1) return '';
        return pretty(x);
        function ugly(x) { return (x != 1) ? '^' + x : ''; }
        function pretty(x) {
            return x.toString().split('').map(
                function (x) { return { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[x]; }).join('');
        }
    }
}

laplace.prototype.eval = function (base) {	// 2016.1
    base = base.pv;
    var c = placevaluecomplex;
    var ei = new c(new wholeplacevalue([new complex(.54, .84)]), 0);
    alert(JSON.stringify([ei, base, ei.pow(base)]));
    base = ei.pow(base);
    return new laplace(this.base, this.pv.eval(base));
}