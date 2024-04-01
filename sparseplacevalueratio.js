
// Author:	Anthony John Ripa
// Date:	3/31/2024
// SparsePlaceValueRatio : a datatype for representing base-agnostic arithmetic via ratios of SparsePlaceValues

class sparseplacevalueratio {	//	+2024.3

//	function sparseplacevalueratio(arg) {																					//	-2024.3		2019.4	Added
	constructor(arg) {																										//	+2024.3
		var num, den;																										//	2019.4	Added
		//if (arguments.length < 2) den = new sparseplacevalue().parse(1);	//	2017.9										//	2019.4	Removed
		if (arguments.length == 0) throw new Error('notype');																//	2019.5	Added
		//if (arguments.length == 0)[num, den] = [new sparseplacevalue(rational), new sparseplacevalue(rational).parse(1)];	//	-2024.3		2019.4	Added
		if (arguments.length == 1) {																						//	2019.4	Added
			if (arg === rational || arg === rationalcomplex)[num, den] = [new sparseplacevalue(arg), new sparseplacevalue(arg).parse(1)];
			else[num, den] = [arg, new sparseplacevalue(arg.datatype).parse(1)];
		}
		if (arguments.length == 2)[num, den] = arguments;
		if (!(num instanceof sparseplacevalue)) { var s = 'SparsePVRatio expects arg 1 to be SparsePlaceValue not ' + typeof num + " : " + JSON.stringify(num); alert(s); throw new Error(s); }
		if (!(den instanceof sparseplacevalue)) { var s = 'SparsePVRatio expects arg 2 to be SparsePlaceValue not ' + typeof den + " : " + JSON.stringify(den); alert(s); throw new Error(s); }
		this.num = num;
		this.den = den;
		this.reduce();
		this.check();																										//	2019.4	Added
		console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(num)=" + Array.isArray(num));
	}

