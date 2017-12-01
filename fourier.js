
// Author:  Anthony John Ripa
// Date:    11/30/2017
// Fourier: a datatype for representing Imaginary Exponentials; an application of the PlaceValueComplex datatype

function fourier(base, pv) {
    //if (arguments.length < 2) { console.trace(); alert('fourier expects 2 arguments'); end; }
    if (arguments.length < 2) pv = new placevaluecomplex(); //  2017.9
    if (Array.isArray(base)) alert('fourier expects argument 1 (base) to be StringOrNumber but found ' + typeof base);
    if (!(pv instanceof placevaluecomplex)) { var s = 'fourier expects arg2 to be PlaceValueComplex not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
    this.base = base
    this.pv = pv;
}

fourier.prototype.parse = function (strornode) {    //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new fourier(a.base, new placevaluecomplex(new wholeplacevalue(complex).parse(JSON.stringify(a.pv.whole)), a.pv.exp)) }
    //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'ConstantNode') {
        return new fourier(1, new placevaluecomplex(new wholeplacevalue([new complex(Number(node.value))]), 0));
    } else if (node.type == 'SymbolNode') {
        var base = node.name;
        if (base == 'i') {
            return new fourier(1, new placevaluecomplex(new wholeplacevalue([new complex(0, 1)]), 0));
        } else {
            alert('Syntax Error: fourier expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');
            console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            //me.base = base;
            //me.pv = new placevaluecomplex(1, 1);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            return new fourier(base, new placevaluecomplex(new wholeplacevalue(complex).parse(1), 1));
        }
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
        console.log(node)
        var kids = node.args;
        //var a = new fourier(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        var a = new fourier().parse(kids[0]);       // fourier handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new fourier(1, new placevaluecomplex(new wholeplacevalue(complex).parse(0), 0)).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new fourier(1, new placevaluecomplex(new wholeplacevalue(complex), 0)).add(a);
        } else {
            //var b = new fourier(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = new fourier().parse(kids[1]);   // fourier handles unpreprocessed kid   2015.11
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c;
        //me.base = c.base;
        //me.pv = c.pv;
    } else if (node.type == 'FunctionNode') {
        console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
        console.log(node)
        var fn = node.name;
        var kids = node.args;
        var kidaspoly = new laurent().parse(kids[0])
        //alert(kidaspoly)
        var base = kidaspoly.base;
        var ten = new placevaluecomplex().parse(10);      //  2017.5
        var tens = kidaspoly.pv.get(1).toreal();    //  2016.7
        var ones = kidaspoly.pv.get(0).toreal();    //  2016.7
        var expi = ten.pow(tens)
        if (ones) expi = expi.scale(new complex(Math.cos(ones), Math.sin(ones))); //  2017.5
        //var expi = placevaluecomplex.parse('(2.718)').pow(placevaluecomplex.parse('i')).pow(placevaluecomplex.parse(kidaspoly.pv.toString())) //  2017.5
        //var exp2 = ten.pow(-tens); if (ones) exp2 = exp2.scale(1 / Math.exp(ones));
        var expi2 = expi.pow(-1);                     //  2017.5
        if (fn == 'cis') var pv = expi;
        else if (fn == 'cos') var pv = expi.add(expi2).scale(new complex(.5));
        else if (fn == 'sin') var pv = expi.sub(expi2).scale(new complex(0, -.5));
        else alert('Syntax Error: fourier expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
        return new fourier(base, pv);
    } else {
        alert('othertype')
    }
}

fourier.prototype.tohtml = function () {                                    // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base e<sup>' + this.base + 'i</sup>';   // tohtml(true) includes <s>        2015.11
}

fourier.prototype.toString = function () {
    return fourier.toStringCos(this.pv, this.base);    // 2015.11
}

fourier.prototype.add = function (other) {
    //alert(JSON.stringify([this, other]));
    this.align(other);
    return new fourier(this.base, this.pv.add(other.pv));
}

fourier.prototype.sub = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.sub(other.pv));
}

fourier.prototype.times = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.times(other.pv));
}

