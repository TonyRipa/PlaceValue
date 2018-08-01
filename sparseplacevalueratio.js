
// Author:	Anthony John Ripa
// Date:	7/31/2018
// SparsePlaceValueRatio : a datatype for representing base agnostic arithmetic via ratios of SparsePlaceValues

function sparseplacevalueratio(num, den) {
	//if (arguments.length < 2) alert('sparseplacevalueratio expects 2 arguments');
	if (arguments.length < 1) num = new sparseplacevalue();				//	2017.9
	if (arguments.length < 2) den = new sparseplacevalue().parse(1);	//	2017.9
	if (!(num instanceof sparseplacevalue)) { var s = 'SparsePVRatio expects arg 1 to be SparsePlaceValue not ' + typeof num + " : " + JSON.stringify(num); alert(s); throw new Error(s); }
	if (!(den instanceof sparseplacevalue)) { var s = 'SparsePVRatio expects arg 2 to be SparsePlaceValue not ' + typeof den + " : " + JSON.stringify(den); alert(s); throw new Error(s); }
	this.num = num;
	this.den = den;
	this.reduce();
	console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(num)=" + Array.isArray(num));
}

sparseplacevalueratio.prototype.parse = function (man) {	//	2017.9
	if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) { var a = JSON.parse(man); return new sparseplacevalueratio(new sparseplacevalue().parse(JSON.stringify(a.num)), new sparseplacevalue().parse(JSON.stringify(a.den))) }    //  2017.10
	var den = 0;
	if (typeof (man) == "number") man = man.toString();		//	2015.11
	if (typeof (man) == "string" && man.indexOf('num') != -1) {
		console.log("new sparseplacevalueratio : arg is stringified sparseplacevalueratio");
		var ans = JSON.parse(man);
		man = ans.num;
		den = ans.den;
	} else if (man instanceof Object && JSON.stringify(man).indexOf('num') != -1) {		//	2015.8
		console.log("new sparseplacevalueratio : arg is sparseplacevalueratio");
		den = man.den;		//	get den from man before
		man = man.num;		//	man overwrites self	2015.8
	}
	var slashindex = findslash(man);
	if (slashindex == -1) {
		var num = new sparseplacevalue().parse(man);
		var den = new sparseplacevalue().parse(1);
	} else {
		var num = new sparseplacevalue().parse(man.substr(0, slashindex));	//	2017.12 new
		var den = new sparseplacevalue().parse(man.substr(slashindex + 1));	//	2017.12 new
	}
	return new sparseplacevalueratio(num, den);
	//console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
	function findslash(x) {	//	2016.7
		var depth = 0;
		for (var i = 0; i < x.length; i++) {
			if (x[i] == '/' && depth == 0) return i;
			if (x[i] == '(') depth++;
			if (x[i] == ')') depth--;
		}
		return -1;
	}
}

sparseplacevalueratio.prototype.tohtml = function (short) {			//	Long and Short HTML	2015.11
	if (short) return this.toString(true);
	return this.num.toString(true) + ' / ' + this.den;				//	Replaces toStringInternal	2015.7
}

sparseplacevalueratio.prototype.toString = function (sTag) {		//	sTag	2015.11
	return this.den.toString() === '1' ? this.num.toString() : this.num.toString() + ' / ' + this.den.toString();
}

sparseplacevalueratio.prototype.reduce = function () {		//	2016.5

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
		if (me.num.is0()) { me.den = new sparseplacevalue().parse(1); return }
		if (me.den.is0()) { me.num = new sparseplacevalue().parse(1); return }	//	2017.12 new
		var num = me.num;
		var den = me.den;
		var n = num.gcd();
		var d = den.gcd();
		var g = n.gcd(d);   // delegate to digits   2016.7
		//alert([JSON.stringify(me.num), n, JSON.stringify(me.den), d, g]);
		me.num = num.unscale(g);
		me.den = den.unscale(g);
	}

	function gcdpv(a, b, count) {
		if (arguments.length < 3) count = 0;
		count++;
		if (count == 10) return new sparseplacevalue().parse(1);	//	2017.7
		//if (a.get(a.mantisa.length - 1).isneg() && b.get(b.mantisa.length - 1).ispos()) return gcdpv(a.negate(), b);
		if (a.points[0][0].isneg() && b.points[0][0].ispos()) { "alert(1)"; return gcdpv(a.negate(), b, count); }
		if (a.is0()) { "alert(2)"; return b; }
		if (b.is0()) { "alert(3)"; return a; }
		if (a.points.length > b.points.length) { "alert(4 + ': ' + a + ' , ' + b)"; return gcdpv(a.remainder(b), b, count); }
		if (a.points[a.points.length - 1][1].above(b.points[b.points.length - 1][1])) { "alert(5 + ': ' + a + ' , ' + b)"; return gcdpv(a.remainder(b), b, count); }
		"alert(6 + ': ' + a + ' , ' + b)"; return gcdpv(b.remainder(a), a, count);
	}
}

