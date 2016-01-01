
// Author : Anthony John Ripa
// Date : 12/31/2015
// Fourier : a datatype for representing Complex Exponentials; an application of the PlaceValueComplex datatype

function fourier(arg, pv) {
    console.log('fourier : arguments.length=' + arguments.length);
    if (arguments.length < 2) {
        var base;
        var pv;
        if (isNaN(arg)) {
            if ((arg instanceof String || typeof (arg) == 'string') && arg.indexOf('base') != -1) {    // if arg is json of fourier-object
                var argObj = JSON.parse(arg);
                console.log('argObj=' + JSON.stringify(argObj));
                base = argObj.base;
                console.log('argObj.base=' + JSON.stringify(argObj.base));
                pv = argObj.pv;
                console.log('argObj.pv=' + JSON.stringify(argObj.pv));
            } else if (arg != arg) {    // If arg is %   2015.8
                base = 1;
                pv = [arg];
            } else {                    // Arg is String
                //alert(arg)
                parse(this, arg);
                return;
            }
        } else {
            base = 1;
            pv = [arg];
        }
        this.base = base;
        this.pv = new placevaluecomplex(pv);
        console.log("fourier : this.pv=" + JSON.stringify(this.pv));
    } else {
        this.base = arg;
        if (pv instanceof placevaluecomplex)
            this.pv = pv;
        else if (typeof pv == 'number') {
            console.log("fourier: typeof pv == 'number'");
            this.pv = new placevaluecomplex(pv)
            console.log(this.pv.toString());
        }
        else
            alert('fourier: bad arg typeof(arg2)=' + typeof (pv));
    }
    function parse(me, strornode) {
        console.log('<strornode>')
        console.log(strornode)
        console.log('</strornode>')
        //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            var base = node.name;
            if (base == 'i') {
                me.base = 1;
                me.pv = new placevaluecomplex([[0, 1]], 0);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            } else {
                alert('Syntax Error: fourier expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');
                console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
                console.log(node)
                //pv = 10;
                me.base = base;
                me.pv = new placevaluecomplex(1, 1);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
            }
        } else if (node.type == 'OperatorNode') {
            console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            var kids = node.args;
            //var a = new fourier(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
            var a = new fourier(kids[0]);       // fourier handles unpreprocessed kid   2015.11
            if (node.fn == 'unaryMinus') {
                var c = new fourier(0).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new fourier(0).add(a);
            } else {
                //var b = new fourier(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
                var b = new fourier(kids[1]);   // fourier handles unpreprocessed kid   2015.11
                var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
            }
            me.base = c.base;
            me.pv = c.pv;
        } else if (node.type == 'FunctionNode') {
            console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
            console.log(node)
            var fn = node.name;
            var kids = node.args;
            var kidaspoly = new laurent(kids[0])
            //alert(kidaspoly)
            me.base = kidaspoly.base;
            var ten = new placevaluecomplex(1, 1);
            var tens = kidaspoly.pv.get(1)
            var one = kidaspoly.pv.get(0)
            var exp = ten.pow(tens)
            if (one) exp = exp.scale(Math.exp(one));
            var exp2 = ten.pow(-tens)
            //alert(exp2)
            if (one) exp2 = exp2.scale(1 / Math.exp(one));
            //alert([exp, exp2]);
            if (fn == 'cis') me.pv = exp;
            else if (fn == 'cos') me.pv = exp.add(exp2).scale([.5, 0]);
            else if (fn == 'sin') me.pv = exp.sub(exp2).scale([0, -.5]);
            else alert('Syntax Error: fourier expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
        } else {
            alert('othertype')
        }
    }
}

fourier.prototype.tohtml = function () {                                // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base e<sup>' + this.base + 'i</sup>';    // tohtml(true) includes <s>    2015.11
}

fourier.prototype.toString = function () {
    return fourier.toStringCosh(this.pv, this.base);    // 2015.11
}

fourier.prototype.add = function (other) {
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
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new fourier('0/0') }
}

fourier.prototype.pow = function (other) { // 2015.6
    return new fourier(this.base, this.pv.pow(other.pv));
}

fourier.prototype.pointpow = function (other) { // 2015.12
    return new fourier(this.base, this.pv.pointpow(other.pv));
}

fourier.toStringCosh = function (pv, base) { // 2015.11
    var s = pv.clone();
    var ret = '';
    hyper('cos(', +1,0);
    hyper('sin(', -1,1);
    ret += fourier.toStringXbase(s, base);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function hyper(name, sign,ind) {
        for (var i = 5; i >= -5; i--) {
            if (i == 0) continue;
            var l = s.get(i)[ind];
            var r = s.get(-i)[ind];
            var m = Math.min(l, sign * r);
            var al = Math.abs(l);
            var ar = Math.abs(r);
            //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
            if (Math.sign(l) * Math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {//alert([i,l,r,m,al,ar])
                var n = m * 2 * sign;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new placevaluecomplex(1, i).add(new placevaluecomplex(1, -i).scale([sign, 0])).scale(ind == 0 ? [m, 0] : [0, m]));
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
        return fourier.toStringXbase(new placevaluecomplex(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
    for (var i = str.length - 1; i >= 0 ; i--) {        // power is index because whole is L2R  2015.7 
        var power = i + exp;
        //var digit = Math.round(1000 * str[i]) / 1000;   // power is index because whole is L2R  2015.7 
        var digit = str[i]
        if (digit[0] != 0 || digit[1] != 0) {
            ret += '+';
            //coef = coefficient(digit);
            coef = new placevaluecomplex([digit]).toString(false, true);
            if (coef == 'NaN') coef += '*';
            //alert(JSON.stringify([digit, new placevaluecomplex([digit]), new placevaluecomplex([digit]).toString(true), new placevaluecomplex([digit]).tohtml(true)]));
            exp1 = ''; if (power != 0) exp1 = power + base; if (power == 1) exp1 = base; if (power == -1) exp1 = '-' + base;
            exp2 = '';
            //if (Math.abs(Math.log(digit) - Math.round(Math.log(digit))) < .01) { coef = ''; exp2 = Math.round(Math.log(digit)); }
            exp12 = (exp1 && exp2) ? ('cis(' + exp1 + '+' + exp2 + ')') : exp1 ? ('cis(' + exp1 + ')') : exp2 ? ('cis(' + exp2 + ')') : '';
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

fourier.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.pv.whole.mantisa.length; i++) {
        var pow = Math.pow(base, i + this.pv.exp);  // offset by exp    2015.8
        if (this.pv.whole.get(i)!=0) sum += this.pv.whole.get(i) * pow  // Skip 0 to avoid %    2015.8
        //alert(this.pv.exp+','+this.pv.whole.get(i)+','+(i+this.pv.exp)+','+sum)
    }
    return new fourier(sum);  // interpret as number  2015.8
}
