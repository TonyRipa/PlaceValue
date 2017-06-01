
// Author:  Anthony John Ripa
// Date:    5/31/2017
// WholePlaceValueComplex : a datatype for representing base agnostic arithmetic via whole numbers whose digits are complex

//var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
//var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v == 1 / 0) ? '∞' : (v == -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }

function wholeplacevaluecomplex(arg) {
    if (!Array.isArray(arg)) { var s = 'wholeplacevaluecomplex expects array argument but found ' + typeof arg + ':' + arg; alert(s); throw new Error(s); }
    if (arg.length > 0 && !(arg[0] instanceof complex)) { var s = 'wholeplacevaluecomplex expects complex[] but found ' + typeof arg[0] + '[] :' + JSON.stringify(arg); alert(s); throw new Error(s); }
    this.mantisa = arg
    while (this.mantisa.length > 1 && this.get(this.mantisa.length - 1).is0())  //  while most sigDig=0  // get(this.man.len-1) 2015.7
        this.mantisa.pop();                             //  pop root
    if (this.mantisa.length == 0) this.mantisa = [new complex(0)];
}

wholeplacevaluecomplex.parse = function (man) {
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('mantisa') != -1) return new wholeplacevaluecomplex(JSON.parse(man).mantisa.map(function (x) { return new complex(x.r, x.i) }))
    if (Array.isArray(man)) {
        console.log("wholeplacevaluecomplex: arg is array " + JSON.stringify(man));
        var mantisa = man.map(function (x) { return Array.isArray(x) ? x : Number(x) });     // ["+1"]→[1] 2015.6  Array   2015.12
        console.log("wholeplacevaluecomplex: arg is array " + JSON.stringify(this.mantisa));
    } else if (typeof man == 'string' || typeof man == 'number') {
        console.log('wholeplacevaluecomplex : num or string but not wpv; man = ' + man);
        var mantisa = tokenize(man);
        for (var i = 0; i < mantisa.length; i++)
            mantisa[i] = complex.parse(mantisa[i]);
        //var mantisa = arr;
        //}
    } else {
        console.log('wholeplacevaluecomplex : arg is else; man = ' + JSON.stringify(man)); // 2015.8
        var mantisa = man.mantisa;
    }
    return new wholeplacevaluecomplex(mantisa);
    //while (this.get(this.mantisa.length - 1) == 0)  //  while most significant digit is 0  // get(this.mantisa.length - 1) 2015.7
    //    this.mantisa.pop();                             //  pop root
    //if (this.mantisa.length == 0) this.mantisa = [0];
    //console.log('cwpv : this.man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
    function tokenize(n) {  //  2016.6
        // 185  189  777 822 8315   9321
        // ^1   1/2  ^   -   ^-     10
        var N = n.toString();
        var ret = [];
        var numb = '';
        var inparen = false;
        for (var i = 0; i < N.length; i++) {
            var c = N[i];
            if (c == '(') { numb += c; inparen = true; continue; }
            if (c == ')') { numb += c; inparen = false; ret.push(numb); numb = ''; continue; }
            if (inparen)
                numb += c;
            else {
                if (c == '.' || c == 'e' || c == 'E') break;    // Truncate    2015.9
                if ([String.fromCharCode(185), String.fromCharCode(777), String.fromCharCode(822), String.fromCharCode(8315)].indexOf(c) > -1) ret[ret.length - 1] += c;
                else ret.push(c);
            }
        }
        return ret.reverse();   // .reverse makes lower indices represent lower powers 2015.7
    }
}

wholeplacevaluecomplex.prototype.get = function (i) {
    return new complex(this.getreal(i), this.getimag(i));
}

wholeplacevaluecomplex.prototype.getreal = function (i) {
    if (i < 0 || this.mantisa.length <= i) return 0;
    if (this.mantisa[i] instanceof complex) return Number(this.mantisa[i].r);
    return Number(this.mantisa[i]);
}

wholeplacevaluecomplex.prototype.getimag = function (i) {
    if (i < 0 || this.mantisa.length <= i) return 0;
    if (this.mantisa[i] instanceof complex) return Number(this.mantisa[i].i);
    return 0;
}

