
// Author:  Anthony John Ripa
// Date:    5/31/2017
// Fourier2 : a 2d datatype for representing Complex Exponentials; an application of the ComplexPlaceValue datatype

function fourier2(base, pv) {
    if (arguments.length < 2) alert('fourier2 expects 2 arguments');
    if (!Array.isArray(base)) { var s = 'fourier expects argument 1 (base) to be Array but found ' + typeof base; alert(s); throw new Error(s); }
    if (!(pv instanceof complexplacevalue)) alert('fourier2 expects argument 2 (pv) to be a complexplacevalue but found ' + typeof pv);
    this.base = base
    this.pv = pv;
}

fourier2.parse = function (strornode) {  // 2016.1
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new fourier2(a.base, new complexplacevalue(new wholeplacevaluecomplex2(a.pv.whole.mantisa), a.pv.exp)) }
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        if (node.name == 'i') {
            var base = [1, null];
            var pv = new complexplacevalue(new wholeplacevaluecomplex2([[{ 'r': 0, 'i': 1 }]]), [0, 0]);    //  i   2016.1
            return new fourier2(base, pv);  //  2017.5  base
        } else {
            var base = [node.name, null];
            alert('Syntax Error: fourier2 expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');
            console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            //pv = 10;
            //me.base = base;
            var pv = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            return new fourier2(base, pv);
        }
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
        console.log(node)
        var kids = node.args;
        //var a = new fourier2(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
        if (kids[0].name == 'e' && node.op == '^') { var e = math.parse('exp(q)'); e.args = [kids[1]]; return fourier2.parse(e) }
        var a = fourier2.parse(kids[0]);       // fourier2 handles unpreprocessed kid   2015.11
        if (node.fn == 'unaryMinus') {
            var c = new fourier2([1, null], complexplacevalue[0]).sub(a);
        } else if (node.fn == 'unaryPlus') {
            var c = new fourier2(1, complexplacevalue[0]).add(a);
        } else {
            //var b = new fourier2(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
            var b = fourier2.parse(kids[1]);   // fourier2 handles unpreprocessed kid   2015.11
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
        var kidaspoly = complexlaurent.parse(kids[0])
        var base = kidaspoly.base;
        var x = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);   // exp is 2D    2016.1
        var y = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, 1]);   // exp is 2D    2016.1
        //var ones = kidaspoly.pv.get(0, 0).r;
        //var iones = kidaspoly.pv.get(0, 0).i;
        //var xs = kidaspoly.pv.get(0, 1).r;
        //var ixs = kidaspoly.pv.get(0, 1).i;
        //var ys = kidaspoly.pv.get(1, 0).r;
        //var iys = kidaspoly.pv.get(1, 0).i;
        ////alert(JSON.stringify([kidaspoly, ones, tens, itens]));
        //var exp = x.pow(ixs).times(y.pow(iys)); //if (ixs != 0) exp = exp.times(y.pow(ixs));
        //exp = exp.scale({ 'r': Math.exp(ones) * Math.cos(iones), 'i': Math.exp(ones) * Math.sin(iones) });
        var exp = new complexplacevalue(new wholeplacevaluecomplex2([[2.718]]), [0, 0]).pow(kidaspoly.pv.divide(complexplacevalue.i));  //  2017.5
        //var expi = x.pow(xs).times(y.pow(ys)); if (ixs != 0) expi = expi.divide(x.pow(ixs));
        //expi = expi.scale({ 'r': Math.exp(-iones) * Math.cos(ones), 'i': Math.exp(-iones) * Math.sin(ones) });
        var expi = new complexplacevalue(new wholeplacevaluecomplex2([[2.718]]), [0, 0]).pow(kidaspoly.pv);  //  2017.5
        //exp2 = exp2.scale({ 'r': Math.exp(-ones) * Math.cos(-iones), 'i': Math.exp(-ones) * Math.sin(-iones) });
        //expi2 = expi2.scale({ 'r': Math.exp(iones) * Math.cos(-ones), 'i': Math.exp(iones) * Math.sin(-ones) });
        var exp2 = exp.pow(-1)
        var expi2 = expi.pow(-1)
        if (fn == 'exp') var pv = exp;
        else if (fn == 'cis') var pv = expi;
        else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
        else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
        else alert('Syntax Error: fourier2 expects function input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
        return new fourier2(base, pv);
    } else if (node.type == 'ConstantNode') {
        var base = [1, null];
        var pv = new complexplacevalue(new wholeplacevaluecomplex2([[Number(node.value)]]), [0, 0]);
        return new fourier2(base, pv);
    } else {
        alert('othertype')
    }
}

