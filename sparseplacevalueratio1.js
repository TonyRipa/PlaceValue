
// Author:  Anthony John Ripa
// Date:    9/30/2017
// SparsePlaceValueRatio1 : a datatype for representing base agnostic arithmetic via ratios of SparsePlaceValueRational1s

function sparseplacevalueratio1(num, den) {
    //if (arguments.length < 2) alert('sparseplacevalueratio1 expects 2 arguments');
    if (arguments.length < 1) num = new sparseplacevaluerational1();          //  2017.9
    if (arguments.length < 2) den = new sparseplacevaluerational1().parse(1); //  2017.9
    if (!(num instanceof sparseplacevaluerational1)) { var s = 'SparsePVRatio1 expects arg1 to be SparsePVRational1 not ' + typeof num + " : " + JSON.stringify(num); alert(s); throw new Error(s); }
    if (!(den instanceof sparseplacevaluerational1)) { var s = 'SparsePVRatio1 expects arg2 to be SparsePVRational1 not ' + typeof den + " : " + JSON.stringify(den); alert(s); throw new Error(s); }
    this.num = num;
    this.den = den;
    this.reduce();
    console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(num)=" + Array.isArray(num));
}

sparseplacevalueratio1.prototype.parse = function (man) {   // 2017.9
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) { var a = JSON.parse(man); return new sparseplacevalueratio1(sparseplacevaluerational1.parse(JSON.stringify(a.num)), sparseplacevaluerational1.parse(JSON.stringify(a.den))) }
    var den = 0;
    if (typeof (man) == "number") man = man.toString();     // 2015.11
    if (typeof (man) == "string" && man.indexOf('num') != -1) {
        console.log("new sparseplacevalueratio1 : arg is stringified sparseplacevalueratio1");
        var ans = JSON.parse(man);
        man = ans.num;
        den = ans.den;
    } else if (man instanceof Object && JSON.stringify(man).indexOf('num') != -1) {   // 2015.8
        console.log("new sparseplacevalueratio1 : arg is sparseplacevalueratio1");
        den = man.den;      // get den from man before
        man = man.num;    // man overwrites self 2015.8
    }
    var slashindex = findslash(man);
    if (slashindex == -1) {
        var num = new sparseplacevaluerational1().parse(man);
        var den = new sparseplacevaluerational1().parse(1);
    } else {
        var num = sparseplacevaluerational1.parse(man.substr(0, slashindex));
        var den = sparseplacevaluerational1.parse(man.substr(slashindex + 1));
    }
    return new sparseplacevalueratio1(num, den);
    function findslash(x) { //  2016.7
        var depth = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] == '/' && depth == 0) return i;
            if (x[i] == '(') depth++;
            if (x[i] == ')') depth--;
        }
        return -1;
    }
}

sparseplacevalueratio1.prototype.tohtml = function (short) {        // Long and Short HTML  2015.11
    if (short) return this.toString(true);
    return this.num.toString(true) + ' / ' + this.den;    // Replaces toStringInternal 2015.7
}

sparseplacevalueratio1.prototype.toString = function (sTag) {       //  sTag    2015.11
    return this.den.toString() === '1' ? this.num.toString() : this.num.toString() + ' / ' + this.den.toString();
}

sparseplacevalueratio1.prototype.reduce = function () {    //  2016.5

    //euclid(this);
    circumfixEuclid(this);
    pulloutcommonconstants(this);

    function circumfixEuclid(me) {
        var n = me.num.gcd();
        var d = me.den.gcd();//alert(JSON.stringify([n,d]))
        me.num = me.num.unscale(n);
        me.den = me.den.unscale(d);
        euclid(me);
        me.num = me.num.scale(n);
        me.den = me.den.scale(d);
    }

    function euclid(ratio) {
        "alert(ratio.num + ' , ' + ratio.den)"
        var g = gcdpv(ratio.num, ratio.den);
        //alert(JSON.stringify(g))
        if (g.points.length == 1 && g.points[0][1].is0()) return;
        ratio.num = ratio.num.divide(g);
        ratio.den = ratio.den.divide(g);
    }

    function pulloutcommonconstants(me) {
        if (me.num.is0() && me.den.is0()) return;
        if (me.num.is0()) { me.den = new sparseplacevaluerational1().parse(1); return }
        if (me.den.is0()) { me.num = new sparseplacevaluerational1().parse(1); return }
        var num = me.num//.scale(2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10).round();   // Large Composite
        var den = me.den//.scale(2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10).round();   // Large Composite
        var n = num.gcd();
        var d = den.gcd();
        var g = n.gcd(d);   // delegate to digits   2016.7
        //alert([JSON.stringify(me.num), n, JSON.stringify(me.den), d, g]);
        //if (g != Math.round(g)) return;
        me.num = num.unscale(g);
        me.den = den.unscale(g);
    }

    function gcdpv(a, b) {
        console.log(a.toString(), b.toString());
        //if (a.get(a.mantisa.length - 1).isneg() && b.get(b.mantisa.length - 1).ispos()) return gcdpv(a.negate(), b);
        if (a.points[0][0].isneg() && b.points[0][0].ispos()) { "alert(1)"; return gcdpv(a.negate(), b); }
        if (a.is0()) { "alert(2)"; return b; }
        if (b.is0()) { "alert(3)"; return a; }
        //if (a.points.length > b.points.length) { alert(4 + ': ' + a + ' , ' + b); return gcdpv(a.remainder(b), b); }
        if (a.points[a.points.length - 1][1].above(b.points[b.points.length - 1][1])) { "alert(5 + ': ' + a + ' , ' + b)"; return gcdpv(a.remainder(b), b); }
        "alert(6 + ': ' + a + ' , ' + b)"; return gcdpv(b.remainder(a), a);
    }
}