wholeplacevaluecomplex.prototype.tohtml = function () {    // Replaces toStringInternal 2015.7
    //alert(this)
    var me = this.clone();                          // Reverse will mutate  2015.9
    //alert(me)
    return JSON.stringify(me.mantisa.reverse());
    //return me.mantisa.reverse().toString();         // R2L
}

wholeplacevaluecomplex.prototype.toString = function (sTag) {                          //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.mantisa.length; i++) {
        //alert(JSON.stringify(this.get(i).toString()));
        ret = this.get(i).toString() + ret;
    }
    return ret;
}

wholeplacevaluecomplex.prototype.is0 = function () { return this.mantisa.reduce(function (prev, curr) { return prev && curr.is0() }, true) }

wholeplacevaluecomplex.prototype.add = function (other) { return this.f(function (x, y) { return x.add(y) }, other); }
wholeplacevaluecomplex.prototype.sub = function (other) { return this.f(function (x, y) { return x.sub(y) }, other); } // 1-1.1≠-.100009 2015.9
wholeplacevaluecomplex.prototype.pointtimes = function (other) { return this.f(function (x, y) { return x.times(y) }, other); }
wholeplacevaluecomplex.prototype.pointdivide = function (other) { return this.f(function (x, y) { return x.divide(y) }, other); }
wholeplacevaluecomplex.prototype.clone = function () { return this.f(function (x) { return x }, this); }

wholeplacevaluecomplex.prototype.f = function (f, other) { // template for binary operations   2015.9
    var man = [];
    for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++) {
        //alert(JSON.stringify([this, other])); console.trace();end;
        man.push(f(this.get(i), other.get(i)));  // get obviates need to pad 2015.7
    }
    //alert(man);
    return new wholeplacevaluecomplex(man);
}

wholeplacevaluecomplex.prototype.pointsub = function (subtrahend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i).sub(subtrahend.get(0)));  // get(0) is the one's place 2015.7
    }
    return new wholeplacevaluecomplex(man)//.round();    // 1-1.1≠-.100009   2015.9
}

wholeplacevaluecomplex.prototype.pointadd = function (addend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i).add(addend.get(0)));      // get(0) is the one's place 2015.7
    }
    return new wholeplacevaluecomplex(man);
}

wholeplacevaluecomplex.prototype.pow = function (power) { // 2016.6
    var p = wholeplacevaluecomplex;
    if (!(power instanceof p)) power = new p([new complex(power)]);
    //if (this.mantisa.length == 1) return new p([this.get(0).pow(power.get(0))]);    //new p([new complex(Math.pow(this.getreal(0), power.getreal(0)), 0)]); // 0^0=1 for convenience    2016.1
    if (this.mantisa.length == 1) return new p([this.get(0).pow(power.get(0))]).times10s(power.get(1).r);    //  2017.5  2^23=800
    if (power.mantisa.length > 1) { alert('CWPV >Bad Exponent = ' + power.tohtml()); return p.parse('%') }   // tohtml supercedes to StringInternal
    if (power.getimag(0) != 0 && this.mantisa.length > 1) { alert('CWPV iBad Exponent = ' + power.tohtml()); return p.parse('%'); }
    //if (power.getimag(0) != 0 && this.mantisa.length == 1) { return new p([this.get(0).pow(power.get(0))]); } //new c([c.mul([Math.pow(c.norm(this.get(0)), power.getreal(0)) * Math.exp(-power.getimag(0) * c.arg(this.get(0))), 0], c.exp([0, power.getreal(0) * c.arg(this.get(0)) + .5 * power.getimag(0) * c.lnn(this.get(0))[0]]))]) }
    if (power.getreal(0) != Math.round(power.getreal(0))) { alert('CWPV .Bad Exponent = ' + JSON.stringify(power)); return p.parse('%') }
    if (power.getreal(0) < 0) return new p([new complex(0)]);
    if (power.getreal(0) == 0) return new p([new complex(1)]);
    return this.times(this.pow(power.getreal(0) - 1));
}

wholeplacevaluecomplex.prototype.pointpow = function (power) {  // 2015.12
    if (!(power instanceof wholeplacevaluecomplex)) power = wholeplacevaluecomplex.parse(power);
    //if (power.getreal(0) == 1) return this.clone();
    var ret = this.clone();
    ret.mantisa = ret.mantisa.map(function (x) { return x.pow(power.get(0)) });
    return ret;
    //return this.pointtimes(this.pointpow(power.getreal(0) - 1));
}

