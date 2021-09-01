
// Author:	Anthony John Ripa
// Date:	8/31/2021
// RationalComplex:	A data-type for representing Complex Numbers as pairs of Rationals

class rationalcomplex extends digit {	//	2019.12

	constructor(real, imag) {
		if (arguments.length < 1) real = new rational();
		if (arguments.length < 2) imag = new rational();
		if (!(real instanceof rational)) { var s = 'rationalcomplex expects arg1 (real) to be a Rational not ' + typeof real + ' ' + JSON.stringify(real); alert(s); throw new Error(s); }
		if (!(imag instanceof rational)) { var s = 'rationalcomplex expects arg2 (imag) to be a Rational not ' + typeof imag + ' ' + JSON.stringify(imag); alert(s); throw new Error(s); }	//	2016.7
		super();		//	2019.12	Added
		this.r = real;
		this.i = imag;
		this.check();
	}

	parse(n) {	//	2017.10
		if (!(this instanceof rationalcomplex)) throw new Error('this!=rationalcomplex' + this)
		this.check();
		return rationalcomplex.parse(n);
	}

	static parse(n) {
		if (n instanceof String || typeof (n) == 'string') if (n.indexOf('i') != -1 && n.indexOf('r') != -1) { var x = JSON.parse(n); return new rationalcomplex(new rational().parse(JSON.stringify(x.r)), new rational().parse(JSON.stringify(x.i))) }    //  2017.3
		if (typeof n == "number") return new rationalcomplex(new rational().parse(n));							//	2017.3
		if (n instanceof Number) return new rationalcomplex(n, 0);												//	2017.3
		var N = n.toString();
		if (N[0] == '-') return rationalcomplex.parse(N.substring(1)).negate();									//	2017.3
		if (N[0] == '+') return rationalcomplex.parse(N.substring(1));											//	2017.11
		if (N[0] == '(' && N.slice(-1)== ')' && !N.includes(',')) return  rationalcomplex.parse(N.slice(1,-1));	//	2019.2
		//var r = N.match(rational.regex()); if (r) { alert(N.match(rational.regex()) + N + 'is Rational'); return new rationalcomplex(new rational().parse(N)); }	//	2017.11
		if (N.match(rational.regexfull())) return new rationalcomplex(new rational().parse(N));	//	2017.11
		//if (N.match(rationalcomplex.regexfull())) alert('rc' + N);
		if (N.match(complex.regexfull())) { var c = complex.parse(N); return new rationalcomplex(new rational().parse(c.r), new rational().parse(c.i)); }                       //  2017.11
		if (N.match(rationalcomplex.regexfull())) {	//	2017.11
			if (N.indexOf(',') != -1) {
				var c = N.slice(1, -1).split(','); return new rationalcomplex(new rational().parse(c[0]), new rational().parse(c[1]));
			} else if (N.indexOf('i') != -1) {
				return new rationalcomplex(new rational(), new rational().parse(N))
			}
		}
		{ var s = 'RationalComplex.parse: no match: ' + JSON.stringify(N); alert(s); throw new Error(s); }
	}

