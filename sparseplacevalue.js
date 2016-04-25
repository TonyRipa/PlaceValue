
// Author : Anthony John Ripa
// Date : 4/25/2016
// SparsePlaceValue : a datatype for representing base agnostic arithmetic via sparse numbers whose digits are real

function sparseplacevalue(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue expects argument to be 2D array but found " + typeof points + points); }
    if (!Array.isArray(points[0])) alert("sparseplacevalue expects argument to be 2D array but found 1D array of " + typeof points[0]);
    points = normal(points);
    this.points = points;
    function normal(points) {
        var list = points.map(function (x) { return x.slice(0) });
        sort(list);
        combineliketerms(list);
        return list;
        function sort(list) {
            for (var i = 0; i < list.length; i++)
                for (var j = 0; j < list.length; j++)
                    if (list[i][1] < list[j][1]) {
                        var temp = list[i][1];
                        list[i][1] = list[j][1];
                        list[j][1] = temp;
                    }
        }
        function combineliketerms(list) {
            var i = list.length - 1;
            while (i > 0)
                if (list[i][1] == list[i - 1][1]) {
                    list[i][0] += list[i - 1][0];
                    list.splice(i - 1, 1);
                    i--;
                } else i--;
        }
    }
}

sparseplacevalue.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevalue(JSON.parse(arg).points); }
    if (typeof arg == "number") return new sparseplacevalue(arg, 0);
    if (arg instanceof Number) return new sparseplacevalue(arg, 0);
    arg = arg.toUpperCase();
    var coefpow = arg.split('E')
    var coef = coefpow[0];
    var pow = coefpow[1];
    if (isNaN(pow)) pow = 0;
    return new sparseplacevalue([[Number(coef), Number(pow)]]);
}

sparseplacevalue.prototype.tohtml = function () {    // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return JSON.stringify(me.points.reverse());
}

sparseplacevalue.prototype.toString = function (sTag) {                          //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += this.digit(i, sTag);
    return ret;
}

sparseplacevalue.prototype.digit = function (i, sTag, long) {                          //  sTag    2015.11
    if (sTag) return this.digitpair(i, '<s>', '</s>', true, long);
    return this.digitpair(i, '', String.fromCharCode(822), false, long);
}

sparseplacevalue.prototype.digitpair = function (i, NEGBEG, NEGEND, fraction, long) {  // 2015.12
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i]; // R2L  2015.7
    if (!Array.isArray(digit)) return this.digithelp(digit, NEGBEG, NEGEND, true);
    var coef = digit[0];
    var pow = digit[1];
    var a = Math.round(coef * 1000) / 1000
    var b = Math.round(pow * 1000) / 1000
    //if (coef != coef) return '%';
    if (-.01 < pow && pow < .01) return long ? a : this.digithelp(coef, NEGBEG, NEGEND, true);
    if (coef == 0) {
        if (long) return '(' + (b == 1 ? '' : b == -1 ? '-' : b) + 'i)';
    }
    if (long) return '(' + a + '+' + (b == 1 ? '' : b) + 'i)';
    return '(' + a + ',' + b + ')';
}

sparseplacevalue.prototype.digithelp = function (digit, NEGBEG, NEGEND, fraction) {  // 2015.11
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
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

sparseplacevalue.prototype.add = function (other) { return new sparseplacevalue(this.points.concat(other.points)); }
sparseplacevalue.prototype.sub = function (other) { return new sparseplacevalue(this.points.concat(other.points.map(function (x) { return [-x[0], x[1]] }))); }
sparseplacevalue.prototype.pointtimes = function (other) { return this; }
sparseplacevalue.prototype.pointdivide = function (other) { return this; }
sparseplacevalue.prototype.pointsub = function (subtrahend) { return this; }
sparseplacevalue.prototype.pointadd = function (addend) { return this; }
sparseplacevalue.prototype.pow = function (power) { return this; }
sparseplacevalue.prototype.pointpow = function (power) { return this; }
sparseplacevalue.prototype.times10 = function () { this }
sparseplacevalue.prototype.clone = function () { return new sparseplacevalue(this.points.slice(0)); }

sparseplacevalue.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            points.push([this.points[i][0] * top.points[j][0], this.points[i][1] + top.points[j][1]]);
    return new sparseplacevalue(points);
}

sparseplacevalue.prototype.divide = function (den) {
    return new sparseplacevalue([[this.points[this.points.length - 1][0] / den.points[den.points.length - 1][0], this.points[this.points.length - 1][1] - den.points[den.points.length - 1][1]]]);
}

sparseplacevalue.prototype.divideleft = function (den) {
    return new sparseplacevalue([[this.points[0][0] / den.points[0][0], this.points[0][1] - den.points[0][1]]]);
}

sparseplacevalue.prototype.dividemiddle = function (den) {
    return new sparseplacevalue([[this.points[0][0] / den.points[0][0], this.points[0][1] - den.points[0][1]]]);
}

sparseplacevalue.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.points.length; i++) {
        sum += this.points[i][0] * Math.pow(base, this.points[i][1]);
    }
    return new sparseplacevalue([[sum, 0]]);
}
