
// Author:  Anthony John Ripa
// Date:    6/29/2016
// Complex: A data-type for representing Complex Numbers

function complex(real, imag) {
    if (arguments.length < 1) alert('complex expects 1 or 2 arguments');
    if (arguments.length < 2) imag = 0;
    if (!(typeof real == 'number' || real instanceof Number)) { console.trace(); alert('complex expects argument 1 (real) to be a Number but found ' + typeof real + ' ' + JSON.stringify(real)); }
    if (!(typeof imag == 'number' || imag instanceof Number)) { console.trace(); alert('complex expects argument 2 (imag) to be a Number but found ' + typeof imag + ' ' + JSON.stringify(imag)); }
    this.r = real;
    this.i = imag;
}

complex.parse = function (n) {
    var N = n.toString();
    var ret = 0;
    var numb = '';
    var imag = '';
    var inparen = false;
    var inimag = false;
    for (var i = 0; i < N.length; i++) {
        var c = N[i];
        if (c == '(') { inparen = true; continue; }
        if (c == ',') { inimag = true; continue; }
        if (c == ')') { ret = [Number(numb), Number(imag)]; numb = ''; imag = ''; inimag = false; inparen = false; continue; }
        if (inparen) {
            //alert(numb);
            if (inimag) imag += c; else numb += c;
        }
        else {
            //if (c == 'e' || c == 'E') break;    // Truncate    2015.9
            if ("0123456789.".indexOf(c) > -1) ret += c;
            var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
            if (frac[c]) ret = frac[c];
            if (c == 'τ') ret = 6.28;
            var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
            if (num[c]) ret = num[c];
            if (c == '∞') ret = Infinity;
            if (c == '%') ret = NaN;
            if (c == 'i') ret = [0, 1];     // 2015.12
            if (c == String.fromCharCode(777)) ret = [0, ret];
            if (c == String.fromCharCode(822)) { if (Array.isArray(ret)) { ret[0] *= -1; ret[1] *= -1; } else ret *= -1; }
            if (c == String.fromCharCode(8315)) ret = 1 / ret;
        }
    }
    var digit = ret;
    if (Array.isArray(digit) && digit.length == 2) return new complex(Number(digit[0]), Number(digit[1]));
    if (Array.isArray(digit)) return new complex(Number(digit[0]));
    return new complex(Number(digit));
}

complex.prototype.tohtml = function () { return this.toString(false) }

//complex.prototype.toString = function (sTag) {                          //  sTag    2015.11
//    var ret = "";
//    ret += this.digit(sTag);
//    return ret;
//}

complex.prototype.toString = function (sTag, long) {                        //  sTag    2015.11
    if (sTag) return this.digitpair('<s>', '</s>', true, long);
    return this.digitpair('', String.fromCharCode(822), false, long);
}

complex.prototype.digitpair = function (NEGBEG, NEGEND, fraction, long) {  // 2015.12
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var IMAG = String.fromCharCode(777);
    var digit = [this.r, this.i]; //alert(JSON.stringify(digit));
    //if (!Array.isArray(digit)) return this.digithelp(digit, NEGBEG, NEGEND, true);
    //if (digit[1] == 0) return this.digithelp(digit[0], NEGBEG, NEGEND, true);
    var real = digit[0];
    var imag = digit[1];
    var a = Math.round(real * 1000) / 1000
    var b = Math.round(imag * 1000) / 1000
    //if (real != real) return '%';
    if (-.01 < imag && imag < .01) return long ? a : this.digithelp(real, NEGBEG, NEGEND, true);
    if (real == 0) {
        if (long) return '(' + (b == 1 ? '' : b == -1 ? '-' : b) + 'i)';
        return b == 1 ? 'i' : b == -1 ? NEGBEG + 'i' + NEGEND : this.digithelp(imag, NEGBEG, NEGEND, true) + IMAG;
    }
    //return '(' + this.digithelp(real, NEGBEG, NEGEND, true) + ',' + this.digithelp(imag, NEGBEG, NEGEND, true) + ')';
    if (long) return '(' + a + '+' + (b == 1 ? '' : b) + 'i)';
    return '(' + a + ',' + b + ')';
}

complex.prototype.digithelp = function (digit, NEGBEG, NEGEND, fraction) {  // 2015.11
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var IMAG = String.fromCharCode(777);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    //var digit = i < 0 ? 0 : this.mantisa[this.mantisa.length - 1 - i]; // R2L  2015.7
    if (typeof (digit) == 'string') return digit;
    var rounddigit = Math.round(digit * 1000) / 1000;
    if (isNaN(digit)) return '%';
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
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : '(' + rounddigit + ')';
    if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

complex.zero = new complex(0);

complex.prototype.equals = function (other) { return (this.r == other.r) && (this.i == other.i); }
complex.prototype.is0 = function () { return this.equals(complex.zero); }

complex.prototype.add = function (other) { return new complex(this.r + other.r, this.i + other.i); }
complex.prototype.sub = function (other) { return new complex(this.r - other.r, this.i - other.i); }
complex.prototype.exp = function () { return new complex(Math.exp(this.r) * Math.cos(this.i), Math.exp(this.r) * Math.sin(this.i)) }
complex.prototype.ln = function () { return new complex(Math.log(Math.sqrt(this.r * this.r + this.i * this.i)), Math.atan2(this.i, this.r)) }
complex.prototype.nor = function () { return new complex(this.r * this.r + this.i * this.i) }
complex.prototype.norm = function () { return Math.sqrt(this.r * this.r + this.i * this.i) }
complex.prototype.lnn = function () { return this.nor().ln() }
complex.prototype.arg = function () { return Math.atan2(this.i, this.r) }
complex.prototype.roun = function () { return new complex(Math.round(1000 * this.r) / 1000, Math.round(1000 * this.i) / 1000) }

complex.prototype.times = function (y) {
    if (!(y instanceof complex)) { console.trace(); alert('complex.times expects argument (y) to be a Complex but found ' + typeof y + ' ' + JSON.stringify(y)); }
    var x = this;
    var c = complex;
    return x.i == 0 ? y.i == 0 ? new c(x.r * y.r, 0) : new c(x.r * y.r, x.r * y.i) : x.r == 0 ? new c(-x.i * y.i, x.i * y.r) : new c(x.r * y.r - x.i * y.i, x.r * y.i + x.i * y.r);
}

complex.prototype.divide = function (y) {
    var x = this;
    var c = complex;
    return y.i == 0 ? x.i == 0 ? new c(x.r / y.r, 0) : x.r == 0 ? new c(0, x.i / y.r) : new c(x.r / y.r, x.i / y.r) : new c((x.r * y.r + x.i * y.i) / (y.r * y.r + y.i * y.i), (x.i * y.r - x.r * y.i) / (y.r * y.r + y.i * y.i));
}

complex.prototype.pow = function (y) {
    var x = this;
    var c = complex;
    var p = x.norm() == 0 ? new c(Math.pow(0, y.r), 0) : new c(Math.pow(x.norm(), y.r) * Math.exp(-y.i * x.arg()), 0).times(new c(0, y.r * x.arg() + .5 * y.i * x.lnn().r).exp());
    return p.roun()
}
