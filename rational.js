
// Author:  Anthony John Ripa
// Date:    11/30/2017
// Rational: A data-type for representing Rational Numbers

function rational(num, den) {   //  2016.7
    //if (arguments.length < 1) alert('Rational expects 1 or 2 arguments');
    if (arguments.length < 1) num = 0;  //  2017.9
    if (arguments.length < 2) den = 1;
    if (!(typeof num == 'number' || num instanceof Number)) { var s = 'Rational expects arg 1 (num) to be a Number not ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }
    if (!(typeof den == 'number' || den instanceof Number)) { console.trace(); alert('Rational expects argument 2 (den) to be a Number but found ' + typeof den + ' ' + JSON.stringify(den)); }
    if (isNaN(num)) { var s = 'Rational expects argument 1 (num) to be a Number but found NaN: ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }  //  2017.7
    this.n = num;
    this.d = den;
    pulloutcommonconstants(this);
    function pulloutcommonconstants(me) {
        if (Math.abs(me.n) == 1 / 0 && Math.abs(me.d) == 1 / 0) { me.n = 0; me.d = 0; }
        if (me.n == 0 && me.d == 0) return;
        if (me.n == 0 || me.n == Infinity || me.n == -Infinity) { me.d = 1; return }
        if (me.d == 0) { me.n = Math.sign(me.n); return }
        if (me.d == Infinity || me.d == -Infinity) { me.n = 0; me.d = 1; return }
        var g = gcd(me.n, me.d);
        me.n = me.n / g;
        me.d = me.d / g;
        function gcd(a, b) {
            if (a < 0 && b > 0) return gcd(-a, b);
            if (a == 0) return b;
            if (b == 0) return a;
            if (a >= Math.abs(b)) return gcd(a % b, b);
            return gcd(b % a, a);
        }
    }
}

rational.prototype.parse = function (n) {   //  2017.9
    if (n instanceof String || typeof (n) == 'string') if (n.indexOf('d') != -1) { var x = JSON.parse(n); return new rational(x.n, x.d) }
    if (n instanceof Number || typeof n == 'number') return parsenumber(n);
    var N = n.toString();
    while (N[0] == '(' && N.slice(-1) == ')')
        N = N.slice(1, -1);
    if (N.indexOf("/") > -1) {
        var numden = N.split('/');
        var num = parsestring(numden[0]);
        var den = parsestring(numden[1]);
        var frac = [num[0] * den[1], num[1] * den[0]];
    } else {
        var frac = parsestring(N);
    }
    var numerator = parsenumber(frac[0]);
    var denominator = parsenumber(frac[1]);
    return numerator.divide(denominator);
    function parsenumber(n) {
        if (isNaN(n)) return new rational(0, 0);
        if (n == Infinity) return new rational(1, 0);
        if (n == -Infinity) return new rational(-1, 0);
        if (n == Math.round(n)) return new rational(n);
        var ns = n.toString();
        var den = Math.pow(10, ns.length - ns.indexOf('.') - 1);
        var num = n * den;
        return new rational(num, den);
    }
    function parsestring(n) {
        var N = n.toString();
        while (N[0] == '(' && N.slice(-1) == ')')
            N = N.slice(1, -1);
        var ret = 0;
        var signbit = 0;
        if (N[0] == '-') { signbit = 1; N = N.substr(1) }
        var flipbit = 0;
        var numb = '';
        for (var i = 0; i < N.length; i++) {
            var c = N[i];
            //if (c == 'e' || c == 'E') break;    // Truncate    2015.9
            if ("0123456789.".indexOf(c) > -1) ret += c;
            var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
            var fracnumden = { '⅛': [1, 8], '⅙': [1, 6], '⅕': [1, 5], '¼': [1, 4], '⅓': [1, 3], '⅜': [3, 8], '⅖': [2, 5], '½': [1, 2], '⅗': [3, 5], '⅔': [2, 3], '¾': [3, 4], '⅘': [4, 5], '⅚': [5, 6] }
            if (frac[c]) ret = fracnumden[c];
            if (c == 'τ') ret = 6.28;
            var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
            if (num[c]) ret = num[c];
            if (c == '∞') ret = Infinity;
            if (c == '%') ret = [0,0];
            if (c == String.fromCharCode(822)) signbit = 1;
            if (c == String.fromCharCode(8315)) flipbit = 1;
        }
        if (!Array.isArray(ret)) ret = [ret, 1];
        if (flipbit) ret = [ret[1], ret[0]];
        if (signbit) ret = [-ret[0], ret[1]];
        return ret.map(Number);
    }
}

rational.regex = function () {  //  2017.6
    var literal = '[⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚%]';   //  2017.11 %
    var dec = String.raw`(\d+\.\d*|\d*\.\d+|\d+)`;
    var num = '(' + literal + '|' + dec + ')';
    var frac = '(' + num + '/' + num + '|' + num + ')';
    var signfrac = '(' + '[\+\-]?' + frac + ')';
    return signfrac;
}

rational.regexfull = function () {   //  2017.11
    return '^' + rational.regex() + '$';
}

rational.prototype.toreal = function () { return this.n / this.d; }

rational.prototype.todigit = function () {
    var IMAG = String.fromCharCode(777);
    var NEG = String.fromCharCode(822);
    var s = this.toString(false, false);
    if (!(s instanceof String)) s = s.toString();
    var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
    if (len > 1 && s[0] != '(') return '(' + s + ')';
    return s;
}

rational.prototype.tohtml = function (short) {
    if (short) {
        var candidate1 = this.toString(true);
        var candidate2 = "<table style='float:none;display:inline-table;vertical-align:bottom;text-align:center;font-size:0.5em;line-height:0.5em'><tr><td>" + this.n + "</td></tr><tr><td style='border-top:thin solid'>" + this.d + "</td></tr></table>";
        return ((candidate1.replace('<s>', '').replace('</s>', '').length) <= Math.max(this.n.toString().length, this.d.toString().length)) ? candidate1 : candidate2;
    }
    return this.n + ' / ' + this.d;
}

rational.prototype.toString = function (sTag, long) {   //  2015.11 sTag    2017.6  long
    if (long) return this.d == 1 ? this.n : this.n + '/' + this.d;  //  2017.7
    var NEGBEG = long ? '-' : sTag ? '<s>' : '';
    var NEGEND = long ? '' : sTag ? '</s>' : String.fromCharCode(822);
    var candidate1 = this.digitpair(NEGBEG, NEGEND, long)//.toString().replace('(', '').replace(')', '');
    var candidate2 = this.digithelp(this.toreal(), NEGBEG, NEGEND, long).toString().replace('(0.', '(.').replace('(-0.', '(-.');//alert([candidate1,candidate2])
    return (candidate1.length <= candidate2.replace('<s>', '').replace('</s>', '').length) ? candidate1 : candidate2;
}

rational.prototype.digitpair = function (NEGBEG, NEGEND, long) {  // 2015.12
    // 185  189  777 822 8315   9321
    // ^1   1/2  ^   -   ^-     10
    var IMAG = String.fromCharCode(777);
    var digit = [this.n, this.d];
    var num = digit[0];
    var den = digit[1];
    var a = Math.round(num * 1000) / 1000
    var b = Math.round(den * 1000) / 1000
    if (.99 < den && den < 1.01) return this.digithelp(num, NEGBEG, NEGEND, long);
    return '(' + a + '/' + b + ')';
}

rational.prototype.digithelp = function (digit, NEGBEG, NEGEND, long) { //  2017.7  long
    // 185  189  777 822 8315   9321
    // ^1   1/2  ^   -   ^-     10
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var IMAG = String.fromCharCode(777);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    if (typeof (digit) == 'string') return digit;
    var rounddigit = Math.round(digit * 1000) / 1000;
    if (isNaN(digit)) return '%';
    if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;
    if (!long && num[-digit]) return NEGBEG + num[-digit] + NEGEND;
    if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
    if (!long) if (-1 < digit && digit < 0) {
        if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
        if (cons[rounddigit]) return cons[rounddigit];
        if (0 < -digit && -digit < .5) {                // prevents 1/1.041666666           2016.7
            var flip = -Math.round(1 / digit);          
            if (flip < 100 && Math.abs(Math.abs(1 / digit) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
        }
    }
    if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
    if (digit == 0) return '0';
    if (!long) if (0 < digit && digit < 1) {
        if (frac[rounddigit]) return frac[rounddigit];
        if (cons[rounddigit]) return cons[rounddigit];	// cons b4 flip prevents .159=6^-1	2015.8
        if (0 < digit && digit < .5) {                  // prevents 1/1.1                   2015.9
            var flip = Math.round(1 / digit);           // round prevents 1/24.99999		2015.8
            if (flip < 100 && Math.abs(Math.abs(1 / digit) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
        }
    }
    if (!long) if (cons[rounddigit]) return cons[rounddigit];
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : '(' + rounddigit + ')';
    if (!long) if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

rational.prototype.equals = function (other) { return (this.n == other.n) && (this.d == other.d); }
rational.prototype.is0 = function () { return (this.n == 0) && (this.d != 0) }
rational.prototype.is1 = function () { return (this.n == 1) && (this.d == 1) }  //  2017.6
rational.prototype.isint = function () { return this.n % this.d == 0; }         //  2017.6
rational.prototype.ispos = function () { return math.sign(this.n) * math.sign(this.d) > 0 }
rational.prototype.isneg = function () { return math.sign(this.n) * math.sign(this.d) < 0 }
rational.prototype.above = function (other) { return this.sub(other).ispos(); } //  2017.6
rational.prototype.below = function (other) { return this.sub(other).isneg(); } //  2017.6

rational.prototype.abs = function () { return new rational(Math.abs(this.n), Math.abs(this.d)) }

rational.prototype.add = function (other) { return (this.d == 0 && other.d == 0) ? new rational(this.n == other.n ? this.n : 0, 0) : new rational(this.n * other.d + other.n * this.d, this.d * other.d); }
rational.prototype.sub = function (other) { return (this.d == 0 && other.d == 0) ? new rational(this.n == -other.n ? this.n : 0, 0) : new rational(this.n * other.d - other.n * this.d, this.d * other.d); }
rational.prototype.times = function (other) { return new rational(this.n * other.n, this.d * other.d); }
rational.prototype.divide = function (other) { return new rational(this.n * other.d, this.d * other.n); }
rational.prototype.divideleft = rational.prototype.divide;      //  2017.6
rational.prototype.dividemiddle = rational.prototype.divide;    //  2017.6
rational.prototype.pointadd = rational.prototype.add;           //  2017.6
rational.prototype.pointsub = rational.prototype.sub;           //  2017.6
rational.prototype.pointtimes = rational.prototype.times;       //  2017.6
rational.prototype.pointdivide = rational.prototype.divide;     //  2017.6
rational.prototype.negate = function () { return new rational(-this.n, this.d); }
rational.prototype.clone = function () { return new rational(this.n, this.d); } //  2017.6
rational.prototype.round = function () { return new rational(Math.round(this.toreal() * 1000) / 1000, 1); } //  2017.11
rational.prototype.scale = function (c) { return new rational(c * this.n, this.d); } //  2017.11

rational.prototype.atan2 = function (other) { return new rational(Math.atan2(this.toreal(), other.toreal()), 1); }   //  2017.11
rational.prototype.sqrt = function () { return new rational(Math.sqrt(this.n), Math.sqrt(this.d)); }   //  2017.11
rational.prototype.log = function () { return new rational(Math.log(this.toreal()), 1); }   //  2017.11
rational.prototype.exp = function () { return new rational(Math.exp(this.toreal()), 1); }   //  2017.11
rational.prototype.sin = function () { return new rational(Math.sin(this.toreal()), 1); }   //  2017.11
rational.prototype.cos = function () { return new rational(Math.cos(this.toreal()), 1); }   //  2017.11

rational.prototype.pow = function (other) {//alert('rational.pow: ' + other)
    //if (other instanceof rational && other.isint()) return new rational(Math.pow(this.num, other.num), Math.pow(this.den, other.num));
    if (other instanceof rational && other.negate().is1()) return new rational(this.d, this.n); //  2017.7
    if (other instanceof rational) other = other.toreal();
    return new rational(Math.pow(this.toreal(), other));
}

rational.prototype.pointpow = rational.prototype.pow;           //  2017.6

rational.prototype.gcd = function (b) {
    var a = this;
    if (a.is0()) return b;
    if (b.is0()) return a;
    return new rational(gcd(a.n, b.n), lcm(a.d, b.d));
    function gcd(a, b) {
        if (a < 0 && b > 0) return gcd(-a, b);
        if (a == 0) return b;
        if (b == 0) return a;
        if (a > Math.abs(b)) return gcd(a % b, b);
        return gcd(b % a, a);
    }
    function lcm(a, b) {
        if (a == 0 || b == 0) return 0;
        return a * b / gcd(a, b);
    }
}

rational.prototype.eval = function (base) { //  2017.6
    return this.clone();
}