sparseplacevalueratio.prototype.add = function (addend) {
	return new sparseplacevalueratio(this.num.times(addend.den).add(addend.num.times(this.den)), this.den.times(addend.den));
}

sparseplacevalueratio.prototype.sub = function (subtrahend) {
	return new sparseplacevalueratio(this.num.times(subtrahend.den).sub(subtrahend.num.times(this.den)), this.den.times(subtrahend.den));
}

sparseplacevalueratio.prototype.pointsub = function (other) {
	var first = this.num.div10s(this.den.mantisa.length - 1);
	var second = other.num.div10s(other.den.mantisa.length - 1);
	return new sparseplacevalueratio(first.pointsub(second), sparseplacevalue.parse(1));
}

sparseplacevalueratio.prototype.pointadd = function (other) {
	var first = this.num.div10s(this.den.mantisa.length - 1);
	var second = other.num.div10s(other.den.mantisa.length - 1);
	return new sparseplacevalueratio(first.pointadd(second), sparseplacevalue.parse(1));
}

sparseplacevalueratio.prototype.pointtimes = function (other) {
	var first = this.num.div10s(this.den.mantisa.length - 1);
	var second = other.num.div10s(other.den.mantisa.length - 1);
	return new sparseplacevalueratio(first.pointtimes(second), sparseplacevalue.parse(1));
}

sparseplacevalueratio.prototype.pointdivide = function (other) {
	var first = this.num.div10s(this.den.mantisa.length - 1);
	var second = other.num.div10s(other.den.mantisa.length - 1);
	return new sparseplacevalueratio(first.pointtimes(second), sparseplacevalue.parse(1));
}

sparseplacevalueratio.prototype.pointpow = function (other) {	//	2015.12
	var first = this.num.div10s(this.den.mantisa.length - 1);
	var second = other.num.div10s(other.den.mantisa.length - 1);
	return new sparseplacevalueratio(first.pointpow(second), sparseplacevalue.parse(1));
}

sparseplacevalueratio.prototype.pow = function (power) {	//	2015.8
	if (power instanceof sparseplacevalueratio) power = power.num.divide(power.den);
	if (!(power instanceof sparseplacevalue)) power = new sparseplacevalue().parse('(' + power + ')');	//	2015.11
	var pow = power.get(0).abs();
	//alert(JSON.stringify([this.num,pow,this.num.pow(pow)]))
	if (power.get(0).ispos()) return new sparseplacevalueratio(this.num.pow(pow), this.den.pow(pow));
	return new sparseplacevalueratio(this.den.pow(pow), this.num.pow(pow));
	//if (power.get(0).isneg()) return (new sparseplacevalueratio(sparseplacevalue.parse(1), 0)).divide(this.pow(new sparseplacevalueratio(new sparseplacevalue([power.get(0).negate()]), 0))); // 2015.8 //  Add '(' for 2 digit power   2015.12
	//var num = this.num.pow(power);
	//var den = this.den.pow(power);
	//return new sparseplacevalueratio(num, den);
}

sparseplacevalueratio.prototype.times = function (top) {
	return new sparseplacevalueratio(this.num.times(top.num), this.den.times(top.den))
}

sparseplacevalueratio.prototype.scale = function (scalar) {		//	2015.11
	var num = this.num.scale(scalar);
	return new sparseplacevalueratio(num, this.den);
}

sparseplacevalueratio.prototype.divide = function (denominator) {
	return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

sparseplacevalueratio.prototype.dividemiddle = function (denominator) {		//	2016.5
	return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

sparseplacevalueratio.prototype.divideleft = function (denominator) {		//	2016.5
	return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
}

sparseplacevalueratio.prototype.clone = function () {
	return new sparseplacevalueratio(this.num.clone(), this.den.clone());
}

sparseplacevalueratio.prototype.reciprocal = function () {
	var temp = this.num;
	this.num = this.den;
	this.den = temp;
}

sparseplacevalueratio.prototype.eval = function (base) {	//	2017.12
	//if (base.num.is0()) return new sparseplacevalueratio(new sparseplacevalue([this.num.get(0)]), new sparseplacevalue([this.den.get(0)]));
	//alert(JSON.stringify([this, base]));
	var num = this.num.eval(base.num.divide(base.den));
	//var num = new sparseplacevalueratio(new sparseplacevalue().parse(0), new sparseplacevalue().parse(1));
	//for (var i = 0; i < this.num.points.length; i++) {
	//    if (!this.num.points[i][0].is0()) num = num.add(base.pow(this.num.points[i][1]).scale(this.num.points[i][0]));
	//}
	var den = this.den.eval(base.num.divide(base.den));
	return new sparseplacevalueratio(num, den);
	//return num.divide(den);
}
