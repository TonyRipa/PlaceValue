
// Author:	Anthony John Ripa
// Date:	11/30/2019
// WholePlaceValue: a datatype for representing base-agnostic arithmetic via whole numbers

var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v === 1 / 0) ? '∞' : (v === -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }  //  2017.2  ===

function wholeplacevalue(arg) {
	var man, datatype;
	if (arguments.length < 1)[man, datatype] = [[], rational];                                      //  2017.11
	if (arg === rational || arg === complex || arg === rationalcomplex)[man, datatype] = [[], arg]; //  2017.11
	if (Array.isArray(arg)) {                                                                       //  2017.11
		man = arg;
		if (man.length==0) throw new Error('notype')												//	2019.5	Added
		datatype = (man.length > 0) ? man[0].constructor : rational;
	}
	this.datatype = datatype;
	this.mantisa = man;
	while (this.mantisa.length > 0 && this.get(this.mantisa.length - 1).is0()) // while MostSigDig=0 // get(this.mantisa.length - 1) 2015.7 // len>0 prevent ∞ loop 2015.12
		this.mantisa.pop();                             //  pop root
	if (this.mantisa.length == 0) this.mantisa = [new this.datatype().parse(0)];
	this.check();
}

wholeplacevalue.prototype.parse = function (man) {  //  2017.9
	if (man instanceof String || typeof (man) == 'string') if (man.indexOf('mantisa') != -1) {
		var ret = new wholeplacevalue(JSON.parse(man).mantisa.map(x=>new this.datatype().parse(JSON.stringify(x))));
		if (!(this.datatype == ret.datatype)) { var s = "wholeplacevalue.parse's arg different digit datatype\n" + this.datatype + '\n' + ret.datatype; alert(s); throw new Error(s); } //  2018.2
		return ret;
	}
	var mantisa = tokenize(man);
	for (var i = 0; i < mantisa.length; i++)
		mantisa[i] = new this.datatype().parse(mantisa[i]);
	if (mantisa.length == 0) return new wholeplacevalue(this.datatype); //  2017.12
	return new wholeplacevalue(mantisa);
	function tokenize(n) {  //  2016.6
		// 185  189  777 822 8315   9321
		// ^1   1/2  ^   -   ^-     10
		var N = n.toString();
		var ret = [];
		var numb = '';
		var inparen = false;
		for (var i = 0; i < N.length; i++) {
			var c = N[i];
			if (c == '(') { numb += c; inparen = true; continue; }
			if (c == ')') { numb += c; inparen = false; ret.push(numb); numb = ''; continue; }
			if (inparen)
				numb += c;
			else {
				if (c == '.' || c == 'e' || c == 'E') break;    // Truncate    2015.9
				if ([String.fromCharCode(185), String.fromCharCode(777), String.fromCharCode(822), String.fromCharCode(8315)].indexOf(c) > -1) ret[ret.length - 1] += c;
				else ret.push(c);
			}
		}
		return ret.reverse();   // .reverse makes lower indices represent lower powers 2015.7
	}
}

wholeplacevalue.prototype.check = function(other) {	//	2018.12	Added Type-Checker
	var translate = x => x == rational ? 'rational' : x == complex ? 'complex' : x == rationalcomplex ? 'rationalcomplex' : 'other';				//	2019.2	Added translate
	if (arguments.length === 0) {
		if (!this.mantisa.every(x=>x instanceof this.datatype))
			throw new Error('Wholeplacevalue.prototype.Check 1 Fail : ' + JSON.stringify(this) + " should have type " + translate(this.datatype));	//	2019.2	Added translate
		return this.datatype;
	}
	var othertype = other.check();
	var mytype = this.check();
	if (mytype != othertype) throw new Error('Wholeplacevalue.prototype.Check 2 Fail');
	return mytype;
}

wholeplacevalue.prototype.get = function (i) {
	this.check();
	if (i < 0 || this.mantisa.length <= i) return new this.datatype();          // check <0 2015.12
	return this.mantisa[i];
}

wholeplacevalue.prototype.getreal = function (i) {  //  2017.11
	this.check();
	return this.get(i).toreal();
}

wholeplacevalue.prototype.getimag = function (i) {  //  2017.11
	this.check();
	return this.get(i).sub(this.datatype.parse(this.getreal(i))).toreal();
}

wholeplacevalue.prototype.tohtml = function (short) {    // Replaces toStringInternal 2015.7
	this.check();
	return this.mantisa.map(function (x) { return x.tohtml(true) }).reverse().join(short ? '' : ',');         // R2L
}

wholeplacevalue.prototype.toString = function (sTag) {                          //  sTag    2015.11
	this.check();
	var ret = "";
	for (var i = 0 ; i < this.mantisa.length; i++) ret = this.get(i).todigit() + ret;   //  2017.11 todigit
	return ret;
}

