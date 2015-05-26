
// Author : Anthony John Ripa
// Date : 5/25/2015
// WholePlaceValue : a datatype for representing base agnostic arithmetic via whole numbers whose digits are real

var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v == 1 / 0) ? '∞' : (v == -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }

function wholeplacevalue(man) {
    if (Array.isArray(man)) {
        console.log("wholeplacevalue: arg is array " + JSON.stringify(man));
        this.mantisa = man;
    } else if (typeof man == 'string' || typeof man == 'number') {
        man = man.toString();
        if (man.indexOf('mantisa') != -1) {     // if arg1 is json of placevalue-object
            var ans = JSON.parse(man)
            console.log('ans=' + JSON.stringify(ans));
            this.mantisa = ans.mantisa
        } else {
            console.log('wholeplacevalue : num or string but not wpv; man = ' + man);
            this.mantisa = num2array(man);
        }
    } else {
        this.mantisa = man.mantisa;
    }
    while (this.mantisa[0] == 0)    // while most significant digit is 0
        this.mantisa.shift();       //  pop root
    if (this.mantisa.length == 0) this.mantisa = [0];
    console.log('wpv : this.man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
    function num2array(n) {
        var N = n.toString();
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
                if (c == '.') break;
                if (c == 0 || c == 1 | c == 2 || c == 3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9) ret.push(c);
                var frac = { '⅛': .125, '⅙': .167, '⅕': .2, '¼': .25, '⅓': .333, '½': .5, '⅔': .667, '¾': .75 }
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
        return ret;
    }
}

wholeplacevalue.prototype.toStringInternal = function () {
    return this.mantisa;
}

wholeplacevalue.prototype.toString = function () {
    var ret = "";
    for (var i = 0 ; i < this.mantisa.length; i++) ret += this.digit(i);
    return ret;
}

wholeplacevalue.prototype.digit = function (i) {
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var NEGATIVE = String.fromCharCode(822);
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .5: '½', .667: '⅔', .75: '¾' }
    var cons = { 0.159: 'τ' + INVERSE, 6.28: 'τ' }; cons[-.159] = 'τ' + NEGATIVE + INVERSE;
    var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    var digit = i < 0 ? 0 : this.mantisa[i];
    var rounddigit = Math.round(digit * 1000) / 1000;
    if (isNaN(digit)) return '%';
    if (digit == -1 / 0) return '∞' + NEGATIVE;
    if (num[-digit]) return num[-digit] + NEGATIVE;
    if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
    if (-1 < digit && digit < 0) {
        var flip = -1 / digit;
        if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + NEGATIVE + INVERSE;
        if (cons[rounddigit]) return cons[rounddigit];
    }
    if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? Math.abs(digit).toString().split('').join(NEGATIVE) + NEGATIVE : '(' + rounddigit + ')';
    if (digit == 0) return '0';
    if (0 < digit && digit < 1) {
        if (frac[rounddigit]) return frac[rounddigit];
        var flip = 1 / digit;
        if (Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
        if (cons[rounddigit]) return cons[rounddigit];
    }
    if (cons[rounddigit]) return cons[rounddigit];
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : '(' + rounddigit + ')';
    if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

wholeplacevalue.prototype.tohtml = function () {
    var ret = "";
    for (var i = 0; i < this.mantisa.length; i++) {
        if (this.mantisa[i] >= 0)
            ret += this.mantisa[i]
        else
            ret += '<s>' + Math.abs(this.mantisa[i]) + '</s>';
    }
    console.log(ret);
    return ret;
}

wholeplacevalue.pad = function (a, b) {
    while (a.mantisa.length > b.mantisa.length)
        b.mantisa.unshift(0);
    while (b.mantisa.length > a.mantisa.length)
        a.mantisa.unshift(0);
}

wholeplacevalue.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    var man = [];
    wholeplacevalue.pad(me, other);
    for (var i = 0; i < me.mantisa.length; i++) {
        man.push(Number(me.mantisa[i]) + Number(other.mantisa[i]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    var man = [];
    wholeplacevalue.pad(me, other);
    for (var i = 0; i < me.mantisa.length; i++) {
        man.push(Number(me.mantisa[i]) - Number(other.mantisa[i]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointsub = function (subtrahend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) - Number(subtrahend.mantisa[subtrahend.mantisa.length - 1]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointadd = function (addend) {
    var man = [];
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) + Number(addend.mantisa[addend.mantisa.length - 1]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    var man = [];
    wholeplacevalue.pad(me, other);
    for (var i = 0; i < me.mantisa.length; i++) {
        man.push(Number(me.mantisa[i]) * Number(other.mantisa[i]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    var man = [];
    wholeplacevalue.pad(me, other);
    for (var i = 0; i < me.mantisa.length; i++) {
        man.push(Number(me.mantisa[i]) / Number(other.mantisa[i]));
    }
    return new wholeplacevalue(man);
}

wholeplacevalue.prototype.times = function (top) {
    if (!(top instanceof wholeplacevalue)) top = new wholeplacevalue(top);
    var prod = new wholeplacevalue([]);
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            sum.unshift(this.mantisa[this.mantisa.length - b - 1] * top.mantisa[top.mantisa.length - t - 1]);
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.mantisa[b] = ' + this.mantisa[this.mantisa.length - b - 1] + ' , top.mantisa[t] = ' + top.mantisa[top.mantisa.length - t - 1] + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.push(0);
        prod = prod.add(new wholeplacevalue(sum));
    }
    return prod;
}

wholeplacevalue.prototype.divide = function (denominator) {
    var me = this.clone();
    var other = denominator.clone();
    while (other.mantisa[0] == 0) {  // while most significant digit is 0
        other.mantisa.shift();            // pop root 
    }
    if (other.mantisa.length == 0) other.mantisa = [0];
    while (me.mantisa.length < other.mantisa.length) {
        me.mantisa.unshift(0);
    }
    return new wholeplacevalue(divide(me.mantisa, other.mantisa));
    function divide(num, den) {
        console.log('num=' + num + '; den=' + den);
        var ret = [];   // need var here otherwise ret is global
        if (num.length >= den.length) {
            var ratio = num[0] / den[0];
            ret.push(num[0] / den[0]);
            var newnum = sub(num, arrXd(den, ratio));
            newnum.shift();   // remove (leading=indexZero) zero
            var q = divide(newnum, den);
            ret = ret.concat(q);
        }
        return ret;
        function sub(first, second) {
            if (first.length < second.length) alert("sub error: can't subtract larger from smaller size numbers");
            var ret = [];           // need var here otherwise ret is global
            for (var i = 0; i < first.length; i++)
                ret.push(second[i] ? first[i] - second[i] : first[i]);
            return ret;
        }
        function arrXd(arr, d) {
            if (!Array.isArray(arr)) alert("times error: arg1 must be array");
            if (typeof d != 'number' && typeof d != 'string') alert("times error: arg2 must be digit");
            var ret = [];           // need var here otherwise ret is global
            for (var i = 0; i < arr.length; i++)
                ret.push(arr[i] * d);
            return ret;
        }
    }
}

wholeplacevalue.prototype.clone = function () {
    var copiedObject = {};
    if (Array.isArray(this)) copiedObject = [];
    jQuery.extend(true, copiedObject, this);
    return copiedObject;
}