	check(other) {	//	2018.12	Added Type-Checker
		if (arguments.length === 0) {
			if (!this.r instanceof rational) throw new Error('RationalComplex.prototype.Check 1 Fail');
			if (!this.i instanceof rational) throw new Error('RationalComplex.prototype.Check 1 Fail');
			return this.datatype;
		}
		if (!(other instanceof rationalcomplex)) throw new Error('RationalComplex.prototype.Check 2 Fail : other is ' + JSON.stringify(other));
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) throw new Error('RationalComplex.prototype.Check 2 Fail');
		return mytype;
	}

	static regex() {	//	2017.10
		//var literal = '[⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';	//	-2020.5
		var literal = '[e⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';	//	-2020.5
		//var dec = String.raw`(\d+\.\d*|\d*\.\d+|\d+)`;
		var dec = rational.regex();
		var num = '(' + literal + '|' + dec + ')';
		var signnum = '(' + '[\+\-]?' + num + '[iI]?' + ')';
		var pair = '(' + String.raw`\(` + signnum + ',' + signnum + String.raw`\)` + ')';	//	2017.10 String.raw
		var pairor1 = '(' + pair + '|' + signnum + ')';
		//var frac = '(' + num + '/' + num + '|' + num + ')';
		//var signfrac = '(' + '[\+\-]?' + frac + ')';
		return pairor1;
	}

	static regexfull() {   //  2017.11
		return '^' + rationalcomplex.regex() + '$';
	}

	//tohtml() { this.check(); return JSON.stringify(this) }	//	-2020.12
	tohtml() { return '(' + this.r + ',' + this.i + ')' }		//	+2020.12

	toreal() { this.check(); return this.r.toreal(); }			//	2017.11

	todigit() {
		this.check();
		var IMAG = String.fromCharCode(777);
		var NEG = String.fromCharCode(822);
		var s = this.toString(false, false);
		var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
		if (len > 1 && s[0] != '(') return '(' + s + ')';
		return s;
	}

	toString(sTag, long) {						//	sTag	2015.11
		this.check();
		if (sTag) return this.digitpair('<s>', '</s>', true, long);
		//if (long) return this.digitpair('-', '', true, long);
		return this.digitpair('', String.fromCharCode(822), false, long);
	}

	digitpair(NEGBEG, NEGEND, fraction, long) {	//	2015.12
		//	185	189	822	8315	9321
		//	^1	1/2	-	^-		10
		this.check();
		var IMAG = String.fromCharCode(777);
		var digit = [this.r, this.i]; //alert(JSON.stringify(digit));
		var real = digit[0];
		var imag = digit[1];
		var a = real;//Math.round(real * 1000) / 1000
		var b = imag;//Math.round(imag * 1000) / 1000
		//if (real != real) return '%';
		if (-.01 < imag && imag < .01) return long ? a.toString(false, long) : a.toString(false, false);	//this.digithelp(real, NEGBEG, NEGEND, true);
		if (real == 0) {
			if (long == 'medium') return b == 1 ? 'i' : '(' + a + ',' + b + ')';	//	2017.4	medium
			//if (long) return (b == 1 ? '' : b.negate().is1() ? '-' : b) + 'i';		//	2017.12		//	2019.7	Removed
			if (long) return (b == 1 ? '' : b.negate().is1() ? '-' : b.toString(false, long)) + 'i';	//	2019.7	Added
			//return b == 1 ? 'i' : b.negate().is1() ? NEGBEG + 'i' + NEGEND : this.digithelp(imag, NEGBEG, NEGEND, true) + IMAG;			//	-2020.12
			return b == 1 ? 'i' : b.negate().is1() ? NEGBEG + 'i' + NEGEND : this.digithelp(imag.toString(), NEGBEG, NEGEND, true) + IMAG;	//	+2020.12
		}
		//return '(' + this.digithelp(real, NEGBEG, NEGEND, true) + ',' + this.digithelp(imag, NEGBEG, NEGEND, true) + ')';
		if (long == 'medium') return '(' + a + ',' + b + ')';
		if (long) return '(' + a.toString(false, long) + (b == 1 ? '+' : b.negate().is1() ? '-' : '+' + b) + 'i)';	//	2017.12
		return '(' + a.toString(false, long).replace('(', '').replace(')', '') + ',' + b.toString(false, long) + ')';
	}

	//rationalcomplex.zero = new rationalcomplex();	//	2017.11	Default 0													//	2019.12	Removed
	static zero() { if (!rationalcomplex.n0) rationalcomplex.n0 = new rationalcomplex(); return rationalcomplex.n0; }		//	2019.12	Added

	equals(other) { this.check(other); return (this.r.equals(other.r)) && (this.i.equals(other.i)); }
	equal(other) { this.check(other); return this.parse(this.equals(other) ? 1 : 0); }					//	+2020.10
	isreal() { this.check(); return this.i == 0; }														//	2017.5
	isimag() { this.check(); return this.r == 0; }														//	2017.12
	is0() { this.check(); return this.equals(rationalcomplex.zero()); }
	is1() { this.check(); return this.r.is1() && this.i.is0(); }										//	2018.3
	isNaN() { this.check(); return this.r.isNaN() || this.i.isNaN(); }									//	2018.3
	below(other) { this.check(other); return !this.r.equals(other.r) ? this.r.below(other.r) : this.i.below(other.i); }	//	2017.3
	above(other) { this.check(other); return !this.r.equals(other.r) ? this.r.above(other.r) : this.i.above(other.i); }	//	2019.2
	below0() { this.check(); return this.below(rationalcomplex.zero()); }								//	2017.3
	above0() { this.check(); return this.above(rationalcomplex.zero()); }								//	2017.3
	isneg() { return this.below0(); }																	//	2017.10
	ispos() { return this.above0(); }																	//	2018.2
	isint() { this.check(); return this.isreal() && this.r.isint(); }									//	2017.10
	abs() { this.check(); return new rationalcomplex(this.r.abs(), this.i.abs()) }						//	2018.2

	min(other) { return (this.below(other) ? this : other).clone() }									//	2019.5	Added
	add(other) { this.check(other); return new rationalcomplex(this.r.add(other.r), this.i.add(other.i)); }
	sub(other) { this.check(other); return new rationalcomplex(this.r.sub(other.r), this.i.sub(other.i)); }
	exp() { this.check(); return this.i.is0() ? new rationalcomplex(this.r.exp()) : new rationalcomplex(this.r.exp().times(this.i.cos()), this.r.exp().times(this.i.sin())); }	//	2017.3
	ln() { this.check(); return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i)).sqrt().log(), this.arg()) }
	log() { return this.ln(); }																			//	+2020.5
	nor() { this.check(); return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i))) }
	norm() { this.check(); return this.r.times(this.r).add(this.i.times(this.i)).sqrt(); }
	lnn() { this.check(); return this.nor().ln() }
	arg() { this.check(); return this.i.atan2(this.r); }
	round() { this.check(); return new rationalcomplex(this.r.round(), this.i.round()) }
	negate() { this.check(); return new rationalcomplex(this.r.negate(), this.i.negate()) }				//	2017.3
	clone() { this.check(); return new rationalcomplex(this.r, this.i); }								//	2017.10
	scale(c) { this.check(); return new rationalcomplex(this.r.scale(c), this.i.scale(c)); }			//	2017.11
	unscale(c) { this.check(); return new rationalcomplex(this.r.unscale(c), this.i.unscale(c)); }		//	+2021.8
	remainder(den) { return this.sub(this.divide(den).times(den)); }									//	2019.4	Added

	times(y) {
		if (!(y instanceof rationalcomplex)) y = rationalcomplex.parse(y);	//	2019.9	Added
		this.check(y);
		//if (!(y instanceof rationalcomplex) && typeof y.r != 'undefined' && typeof y.i != 'undefined') y = new rationalcomplex(y.r, y.i); // 2019.9 Removed
		if (!(y instanceof rationalcomplex)) { var s = 'rationalcomplex.times expects argument (y) to be a rationalcomplex but found ' + typeof y + ' ' + JSON.stringify(y); alert(s); throw new Error(s); }	//	2017.5
		var x = this;
		var c = rationalcomplex;
		return x.i.is0() ? y.i.is0() ? new c(x.r.times(y.r)) : new c(x.r.times(y.r), x.r.times(y.i)) : x.r.is0() ? new c(x.i.negate().times(y.i), x.i.times(y.r)) : new c(x.r.times(y.r).sub(x.i.times(y.i)), x.r.times(y.i).add(x.i.times(y.r)));
	}

	divide(y) {
		this.check(y);
		var x = this;
		var c = rationalcomplex;
		return y.i.is0() ? x.i.is0() ? new c(x.r.divide(y.r)) : x.r.is0() ? new c(new rational, x.i.divide(y.r)) : new c(x.r.divide(y.r), x.i.divide(y.r)) : new c((x.r.times(y.r).add(x.i.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))), (x.i.times(y.r).sub(x.r.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))));
	}

	pow(p) {
		if (!(p instanceof rationalcomplex)) p = rationalcomplex.parse(p);	//	2017.11
		this.check(p);
		var b = this;
		var c = rationalcomplex;
		//if (b.norm().is0()) var ret = new c(new rational().pow(p.r));	//	-2020.11
		if (b.norm().is0()) return new c(new rational().pow(p.r));		//	+2020.11
		else if (b.isNaN()) return b;									//	+2020.12
		else if (b.i.is0()) var ret = p.times(b.ln()).exp();			//	2017.3
		else var ret = new c(b.norm().pow(p.r).times((p.i.negate().times(b.arg())).exp())).times(new c(new rational, p.r.times(b.arg()).add(p.i.times(b.lnn().r).scale(.5))).exp());
		return ret.round();
	}

	divideleft(x) { return this.divide(x); }	//	2017.10
	dividemiddle(x) { return this.divide(x); }	//	2017.10
	pointadd(x) { return this.add(x); }			//	2017.10
	pointsub(x) { return this.sub(x); }			//	2017.10
	pointtimes(x) { return this.times(x); }		//	2017.10
	pointdivide(x) { return this.divide(x); }	//	2017.10
	pointpow(x) { return this.pow(x); }			//	2017.10

	gcd(b) {									//	2017.12
		this.check(b);
		var rgcd = this.r.gcd(b.r);
		var igcd = this.i.gcd(b.i);
		if (b.isimag()) return new rationalcomplex(new rational(), igcd);
		return new rationalcomplex(rgcd.gcd(igcd));
	}

	eval(base) {								//	2017.10
		this.check(base);
		return this.clone();
	}

}