//wholeplacevalue.prototype.digit = function (i, sTag) {                          //  sTag    2015.11	//	2019.11	Removed
//	this.check();
//	if (sTag) return this.digithelp(i, '<s>', '</s>', true);
//	return this.digithelp(i, '', String.fromCharCode(822), false);
//}

wholeplacevalue.prototype.equals = function (other) {
	this.check();
	var ret = true
	for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++)
		ret = ret && this.get(i).equals(other.get(i))   //  2017.11 delegate =
	return ret;
}

wholeplacevalue.prototype.comparelittle = function (other) {					//	2019.4	Added
	this.check(other)
	for (var i = 0; i < this.mantisa.length + other.mantisa.length ; i++) {
		if (this.get(i).above(other.get(i))) return 1;
		if (this.get(i).below(other.get(i))) return -1;
	}
	return 0;
}

wholeplacevalue.prototype.comparebig = function (other) {						//	2019.4	Added
	this.check(other);
	for (var i = this.mantisa.length + other.mantisa.length; i >= 0 ; i--) {
		if (this.get(i).above(other.get(i))) return 1;
		if (this.get(i).below(other.get(i))) return -1;
	}
	return 0;
}

wholeplacevalue.prototype.is0 = function () { this.check(); return this.equals(this.parse(0)); }      //  2016.5
wholeplacevalue.prototype.is1 = function () { this.check(); return this.equals(this.parse(1)); }      //  2016.5
wholeplacevalue.prototype.isNaN = function () { this.check(); return this.equals(this.parse('%')); }  //  2018.3

wholeplacevalue.prototype.above = function (other) { this.check(other); return this.get(0).above(other.get(0)) }	//	2017.7
//wholeplacevalue.prototype.isneg = function () { this.check(); return new wholeplacevalue().above(this) }			//	2017.7			//	2019.4	Removed
//wholeplacevalue.prototype.isneg = function () { this.check(); return this.parse(0).comparebig(this) == 1 }		//	2019.4	Added	//	2019.5	Removed
wholeplacevalue.prototype.isneg = function () { this.check(); return this.parse(0).above(this) == 1 }				//	2019.5	Added

wholeplacevalue.prototype.add = function (other) { this.check(other); return this.f(function (x, y) { return x.add(y) }, other); }
wholeplacevalue.prototype.sub = function (other) { this.check(other); return this.f((x, y)=>x.sub(y),other);}	//	2018.12
wholeplacevalue.prototype.pointtimes = function (other) { this.check(other); return this.f(function (x, y) { return x.times(y) }, other); }
wholeplacevalue.prototype.pointdivide = function (other) { this.check(other); return this.f(function (x, y) { return x.divide(y) }, other); }
wholeplacevalue.prototype.pointmin = function (other) { this.check(other); return this.f(function (x, y) { return x.min(y) }, other); }	//	2019.5	Added
wholeplacevalue.prototype.clone = function () { this.check(); return this.f(function (x) { return x }, this); }
wholeplacevalue.prototype.negate = function () { this.check(); return this.f(function (x) { return x.negate() }, this); }     //  2016.5

wholeplacevalue.prototype.f = function (f, other) { // template for binary operations   2015.9
	this.check(other);
	var man = [];
	for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++) {
		if (!(this.get(i) instanceof this.datatype && other.get(i) instanceof this.datatype)) {
			var s = `f wants WPV(${this.datatype == rational ? 'rational' : this.datatype == complex ? 'complex' : 'complexrational'}) not ${typeof other.get(i)} ${JSON.stringify(other.get(i))}`;
			alert(s); throw new Error(s);
		}   //  2017.12
		man.push(f(this.get(i), other.get(i)));  // get obviates need to pad 2015.7
	}
	if (man.length === 0) return new wholeplacevalue(this.datatype);    //  2017.11
	return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pointsub = function (subtrahend) {
	this.check(subtrahend); 
	var man = [];
	for (var i = 0; i < this.mantisa.length; i++) {
		man.push(this.get(i).sub(subtrahend.get(0)));  // get(0) is the one's place 2015.7
	}
	return new wholeplacevalue(man)//.round();    // 1-1.1≠-.100009   2015.9
}

wholeplacevalue.prototype.pointadd = function (addend) {
	this.check(addend); 
	var man = [];
	for (var i = 0; i < this.mantisa.length; i++) {
		man.push(this.get(i).add(addend.get(0)));      // get(0) is the one's place 2015.7
	}
	return new wholeplacevalue(man);
}

