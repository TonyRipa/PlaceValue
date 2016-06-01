
// Author : Anthony John Ripa
// Date : 5/31/2016
// PlaceValueRatio : a datatype for representing base agnostic arithmetic via ratios of WholePlaceValues

function placevalueratio(num, den) {
    if (arguments.length < 2) alert('placevalueratio expects 2 arguments');
    if (!(num instanceof wholeplacevalue)) alert('placevalueratio expects argument 1 to be a wholeplacevalue but found ' + typeof num + " : " + JSON.stringify(num));
    if (!(den instanceof wholeplacevalue)) alert('placevalueratio expects argument 2 to be a wholeplacevalue but found ' + typeof den + " : " + JSON.stringify(den));
    this.num = num;
    this.den = den;
    this.reduce();
    console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(num)=" + Array.isArray(num));
}

placevalueratio.parse = function (man) {    // 2016.1
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) { var a = JSON.parse(man); return new placevalueratio(new wholeplacevalue(a.num.mantisa), new wholeplacevalue(a.den.mantisa)) }
    var den = 0;
    if (typeof (man) == "number") man = man.toString();     // 2015.11
    if (typeof (man) == "string" && man.indexOf('num') != -1) {
        console.log("new placevalueratio : arg is stringified placevalueratio");
        var ans = JSON.parse(man);
        man = ans.num;
        den = ans.den;
    } else if (man instanceof Object && JSON.stringify(man).indexOf('num') != -1) {   // 2015.8
        console.log("new placevalueratio : arg is placevalueratio");
        den = man.den;      // get den from man before
        man = man.num;    // man overwrites self 2015.8
    }
    if (man.indexOf('/') == -1) {
        var num = wholeplacevalue.parse(man);
        var den = wholeplacevalue.parse(1);
    } else {
        var num = wholeplacevalue.parse(man.split('/')[0]);
        var den = wholeplacevalue.parse(man.split('/')[1]);
    }
    return new placevalueratio(num, den);
    console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
}

placevalueratio.prototype.tohtml = function (short) {        // Long and Short HTML  2015.11
    if (short) return this.toString(true);
    return this.num.toString(true) + ' / ' + this.den;    // Replaces toStringInternal 2015.7
}

placevalueratio.prototype.toString = function (sTag) {       //  sTag    2015.11
    return this.den.toString() === '1' ? this.num.toString() : this.num.toString() + "/" + this.den.toString();
}

placevalueratio.prototype.reduce = function () {    //  2016.5

    //euclid(this);
    circumfixEuclid(this);
    pulloutcommonconstants(this);

    function circumfixEuclid(me) {
        var n = me.num.gcd();
        var d = me.den.gcd();
        me.num = me.num.unscale(n);
        me.den = me.den.unscale(d);
        euclid(me);
        me.num = me.num.scale(n);
        me.den = me.den.scale(d);
    }

    function euclid(ratio) {
        var g = gcdpv(ratio.num, ratio.den);
        //alert(g);
        //for (var i = 0; i < g.mantisa.length; i++)
        //    if (g.get(i) != Math.round(g.get(i))) return;
        if (g.mantisa.length == 1) return;
        ratio.num = ratio.num.divide(g);
        ratio.den = ratio.den.divide(g);
    }

    function pulloutcommonconstants(me) {
        if (me.num.is0() && me.den.is0()) return;
        if (me.num.is0()) { me.den = new wholeplacevalue([1]); return }
        if (me.den.is0()) { me.num = new wholeplacevalue([1]); return }
        var num = me.num.scale(2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10).round();   // Large Composite
        var den = me.den.scale(2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10).round();   // Large Composite
        var n = num.gcd();
        var d = den.gcd()
        var g = gcd(n, d);
        //alert([JSON.stringify(me.num), n, JSON.stringify(me.den), d, g]);
        if (g != Math.round(g)) return;
        me.num = num.unscale(g);
        me.den = den.unscale(g);
    }

    function gcd(a, b) {
        if (a < 0 && b > 0) return gcd(-a, b);
        if (a == 0) return b;
        if (b == 0) return a;
        if (a >= Math.abs(b)) return gcd(a % b, b);
        return gcd(b % a, a);
    }

    function gcdpv(a, b) {
        if (a.get(a.mantisa.length - 1) < 0 && b.get(b.mantisa.length - 1) > 0) return gcdpv(a.negate(), b);
        if (a.is0()) return b;
        if (b.is0()) return a;
        if (a.mantisa.length > b.mantisa.length) return gcdpv(a.remainder(b), b);
        return gcdpv(b.remainder(a), a);
    }
}