fourier.prototype.divide = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.divide(other.pv));
}

fourier.prototype.divideleft = fourier.prototype.divide;    //  2016.6
fourier.prototype.dividemiddle = fourier.prototype.divide;  //  2016.6

fourier.prototype.pointadd = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.pointadd(other.pv));
}

fourier.prototype.pointsub = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.pointsub(other.pv));
}

fourier.prototype.pointtimes = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.pointtimes(other.pv));
}

fourier.prototype.pointdivide = function (other) {
    this.align(other);
    return new fourier(this.base, this.pv.pointdivide(other.pv));
}

fourier.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.whole.mantisa.length == 1 && this.pv.exp == 0) this.base = other.base;
    if (other.pv.whole.mantisa.length == 1 && other.pv.exp == 0) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return fourier.parse('0/0') }
}

fourier.prototype.pow = function (other) { // 2015.6
    return new fourier(this.base, this.pv.pow(other.pv));
}

fourier.prototype.pointpow = function (other) { // 2015.12
    return new fourier(this.base, this.pv.pointpow(other.pv));
}

fourier.toStringCos = function (pv, base) { // 2016.6
    var s = pv.clone();
    var ret = '';
    hyper('cos(', +1, 'r');
    hyper('sin(', -1, 'i');
    ret += fourier.toStringXbase(s, base);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function hyper(name, sign, ind) {
        for (var i = 5; i >= -5; i--) {
            if (i == 0) continue;
            var l = s.get(i)[ind];
            var r = s.get(-i)[ind];
            var m = Math.min(l, sign * r);
            var al = Math.abs(l);
            var ar = Math.abs(r);
            //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
            if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
                var n = m * 2 * sign;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new placevaluecomplex(new wholeplacevalue([new complex(1)]), i).add(new placevaluecomplex(new wholeplacevalue([new complex(1)]), -i).scale(new complex(sign))).scale(ind == 'r' ? new complex(m) : new complex(0, m)));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

fourier.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    console.log('fourier: pv = ' + pv);
    var x = pv.whole.mantisa;
    var exp = pv.exp;						// exp for negative powers	2015.8
    console.log('fourier.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return fourier.toStringXbase(new placevaluecomplex(new wholeplacevalue(x), 0), base);    //  2017.5  [x] -> x
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
    for (var i = str.length - 1; i >= 0 ; i--) {        // power is index because whole is L2R  2015.7 
        var power = i + exp;
        //var digit = Math.round(1000 * str[i]) / 1000;   // power is index because whole is L2R  2015.7 
        var digit = str[i]
        if (digit['r'] != 0 || digit['i'] != 0) {
            ret += '+';
            //coef = coefficient(digit);
            coef = new placevaluecomplex(new wholeplacevalue(complex).parse(digit), 0).toString(false, true);
            if (coef == 'NaN' || coef.indexOf('i') != -1) coef += '*';
            //alert(JSON.stringify([digit, new placevaluecomplex([digit]), new placevaluecomplex([digit]).toString(true), new placevaluecomplex([digit]).tohtml(true)]));
            exp1 = ''; if (power != 0) exp1 = power + base; if (power == 1) exp1 = base; if (power == -1) exp1 = '-' + base;
            exp2 = '';
            //exp12 = (exp1 && exp2) ? ('cis(' + exp1 + '+' + exp2 + ')') : exp1 ? ('cis(' + exp1 + ')') : exp2 ? ('cis(' + exp2 + ')') : '';
            exp12 = (exp1 && exp2) ? ('cis(' + exp1 + '+' + exp2 + ')') : exp1 ? ('cis(' + exp1 + ')') : '';
            ret += exp12 ? (coef + exp12) : coef ? coef : '1';
        }
        console.log('fourier.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
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

fourier.prototype.eval = function (base) {	// 2016.1
    base = base.pv;
    var ei = new placevaluecomplex(new wholeplacevalue([new complex(.54, .84)]), 0);
    //alert(JSON.stringify([ei, base, ei.pow(base)]));
    base = ei.pow(base);
    return new fourier(this.base, this.pv.eval(base));
}