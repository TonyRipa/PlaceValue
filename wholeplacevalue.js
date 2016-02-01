
// Author : Anthony John Ripa
// Date : 1/31/2016
// WholePlaceValue : a datatype for representing base agnostic arithmetic via whole numbers whose digits are real

var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v == 1 / 0) ? '∞' : (v == -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }

function wholeplacevalue(man) {
    if (!Array.isArray(man)) alert('wholeplacevalue expects array argument but found ' + typeof man + man);
    this.mantisa = man.map(Number);     // ["+1"]→[1] 2015.6
    while (this.mantisa.length > 0 && this.get(this.mantisa.length - 1) == 0) // while MostSigDig=0 // get(this.mantisa.length - 1) 2015.7 // len>0 prevent ∞ loop 2015.12
        this.mantisa.pop();                             //  pop root
    if (this.mantisa.length == 0) this.mantisa = [0];
    console.log('wpv : this.man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
}

wholeplacevalue.parse = function(n) {
    var N = n.toString();
    if (N.indexOf('mantisa') != -1) return new wholeplacevalue(JSON.parse(N).mantisa);
    var ret = [];
    var numb = '';
    var inparen = false;
    for (var i = 0; i < N.length; i++) {
        var c = N[i];
        if (c == '(') { inparen = true; continue; }
        if (c == ')') { ret.push(Number(numb)); numb = ''; inparen = false; continue; }
        if (inparen)
            numb += c;
        else {
            if (c == '.' || c == 'e' || c == 'E') break;    // Recognize 2e3    2015.9
            if (c == 0 || c == 1 | c == 2 || c == 3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9) ret.push(c);
            var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
            if (frac[c]) ret.push(frac[c]);
            if (c == 'τ') ret.push(6.28);
            var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
            if (num[c]) ret.push(num[c]);
            if (c == '∞') ret.push(Infinity);
            if (c == '%') ret.push(NaN);
            if (c == String.fromCharCode(822)) ret[ret.length - 1] *= -1;
            if (c == String.fromCharCode(8315)) ret[ret.length - 1] = 1 / ret[ret.length - 1];
        }
    }
    return new wholeplacevalue(ret.reverse());   // .reverse makes lower indices represent lower powers 2015.7
}

wholeplacevalue.prototype.get = function (i) {
    if (i < 0 || this.mantisa.length <= i) return 0;    // check <0 2015.12
    return Number(this.mantisa[i]);
}

wholeplacevalue.prototype.tohtml = function () {    // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return me.mantisa.reverse().toString();         // R2L
}

wholeplacevalue.prototype.toString = function (sTag) {                          //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.mantisa.length; i++) ret += this.digit(i, sTag);
    return ret;
}

wholeplacevalue.prototype.digit = function (i, sTag) {                          //  sTag    2015.11
    if (sTag) return this.digithelp(i, '<s>', '</s>', true);
    return this.digithelp(i, '', String.fromCharCode(822), false);
}

wholeplacevalue.prototype.digithelp = function (i, NEGBEG, NEGEND, fraction) {  // 2015.11
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    var digit = i < 0 ? 0 : this.mantisa[this.mantisa.length - 1 - i]; // R2L  2015.7
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
            if (Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
        }
    }
    if (cons[rounddigit]) return cons[rounddigit];
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : '(' + rounddigit + ')';
    if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

wholeplacevalue.prototype.add = function (other) { return this.f(function (x, y) { return x + y }, other); }
wholeplacevalue.prototype.sub = function (other) { return this.f(function (x, y) { return x - y }, other).round(); } // 1-1.1≠-.100009 2015.9
wholeplacevalue.prototype.pointtimes = function (other) { return this.f(function (x, y) { return x * y }, other); }
wholeplacevalue.prototype.pointdivide = function (other) { return this.f(function (x, y) { return x / y }, other); }
wholeplacevalue.prototype.clone = function () { return this.f(function (x) { return x }, this); }
wholeplacevalue.prototype.round = function () { return this.f(function (x) { return Math.round(x * 1000) / 1000 }, this); }   // for sub 2015.9

wholeplacevalue.prototype.f = function (f, other) { // template for binary operations   2015.9
    var man = [];
    for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length); i++) {
        man.push(f(this.get(i), other.get(i)));  // get obviates need to pad 2015.7
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointsub = function (subtrahend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i) - subtrahend.get(0));  // get(0) is the one's place 2015.7
    }
    return new wholeplacevalue(man).round();    // 1-1.1≠-.100009   2015.9
}

