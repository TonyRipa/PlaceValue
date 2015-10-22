
// Author : Anthony John Ripa
// Date : 9/23/2015
// PlaceValue : a datatype for representing base agnostic arithmetic via numbers whose digits are real

function placevalue(man, exp) {
    if (arguments.length < 2) exp = 0;
    if (typeof (man) == "string" && man.indexOf('whole') != -1) {
        console.log("new placevalue : arg is stringified placevalue");
        var ans = JSON.parse(man);
        man = ans.whole;
        exp = ans.exp;
    } else if (man instanceof Object && JSON.stringify(man).indexOf('whole') != -1) {   // 2015.8
        console.log("new placevalue : arg is placevalue");
        exp = man.exp;      // get exp from man before
        man = man.whole;    // man overwrites self 2015.8
    }
    this.whole = new wholeplacevalue((typeof man == 'string') ? man.replace(/\.(?![^\(]*\))/g, '') : man);
    this.exp = exp + getexp(man);
    console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
    function getexp(x) {
        if (Array.isArray(x)) return 0;     // If man is Array, man has no exp contribution 2015.8 
        if (x.mantisa) return 0;  // To check for wholeplacevalue-like objects, replace (x instanceof wholeplacevalue) with (x.mantisa)    2015.9
        if (x.toString().toUpperCase().indexOf('E') != -1) {    // Recognize 2e3    2015.9
            x = x.toString().toUpperCase();
            return Number(x.substr(1+x.indexOf('E'))) + getexp(x.substr(0,x.indexOf('E')))
        }
        var NEGATIVE = String.fromCharCode(822); var MINUS = String.fromCharCode(8315); var ONE = String.fromCharCode(185);
        x = x.toString().replace(new RegExp(NEGATIVE, 'g'), '').replace(new RegExp(MINUS, 'g'), '').replace(new RegExp(ONE, 'g'), '').replace(/\([^\(]*\)/g, 'm');
        return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.length + 1;
    }
}

placevalue.prototype.tohtml = function () {     // Replaces toStringInternal 2015.7
    return this.whole.toString() + 'E' + this.exp;
}

placevalue.prototype.toString = function () {
    var ret = "";
    for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
        if (i == this.whole.mantisa.length + this.exp) ret += '.';
        ret += this.whole.digit(i);
    }
    for (var i = 0; i<this.exp; i++) ret += '0';
    if (ret.indexOf('.') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
    if (ret[ret.length - 1] == '.') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
    while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
    if (ret[0] == '.') ret = '0' + ret;                                                                     // '.x' -> '0.x'
    if (ret == '') ret = '0';                                                                               // ''   -> '0'
    return ret;
}

placevalue.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    placevalue.align(me, other);
    var whole = me.whole.add(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    placevalue.align(me, other);
    var whole = me.whole.sub(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.pointadd = function (addend) {
    var whole = this.whole.pointadd(addend.whole);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    placevalue.align(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    placevalue.align(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pow = function (power) {	// 2015.8
    if (power instanceof placevalue) power = power.whole;   // laurent calls wpv    2015.8
    if (power.get(0)<0) return (new placevalue(1)).divide(this.pow(new placevalue(-power.get(0)))); // 2015.8
    var whole = this.whole.pow(power);
    var exp = this.exp * power.get(0);    // exp*pow not exp^pow  2015.9
    return new placevalue(whole, exp);
}

placevalue.align = function (a, b) {    // rename pad align 2015.9
    if (arguments.length < 3) offset = 0;
    while (a.exp > b.exp) {
        a.exp--;
        a.whole = a.whole.times(10);    // Delegate Shift to Whole  2015.7
    }
    while (b.exp > a.exp) {
        b.exp--;
        b.whole = b.whole.times(10);    // Delegate Shift to Whole  2015.7
    }
}

placevalue.prototype.times = function (top) {
    var whole = this.whole.times(top.whole);
    return new placevalue(whole, this.exp + top.exp);
}

placevalue.prototype.divide = function (denominator) {
    var me = this.clone();
    if (me.whole.mantisa.length<denominator.whole.mantisa.length) pad(me, denominator, 4);  // 2015.9
    var whole = me.whole.divide(denominator.whole);
    console.log('placevalue.prototype.divide : return new placevalue(whole, ' + me.exp + '-' + denominator.exp +')')
    return new placevalue(whole, me.exp - denominator.exp);
    function pad(n, d, sigfig) {
        while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
            console.log('placevalue.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp--;
            n.whole.times10();      // Delegate Shift to Whole  2015.7
        }
    }
}

placevalue.prototype.clone = function () {
    return new placevalue(this.whole.clone(), this.exp);
}

placevalue.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.whole.mantisa.length; i++) {
        sum += this.whole.get(i) * Math.pow(base, i);
    }
    var scale = Math.pow(base, this.exp)
    sum *= scale;
    return new placevalue('(' + sum + ')');
}