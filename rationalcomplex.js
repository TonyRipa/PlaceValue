
// Author:  Anthony John Ripa
// Date:    11/30/2017
// Complex: A data-type for representing Complex Numbers as pairs of Rationals

function rationalcomplex(real, imag) {
    //if (arguments.length < 1) alert('rationalcomplex expects 1 or 2 arguments');
    if (arguments.length < 1) real = new rational();
    if (arguments.length < 2) imag = new rational();
    if (!(real instanceof rational)) { var s = 'rationalcomplex expects arg1 (real) to be a Rational not ' + typeof real + ' ' + JSON.stringify(real); alert(s); throw new Error(s); }
    if (!(imag instanceof rational)) { var s = 'rationalcomplex expects arg2 (imag) to be a Rational not ' + typeof imag + ' ' + JSON.stringify(imag); alert(s); throw new Error(s); }    //  2016.7
    this.r = real;
    this.i = imag;
}

rationalcomplex.prototype.parse = function (n) {    //  2017.10
    return rationalcomplex.parse(n);
}

rationalcomplex.parse = function (n) {
    //alert('n = ' + n);
    if (n instanceof String || typeof (n) == 'string') if (n.indexOf('i') != -1 && n.indexOf('r') != -1) { var x = JSON.parse(n); return new rationalcomplex(new rational().parse(JSON.stringify(x.r)), new rational().parse(JSON.stringify(x.i))) }    //  2017.3
    if (typeof n == "number") return new rationalcomplex(new rational().parse(n));      //  2017.3
    if (n instanceof Number) return new rationalcomplex(n, 0);                          //  2017.3
    var N = n.toString();
    if (N[0] == '-') return rationalcomplex.parse(N.substring(1)).negate();             //  2017.3
    if (N[0] == '+') return rationalcomplex.parse(N.substring(1));                      //  2017.11
    //var r = N.match(rational.regex()); if (r && r.indexOf(N) != -1) { alert(N.match(rational.regex()) + N + 'is Rational'); return new rationalcomplex(new rational().parse(N)); }  //  2017.11
    //var r = N.match(rational.regex()); if (r) { alert(N.match(rational.regex()) + N + 'is Rational'); return new rationalcomplex(new rational().parse(N)); }  //  2017.11
    //if (N.match(rational.regexfull())) alert('r' + N);
    if (N.match(rational.regexfull())) return new rationalcomplex(new rational().parse(N)); //  2017.11
    //if (N.match(rationalcomplex.regexfull())) alert('rc' + N);
    if (N.match(complex.regexfull())) { var c = complex.parse(N); return new rationalcomplex(new rational().parse(c.r), new rational().parse(c.i)); }                       //  2017.11
    if (N.match(rationalcomplex.regexfull())) { //  2017.11
        if (N.indexOf(',') != -1) {
            var c = N.slice(1, -1).split(','); return new rationalcomplex(new rational().parse(c[0]), new rational().parse(c[1]));
        } else if (N.indexOf('i') != -1) {
            return new rationalcomplex(new rational(), new rational().parse(N))
        }
    }
    { var s = 'RationalComplex.parse: no match: ' + JSON.stringify(N); alert(s); throw new Error(s); }
    //alert(JSON.stringify([N, rationalcomplex.regexfull(), N.match(rationalcomplex.regexfull())]))
    //var ret = 0;
    //var numb = '';
    //var imag = '';
    //var inparen = false;
    //var inimag = false;
    //for (var i = 0; i < N.length; i++) {
    //    var c = N[i];
    //    if (c == '(') { inparen = true; continue; }
    //    if (c == ',') { inimag = true; continue; }
    //    if (c == ')') { ret = [Number(numb), Number(imag)]; numb = ''; imag = ''; inimag = false; inparen = false; continue; }
    //    if (inparen) {
    //        if (inimag) imag += c; else numb += c;
    //    }
    //    else {
    //        //if (c == 'e' || c == 'E') break;    // Truncate    2015.9
    //        if ("0123456789.".indexOf(c) > -1) ret += c;
    //        var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for //precision 2015.6
    //        if (frac[c]) ret = frac[c];
    //        if (c == 'τ') ret = 6.28;
    //        var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, /'㉘': /28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': /46, /'㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
    //        if (num[c]) ret = num[c];
    //        if (c == '∞') ret = Infinity;
    //        if (c == '%') ret = NaN;
    //        if (c == 'i') ret = [0, 1];     // 2015.12
    //        if (c == 'I') ret = [0, 1];     // 2017.10
    //        if (c == String.fromCharCode(777)) ret = [0, ret];
    //        if (c == String.fromCharCode(822)) { if (Array.isArray(ret)) { ret[0] *= -1; ret[1] *= -1; } else ret *= -1; }
    //        if (c == String.fromCharCode(8315)) ret = 1 / ret;
    //    }
    //}
    //var digit = ret;
    //if (Array.isArray(digit) && digit.length == 2) return new rationalcomplex(new rational().parse(digit[0]), new rational().parse(digit[1]));
    //if (Array.isArray(digit)) return new rationalcomplex(Number(digit[0]));
    //return new rationalcomplex(new rational().parse(digit));
}