wholeplacevalue.prototype.pointadd = function (addend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(this.get(i) + addend.get(0));      // get(0) is the one's place 2015.7
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pow = function (power) { // 2015.6
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([power]);
    if (power.mantisa.length > 1) { alert('WPV >Bad Exponent = ' + power.tohtml()); return new wholeplacevalue(['%']) }   // tohtml supercedes to StringInternal
    if (this.mantisa.length == 1) return new wholeplacevalue([this.mantisa == 0 && power.mantisa == 0 ? '%' : Math.pow(this.mantisa, power.mantisa)]);
    if (power.mantisa != Math.round(power.mantisa)) { alert('WPV .Bad Exponent = ' + power.tohtml()); return new wholeplacevalue(['%']) }
    if (power.mantisa < 0) return new wholeplacevalue([0]);
    if (power.mantisa == 0) return new wholeplacevalue([1]);
    return this.times(this.pow(power.mantisa - 1));
}

wholeplacevalue.prototype.pointpow = function (power) { // 2015.12
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([power]);
    var ret = this.clone();
    ret.mantisa = ret.mantisa.map(function (x) { return Math.pow(x, power.get(0)) });
    return ret;
}

wholeplacevalue.prototype.times10 = function () { this.mantisa.unshift(0) } // Caller can pad w/out knowing L2R or R2L  2015.7

wholeplacevalue.prototype.times = function (top) {
    //if (!(top instanceof wholeplacevalue)) top = new wholeplacevalue([top]);
    var prod = new wholeplacevalue([]);
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            sum.push(this.get(b) == 0 || top.get(t) == 0 ? 0 : this.get(b) * top.get(t)); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.get(b) = ' + this.get(b) + ' , top.get(t) = ' + top.get(t) + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.unshift(0); // change push to unshift because L2R   2015.7
        prod = prod.add(new wholeplacevalue(sum));
    }
    return prod;
}

wholeplacevalue.prototype.scale = function (scalar, trace) {
    var ret = this.clone(trace + ' wholeplacevalue.prototype.scale >');
    ret.mantisa[ret.mantisa.length - 1] *= scalar;                        // leading can be NaN       2015.9
    for (var r = 0; r < ret.mantisa.length - 1; r++)
        if (true || !isNaN(ret.mantisa[r] * scalar)) ret.mantisa[r] *= scalar;  // nonleading can/t be NaN  2015.9
    return ret;
}

wholeplacevalue.getDegree = function (man) {
    for (var i = man.length - 1; i >= 0; i--)
        if (man[i] != 0) return { 'deg': i, 'val': man[i] };
    return { 'deg': 0, 'val': man[0] };
}

wholeplacevalue.prototype.divide = function (den) { // 2015.8
    var num = this;
    var iter = num.mantisa.length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevalue([0], 'wholeplacevalue.prototype.divide >');
        var d = wholeplacevalue.getDegree(den.mantisa);
        var quotient = shift(num, d.deg).scale(1 / d.val, 'wholeplacevalue.prototype.divide >');
        if (d.val == 0) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, left) {
            var ret = new wholeplacevalue([0], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');
            for (var r = 0; r < left; r++) ret.mantisa.shift();
            return ret;
        }
    }
}

wholeplacevalue.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.mantisa.length; i++) {
        sum += this.get(i) * Math.pow(base.get(0), i);  // get(0)   2016.1
    }
    return new wholeplacevalue([sum]);
}