wholeplacevalue.prototype.pow = function (power) { // 2015.6
	if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new this.datatype().parse(power)]);
	this.check(power);
	//if (this.mantisa.length == 1) return new wholeplacevalue([this.get(0).pow(power.get(0))]);  //  0^0=1 for convenience   2016.5
	if (this.mantisa.length == 1) return new wholeplacevalue([this.get(0).pow(power.get(0))]).times10s(power.get(1).toreal());  //  2017.5  2^32=4000
	if (power.mantisa.length > 1) { alert('WPV >Bad Exponent = ' + power.toString()); return this.parse('%') }
	if (power.get(0).toreal() != Math.round(power.get(0).toreal())) { alert('WPV .Bad Exponent = ' + power.tohtml()); return wholeplacevalue.parse('%') }
	if (power.get(0).toreal() < 0) return this.parse(0);    //  2018.1  this.parse
	if (power.is0()) return this.parse(1);//alert(JSON.stringify(power))
	return this.times(this.pow(power.get(0).toreal() - 1));
}

wholeplacevalue.prototype.pointpow = function (power) { // 2015.12
	//	if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new this.datatype(power)]);		//	2018.6	Removed
	if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new this.datatype().parse(power)]);	//	2018.6	Added
	this.check(power);
	var ret = this.clone();
	ret.mantisa = ret.mantisa.map(function (x) { return x.pow(power.get(0)) });
	return ret;
}

wholeplacevalue.prototype.div10 = function () { this.check(); this.mantisa.shift() }							//	2018.6	Caller can unpad w/out knowing L2R or R2L
wholeplacevalue.prototype.times10 = function () { this.check(); this.mantisa.unshift(new this.datatype()) }	//	Caller can pad w/out knowing L2R or R2L  2015.7
wholeplacevalue.prototype.div10s = function (s) { this.check(); me = this.clone(); while (s-- > 0) me.mantisa.shift(); return me.clone(); }  // 2017.6    clone
wholeplacevalue.prototype.times10s = function (s) { this.check(); if (s < 0) return this.div10s(-s); me = this.clone(); while (s-- > 0) me.mantisa.unshift(new this.datatype()); return me; }  // 2017.6

wholeplacevalue.prototype.times = function (top) {
	this.check(top);
	if (!(top instanceof wholeplacevalue)) { var s = 'wholeplacevalue.times expects arg to be a wholeplacevalue but found ' + typeof top + ' ' + JSON.stringify(top); alert(s); throw new Error(s); }   //  2018.2
	if (!(this.datatype == top.datatype)) { var s = 'wholePV.times arg (wholeplacevalue) different digit datatype\n' + this.datatype + '\n' + top.datatype; alert(s); throw new Error(s); }             //  2018.2
	var prod = new wholeplacevalue(this.datatype);
	for (var b = 0; b < this.mantisa.length; b++) {
		var sum = [];
		for (var t = 0; t < top.mantisa.length; t++) {
			sum.push(this.get(b).is0() || top.get(t).is0() ? new this.datatype() : this.get(b).times(top.get(t))); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7
		}
		for (var i = 0; i < b; i++) sum.unshift(new this.datatype()); // change push to unshift because L2R   2015.7
		prod = prod.add(new wholeplacevalue(sum));
	}
	return prod;
}

wholeplacevalue.prototype.scale = function (scalar, trace) {
	this.check(); 
	if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);
	var ret = this.clone(trace + ' wholeplacevalue.prototype.scale >');
	ret.mantisa = ret.mantisa.map(function (x) { return x.times(scalar) });
	return ret;
}

wholeplacevalue.prototype.unscale = function (scalar, trace) {  //  2016.5
	this.check(); 
	if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);
	var ret = this.clone(trace + ' wholeplacevalue.prototype.unscale >');
	ret.mantisa = ret.mantisa.map(function (x) { return x.divide(scalar) });
	return ret;
}

wholeplacevalue.getDegree = function (me) {			//	2018.6	1-arg
	me.check(); 
	for (var i = me.mantisa.length - 1; i >= 0; i--)
		if (!me.get(i).is0()) return { 'deg': i, 'val': me.get(i) };
	return { 'deg': 0, 'val': me.get(0) };
}

