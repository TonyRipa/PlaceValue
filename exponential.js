
// Author : Anthony John Ripa
// Date : 12/31/2015
// Exponential : a datatype for representing Exponentials; an application of the PlaceValue datatype

function exponential(arg, pv) {
    console.log('exponential : arguments.length=' + arguments.length);
    if (arguments.length < 2) {
        var base;
        var pv;
        if (isNaN(arg)) {
            if ((arg instanceof String || typeof (arg) == 'string') && arg.indexOf('base') != -1) {    // if arg is json of exponential-object
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
        this.pv = new placevalue(pv);
        console.log("exponential : this.pv=" + JSON.stringify(this.pv));
    } else {
        this.base = arg;
        if (pv instanceof placevalue)
            this.pv = pv;
        else if (typeof pv == 'number') {
            console.log("exponential: typeof pv == 'number'");
            this.pv = new placevalue(pv)
            console.log(this.pv.toString());
        }
        else
            alert('exponential: bad arg typeof(arg2)=' + typeof (pv));
    }
    function parse(me, strornode) {
        console.log('<strornode>')
        console.log(strornode)
        console.log('</strornode>')
        //alert(strornode instanceof String || typeof (strornode) == 'string') // seems always string
        var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
        if (node.type == 'SymbolNode') {
            alert('Syntax Error: Exponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');
            console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            var base = node.name;
            //pv = 10;
            me.base = base;
            me.pv = new placevalue(1, 1);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
        } else if (node.type == 'OperatorNode') {
            console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
            console.log(node)
            var kids = node.args;
            //var a = new exponential(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
            var a = new exponential(kids[0]);       // exponential handles unpreprocessed kid   2015.11
            if (node.fn == 'unaryMinus') {
                var c = new exponential(0).sub(a);
            } else if (node.fn == 'unaryPlus') {
                var c = new exponential(0).add(a);
            } else {
                //var b = new exponential(kids[1].type == 'OperatorNode' ? kids[1] : kids[1].value || kids[1].name);
                var b = new exponential(kids[1]);   // exponential handles unpreprocessed kid   2015.11
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
            var ten = new placevalue(10)
            var tenth = new placevalue(.1)
            var tens = new placevalue('(' + kidaspoly.pv.get(1) + ')'); // Add '(' for 2 digit power    2015.12
            var one = kidaspoly.pv.get(0)
            var exp = ten.pow(tens)
            if (one) exp = exp.scale(Math.exp(one));
            var exp2 = tenth.pow(tens)
            if (one) exp2 = exp2.scale(1 / Math.exp(one));
            //alert([exp, exp2]);
            if (fn == 'exp') me.pv = exp;
            else if (fn == 'cosh') me.pv = exp.add(exp2).scale(.5);
            else if (fn == 'sinh') me.pv = exp.sub(exp2).scale(.5);
            else alert('Syntax Error: Exponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');  // Check    2015.12
        } else {
            alert('othertype')
        }
    }
}

exponential.prototype.tohtml = function () {                                // Replacement for toStringInternal 2015.7
    return this.pv.tohtml(true) + ' base e<sup>' + this.base + '</sup>';    // tohtml(true) includes <s>    2015.11
}

exponential.prototype.toString = function () {
    return exponential.toStringCosh(this.pv, this.base);    // 2015.11
}

exponential.prototype.add = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.add(other.pv));
}

exponential.prototype.sub = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.sub(other.pv));
}

exponential.prototype.times = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.times(other.pv));
}

exponential.prototype.divide = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.divide(other.pv));
}

exponential.prototype.pointadd = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.pointadd(other.pv));
}

exponential.prototype.pointsub = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.pointsub(other.pv));
}

exponential.prototype.pointtimes = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.pointtimes(other.pv));
}

exponential.prototype.pointdivide = function (other) {
    this.align(other);
    return new exponential(this.base, this.pv.pointdivide(other.pv));
}

exponential.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.whole.mantisa.length == 1 && this.pv.exp == 0) this.base = other.base;
    if (other.pv.whole.mantisa.length == 1 && other.pv.exp == 0) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new exponential('0/0') }
}

exponential.prototype.pow = function (other) { // 2015.6
    return new exponential(this.base, this.pv.pow(other.pv));
}

exponential.prototype.pointpow = function (other) { // 2015.12
    return new exponential(this.base, this.pv.pointpow(other.pv));
}

exponential.toStringCosh = function (pv, base) { // 2015.11
    var s = pv.clone();
    var ret = '';
    hyper('cosh(', +1);
    hyper('sinh(', -1);
    ret += exponential.toStringXbase(s, base);
    //alert([JSON.stringify(s), JSON.stringify(ret)]);
    return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
    function hyper(name, sign) {
        for (var i = 4; i >= -4; i--) {
            if (i == 0) continue;
            var l = s.get(i);
            var r = s.get(-i);
            var m = Math.min(l, sign * r);
            var al = Math.abs(l);
            var ar = Math.abs(r);
            //alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
            if (Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001) {
                var n = m * 2;
                ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
                s = s.sub(new placevalue(1, i).add(new placevalue(1, -i).scale(sign)).scale(m));
            }
        }
        ret = ret.replace(/\+\-/g, '-');
    }
}

exponential.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    console.log('exponential: pv = ' + pv);
    var x = pv.whole.mantisa;
    var exp = pv.exp;						// exp for negative powers	2015.8
    console.log('exponential.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return exponential.toStringXbase(new placevalue(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
    for (var i = str.length-1; i >=0 ; i--) {        // power is index because whole is L2R  2015.7 
	var power = i + exp;
        var digit = Math.round(1000 * str[i]) / 1000;   // power is index because whole is L2R  2015.7 
        if (digit != 0) {
            ret += '+';
            coef = coefficient(digit); if (power == 0) { coef = digit; }
            exp1 = ''; if (power != 0) exp1 = power + base; if (power == 1) exp1 = base; if (power == -1) exp1 = '-' + base;
            exp2 = '';
            if (Math.abs(Math.log(digit) - Math.round(Math.log(digit))) < .01) { coef = ''; exp2 = Math.round(Math.log(digit)); }
            exp12 = (exp1 && exp2) ? ('exp(' + exp1 + '+' + exp2 + ')') : exp1 ? ('exp(' + exp1 + ')') : exp2 ? ('exp(' + exp2 + ')') : '';
            ret += exp12 ? (coef + exp12) : coef != '' ? coef : '1';
        }
        console.log('exponential.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret.slice(-1) == '*') ret = ret.slice(0,-1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*'); }
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

exponential.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.pv.whole.mantisa.length; i++) {
        var pow = Math.pow(base, i + this.pv.exp);  // offset by exp    2015.8
        if (this.pv.whole.get(i)!=0) sum += this.pv.whole.get(i) * pow  // Skip 0 to avoid %    2015.8
        //alert(this.pv.exp+','+this.pv.whole.get(i)+','+(i+this.pv.exp)+','+sum)
    }
    return new exponential(sum);  // interpret as number  2015.8
}
