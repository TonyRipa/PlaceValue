
// Author:  Anthony John Ripa
// Date:    5/31/2017
// WholePlaceValue : a datatype for representing base agnostic arithmetic via whole numbers whose digits are real

var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v === 1 / 0) ? '∞' : (v === -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }  //  2017.2  ===

function wholeplacevalue(man) {
    if (!Array.isArray(man)) alert('wholeplacevalue expects array argument but found ' + typeof man + man);
    if (man.length > 0 && !(man[0] instanceof rational)) { console.trace(); alert("wholeplacevalue expects rational[] but found " + typeof man[0] + '[] :' + man); end; }
    this.mantisa = man;
    while (this.mantisa.length > 0 && this.get(this.mantisa.length - 1).is0()) // while MostSigDig=0 // get(this.mantisa.length - 1) 2015.7 // len>0 prevent ∞ loop 2015.12
        this.mantisa.pop();                             //  pop root
    if (this.mantisa.length == 0) this.mantisa = [rational.parse(0)];
    console.log('wpv : this.man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
}

wholeplacevalue.parse = function (man) {
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('mantisa') != -1) return new wholeplacevalue(JSON.parse(man).mantisa.map(function (x) { return rational.parse(JSON.stringify(x)) }))
    var mantisa = tokenize(man);
    for (var i = 0; i < mantisa.length; i++)
        mantisa[i] = rational.parse(mantisa[i]);
    //alert(mantisa)
    return new wholeplacevalue(mantisa);
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

wholeplacevalue.prototype.get = function (i) {
    if (i < 0 || this.mantisa.length <= i) return new rational(0);    // check <0 2015.12
    return this.mantisa[i];
}

wholeplacevalue.prototype.tohtml = function (short) {    // Replaces toStringInternal 2015.7
    return this.mantisa.map(function (x) { return x.tohtml(true) }).reverse().join(short ? '' : ',');         // R2L
}

wholeplacevalue.prototype.toString = function (sTag) {                          //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.mantisa.length; i++) ret = this.get(i) + ret;
    return ret;
}

wholeplacevalue.prototype.digit = function (i, sTag) {                          //  sTag    2015.11
    if (sTag) return this.digithelp(i, '<s>', '</s>', true);
    return this.digithelp(i, '', String.fromCharCode(822), false);
}

wholeplacevalue.prototype.equals = function (other) {
    var ret = true
    for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++)
        ret = ret && this.get(i).toreal() == other.get(i).toreal();     //  toreal  2016.7
    return ret;
}

wholeplacevalue.prototype.is0 = function () { return this.equals(wholeplacevalue.zero); }   //  2016.5
wholeplacevalue.prototype.is1 = function () { return this.equals(wholeplacevalue.one); }    //  2016.5

wholeplacevalue.zero = new wholeplacevalue([rational.parse(0)]);    //  2016.5
wholeplacevalue.one = new wholeplacevalue([rational.parse(1)]);     //  2016.5

wholeplacevalue.prototype.add = function (other) { return this.f(function (x, y) { return x.add(y) }, other); }
wholeplacevalue.prototype.sub = function (other) { return this.f(function (x, y) { return x.sub(y) }, other); }
wholeplacevalue.prototype.pointtimes = function (other) { return this.f(function (x, y) { return x.times(y) }, other); }
wholeplacevalue.prototype.pointdivide = function (other) { return this.f(function (x, y) { return x.divide(y) }, other); }
wholeplacevalue.prototype.clone = function () { return this.f(function (x) { return x }, this); }
wholeplacevalue.prototype.negate = function () { return this.f(function (x) { return x.negate() }, this); }     //  2016.5
//wholeplacevalue.prototype.round = function () { return this.f(function (x) { return Math.round(x * 1000) / 1000 }, this); }   // for sub 2015.9

wholeplacevalue.prototype.f = function (f, other) { // template for binary operations   2015.9
    var man = [];
    for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++) {
        if (!(this.get(i) instanceof rational && other.get(i) instanceof rational)) { console.trace(); alert('f expects Array of Rational but found [' + typeof this.get(i) + '] ' + JSON.stringify(this.get(i))); }
        man.push(f(this.get(i), other.get(i)));  // get obviates need to pad 2015.7
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointsub = function (subtrahend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i).sub(subtrahend.get(0)));  // get(0) is the one's place 2015.7
    }
    return new wholeplacevalue(man)//.round();    // 1-1.1≠-.100009   2015.9
}

wholeplacevalue.prototype.pointadd = function (addend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i).add(addend.get(0)));      // get(0) is the one's place 2015.7
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pow = function (power) { // 2015.6
    //alert(power instanceof rational);
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([rational.parse(power)]);
    //if (this.mantisa.length == 1) return new wholeplacevalue([this.get(0).pow(power.get(0))]);  //  0^0=1 for convenience   2016.5
    if (this.mantisa.length == 1) return new wholeplacevalue([this.get(0).pow(power.get(0))]).times10s(power.get(1).toreal());  //  2017.5  2^32=4000
    if (power.mantisa.length > 1) { alert('WPV >Bad Exponent = ' + power.toString()); return wholeplacevalue.parse('%') }
    if (power.get(0).toreal() != Math.round(power.get(0).toreal())) { alert('WPV .Bad Exponent = ' + power.tohtml()); return wholeplacevalue.parse('%') }
    if (power.get(0).toreal() < 0) return wholeplacevalue.parse(0);
    if (power.is0()) return wholeplacevalue.parse(1);//alert(JSON.stringify(power))
    return this.times(this.pow(power.get(0).toreal() - 1));
}

