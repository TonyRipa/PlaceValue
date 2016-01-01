
// Author : Anthony John Ripa
// Date : 12/31/2015
// WholePlaceValueComplex : a datatype for representing base agnostic arithmetic via whole numbers whose digits are complex

//var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
//var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v == 1 / 0) ? '∞' : (v == -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }

function wholeplacevaluecomplex(man) {
    if (Array.isArray(man)) {
        console.log("wholeplacevaluecomplex: arg is array " + JSON.stringify(man));
        this.mantisa = man.map(function (x) { return Array.isArray(x) ? x : Number(x) });     // ["+1"]→[1] 2015.6  Array   2015.12
        console.log("wholeplacevaluecomplex: arg is array " + JSON.stringify(this.mantisa));
    } else if (typeof man == 'string' || typeof man == 'number') {
        man = man.toString();
        if (man.indexOf('mantisa') != -1) {     // if arg1 is json of placevalue-object
            var ans = JSON.parse(man)
            console.log('ans=' + JSON.stringify(ans));
            this.mantisa = ans.mantisa
        } else {
            console.log('wholeplacevaluecomplex : num or string but not wpv; man = ' + man);
            this.mantisa = num2array(man);
        }
    } else {
        console.log('wholeplacevaluecomplex : arg is else; man = ' + JSON.stringify(man)); // 2015.8
        this.mantisa = man.mantisa;
    }
    while (this.get(this.mantisa.length - 1) == 0)  //  while most significant digit is 0  // get(this.mantisa.length - 1) 2015.7
        this.mantisa.pop();                             //  pop root
    if (this.mantisa.length == 0) this.mantisa = [0];
    console.log('cwpv : this.man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
    function num2array(n) {
        var N = n.toString();
        var ret = [];
        var numb = '';
        var imag = '';
        var inparen = false;
        var inimag = false;
        for (var i = 0; i < N.length; i++) {
            var c = N[i];
            if (c == '(') { inparen = true; continue; }
            if (c == ',') { inimag = true; continue; }
            if (c == ')') { ret.push([Number(numb), Number(imag)]); numb = ''; imag = ''; inimag = false; inparen = false; continue; }
            if (inparen)
                if (inimag) imag += c; else numb += c;
            else {
                if (c == '.' || c == 'e' || c == 'E') break;    // Truncate    2015.9
                if (c == 0 || c == 1 | c == 2 || c == 3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9) ret.push(c);
                var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
                if (frac[c]) ret.push(frac[c]);
                if (c == 'τ') ret.push(6.28);
                var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
                if (num[c]) ret.push(num[c]);
                if (c == '∞') ret.push(Infinity);
                if (c == '%') ret.push(NaN);
                if (c == 'i') ret.push([0, 1]);     // 2015.12
                if (c == String.fromCharCode(777)) ret[ret.length - 1] = [0, ret[ret.length - 1]];
                if (c == String.fromCharCode(822)) { if (Array.isArray(ret[ret.length - 1])) { ret[ret.length - 1][0] *= -1; ret[ret.length - 1][1] *= -1; } else ret[ret.length - 1] *= -1; }
                if (c == String.fromCharCode(8315)) ret[ret.length - 1] = 1 / ret[ret.length - 1];
            }
        }
        return ret.reverse();   // .reverse makes lower indices represent lower powers 2015.7
    }
}

wholeplacevaluecomplex.prototype.get = function (i) {
    return [this.getreal(i), this.getimag(i)];
    //return Number(this.mantisa[i]);
}

wholeplacevaluecomplex.prototype.getreal = function (i) {
    if (i < 0 || this.mantisa.length <= i) return 0;
    if (Array.isArray(this.mantisa[i])) return Number(this.mantisa[i][0]);
    return Number(this.mantisa[i]);
    return this.get(i);
}

wholeplacevaluecomplex.prototype.getimag = function (i) {
    if (i < 0 || this.mantisa.length <= i) return 0;
    if (Array.isArray(this.mantisa[i])) return Number(this.mantisa[i][1]);
    return 0;
}

wholeplacevaluecomplex.prototype.tohtml = function () {    // Replaces toStringInternal 2015.7
    //alert(this)
    var me = this.clone();                          // Reverse will mutate  2015.9
    //alert(me)
    return JSON.stringify(me.mantisa.reverse());
    return me.mantisa.reverse().toString();         // R2L
}

wholeplacevaluecomplex.prototype.toString = function (sTag) {                          //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.mantisa.length; i++) ret += this.digit(i, sTag);
    return ret;
}

wholeplacevaluecomplex.prototype.digit = function (i, sTag, long) {                          //  sTag    2015.11
    if (sTag) return this.digitpair(i, '<s>', '</s>', true, long);
    return this.digitpair(i, '', String.fromCharCode(822), false, long);
}

wholeplacevaluecomplex.prototype.digitpair = function (i, NEGBEG, NEGEND, fraction, long) {  // 2015.12
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var IMAG = String.fromCharCode(777);
    var digit = i < 0 ? 0 : this.mantisa[this.mantisa.length - 1 - i]; // R2L  2015.7
    if (!Array.isArray(digit)) return this.digithelp(digit, NEGBEG, NEGEND, true);
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

wholeplacevaluecomplex.prototype.digithelp = function (digit, NEGBEG, NEGEND, fraction) {  // 2015.11
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

wholeplacevaluecomplex.add = function (x, y) { return [x[0] + y[0], x[1] + y[1]]; }
wholeplacevaluecomplex.sub = function (x, y) { return [x[0] - y[0], x[1] - y[1]]; }
//wholeplacevaluecomplex.mul = function (x, y) { return [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; }
wholeplacevaluecomplex.mul = function (x, y) { return x[1] == 0 ? [x[0] * y[0], x[0] * y[1]] : x[0] == 0 ? [-x[1] * y[1], x[1] * y[0]] : [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; }
wholeplacevaluecomplex.div = function (x, y) { return y[1] == 0 ? x[1] == 0 ? [x[0] / y[0], 0] : x[0] == 0 ? [0, x[1] / y[0]] : [x[0] / y[0], x[1] / y[0]] : [(x[0] * y[0] + x[1] * y[1]) / (y[0] * y[0] + y[1] * y[1]), (x[1] * y[0] - x[0] * y[1]) / (y[0] * y[0] + y[1] * y[1])]; }
wholeplacevaluecomplex.exp = function (x) { return [Math.exp(x[0]) * Math.cos(x[1]), Math.exp(x[0]) * Math.sin(x[1])]; }
wholeplacevaluecomplex.ln = function (x) { return [Math.log(Math.sqrt(x[0] * x[0] + x[1] * x[1])), Math.atan2(x[1], x[0])]; }
wholeplacevaluecomplex.nor = function (x) { return [x[0] * x[0] + x[1] * x[1], 0] }
wholeplacevaluecomplex.norm = function (x) { return Math.sqrt(x[0] * x[0] + x[1] * x[1]) }
wholeplacevaluecomplex.lnn = function (x) { return wholeplacevaluecomplex.ln(wholeplacevaluecomplex.nor(x)) }
wholeplacevaluecomplex.arg = function (x) { return Math.atan2(x[1], x[0]) }
wholeplacevaluecomplex.prototype.add = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex.add(x, y) }, other); }
wholeplacevaluecomplex.prototype.sub = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex.sub(x, y) }, other); } // 1-1.1≠-.100009 2015.9
wholeplacevaluecomplex.prototype.pointtimes = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex.mul(x, y) }, other); }
wholeplacevaluecomplex.prototype.pointdivide = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex.div(x, y) }, other); }
wholeplacevaluecomplex.prototype.clone = function () { return this.f(function (x) { return x }, this); }
wholeplacevaluecomplex.prototype.round = function () { return this.f(function (x) { return [x[0] * Math.round(x[0] * 1000) / 1000, x[1] * Math.round(x[1] * 1000) / 1000] }, this); }   // for sub 2015.9

