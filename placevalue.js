
// Author : Anthony John Ripa
// Date : 4/28/2015
// PlaceValue : a datatype for representing base agnostic arithmetic via numbers whose digits are real

function placevalue(man, exp) {
    if (arguments.length < 2) exp = 0;
    if (typeof (man) == "string" && man.indexOf('whole') != -1) {
        var ans = JSON.parse(man);
        man = ans.whole;
        exp = ans.exp;
    }
    this.whole = new wholeplacevalue((typeof man == 'string') ? man.replace(/\.(?![^\(]*\))/g, '') : man);
    this.exp = exp + getexp(man);
    console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
    function getexp(x) {
        if (x instanceof wholeplacevalue) return 0;
        x = x.toString().replace(new RegExp(String.fromCharCode(822), 'g'), '').replace(/\([^\(]*\)/g, 'm');
        return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.length + 1;
    }
}

placevalue.prototype.toStringInternal = function () {
    return this.whole + 'E' + this.exp;
}

placevalue.prototype.toString = function () {
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var ret = "";
    for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
        if (i == this.whole.mantisa.length + this.exp) ret += '.';
        ret += this.whole.digit(i);
    }
    if (ret.indexOf('.') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
    if (ret[ret.length - 1] == '.') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
    while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
    if (ret[0] == '.') ret = '0' + ret;                                                                     // '.x' -> '0.x'
    if (ret == '') ret = '0';                                                                               // ''   -> '0'
    return ret;
}

placevalue.prototype.tohtml = function () {
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

placevalue.pad = function (a, b) {
    if (arguments.length < 3) offset = 0;
    while (a.exp > b.exp) {
        a.exp--;
        a.whole.mantisa.push(0);
    }
    while (b.exp > a.exp) {
        b.exp--;
        b.whole.mantisa.push(0);
    }
    wholeplacevalue.pad(a.whole, b.whole);
}

placevalue.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    placevalue.pad(me, other);
    var whole = me.whole.add(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    placevalue.pad(me, other);
    var whole = me.whole.sub(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    placevalue.pad(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    placevalue.pad(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.times = function (top) {
    var whole = this.whole.times(top.whole);
    return new placevalue(whole, this.exp + top.exp);
}

placevalue.prototype.divide = function (denominator) {
    var me = this.clone();
    pad(me, denominator, 4);
    var whole = me.whole.divide(denominator.whole);
    console.log('placevalue.prototype.divide : return new placevalue(whole, ' + me.exp + '-' + denominator.exp +')')
    return new placevalue(whole, me.exp - denominator.exp);
    function pad(a, b, sigfig) {
        while (a.whole.mantisa.length < sigfig + b.whole.mantisa.length) {
            console.log('placevalue.prototype.divide.padback : ' + a.whole.mantisa.length + ' < ' + sigfig + ' + ' + b.whole.mantisa.length);
            a.exp--;
            a.whole.mantisa.push(0);
        }
    }
}

placevalue.prototype.clone = function () {
    return new placevalue(this.whole.clone(), this.exp);
}