wholeplacevalue.prototype.pointpow = function (power) { // 2015.12
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new rational(power)]);
    var ret = this.clone();
    ret.mantisa = ret.mantisa.map(function (x) { return x.pow(power.get(0)) });
    return ret;
}

wholeplacevalue.prototype.times10 = function () { this.mantisa.unshift(new rational(0)) } // Caller can pad w/out knowing L2R or R2L  2015.7
wholeplacevalue.prototype.div10s = function (s) { me = this.clone(); while (s-- > 0) me.mantisa.shift(); return me; }  // 2016.5
wholeplacevalue.prototype.times10s = function (s) { me = this.clone(); while (s-- > 0) me.mantisa.unshift(new rational(0)); return me; }  // 2017.5

wholeplacevalue.prototype.times = function (top) {
    //if (!(top instanceof wholeplacevalue)) top = new wholeplacevalue([top]);
    var prod = new wholeplacevalue([]);
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            sum.push(this.get(b).is0() || top.get(t).is0() ? new rational(0) : this.get(b).times(top.get(t))); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.get(b) = ' + this.get(b) + ' , top.get(t) = ' + top.get(t) + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.unshift(new rational(0)); // change push to unshift because L2R   2015.7
        prod = prod.add(new wholeplacevalue(sum));
    }
    return prod;
}

wholeplacevalue.prototype.scale = function (scalar, trace) {
    if (!(scalar instanceof rational)) scalar = rational.parse(scalar);
    var ret = this.clone(trace + ' wholeplacevalue.prototype.scale >');
    ret.mantisa = ret.mantisa.map(function (x) { return x.times(scalar) });
    return ret;
}

wholeplacevalue.prototype.unscale = function (scalar, trace) {  //  2016.5
    if (!(scalar instanceof rational)) scalar = rational.parse(scalar);
    var ret = this.clone(trace + ' wholeplacevalue.prototype.unscale >');
    ret.mantisa = ret.mantisa.map(function (x) { return x.divide(scalar) });
    //for (var r = 0; r < ret.mantisa.length; r++)
    //    ret.mantisa[r] = ret.mantisa[r].divide(scalar);
    return ret;
}

wholeplacevalue.getDegree = function (man) {
    for (var i = man.length - 1; i >= 0; i--)
        if (!man[i].is0()) return { 'deg': i, 'val': man[i] };
    return { 'deg': 0, 'val': man[rational.parse(0)] };
}

wholeplacevalue.prototype.divide = function (den) { // 2015.8
    var num = this;
    var iter = num.mantisa.length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevalue([rational.parse(0)], 'wholeplacevalue.prototype.divide >');
        var d = wholeplacevalue.getDegree(den.mantisa);
        var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');
        if (d.val.is0()) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, left) {
            var ret = new wholeplacevalue([rational.parse(0)], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');
            for (var r = 0; r < left; r++) ret.mantisa.shift();
            return ret;
        }
    }
}

wholeplacevalue.prototype.remainder = function (den) {  //  2016.5
    return this.sub(this.divide(den).times(den));
}

wholeplacevalue.getDegreeLeft = function (man) {
    for (var i = 0 ; i < man.length ; i++)
        if (!man[i].is0()) return { 'deg': i, 'val': man[i] };
    return { 'deg': 0, 'val': man[rational.parse(0)] };
}

wholeplacevalue.prototype.divideleft = function (den) { // 2016.3
    var num = this;
    var iter = 5//num.mantisa.length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevalue([rational.parse(0)], 'wholeplacevalue.prototype.divide >');
        var d = wholeplacevalue.getDegreeLeft(den.mantisa);
        var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');
        if (d.val.is0()) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, left) {
            var ret = new wholeplacevalue([rational.parse(0)], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');
            for (var r = 0; r < left; r++) ret.mantisa.shift();
            return ret;
        }
    }
}

wholeplacevalue.prototype.dividemiddle = function (den) {   // 2016.3
    var A = []
    var b = []
    for (var i = 0; i <= this.mantisa.length + 1; i++) {
        let row = [den.get(i - 1).toreal(), den.get(i).toreal(), den.get(i + 1).toreal()];
        if (row[0] == 0 && row[1] == 0 && row[2] == 0) continue;
        A.push(row);
        b.push([this.get(i).toreal()]);
    }
    A = math.matrix(A);
    b = math.matrix(b);
    var At = A.transpose();
    var AtA = math.multiply(At, A);
    var I = math.matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    try {
        var AtAinv = math.divide(I, AtA);
    } catch (e) {
        return wholeplacevalue.parse('%0');
    }
    var Atb = math.multiply(At, b);
    var x = math.multiply(AtAinv, Atb);
    x = x.transpose().valueOf()[0];
    x.reverse();
    return new wholeplacevalue(x.map(function (x) { return Math.round(100 * x) / 100 }).map(rational.parse));
}

wholeplacevalue.prototype.gcd = function () {   // 2016.5
    var list = [];
    for (var i = 0; i < this.mantisa.length; i++)
        list.push(this.get(i));
    if (list.length == 0) return new rational(1);
    if (list.length == 1) return list[0].is0() ? new rational(1) : list[0];    //  Disallow 0 to be a GCD for expediency.  2016.5
    return list.reduce(function (x, y) { return x.gcd(y) }, new rational(0));
}

wholeplacevalue.prototype.eval = function (base) {
    var sum = new rational(0);
    for (var i = 0; i < this.mantisa.length; i++) {
        sum = sum.add(this.get(i).times(base.get(0).pow(i)));  // get(0)   2016.1
    }
    return new wholeplacevalue([sum]);
}