fourier2.prototype.tohtml = function () {                                // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base e<sup>i' + this.base + '</sup>';    // tohtml(true) includes <s>    2015.11
}

fourier2.prototype.toString = function () {
    return fourier2.toStringXbase(this.pv, this.base)//Cosh(this.pv, this.base);    // 2015.11
}

fourier2.prototype.add = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.add(other.pv));
}

fourier2.prototype.sub = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.sub(other.pv));
}

fourier2.prototype.times = function (other) {
    //alert(JSON.stringify(['fourier2.prototype.times', 'this', this, 'other', other]));
    this.align(other);
    return new fourier2(this.base, this.pv.times(other.pv));
}

fourier2.prototype.divide = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.divide(other.pv));
}

fourier2.prototype.pointadd = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.pointadd(other.pv));
}

fourier2.prototype.pointsub = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.pointsub(other.pv));
}

fourier2.prototype.pointtimes = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.pointtimes(other.pv));
}

fourier2.prototype.pointdivide = function (other) {
    this.align(other);
    return new fourier2(this.base, this.pv.pointdivide(other.pv));
}

fourier2.prototype.align = function (other) {    // Consolidate alignment    2015.9
    //if (this.pv.whole.mantisa.length == 1 && this.pv.exp[0] == 0 && this.pv.exp[1] == 0) this.base = other.base;
    //if (other.pv.whole.mantisa.length == 1 && other.pv.exp[0] == 0 && other.pv.exp[1] == 0) other.base = this.base;
    //if (this.base != other.base) { alert('fourier2 Different bases : ' + this.base + ' & ' + other.base); return new fourier2(1, new complexplacevalue(new wholeplacevaluecomplex2([['%']]), [0, 0])) }
    alignHelper(other, this);
    if (alignHelper(this, other)) flip(this, other);	// If (this flipped) flipback;	2015.8
    //if (shouldFlip(this.pv.mantisa, other.pv.mantisa)) flip(this, other);
    if (this.base.toString() != other.base.toString()) alert('fourier2 Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
    //function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }
    function flip(me, it) {
        it.base = me.base = [me.base[1], me.base[0]];
        me.pv.whole.mantisa = math.transpose(me.pv.whole.mantisa);
        it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa);
        me.pv.exp.push(me.pv.exp.shift())  // flip exp // 2015.10
        it.pv.exp.push(it.pv.exp.shift())  // flip exp // 2015.10
    }
    function alignHelper(it, me) {
        function isnum(x) { return !isNaN(x) }

        try {
            if (isnum(it.base[0]) && isnum(it.base[1])) {
                it.base = me.base;
            } else if (it.base[0] == me.base[0] && isnum(it.base[1])) {
                it.base = me.base;
            } else if (it.base[1] == me.base[1] && isnum(it.base[0])) {
                it.base = me.base;
            } else if (it.base[0] == me.base[1] && it.base[1] == me.base[0]) {
                it.base = me.base;
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && isnum(it.base[1])) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            } else if (isNaN(me.base[0]) && isnum(me.base[1]) && it.base[1] == me.base[0]) {
                me.base[1] = it.base[0];
                it.base = me.base;
                it.pv.whole.mantisa = math.transpose(it.pv.whole.mantisa); // mathjs transpose 2015.7
                it.pv.exp.push(it.pv.exp.shift());  // flip exp // 2015.10
                return true // signal flip	2015.8
            }
        } catch (e) {
            alert('complexlaurent.align: Error\n\nStackTrace:\n' + e.stack);
        }
    }
}

fourier2.prototype.pow = function (other) { // 2015.6
    return new fourier2(this.base, this.pv.pow(other.pv));
}

fourier2.prototype.pointpow = function (other) { // 2015.12
    return new fourier2(this.base, this.pv.pointpow(other.pv));
}

