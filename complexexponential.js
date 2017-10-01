
// Author:  Anthony John Ripa
// Date:    9/30/2017
// ComplexExponential : a datatype for representing Complex Exponentials; an application of the ComplexPlaceValue datatype

function complexexponential(base, pv) {
    //if (arguments.length < 2) alert('complexexponential expects 2 arguments');
    if (arguments.length < 2) pv = new complexplacevalue(); //  2017.9
    if (Array.isArray(base)) alert('complexexponential expects argument 1 (base) to be StringOrNumber but found ' + typeof base);
    if (!(pv instanceof complexplacevalue)) { var s = 'complexexponential expects argument 2 (pv) to be complexplacevalue but found ' + typeof pv + ':' + pv; alert(s); throw new Error(s); }
    this.base = base
    this.pv = pv;
}

complexexponential.prototype.parse = function (strornode) { //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new complexexponential(a.base, new complexplacevalue(new wholeplacevaluecomplex2(a.pv.whole.mantisa), a.pv.exp)) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        var base = node.name;
        if (base == 'i') {
            base = 1;
            var pv = new complexplacevalue(new wholeplacevaluecomplex2([[{ 'r': 0, 'i': 1 }]]), [0, 0]);    //  i   2016.1
            return new complexexponential(1, pv);
        } else {
            alert('Syntax Error: complexexponential expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');
            console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            //pv = 10;
            //me.base = base;
            var pv = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            return new complexexponential(base, pv);
        }
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
        console.log(node)
        var kids = node.args;
        //var a = new complexexponential(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        var a = new complexexponential().parse(kids[0]);       // complexexponential handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new complexexponential(1, complexplacevalue[0]).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new complexexponential(1, complexplacevalue[0]).add(a);
        } else {
            //var b = new complexexponential(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = new complexexponential().parse(kids[1]);   // complexexponential handles unpreprocessed kid   2015.11
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
        var kidaspoly = new complexlaurent().parse(kids[0])
        var base = kidaspoly.base[0];
        var ten = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);   // exp is 2D    2016.1
        var iten = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, 1]);   // exp is 2D    2016.1
        var ones = kidaspoly.pv.get(0, 0).r;
        var tens = kidaspoly.pv.get(0, 1).r;
        var iones = kidaspoly.pv.get(0, 0).i;
        var itens = kidaspoly.pv.get(0, 1).i;
        //var exp = ten.pow(tens); if (itens != 0) exp = exp.times(iten.pow(itens));
        //exp = exp.scale({ 'r': Math.exp(ones) * Math.cos(iones), 'i': Math.exp(ones) * Math.sin(iones) });
        var exp = new complexplacevalue(new wholeplacevaluecomplex2([[2.718]]), [0, 0]).pow(kidaspoly.pv);  //  2017.5
        //var expi = iten.pow(tens); if (itens != 0) expi = expi.divide(ten.pow(itens));
        //expi = expi.scale({ 'r': Math.exp(-iones) * Math.cos(ones), 'i': Math.exp(-iones) * Math.sin(ones) });
        var expi = new complexplacevalue(new wholeplacevaluecomplex2([[2.718]]), [0, 0]).pow(kidaspoly.pv.times(complexplacevalue.i));  //  2017.5
        //exp2 = exp2.scale({ 'r': Math.exp(-ones) * Math.cos(-iones), 'i': Math.exp(-ones) * Math.sin(-iones) });
        var exp2 = exp.pow(-1)
        //expi2 = expi2.scale({ 'r': Math.exp(iones) * Math.cos(-ones), 'i': Math.exp(iones) * Math.sin(-ones) });
        var expi2 = expi.pow(-1)
        if (fn == 'exp') var pv = exp;
        else if (fn == 'cis') var pv = expi;
        else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
        else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
        else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
        else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
        else alert('Syntax Error: complexexponential expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
        return new complexexponential(base, pv);
    } else if (node.type == 'ConstantNode') {
        var base = 1;
        var pv = new complexplacevalue(new wholeplacevaluecomplex2([[Number(node.value)]]), [0, 0]);
        return new complexexponential(base, pv);
    } else {
        alert('othertype')
    }
}

complexexponential.prototype.tohtml = function () {                         // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base e<sup>' + this.base + '</sup>';    // tohtml(true) includes <s>    2015.11
}

complexexponential.prototype.toString = function () {
    return complexexponential.toStringCosh(this.pv, this.base);    // 2015.11
}

complexexponential.prototype.add = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.add(other.pv));
}

complexexponential.prototype.sub = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.sub(other.pv));
}

complexexponential.prototype.times = function (other) {
    //alert(JSON.stringify(['complexexponential.prototype.times', 'this', this, 'other', other]));
    this.align(other);
    return new complexexponential(this.base, this.pv.times(other.pv));
}

