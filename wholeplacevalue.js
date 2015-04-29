
// Author : Anthony John Ripa
// Date : 4/28/2015
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
        var num = '';
        var inparen = false;
        for (var i = 0; i < N.length; i++) {
            var c = N[i];
            if (c == '(') { inparen = true; continue; }
            if (c == ')') { ret.push(Number(num)); num = ''; inparen = false; continue; }
            if (inparen)
                num += c;
            else {
                if (c == '.') break;
                if (c == 0 || c == 1 | c == 2 || c == 3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9) ret.push(c);
                if (c == '∞') ret.push(Infinity);
                if (c == '%') ret.push(NaN);
                if (c == String.fromCharCode(822)) ret[ret.length - 1] *= -1;
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
    var ret = "";
    var digit = i < 0 ? 0 : this.mantisa[i];
    digit = Math.round(digit * 1000) / 1000;
    if (isNaN(digit)) ret += '%';
    if (digit == -1 / 0) ret += '∞' + String.fromCharCode(822);
    if (digit < -9 && isFinite(digit)) ret += '(' + digit + ')';
    if (-9 <= digit && digit < 0)
        ret += (digit == Math.round(digit)) ? Math.abs(digit).toString().split('').join(String.fromCharCode(822)) + String.fromCharCode(822) : '(' + digit + ')';
    if (0 <= digit && digit <= 9) ret += (digit == Math.round(digit)) ? digit : '(' + digit + ')';
    if (9 < digit && isFinite(digit)) ret += '(' + digit + ')';
    if (digit == 1 / 0) ret += '∞';
    return ret;
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
        man.push(Number(this.mantisa[i]) - Number(subtrahend.mantisa[0]));
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

wholeplacevalue.prototype.clone = function() {
    var copiedObject = {};
    if (Array.isArray(this)) copiedObject = [];
    jQuery.extend(true, copiedObject, this);
    return copiedObject;
}