placevalueratio.prototype.add = function (addend) {
    return new placevalueratio(this.num.times(addend.den).add(addend.num.times(this.den)), this.den.times(addend.den));
}

placevalueratio.prototype.sub = function (subtrahend) {
    return new placevalueratio(this.num.times(subtrahend.den).sub(subtrahend.num.times(this.den)), this.den.times(subtrahend.den));
}

placevalueratio.prototype.pointsub = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new placevalueratio(first.pointsub(second), new wholeplacevalue([1]));
}

placevalueratio.prototype.pointadd = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new placevalueratio(first.pointadd(second), new wholeplacevalue([1]));
}

placevalueratio.prototype.pointtimes = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new placevalueratio(first.pointtimes(second), new wholeplacevalue([1]));
}

placevalueratio.prototype.pointdivide = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new placevalueratio(first.pointtimes(second), new wholeplacevalue([1]));
}

placevalueratio.prototype.pointpow = function (other) {	// 2015.12
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new placevalueratio(first.pointpow(second), new wholeplacevalue([1]));
}

placevalueratio.prototype.pow = function (power) {	// 2015.8
    if (power instanceof placevalueratio) power = power.num;
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([power]);  // 2015.11
    var pow = Math.abs(power.get(0));
    if (power.get(0) > 0) return new placevalueratio(this.num.pow(pow), this.den.pow(pow));
    return new placevalueratio(this.den.pow(pow), this.num.pow(pow));
    if (power.get(0) < 0) return (new placevalueratio(new wholeplacevalue([1]), 0)).divide(this.pow(new placevalueratio(new wholeplacevalue([-power.get(0)]), 0))); // 2015.8 //  Add '(' for 2 digit power   2015.12
    var num = this.num.pow(power);
    var den = this.den.pow(power);
    return new placevalueratio(num, den);
}

placevalueratio.prototype.times = function (top) {
    return new placevalueratio(this.num.times(top.num), this.den.times(top.den))
}

placevalueratio.prototype.scale = function (scalar) {   // 2015.11
    var num = this.num.scale(scalar);
    return new placevalueratio(num, this.den);
}

placevalueratio.prototype.divide = function (denominator) {
    return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

placevalueratio.prototype.dividemiddle = function (denominator) {    // 2016.5
    return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

placevalueratio.prototype.divideleft = function (denominator) {      // 2016.5
    return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

placevalueratio.prototype.clone = function () {
    return new placevalueratio(this.num.clone(), this.den.clone());
}

placevalueratio.prototype.reciprocal = function () {
    var temp = this.num;
    this.num = this.den;
    this.den = temp;
}

placevalueratio.prototype.eval = function (base) {
    if (base.num.is0()) return new placevalueratio(new wholeplacevalue([this.num.get(0)]), new wholeplacevalue([this.den.get(0)]));
    var num = new placevalueratio(new wholeplacevalue([0]), new wholeplacevalue([1]));
    for (var i = 0; i < this.num.mantisa.length; i++) {
        if (this.num.get(i) != 0) num = num.add(base.pow(i).scale(this.num.get(i)));
    }
    var den = new placevalueratio(new wholeplacevalue([0]), new wholeplacevalue([1]));
    for (var i = 0; i < this.den.mantisa.length; i++) {
        if (this.den.get(i) != 0) den = den.add(base.pow(i).scale(this.den.get(i)));
    }
    return num.divide(den);
}