fourier2.toStringCosh = function (pv, base) { // 2015.11
    var s = pv.clone();
    var ret = '';
    hyper('cosh(', +1);
    hyper('sinh(', -1);
    ret += fourier2.toStringCos(s, base);
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
            if (Math.sign(l) * Math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {//alert([i,l,r,m,al,ar])
                var n = m * 2;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [i, 0]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [-i, 0]).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

fourier2.toStringCos = function (pv, base) { // 2015.11
    //alert(JSON.stringify(['pv', pv]));
    var s = pv.clone();
    //alert(JSON.stringify(['fourier2.toStringCosh', pv, s]));
    var ret = '';
    hyper('cos(', +1, 0);
    hyper('sin(', -1, 1);
    ret += fourier2.toStringXbase(s, base);
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
            if (Math.sign(l) * Math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {//alert([i,l,r,m,al,ar])
                var n = m * 2 * sign;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

fourier2.toStringXbase = function (pv, base) {
    console.log('fourier2: pv = ' + pv);
    var ret = '';
    for (var r = 0; r < pv.whole.mantisa.length; r++) {
        for (var c = pv.whole.mantisa[0].length - 1; c >= 0 ; c--) {
            var powerx = c + pv.exp[0];
            var powery = r + pv.exp[1];
            var real = Math.round(pv.whole.getreal(r, c) * 1000) / 1000; // get() 2015.7
            var imag = Math.round(pv.whole.getimag(r, c) * 1000) / 1000; // get() 2015.7
            var digit = imag == 0 ? real : real == 0 ? (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i' : real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i';
            //alert(JSON.stringify(['fourier2.toStringXbase', 'digit', digit]));
            if (real == 0 && imag == 0) continue;
            ret += '+';
            if (powerx == 0 && powery == 0)
                ret += digit;
            else {
                if (imag == 0) ret += coefficient(real);
                else if (real == 0) ret += (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i*';
                else ret += '(' + real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i)';
                //if (powerx != 0 && powery != 0) ret += 'exp((' + powerx + '+' + coefficient(powery) + 'i)' + base + ')';
                if (powerx != 0 && powery != 0) ret += 'e^(i(' + coefficient(powerx) + base[0] + '+' + coefficient(powery) + base[1] + '))';
                else {
                    ret += 'e^(i*';
                    if (powerx != 0) ret += coefficient(powerx) + base[0];
                    if (powery != 0) ret += '+' + coefficient(powery) + base[1];
                    ret += ')';
                }
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

fourier2.toStringXbasenew = function (pv, base) {
    console.log('complexlaurent.toStringXbase2: pv=' + JSON.stringify(pv));
    var man = pv.whole.mantisa;
    var exp = pv.exp;   // 2015.10
    var ret = '';
    var row = man[0]//.toString().replace('.', '');
    for (var c = row.length - 1; c >= 0; c--) {
        for (var r = 0; r < man.length; r++) {
            var powerx = c + exp[0];    // power is index because whole is L2R  2015.7  // + exp[0] 2015.10
            var powery = r + exp[1];    // power is index because whole is L2R  2015.7  // + exp[1] 2015.10
            var real = Math.round(pv.whole.getreal(r, c) * 1000) / 1000; // get() 2015.7
            var imag = Math.round(pv.whole.getimag(r, c) * 1000) / 1000; // get() 2015.7
            var digit = imag == 0 ? real : real == 0 ? (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i' : real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i';
            //var digit = Math.round(pv.whole.get(r, c) * 1000) / 1000; // get() 2015.7
            if (real != 0 || imag != 0) {
                ret += '+';
                if (powerx == 0 && powery == 0)
                    ret += digit;
                else {
                    if (powerx != 0 && powery != 0) ret += 'exp(i*('; else ret += 'exp(i*';
                    //ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
                    //ret += '(' + digit + ')';
                    if (imag == 0) ret += coefficient(real);
                    else if (real == 0) ret += (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i*';
                    else ret += '(' + real + '+' + (imag == 1 ? '' : imag == -1 ? '-' : imag) + 'i)';
                    if (powerx != 0) ret += base[0] + sup(powerx);
                    if (powerx == 1 && powery != 0) ret += '*';
                    if (powery != 0) ret += base[1] + sup(powery);
                    //console.log('complexlaurent.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
                    if (powerx != 0 && powery != 0) ret += '))'; else ret += ')';
                }
            }
        }
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*'); }
    function sup(x) {
        if (x == 1) return '';
        return ugly(x);
        function ugly(x) { return (x != 1) ? '^' + x : ''; }
        function pretty(x) {
            return x.toString().split('').map(
                function (x) { return { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[x]; }).join('');
        }
    }
}

fourier2.prototype.eval = function (base) {	// 2015.8
    base = base.pv;
    var c = complexplacevalue;
    var ei = new c(new wholeplacevaluecomplex2([[{ 'r': .54, 'i': .84 }]]), [0, 0]);
    base = ei.pow(base);
    if (isNaN(this.base[1])) {
        alert(1)
        return new fourier2(this.base, this.pv.eval(base));
    } else {
        alert(2)
    }
}