wholeplacevaluecomplex.prototype.f = function (f, other) { // template for binary operations   2015.9
    var man = [];
    for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length); i++) {
        man.push(f(this.get(i), other.get(i)));  // get obviates need to pad 2015.7
    }
    //alert(man);
    return new wholeplacevaluecomplex(man);
}

wholeplacevaluecomplex.prototype.pointsub = function (subtrahend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(wholeplacevaluecomplex.sub(this.get(i),subtrahend.get(0)));  // get(0) is the one's place 2015.7
    }
    return new wholeplacevaluecomplex(man)//.round();    // 1-1.1≠-.100009   2015.9
}

wholeplacevaluecomplex.prototype.pointadd = function (addend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(wholeplacevaluecomplex.add(this.get(i),addend.get(0)));      // get(0) is the one's place 2015.7
    }
    return new wholeplacevaluecomplex(man);
}

wholeplacevaluecomplex.prototype.pow = function (power) { // 2015.6
    var c = wholeplacevaluecomplex;
    if (!(power instanceof wholeplacevaluecomplex)) power = new wholeplacevaluecomplex([power]);
    if (power.mantisa.length > 1) { alert('CWPV >Bad Exponent = ' + power.tohtml()); return new wholeplacevaluecomplex('%') }   // tohtml supercedes to StringInternal
    if (this.mantisa.length == 1 && this.getimag(0) == 0) return new wholeplacevaluecomplex([this.getreal(0) == 0 && power.getreal(0) == 0 ? '%' : Math.pow(this.getreal(0), power.getreal(0))]);
    if (power.getimag(0) != 0) { alert('CWPV iBad Exponent = ' + power.tohtml()); return new c([c.mul([Math.pow(c.norm(this.get(0)), power.getreal(0)) * Math.exp(-power.getimag(0) * c.arg(this.get(0))), 0], c.exp([0, power.getreal(0) * c.arg(this.get(0)) + .5 * power.getimag(0) * c.lnn(this.get(0))[0]]))]) }
    if (power.getreal(0) != Math.round(power.getreal(0))) { alert('CWPV .Bad Exponent = ' + JSON.stringify(power)); return new wholeplacevaluecomplex('%') }
    if (power.getreal(0) < 0) return new wholeplacevaluecomplex(0);
    if (power.getreal(0) == 0) return new wholeplacevaluecomplex(1);
    return this.times(this.pow(power.getreal(0) - 1));
}