rationalcomplex.regex = function () {   //  2017.10
    //alert(rational.regex())
    //return rational.regex();
    var literal = '[⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';
    //var dec = String.raw`(\d+\.\d*|\d*\.\d+|\d+)`;
    var dec = rational.regex();
    var num = '(' + literal + '|' + dec + ')';
    var signnum = '(' + '[\+\-]?' + num + '[iI]?' + ')';
    var pair = '(' + String.raw`\(` + signnum + ',' + signnum + String.raw`\)` + ')';   //  2017.10 String.raw
    var pairor1 = '(' + pair + '|' + signnum + ')';
    //var frac = '(' + num + '/' + num + '|' + num + ')';
    //var signfrac = '(' + '[\+\-]?' + frac + ')';
    return pairor1;
}

rationalcomplex.regexfull = function () {   //  2017.11
    return '^' + rationalcomplex.regex() + '$';
}

rationalcomplex.prototype.tohtml = function () { return JSON.stringify(this) }

rationalcomplex.prototype.toreal = function () { return this.r.toreal(); }          //  2017.11

rationalcomplex.prototype.todigit = function () {
    var IMAG = String.fromCharCode(777);
    var NEG = String.fromCharCode(822);
    var s = this.toString(false, false);
    var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
    if (len > 1 && s[0] != '(') return '(' + s + ')';
    return s;
}

rationalcomplex.prototype.toString = function (sTag, long) {                        //  sTag    2015.11
    if (sTag) return this.digitpair('<s>', '</s>', true, long);
    return this.digitpair('', String.fromCharCode(822), false, long);
}

rationalcomplex.prototype.digitpair = function (NEGBEG, NEGEND, fraction, long) {  // 2015.12
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var IMAG = String.fromCharCode(777);
    var digit = [this.r, this.i]; //alert(JSON.stringify(digit));
    //if (!Array.isArray(digit)) return this.digithelp(digit, NEGBEG, NEGEND, true);
    //if (digit[1] == 0) return this.digithelp(digit[0], NEGBEG, NEGEND, true);
    var real = digit[0];
    var imag = digit[1];
    var a = real;//Math.round(real * 1000) / 1000
    var b = imag;//Math.round(imag * 1000) / 1000
    //if (real != real) return '%';
    if (-.01 < imag && imag < .01) return long ? a.toString(false, long) : a.toString(false, false); //this.digithelp(real, NEGBEG, NEGEND, true);
    if (real == 0) {
        if (long == 'medium') return b == 1 ? 'i' : '(' + a + ',' + b + ')';   //  2017.4  medium
        //if (long) return '(' + (b == 1 ? '' : b == -1 ? '-' : b) + 'i)';
        if (long) return (b == 1 ? '' : b == -1 ? '-' : b) + 'i';   //  2017.11
        return b == 1 ? 'i' : b.negate().is1() ? NEGBEG + 'i' + NEGEND : this.digithelp(imag, NEGBEG, NEGEND, true) + IMAG;
    }
    //return '(' + this.digithelp(real, NEGBEG, NEGEND, true) + ',' + this.digithelp(imag, NEGBEG, NEGEND, true) + ')';
    if (long == 'medium') return '(' + a + ',' + b + ')';
    if (long) return '(' + a + '+' + (b == 1 ? '' : b) + 'i)';
    return '(' + a.toString(false, long).replace('(', '').replace(')', '') + ',' + b.toString(false, long) + ')';
}