wholeplacevalue.prototype.divide = function (den) { // 2015.8
	this.check(den);
	var num = this;
	var iter = num.mantisa.length;
	var quotient = divideh(num, den, iter);
	return quotient;
	function divideh(num, den, c) {
		if (c == 0) return new wholeplacevalue([new num.datatype().parse(0)], 'wholeplacevalue.prototype.divide >');
		var d = wholeplacevalue.getDegree(den);		//	2018.6	arg=den
		var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');
		if (d.val.is0()) return quotient;
		var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
		var q2 = divideh(remainder, den, c - 1);
		quotient = quotient.add(q2);
		return quotient;
		function shift(me, left) {
			var ret = new wholeplacevalue([new me.datatype()], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');
			for (var r = 0; r < left; r++) ret.mantisa.shift();
			return ret;
		}
	}
}

wholeplacevalue.prototype.remainder = function (den) {  //  2016.5
	this.check(den);
	return this.sub(this.divide(den).times(den));
}

wholeplacevalue.getDegreeLeft = function (man) {
	for (var i = 0 ; i < man.length ; i++)
		if (!man[i].is0()) return { 'deg': i, 'val': man[i] };
	return { 'deg': 0, 'val': man[this.datatype.parse(0)] };
}

wholeplacevalue.prototype.divideleft = function (den) { // 2016.3
	this.check(den);
	var num = this;
	var iter = 5//num.mantisa.length;
	var quotient = divideh(num, den, iter);
	quotient.mantisa = quotient.mantisa.slice(0,5)	//	2018.10	Discard Error
	return new wholeplacevalue(quotient.mantisa);	//	2018.10	Clean zeros
	function divideh(num, den, c) {
		num.check(den);
		if (c == 0) return new wholeplacevalue([new num.datatype()], 'wholeplacevalue.prototype.divide >');
		var d = wholeplacevalue.getDegreeLeft(den.mantisa);
		var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');
		if (d.val.is0()) return quotient;
		var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
		var q2 = divideh(remainder, den, c - 1);
		quotient = quotient.add(q2);
		return quotient;
		function shift(me, left) {
			var ret = new wholeplacevalue([new me.datatype()], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');
			for (var r = 0; r < left; r++) ret.mantisa.shift();
			return ret;
		}
	}
}

wholeplacevalue.prototype.dividemiddle = function (den) {   // 2016.3
	this.check(den);
	var A = []
	var b = []
	for (var i = 0; i <= this.mantisa.length + 1; i++) {
		let row = [den.get(i - 1).toreal(), den.get(i).toreal(), den.get(i + 1).toreal()];
		if (row[0] == 0 && row[1] == 0 && row[2] == 0) continue;
		A.push(row);
		b.push([this.get(i).toreal()]);
	}
	A = math.matrix(A);
	b = math.matrix(b);
	var At = A.transpose();
	var AtA = math.multiply(At, A);
	var I = math.matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
	try {
		var AtAinv = math.divide(I, AtA);
	} catch (e) {
		return this.parse('%0');
	}
	var Atb = math.multiply(At, b);
	var x = math.multiply(AtAinv, Atb);
	x = x.transpose().valueOf()[0];
	x.reverse();
	return new wholeplacevalue(x.map(function (x) { return Math.round(100 * x) / 100 }).map(new this.datatype().parse));
}

wholeplacevalue.prototype.gcd = function(arg) {			//	2019.5
	if (arguments.length == 0) return this.gcd0();
	if (arguments.length == 1) return this.gcd1(arg);
	alert('GCD Error : Too many args');
}

wholeplacevalue.prototype.gcd0 = function () {			//	2016.5
	this.check();
	var list = [];
	for (var i = 0; i < this.mantisa.length; i++)
		list.push(this.get(i));
	if (list.length == 0) return new this.datatype.parse(1);
	if (list.length == 1) return list[0].is0() ? new this.datatype().parse(1) : list[0];    //  Disallow 0 to be a GCD for expediency.  2016.5
	return list.reduce(function (x, y) { return x.gcd(y) }, new this.datatype());
}

wholeplacevalue.prototype.gcd1 = function(b, count) {	//	2019.5
	var a = this;
	a.check();
	b.check();
	if (arguments.length < 2) count = 0;
	count++;
	if (count == 10) return a.parse(1);
	console.log(a.toString(), b.toString());
	//if (a.get(a.mantisa.length - 1).isneg() && b.get(b.mantisa.length - 1).ispos()) return gcdpv(a.negate(), b);
	if (a.mantisa[0].isneg() && b.mantisa[0].ispos()) { "alert(1)"; return a.negate().gcd1(b,count); }
	if (a.is0()) { "alert(2)"; return b; }
	if (b.is0()) { "alert(3)"; return a; }
	//if (a.points.length > b.points.length) { alert(4 + ': ' + a + ' , ' + b); return gcdpv(a.remainder(b), b); }
	if (a.mantisa[a.mantisa.length - 1].above(b.mantisa[b.mantisa.length - 1])) { "alert(5 + ': ' + a + ' , ' + b)"; return a.remainder(b).gcd1(b,count); }
	"alert(6 + ': ' + a + ' , ' + b)"; return b.remainder(a).gcd1(a,count);
}

wholeplacevalue.prototype.eval = function (base) {
	this.check(base);
	var sum = new this.datatype();
	for (var i = 0; i < this.mantisa.length; i++) {
		sum = sum.add(this.get(i).times(base.get(0).pow(i)));  // get(0)   2016.1
	}
	return new wholeplacevalue([sum]);
}