sparseplacevalueratio1.prototype.add = function (addend) {
    return new sparseplacevalueratio1(this.num.times(addend.den).add(addend.num.times(this.den)), this.den.times(addend.den));
}

sparseplacevalueratio1.prototype.sub = function (subtrahend) {
    return new sparseplacevalueratio1(this.num.times(subtrahend.den).sub(subtrahend.num.times(this.den)), this.den.times(subtrahend.den));
}

sparseplacevalueratio1.prototype.pointsub = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new sparseplacevalueratio1(first.pointsub(second), sparseplacevaluerational1.parse(1));
}

sparseplacevalueratio1.prototype.pointadd = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new sparseplacevalueratio1(first.pointadd(second), sparseplacevaluerational1.parse(1));
}

sparseplacevalueratio1.prototype.pointtimes = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new sparseplacevalueratio1(first.pointtimes(second), sparseplacevaluerational1.parse(1));
}

sparseplacevalueratio1.prototype.pointdivide = function (other) {
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new sparseplacevalueratio1(first.pointtimes(second), sparseplacevaluerational1.parse(1));
}

sparseplacevalueratio1.prototype.pointpow = function (other) {	// 2015.12
    var first = this.num.div10s(this.den.mantisa.length - 1);
    var second = other.num.div10s(other.den.mantisa.length - 1);
    return new sparseplacevalueratio1(first.pointpow(second), sparseplacevaluerational1.parse(1));
}

sparseplacevalueratio1.prototype.pow = function (power) {	// 2015.8
    if (power instanceof rational) power = new sparseplacevaluerational1([[power, rational.parse(0)]]);
    if (!(power instanceof sparseplacevaluerational1)) power = new sparseplacevaluerational1().parse('' + power);   // 2017.9
    if (!(power instanceof sparseplacevalueratio1)) power = new sparseplacevalueratio1(power);                      // 2017.9
    //if (power == -1) throw new Error();
    //alert(JSON.stringify(power));
    return new sparseplacevalueratio1(this.num.pow(power.num.divide(power.den)), this.den.pow(power.num.divide(power.den)));
    if (power instanceof sparseplacevalueratio1) power = power.num.divide(power.den);
    if (!(power instanceof sparseplacevaluerational1)) power = sparseplacevaluerational1.parse('(' + power + ')');  // 2015.11
    var pow = power.get(0).abs();
    //alert(JSON.stringify([this.num,pow,this.num.pow(pow)]))
    if (power.get(0).ispos()) return new sparseplacevalueratio1(this.num.pow(pow), this.den.pow(pow));
    return new sparseplacevalueratio1(this.den.pow(pow), this.num.pow(pow));
}

sparseplacevalueratio1.prototype.times = function (top) {
    return new sparseplacevalueratio1(this.num.times(top.num), this.den.times(top.den))
}

sparseplacevalueratio1.prototype.scale = function (scalar) {   // 2015.11
    var num = this.num.scale(scalar);
    return new sparseplacevalueratio1(num, this.den);
}

sparseplacevalueratio1.prototype.divide = function (denominator) {
    return new sparseplacevalueratio1(this.num.times(denominator.den), this.den.times(denominator.num));
}

sparseplacevalueratio1.prototype.dividemiddle = sparseplacevalueratio1.prototype.divide
sparseplacevalueratio1.prototype.divideleft = sparseplacevalueratio1.prototype.divide

sparseplacevalueratio1.prototype.clone = function () {
    return new sparseplacevalueratio1(this.num.clone(), this.den.clone());
}

sparseplacevalueratio1.prototype.reciprocal = function () {
    var temp = this.num;
    this.num = this.den;
    this.den = temp;
}

sparseplacevalueratio1.prototype.eval = function (base) {
    if (base.num.is0()) return new sparseplacevalueratio1(new sparseplacevaluerational1([this.num.get(0)]), new sparseplacevaluerational1([this.den.get(0)]));
    var num = new sparseplacevalueratio1(new sparseplacevaluerational1().parse(0), new sparseplacevaluerational1().parse(1));
    for (var i = 0; i < this.num.points.length; i++) {
        if (!this.num.get(i).is0()) num = num.add(base.pow(i).scale(this.num.get(i)));
    }
    var den = new sparseplacevalueratio1(new sparseplacevaluerational1().parse(0), new sparseplacevaluerational1().parse(1));
    for (var i = 0; i < this.den.points.length; i++) {
        if (!this.den.get(i).is0()) den = den.add(base.pow(i).scale(this.den.get(i)));
    }
    return num.divide(den);
}