rationalcomplex.prototype.digithelp = function (digit, NEGBEG, NEGEND, fraction) {  // 2015.11
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var IMAG = String.fromCharCode(777);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    if (typeof (digit) == 'string') return digit;
    var rounddigit = Math.round(digit * 1000) / 1000;
    //if (isNaN(digit)) return '%';
    if (isNaN(digit)) return digit.toString(false, fraction); //  2017.11
    if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;
    if (num[-digit]) return NEGBEG + num[-digit] + NEGEND;
    if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
    if (-1 < digit && digit < 0) {
        if (fraction) if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
        var flip = -1 / digit;
        if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
        if (cons[rounddigit]) return cons[rounddigit];
    }
    if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
    if (digit == 0) return '0';
    if (0 < digit && digit < 1) {
        if (frac[rounddigit]) return frac[rounddigit];
        if (cons[rounddigit]) return cons[rounddigit];	// cons b4 flip prevents .159=6^-1	2015.8
        if (0 < digit && digit < .5) {                  // prevents 1/1.1                       2015.9
            var flip = Math.round(1 / digit);		// round prevents 1/24.99999		2015.8
            if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
        }
    }
    if (cons[rounddigit]) return cons[rounddigit];
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit.toString() : '(' + rounddigit + ')';
    if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

rationalcomplex.zero = new rationalcomplex();   //  2017.11 Default 0

rationalcomplex.prototype.equals = function (other) { return (this.r.equals(other.r)) && (this.i.equals(other.i)); }
rationalcomplex.prototype.isreal = function () { return this.i == 0; }                                                  //  2017.5
rationalcomplex.prototype.is0 = function () { return this.equals(rationalcomplex.zero); }
rationalcomplex.prototype.below = function (other) { return !this.r.equals(other.r) ? this.r.below(other.r) : this.i.below(other.i); }  //  2017.3
rationalcomplex.prototype.above = function (other) { return this.r != other.r ? this.r > other.r : this.i > other.i; }  //  2017.3
rationalcomplex.prototype.below0 = function () { return this.below(rationalcomplex.zero); }                             //  2017.3
rationalcomplex.prototype.above0 = function () { return this.above(rationalcomplex.zero); }                             //  2017.3
rationalcomplex.prototype.isneg = rationalcomplex.prototype.below0                                                      //  2017.10
rationalcomplex.prototype.isint = function () { return this.isreal() && this.r.isint(); }                               //  2017.10

rationalcomplex.prototype.add = function (other) { return new rationalcomplex(this.r.add(other.r), this.i.add(other.i)); }
rationalcomplex.prototype.sub = function (other) { return new rationalcomplex(this.r.sub(other.r), this.i.sub(other.i)); }
rationalcomplex.prototype.exp = function () { return this.i.is0() ? new rationalcomplex(this.r.exp()) : new rationalcomplex(this.r.exp().times(this.i.cos()), this.r.exp().times(this.i.sin())); }  //  2017.3
rationalcomplex.prototype.ln = function () { return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i)).sqrt().log(), this.arg()) }
rationalcomplex.prototype.nor = function () { return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i))) }
rationalcomplex.prototype.norm = function () { return this.r.times(this.r).add(this.i.times(this.i)).sqrt(); }
rationalcomplex.prototype.lnn = function () { return this.nor().ln() }
rationalcomplex.prototype.arg = function () { return this.i.atan2(this.r); }
rationalcomplex.prototype.round = function () { return new rationalcomplex(this.r.round(), this.i.round()) }
rationalcomplex.prototype.negate = function () { return new rationalcomplex(this.r.negate(), this.i.negate()) }     //  2017.3
rationalcomplex.prototype.clone = function () { return new rationalcomplex(this.r, this.i); }                       //  2017.10
rationalcomplex.prototype.scale = function (c) { return new rationalcomplex(this.r.scale(c), this.i.scale(c)); }    //  2017.11

rationalcomplex.prototype.times = function (y) {
    if (!(y instanceof rationalcomplex) && typeof y.r != 'undefined' && typeof y.i != 'undefined') y = new rationalcomplex(y.r, y.i);   //  2017.5
    if (!(y instanceof rationalcomplex)) { var s = 'rationalcomplex.times expects argument (y) to be a rationalcomplex but found ' + typeof y + ' ' + JSON.stringify(y); alert(s); throw new Error(s); }    //  2017.5
    var x = this;
    var c = rationalcomplex;
    return x.i.is0() ? y.i.is0() ? new c(x.r.times(y.r)) : new c(x.r.times(y.r), x.r.times(y.i)) : x.r.is0() ? new c(x.i.negate().times(y.i), x.i.times(y.r)) : new c(x.r.times(y.r).sub(x.i.times(y.i)), x.r.times(y.i).add(x.i.times(y.r)));
}

rationalcomplex.prototype.divide = function (y) {
    var x = this;
    var c = rationalcomplex;
    return y.i.is0() ? x.i.is0() ? new c(x.r.divide(y.r)) : x.r.is0() ? new c(new rational, x.i.divide(y.r)) : new c(x.r.divide(y.r), x.i.divide(y.r)) : new c((x.r.times(y.r).add(x.i.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))), (x.i.times(y.r).sub(x.r.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))));
}

rationalcomplex.prototype.pow = function (p) {
    if (!(p instanceof rationalcomplex)) p = rationalcomplex.parse(p);  //  2017.11
    //try {
        var b = this;
        var c = rationalcomplex;
        if (b.norm().is0()) var ret = new c(new rational().pow(p.r));
        else if (b.i.is0()) var ret = p.times(b.ln()).exp(); //  2017.3
        else var ret = new c(b.norm().pow(p.r).times((p.i.negate().times(b.arg())).exp())).times(new c(new rational, p.r.times(b.arg()).add(p.i.times(b.lnn().r).scale(.5))).exp());
        return ret.round();
    //} catch (e) {
    //    alert(e);
    //    console.trace();
    //    end;
    //}
}

rationalcomplex.prototype.divideleft = rationalcomplex.prototype.divide;      //  2017.10
rationalcomplex.prototype.dividemiddle = rationalcomplex.prototype.divide;    //  2017.10
rationalcomplex.prototype.pointadd = rationalcomplex.prototype.add;           //  2017.10
rationalcomplex.prototype.pointsub = rationalcomplex.prototype.sub;           //  2017.10
rationalcomplex.prototype.pointtimes = rationalcomplex.prototype.times;       //  2017.10
rationalcomplex.prototype.pointdivide = rationalcomplex.prototype.divide;     //  2017.10
rationalcomplex.prototype.pointpow = rationalcomplex.prototype.pow;           //  2017.10

rationalcomplex.prototype.eval = function (base) {  //  2017.10
    return this.clone();
}