wholeplacevaluecomplex.prototype.pointpow = function (power) {  // 2015.12
    if (!(power instanceof wholeplacevaluecomplex)) power = new wholeplacevaluecomplex([power]);
    if (power.getreal(0) == 1) return this.clone();
    return this.pointtimes(this.pointpow(power.getreal(0) - 1));
}

wholeplacevaluecomplex.prototype.equal = function (num) {   // 2015.12
    return new wholeplacevaluecomplex(this.mantisa.map(function (x) { return (x == num || x[0] == num) ? '%' : 0 }));
}

wholeplacevaluecomplex.prototype.times10 = function () { this.mantisa.unshift(0) } // Caller can pad w/out knowing L2R or R2L  2015.7

wholeplacevaluecomplex.prototype.times = function (top) {
    if (!(top instanceof wholeplacevaluecomplex)) top = new wholeplacevaluecomplex(top);
    var prod = new wholeplacevaluecomplex([]);
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            var r1 = this.getreal(b), i1 = this.getimag(b), r2 = top.getreal(t), i2 = top.getimag(t);
            //sum.push((r1 == 0 && i1 == 0) || (r2 == 0 && i2 == 0) ? 0 : [r1 * r2 - i1 * i2, r1 * i2 + r2 * i1]); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            sum.push((r1 == 0 && i1 == 0) || (r2 == 0 && i2 == 0) ? 0 : wholeplacevaluecomplex.mul(this.get(b), top.get(t))); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.get(b) = ' + this.get(b) + ' , top.get(t) = ' + top.get(t) + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.unshift(0); // change push to unshift because L2R   2015.7
        prod = prod.add(new wholeplacevaluecomplex(sum));
    }
    return prod;
}

wholeplacevaluecomplex.prototype.scale = function (scalar, trace) {
    //alert("scalar: " + scalar)
    //alert("this: " + JSON.stringify(this))
    var ret = this.clone(trace + ' wholeplacevaluecomplex.prototype.scale >');
    //alert("ret: " + JSON.stringify(ret))
    //ret.mantisa[ret.mantisa.length - 1] *= scalar;                        // leading can be NaN       2015.9
    for (var r = 0; r < ret.mantisa.length - 1 * 0; r++)
        if (true || !isNaN(ret.mantisa[r] * scalar)) ret.mantisa[r] = wholeplacevaluecomplex.mul(ret.get(r), scalar);  // nonleading can/t be NaN  2015.9
        //if (true || !isNaN(ret.mantisa[r] * scalar)) ret.mantisa[r] = [ret.getreal(r) * scalar[0] - ret.getimag(r) * scalar[1], ret.getreal(r) * scalar[1] + ret.getimag(r) * scalar[0]];  // nonleading can/t be NaN  2015.9
    //alert("ret: " + JSON.stringify(ret))
    return ret;
}

wholeplacevaluecomplex.getDegree = function (cwpv) {
    for (var i = cwpv.mantisa.length - 1; i >= 0; i--)
        if (cwpv.get(i) != 0) return { 'deg': i, 'val': [cwpv.getreal(i), cwpv.getimag(i)] };
    return { 'deg': 0, 'val': [cwpv.getreal(0), cwpv.getimag(0)] };
}

wholeplacevaluecomplex.prototype.divide = function (den) { // 2015.8
    var num = this;
    var iter = num.mantisa.length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevaluecomplex(0, 'wholeplacevaluecomplex.prototype.divide >');
        var d = wholeplacevaluecomplex.getDegree(den);
        var quotient = shift(num, d.deg).scale(wholeplacevaluecomplex.div([1, 0], d.val), 'wholeplacevalue.prototype.divide >');
        //alert("q: " + JSON.stringify(quotient))
        if (d.val[0] == 0 && d.val[1] == 0) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevaluecomplex.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, left) {
            //alert("shift: " + me);
            var ret = new wholeplacevaluecomplex(0, 'wholeplacevaluecomplex.prototype.add >').add(me, 'wholeplacevaluecomplex.prototype.shift >');
            for (var r = 0; r < left; r++) ret.mantisa.shift();
            //alert("shift: " + JSON.stringify(ret))
            return ret;
        }
    }
}

wholeplacevaluecomplex.prototype.eval = function (base) {
    //alert(base)
    var sum = [0, 0];
    for (var i = 0; i < this.mantisa.length; i++) {
        sum = wholeplacevaluecomplex.add(sum, wholeplacevaluecomplex.mul(this.get(i), base.pow(i).get(0)));
    }
    return new wholeplacevaluecomplex([sum]);
}