	parse(man) {	//	2017.9
		this.check();											//	2019.4	Added
		//if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) { var a = JSON.parse(man); return new sparseplacevalueratio(this.num.parse(JSON.stringify(a.num)), this.num.parse(JSON.stringify(a.den))) }	//	2017.10	//	2019.4	Removed
		if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) { var a = JSON.parse(man); return new sparseplacevalueratio(this.num.parse(JSON.stringify(a.num)), this.num.parse(JSON.stringify(a.den))) }				//	2019.4	Added
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
			//var num = new sparseplacevalue().parse(man);	//	2019.4	Removed
			//var den = new sparseplacevalue().parse(1);	//	2019.4	Removed
			var num = this.num.parse(man);					//	2019.4	Added
			var den = this.num.parse(1);					//	2019.4	Added
		} else {
			//var num = new sparseplacevalue().parse(man.substr(0, slashindex));	//	2017.12 new		//	2019.4	Removed
			//var den = new sparseplacevalue().parse(man.substr(slashindex + 1));	//	2017.12 new		//	2019.4	Removed
			var num = this.num.parse(man.substr(0, slashindex));										//	2019.4	Added
			var den = this.num.parse(man.substr(slashindex + 1));										//	2019.4	Added
		}
		return new sparseplacevalueratio(num, den);
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

	check(other) {	//	2019.4	Added Type-Checker
		if (!(this instanceof sparseplacevalueratio)) throw new Error("SparsePlaceValueRatio.prototype.Check 1 Fail : This isn't SparsePlaceValueRatio");
		var translate = x => x == rational ? 'rational' : x == complex ? 'complex' : x == rationalcomplex ? 'rationalcomplex' : 'other';
		if (arguments.length === 0) {
			var numtype = this.num.check();
			var dentype = this.num.check();
			if (numtype != dentype)
				throw new Error('SparsePlaceValueRatio.prototype.Check 1 Fail : num is ' + translate(numtype) + ' but den is ' + translate(dentype));
			return numtype;
		}
		if (!(other instanceof sparseplacevalueratio)) throw new Error("SparsePlaceValueRatio.prototype.Check 2 Fail : Other isn't SparsePlaceValueRatio");
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) {
			throw new Error('SparsePlaceValueRatio.prototype.Check 2 Fail : Othertype is of type ' + translate(othertype) + ', but ThisType is ' + translate(mytype));
		}
		return mytype;
	}

	tohtml(short) {			//	Long and Short HTML	2015.11
		this.check();													//	2019.4	Added
		if (short) return this.toString(true);
		return this.num.toString(true) + ' / ' + this.den;				//	Replaces toStringInternal	2015.7
	}

	toString(sTag) {		//	sTag	2015.11
		this.check();													//	2019.4	Added
		if (this.den.toString() === '%') return '0 / 0'					//	+2024.3
		return this.den.toString() === '1' ? this.num.toString() : this.num.toString() + ' / ' + this.den.toString();
	}

	reduce() {				//	2016.5
		this.check();													//	2019.4	Added
		circumfixEuclid(this);
		pulloutcommonconstants(this);

		function circumfixEuclid(me) {
			me.check();													//	2019.4	Added
			var n = me.num.gcd();
			var d = me.den.gcd();//alert(JSON.stringify([n,d]))
			me.num = me.num.unscale(n);
			me.den = me.den.unscale(d);
			euclid(me);
			me.num = me.num.scale(n);
			me.den = me.den.scale(d);
		}

		function euclid(ratio) {
			ratio.check();												//	2019.4	Added
			"alert(ratio.num + ' , ' + ratio.den)"
			//var g = gcdpv(ratio.num, ratio.den);						//	2019.5	Removed
			var g = ratio.num.gcd(ratio.den);							//	2019.5	Added
			"alert(JSON.stringify(g))"
			if (g.points.length == 1 && g.points[0][1].is0()) return;
			ratio.num = ratio.num.divide(g);
			ratio.den = ratio.den.divide(g);
		}

		function pulloutcommonconstants(me) {
			me.check();													//	2019.4	Added
			if (me.num.is0() && me.den.is0()) return;
			//if (me.num.is0()) { me.den = new sparseplacevalue().parse(1); return }					//	2019.4	Removed
			//if (me.den.is0()) { me.num = new sparseplacevalue().parse(1); return }	//	2017.12 new	//	2019.4	Removed
			if (me.num.is0()) { me.den = me.num.parse(1); return }										//	2019.4	Added
			if (me.den.is0()) { me.num = me.num.parse(1); return }										//	2019.4	Added
			var num = me.num;
			var den = me.den;
			var n = num.gcd();
			var d = den.gcd();
			var g = n.gcd(d);   // delegate to digits   2016.7
			//alert([JSON.stringify(me.num), n, JSON.stringify(me.den), d, g]);
			me.num = num.unscale(g);
			me.den = den.unscale(g);
		}

		//function gcdpv(a, b, count) {									//	2019.5	Removed
		//	a.check();													//	2019.4	Added
		//	b.check();													//	2019.4	Added
		//	if (arguments.length < 3) count = 0;
		//	count++;
		//	//if (count == 10) return new sparseplacevalue().parse(1);	//	2017.7	//	2019.5	Removed
		//	if (count == 10) return a.parse(1);										//	2019.5	Added
		//	//if (a.get(a.mantisa.length - 1).isneg() && b.get(b.mantisa.length - 1).ispos()) return gcdpv(a.negate(), b);
		//	if (a.points[0][0].isneg() && b.points[0][0].ispos()) { "alert(1)"; return gcdpv(a.negate(), b, count); }
		//	if (a.is0()) { "alert(2)"; return b; }
		//	if (b.is0()) { "alert(3)"; return a; }
		//	if (a.points.length > b.points.length) { "alert(4 + ': ' + a + ' , ' + b)"; return gcdpv(a.remainder(b), b, count); }
		//	//if (a.points[a.points.length - 1][1].above(b.points[b.points.length - 1][1])) { alert(5 + ': ' + a + ' , ' + b); return gcdpv(a.remainder(b), b, count); }		//	2019.4	Removed
		//	if (a.points[a.points.length - 1][1].comparebig(b.points[b.points.length - 1][1])==1) { "alert(5 + ': ' + a + ' , ' + b)"; return gcdpv(a.remainder(b), b, count); }	//	2019.4	Added
		//	"alert(6 + ': ' + JSON.stringify(a) + ' , ' + JSON.stringify(b))"; return gcdpv(b.remainder(a), a, count);
		//}
	}

	add(addend) {
		this.check(addend);																		//	2019.4	Added
		return new sparseplacevalueratio(this.num.times(addend.den).add(addend.num.times(this.den)), this.den.times(addend.den));
	}

	sub(subtrahend) {
		this.check(subtrahend);																	//	2019.4	Added
		return new sparseplacevalueratio(this.num.times(subtrahend.den).sub(subtrahend.num.times(this.den)), this.den.times(subtrahend.den));
	}

	pointsub(other) {
		this.check(other);																		//	2019.4	Added
		//var first = this.num.div10s(this.den.mantisa.length - 1);								//	-2021.1
		//var second = other.num.div10s(other.den.mantisa.length - 1);							//	-2021.1
		var first = this.num.divide(this.den);													//	+2021.1
		var second = other.num.divide(other.den);												//	+2021.1
		//return new sparseplacevalueratio(first.pointsub(second), sparseplacevalue.parse(1));	//	2019.4	Removed
		return new sparseplacevalueratio(first.pointsub(second), this.num.parse(1));			//	2019.4	Added
	}

	pointadd(other) {
		this.check(other);																		//	2019.4	Added
		//var first = this.num.div10s(this.den.mantisa.length - 1);								//	-2021.1
		//var second = other.num.div10s(other.den.mantisa.length - 1);							//	-2021.1
		var first = this.num.divide(this.den);													//	+2021.1
		var second = other.num.divide(other.den);												//	+2021.1
		//return new sparseplacevalueratio(first.pointadd(second), sparseplacevalue.parse(1));	//	2019.4	Removed
		return new sparseplacevalueratio(first.pointadd(second), this.num.parse(1));			//	2019.4	Added
	}

	pointtimes(other) {
		this.check(other);																		//	2019.4	Added
		//var first = this.num.div10s(this.den.mantisa.length - 1);								//	-2021.1
		//var second = other.num.div10s(other.den.mantisa.length - 1);							//	-2021.1
		var first = this.num.divide(this.den);													//	+2021.1
		var second = other.num.divide(other.den);												//	+2021.1
		//return new sparseplacevalueratio(first.pointtimes(second), sparseplacevalue.parse(1));//	2019.4	Removed
		return new sparseplacevalueratio(first.pointtimes(second), this.num.parse(1));			//	2019.4	Added
	}

	pointdivide(other) {
		this.check(other);																		//	2019.4	Added
		//var first = this.num.div10s(this.den.mantisa.length - 1);								//	-2021.1
		//var second = other.num.div10s(other.den.mantisa.length - 1);							//	-2021.1
		var first = this.num.divide(this.den);													//	+2021.1
		var second = other.num.divide(other.den);												//	+2021.1
		//return new sparseplacevalueratio(first.pointtimes(second), sparseplacevalue.parse(1));//	2019.4	Removed
		return new sparseplacevalueratio(first.pointtimes(second), this.num.parse(1));			//	2019.4	Added
	}

	pointpow(other) {	//	2015.12
		this.check(other);																		//	2019.4	Added
		//var first = this.num.div10s(this.den.mantisa.length - 1);								//	-2021.1
		//var second = other.num.div10s(other.den.mantisa.length - 1);							//	-2021.1
		var first = this.num.divide(this.den);													//	+2021.1
		var second = other.num.divide(other.den);												//	+2021.1
		//return new sparseplacevalueratio(first.pointpow(second), sparseplacevalue.parse(1));	//	2019.4	Removed
		return new sparseplacevalueratio(first.pointpow(second), this.num.parse(1));			//	2019.4	Added
	}

	pow(power) {	//	2015.8
		this.check(power);																		//	2019.4	Added
		if (power instanceof sparseplacevalueratio) power = power.num.divide(power.den);
		//if (!(power instanceof sparseplacevalue)) power = new sparseplacevalue().parse('(' + power + ')');	//	2015.11	//	2019.4	Removed
		if (!(power instanceof sparseplacevalue)) power = this.num.parse('(' + power + ')');								//	2019.4	Added
		//var pow = power.get(0).abs();	//	-2020.5
		var pow = power;				//	+2020.5
		//alert(JSON.stringify([this.num,pow,this.num.pow(pow)]))
		if (power.get(0).ispos()) return new sparseplacevalueratio(this.num.pow(pow), this.den.pow(pow));
		return new sparseplacevalueratio(this.den.pow(pow), this.num.pow(pow));
		//if (power.get(0).isneg()) return (new sparseplacevalueratio(sparseplacevalue.parse(1), 0)).divide(this.pow(new sparseplacevalueratio(new sparseplacevalue([power.get(0).negate()]), 0))); // 2015.8 //  Add '(' for 2 digit power   2015.12
		//var num = this.num.pow(power);
		//var den = this.den.pow(power);
		//return new sparseplacevalueratio(num, den);
	}

	times(top) {
		this.check(top);																		//	2019.4	Added
		return new sparseplacevalueratio(this.num.times(top.num), this.den.times(top.den))
	}

	scale(scalar) {		//	2015.11
		this.check();																			//	2019.4	Added
		var num = this.num.scale(scalar);
		return new sparseplacevalueratio(num, this.den);
	}

	divide(denominator) {
		this.check(denominator);																//	2019.4	Added
		return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}

	remainder(den) {								//	2019.4	Added
		this.check(den);
		return this.sub(this.divide(den).times(den));
	}

	dividemiddle(denominator) {																	// --2024.3		2016.5	//	2019.4	Removed
		return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}
	//sparseplacevalueratio.prototype.dividemiddle = sparseplacevalueratio.prototype.divide;	// -2024.3	//	2019.4	Added

	divideleft(denominator) {																	//	--2024.3	2016.5		//	2019.4	Removed
		return new sparseplacevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}
	//sparseplacevalueratio.prototype.divideleft = sparseplacevalueratio.prototype.divide;		//	-2024.3		2019.4	Added

	clone() {
		this.check();																			//	2019.4	Added
		return new sparseplacevalueratio(this.num.clone(), this.den.clone());
	}

	reciprocal() {
		this.check();																			//	2019.4	Added
		var temp = this.num;
		this.num = this.den;
		this.den = temp;
	}

	eval(base) {	//	2017.12
		this.check(base);																		//	2019.4	Added
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

	evalfull(base) {	//	+2024.3
		if (!Array.isArray(base)) base = [base]
		base = base.map(b => (b instanceof sparseplacevalueratio) ? b.num.divide(b.den) : b)
		var num = this.num.evalfull(base)
		var den = this.den.evalfull(base)
		return num.divide(den)
	}

}