wholeplacevaluecomplex.prototype.times10 = function () { this.mantisa.unshift(0) } // Caller can pad w/out knowing L2R or R2L  2015.7
wholeplacevaluecomplex.prototype.times10s = function (s) { me = this.clone(); while (s-- > 0) me.mantisa.unshift(new complex(0)); return me; }  // 2017.5

wholeplacevaluecomplex.prototype.times = function (top) {
    if (!(top instanceof wholeplacevaluecomplex)) top = wholeplacevaluecomplex.parse(top);
    var prod = new wholeplacevaluecomplex([]);
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            var r1 = this.getreal(b), i1 = this.getimag(b), r2 = top.getreal(t), i2 = top.getimag(t);
            //sum.push((r1 == 0 && i1 == 0) || (r2 == 0 && i2 == 0) ? 0 : [r1 * r2 - i1 * i2, r1 * i2 + r2 * i1]); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            sum.push((r1 == 0 && i1 == 0) || (r2 == 0 && i2 == 0) ? new complex(0) : this.get(b).times(top.get(t))); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.get(b) = ' + this.get(b) + ' , top.get(t) = ' + top.get(t) + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.unshift(new complex(0)); // change push to unshift because L2R   2015.7
        prod = prod.add(new wholeplacevaluecomplex(sum));
    }
    return prod;
}

wholeplacevaluecomplex.prototype.scale = function (scalar, trace) {
    if (!(scalar instanceof complex)) scalar = complex.parse(scalar);
    if (!(scalar instanceof complex)) { console.trace(); alert("wholeplacevaluecomplex.scale expects complex but found " + typeof scalar + ' :' + scalar); end; }
    //alert("scalar: " + scalar)
    //alert("this: " + JSON.stringify(this))
    var ret = this.clone(trace + ' wholeplacevaluecomplex.prototype.scale >');
    //alert("ret: " + JSON.stringify(ret))
    //ret.mantisa[ret.mantisa.length - 1] *= scalar;                        // leading can be NaN       2015.9
    for (var r = 0; r < ret.mantisa.length - 1 * 0; r++)
        if (true || !isNaN(ret.mantisa[r].times(scalar))) ret.mantisa[r] = ret.get(r).times(scalar);  // nonleading can/t be NaN  2015.9
    //alert("ret: " + JSON.stringify(ret))
    return ret;
}

wholeplacevaluecomplex.getDegree = function (cwpv) {
    for (var i = cwpv.mantisa.length - 1; i >= 0; i--)
        if (cwpv.getreal(i) != 0 || cwpv.getimag(i) != 0) return { 'deg': i, 'val': cwpv.get(i) };
    return { 'deg': 0, 'val': cwpv.get(0) };
}

wholeplacevaluecomplex.prototype.divide = function (den) { // 2015.8
    var num = this;
    var iter = num.mantisa.length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevaluecomplex([new complex(0)], 'wholeplacevaluecomplex.prototype.divide >');
        var d = wholeplacevaluecomplex.getDegree(den);
        var quotient = shift(num, d.deg).scale(new complex(1).divide(d.val), 'wholeplacevaluecomplex.prototype.divide >');
        //alert("q: " + JSON.stringify(quotient))
        if (d.val.r == 0 && d.val.i == 0) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevaluecomplex.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, left) {
            //alert("shift: " + me);
            var ret = new wholeplacevaluecomplex([new complex(0)], 'wholeplacevaluecomplex.prototype.add >').add(me, 'wholeplacevaluecomplex.prototype.shift >');
            for (var r = 0; r < left; r++) ret.mantisa.shift();
            //alert("shift: " + JSON.stringify(ret))
            return ret;
        }
    }
}

wholeplacevaluecomplex.prototype.divideleft = wholeplacevaluecomplex.prototype.divide   //  2016.6
wholeplacevaluecomplex.prototype.dividemiddle = wholeplacevaluecomplex.prototype.divide   //  2016.6

wholeplacevaluecomplex.prototype.eval = function (base) {
    //alert(base)
    var sum = new complex(0);
    for (var i = 0; i < this.mantisa.length; i++) {
        sum = sum.add(this.get(i).times(base.pow(i).get(0)));
    }
    return new wholeplacevaluecomplex([sum]);
}