complexexponential.prototype.divide = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.divide(other.pv));
}

complexexponential.prototype.pointadd = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.pointadd(other.pv));
}

complexexponential.prototype.pointsub = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.pointsub(other.pv));
}

complexexponential.prototype.pointtimes = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.pointtimes(other.pv));
}

complexexponential.prototype.pointdivide = function (other) {
    this.align(other);
    return new complexexponential(this.base, this.pv.pointdivide(other.pv));
}

complexexponential.prototype.align = function (other) {    // Consolidate alignment    2015.9
    //alert(this.base)
    if (this.pv.whole.mantisa.length == 1 && this.pv.exp[0] == 0 && this.pv.exp[1] == 0) this.base = other.base;
    if (other.pv.whole.mantisa.length == 1 && other.pv.exp[0] == 0 && other.pv.exp[1] == 0) other.base = this.base;
    if (this.base != other.base) { alert('complexexponential Different bases : ' + this.base + ' & ' + other.base); return new complexexponential(1, new complexplacevalue(new wholeplacevaluecomplex2([['%']]), [0, 0])) }
}

complexexponential.prototype.pow = function (other) { // 2015.6
    return new complexexponential(this.base, this.pv.pow(other.pv));
}

complexexponential.prototype.pointpow = function (other) { // 2015.12
    return new complexexponential(this.base, this.pv.pointpow(other.pv));
}

complexexponential.toStringCosh = function (pv, base) { // 2015.11
    var s = pv.clone();
    var ret = '';
    hyper('cosh(', +1);
    hyper('sinh(', -1);
    ret += complexexponential.toStringCos(s, base);
    //alert([JSON.stringify(s), JSON.stringify(ret)]);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function hyper(name, sign) {
        for (var i = 4; i >= -4; i--) {
            if (i == 0) continue;
            var l = s.get(0, i).r;
            var r = s.get(0, -i).r;
            var m = Math.min(l, sign * r);
            var al = Math.abs(l);
            var ar = Math.abs(r);
            //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
            if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
                var n = m * 2;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [i, 0]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [-i, 0]).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

complexexponential.toStringCos = function (pv, base) { // 2015.11
    //alert(JSON.stringify(['pv', pv]));
    var s = pv.clone();
    //alert(JSON.stringify(['complexexponential.toStringCosh', pv, s]));
    var ret = '';
    hyper('cos(', +1, 0);
    hyper('sin(', -1, 1);
    ret += complexexponential.toStringXbase(s, base);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function hyper(name, sign, ind) {
        for (var i = 5; i >= -5; i--) {
            if (i == 0) continue;
            var l = (ind == 0) ? s.get(i, 0).r : s.get(i, 0).i;
            var r = (ind == 0) ? s.get(-i, 0).r : s.get(-i, 0).i;
            var m = Math.min(l, sign * r);
            var al = Math.abs(l);
            var ar = Math.abs(r);
            //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
            if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
                var n = m * 2 * sign;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

complexexponential.toStringXbase = function (pv, base) {
    console.log('complexexponential: pv = ' + pv);
    var ret = '';
    for (var r = 0; r < pv.whole.mantisa.length; r++) {
        for (var c = pv.whole.mantisa[0].length - 1; c >= 0 ; c--) {
            var powerx = c + pv.exp[0];
            var powery = r + pv.exp[1];
            var real = Math.round(pv.whole.getreal(r, c) * 1000) / 1000; // get() 2015.7
            var imag = Math.round(pv.whole.getimag(r, c) * 1000) / 1000; // get() 2015.7
            var digit = imag == 0 ? real : real == 0 ? (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i' : real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i';
            //alert(JSON.stringify(['complexexponential.toStringXbase', 'digit', digit]));
            if (real == 0 && imag == 0) continue;
            ret += '+';
            if (powerx == 0 && powery == 0)
                ret += digit;
            else {
                if (imag == 0) ret += coefficient(real);
                else if (real == 0) ret += (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i*';
                else ret += '(' + real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i)';
                //if (powerx != 0 && powery != 0) ret += 'exp((' + powerx + '+' + coefficient(powery) + 'i)' + base + ')';
                if (powerx != 0) ret += 'exp(' + coefficient(powerx) + base + ')';
                if (powery != 0) ret += 'cis(' + coefficient(powery) + base + ')';
            }
        }
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret.slice(-1) == '*') ret = ret.slice(0, -1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*'); }
}

complexexponential.prototype.eval = function (base) {	// 2015.8
    base = base.pv;
    var c = complexplacevalue;
    var ei = new c(new wholeplacevaluecomplex2([[{ 'r': .54, 'i': .84 }]]), [0, 0]);
    base = ei.pow(base);
    if (isNaN(this.base[1])) {
        //alert(1)
        return new complexexponential(this.base, this.pv.eval(base));
    } else {
        alert(2)
    }
}
