
// Author:	Anthony John Ripa
// Date:	12/31/2018
// Complex:	A data-type for representing Complex Numbers as pairs of Rationals

function rationalcomplex(real, imag) {
	//if (arguments.length < 1) alert('rationalcomplex expects 1 or 2 arguments');
	if (arguments.length < 1) real = new rational();
	if (arguments.length < 2) imag = new rational();
	if (!(real instanceof rational)) { var s = 'rationalcomplex expects arg1 (real) to be a Rational not ' + typeof real + ' ' + JSON.stringify(real); alert(s); throw new Error(s); }
	if (!(imag instanceof rational)) { var s = 'rationalcomplex expects arg2 (imag) to be a Rational not ' + typeof imag + ' ' + JSON.stringify(imag); alert(s); throw new Error(s); }	//	2016.7
	this.r = real;
	this.i = imag;
	this.check();
}

rationalcomplex.prototype.parse = function (n) {	//	2017.10
	if (!(this instanceof rationalcomplex)) throw new Error('this!=rationalcomplex' + this)
	this.check();
	return rationalcomplex.parse(n);
}

rationalcomplex.parse = function (n) {
	//alert('n = ' + n);
	if (n instanceof String || typeof (n) == 'string') if (n.indexOf('i') != -1 && n.indexOf('r') != -1) { var x = JSON.parse(n); return new rationalcomplex(new rational().parse(JSON.stringify(x.r)), new rational().parse(JSON.stringify(x.i))) }    //  2017.3
	if (typeof n == "number") return new rationalcomplex(new rational().parse(n));			//	2017.3
	if (n instanceof Number) return new rationalcomplex(n, 0);								//	2017.3
	var N = n.toString();
	if (N[0] == '-') return rationalcomplex.parse(N.substring(1)).negate();					//	2017.3
	if (N[0] == '+') return rationalcomplex.parse(N.substring(1));							//	2017.11
	//if (N[0] == '(' && N.slice(-1) == ')') return rationalcomplex.parse(N.slice(1, -1));	//	2018.1 Added	//	2018.11 Removed so (2,3) is parsable
	//var r = N.match(rational.regex()); if (r && r.indexOf(N) != -1) { alert(N.match(rational.regex()) + N + 'is Rational'); return new rationalcomplex(new rational().parse(N)); }	//	2017.11
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

rationalcomplex.prototype.check = function(other) {	//	2018.12	Added Type-Checker
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

rationalcomplex.regex = function () {	//	2017.10
	//return rational.regex();
	var literal = '[⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';
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

rationalcomplex.regexfull = function () {   //  2017.11
	return '^' + rationalcomplex.regex() + '$';
}

rationalcomplex.prototype.tohtml = function () { this.check(); return JSON.stringify(this) }

rationalcomplex.prototype.toreal = function () { this.check(); return this.r.toreal(); }			//	2017.11

rationalcomplex.prototype.todigit = function () {
	this.check();
	var IMAG = String.fromCharCode(777);
	var NEG = String.fromCharCode(822);
	var s = this.toString(false, false);
	var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
	if (len > 1 && s[0] != '(') return '(' + s + ')';
	return s;
}

rationalcomplex.prototype.toString = function (sTag, long) {						//	sTag	2015.11
	this.check();
	if (sTag) return this.digitpair('<s>', '</s>', true, long);
	//if (long) return this.digitpair('-', '', true, long);
	return this.digitpair('', String.fromCharCode(822), false, long);
}

rationalcomplex.prototype.digitpair = function (NEGBEG, NEGEND, fraction, long) {	//	2015.12
	//	185	189	822	8315	9321
	//	^1	1/2	-	^-		10
	this.check();
	var IMAG = String.fromCharCode(777);
	var digit = [this.r, this.i]; //alert(JSON.stringify(digit));
	//if (!Array.isArray(digit)) return this.digithelp(digit, NEGBEG, NEGEND, true);
	//if (digit[1] == 0) return this.digithelp(digit[0], NEGBEG, NEGEND, true);
	var real = digit[0];
	var imag = digit[1];
	var a = real;//Math.round(real * 1000) / 1000
	var b = imag;//Math.round(imag * 1000) / 1000
	//if (real != real) return '%';
	if (-.01 < imag && imag < .01) return long ? a.toString(false, long) : a.toString(false, false);	//this.digithelp(real, NEGBEG, NEGEND, true);
	if (real == 0) {
		if (long == 'medium') return b == 1 ? 'i' : '(' + a + ',' + b + ')';	//	2017.4	medium
		//if (long) return '(' + (b == 1 ? '' : b == -1 ? '-' : b) + 'i)';
		if (long) return (b == 1 ? '' : b.negate().is1() ? '-' : b) + 'i';		//	2017.12
		return b == 1 ? 'i' : b.negate().is1() ? NEGBEG + 'i' + NEGEND : this.digithelp(imag, NEGBEG, NEGEND, true) + IMAG;
	}
	//return '(' + this.digithelp(real, NEGBEG, NEGEND, true) + ',' + this.digithelp(imag, NEGBEG, NEGEND, true) + ')';
	if (long == 'medium') return '(' + a + ',' + b + ')';
	if (long) return '(' + a.toString(false, long) + (b == 1 ? '+' : b.negate().is1() ? '-' : '+' + b) + 'i)';	//	2017.12
	return '(' + a.toString(false, long).replace('(', '').replace(')', '') + ',' + b.toString(false, long) + ')';
}

rationalcomplex.prototype.digithelp = function (digit, NEGBEG, NEGEND, fraction) {	//	2015.11
	//	185	189	822	8315	9321
	//	^1	1/2	-	^-		10
	this.check();
	var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
	var IMAG = String.fromCharCode(777);
	var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
	var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
	var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
	if (typeof (digit) == 'string') return digit;
	var rounddigit = Math.round(digit * 1000) / 1000;
	if (isNaN(digit)) return digit.toString(false, fraction);	//	2017.11
	if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;
	if (num[-digit]) return NEGBEG + num[-digit] + NEGEND;
	if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
	if (-1 < digit && digit < 0) {
		if (fraction) if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
		var flip = -1 / digit;
		if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
		if (cons[rounddigit]) return cons[rounddigit];
	}
	if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
	if (digit == 0) return '0';
	if (0 < digit && digit < 1) {
		if (frac[rounddigit]) return frac[rounddigit];
		if (cons[rounddigit]) return cons[rounddigit];	//	cons b4 flip prevents .159=6^-1	2015.8
		if (0 < digit && digit < .5) {					//	prevents 1/1.1					2015.9
			var flip = Math.round(1 / digit);			//	round prevents 1/24.99999		2015.8
			if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
		}
	}
	if (cons[rounddigit]) return cons[rounddigit];
	if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit.toString() : '(' + rounddigit + ')';
	if (num[digit]) return num[digit]
	if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
	if (digit == 1 / 0) return '∞';
	return 'x';
}

rationalcomplex.zero = new rationalcomplex();	//	2017.11	Default 0

rationalcomplex.prototype.equals = function (other) { this.check(other); return (this.r.equals(other.r)) && (this.i.equals(other.i)); }
rationalcomplex.prototype.isreal = function () { this.check(); return this.i == 0; }													//	2017.5
rationalcomplex.prototype.isimag = function () { this.check(); return this.r == 0; }													//	2017.12
rationalcomplex.prototype.is0 = function () { this.check(); return this.equals(rationalcomplex.zero); }
rationalcomplex.prototype.is1 = function () { this.check(); return this.r.is1() && this.i.is0(); }										//	2018.3
rationalcomplex.prototype.isNaN = function () { this.check(); return this.r.isNaN() || this.i.isNaN(); }								//	2018.3
rationalcomplex.prototype.below = function (other) { this.check(other); return !this.r.equals(other.r) ? this.r.below(other.r) : this.i.below(other.i); }	//	2017.3
rationalcomplex.prototype.above = function (other) { this.check(other); return this.r != other.r ? this.r > other.r : this.i > other.i; }	//	2017.3
rationalcomplex.prototype.below0 = function () { this.check(); return this.below(rationalcomplex.zero); }								//	2017.3
rationalcomplex.prototype.above0 = function () { this.check(); return this.above(rationalcomplex.zero); }								//	2017.3
rationalcomplex.prototype.isneg = rationalcomplex.prototype.below0																		//	2017.10
rationalcomplex.prototype.ispos = rationalcomplex.prototype.above0																		//	2018.2
rationalcomplex.prototype.isint = function () { this.check(); return this.isreal() && this.r.isint(); }									//	2017.10
rationalcomplex.prototype.abs = function () { this.check(); return new rationalcomplex(this.r.abs(), this.i.abs()) }					//	2018.2

rationalcomplex.prototype.add = function (other) { this.check(other); return new rationalcomplex(this.r.add(other.r), this.i.add(other.i)); }
rationalcomplex.prototype.sub = function (other) { this.check(other); return new rationalcomplex(this.r.sub(other.r), this.i.sub(other.i)); }
rationalcomplex.prototype.exp = function () { this.check(); return this.i.is0() ? new rationalcomplex(this.r.exp()) : new rationalcomplex(this.r.exp().times(this.i.cos()), this.r.exp().times(this.i.sin())); }	//	2017.3
rationalcomplex.prototype.ln = function () { this.check(); return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i)).sqrt().log(), this.arg()) }
rationalcomplex.prototype.nor = function () { this.check(); return new rationalcomplex(this.r.times(this.r).add(this.i.times(this.i))) }
rationalcomplex.prototype.norm = function () { this.check(); return this.r.times(this.r).add(this.i.times(this.i)).sqrt(); }
rationalcomplex.prototype.lnn = function () { this.check(); return this.nor().ln() }
rationalcomplex.prototype.arg = function () { this.check(); return this.i.atan2(this.r); }
rationalcomplex.prototype.round = function () { this.check(); return new rationalcomplex(this.r.round(), this.i.round()) }
rationalcomplex.prototype.negate = function () { this.check(); return new rationalcomplex(this.r.negate(), this.i.negate()) }		//	2017.3
rationalcomplex.prototype.clone = function () { this.check(); return new rationalcomplex(this.r, this.i); }						//	2017.10
rationalcomplex.prototype.scale = function (c) { this.check(); return new rationalcomplex(this.r.scale(c), this.i.scale(c)); }	//	2017.11

rationalcomplex.prototype.times = function (y) {
	this.check(y);
	if (!(y instanceof rationalcomplex) && typeof y.r != 'undefined' && typeof y.i != 'undefined') y = new rationalcomplex(y.r, y.i);	//	2017.5
	if (!(y instanceof rationalcomplex)) { var s = 'rationalcomplex.times expects argument (y) to be a rationalcomplex but found ' + typeof y + ' ' + JSON.stringify(y); alert(s); throw new Error(s); }	//	2017.5
	var x = this;
	var c = rationalcomplex;
	return x.i.is0() ? y.i.is0() ? new c(x.r.times(y.r)) : new c(x.r.times(y.r), x.r.times(y.i)) : x.r.is0() ? new c(x.i.negate().times(y.i), x.i.times(y.r)) : new c(x.r.times(y.r).sub(x.i.times(y.i)), x.r.times(y.i).add(x.i.times(y.r)));
}

rationalcomplex.prototype.divide = function (y) {
	this.check(y);
	var x = this;
	var c = rationalcomplex;
	return y.i.is0() ? x.i.is0() ? new c(x.r.divide(y.r)) : x.r.is0() ? new c(new rational, x.i.divide(y.r)) : new c(x.r.divide(y.r), x.i.divide(y.r)) : new c((x.r.times(y.r).add(x.i.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))), (x.i.times(y.r).sub(x.r.times(y.i))).divide(y.r.times(y.r).add(y.i.times(y.i))));
}

rationalcomplex.prototype.pow = function (p) {
	if (!(p instanceof rationalcomplex)) p = rationalcomplex.parse(p);	//	2017.11
	this.check(p);
	//try {
		var b = this;
		var c = rationalcomplex;
		if (b.norm().is0()) var ret = new c(new rational().pow(p.r));
		else if (b.i.is0()) var ret = p.times(b.ln()).exp(); //  2017.3
		else var ret = new c(b.norm().pow(p.r).times((p.i.negate().times(b.arg())).exp())).times(new c(new rational, p.r.times(b.arg()).add(p.i.times(b.lnn().r).scale(.5))).exp());
		return ret.round();
}

rationalcomplex.prototype.divideleft = rationalcomplex.prototype.divide;	//	2017.10
rationalcomplex.prototype.dividemiddle = rationalcomplex.prototype.divide;	//	2017.10
rationalcomplex.prototype.pointadd = rationalcomplex.prototype.add;			//	2017.10
rationalcomplex.prototype.pointsub = rationalcomplex.prototype.sub;			//	2017.10
rationalcomplex.prototype.pointtimes = rationalcomplex.prototype.times;		//	2017.10
rationalcomplex.prototype.pointdivide = rationalcomplex.prototype.divide;	//	2017.10
rationalcomplex.prototype.pointpow = rationalcomplex.prototype.pow;			//	2017.10

rationalcomplex.prototype.gcd = function (b) {	//	2017.12
	this.check(b);
	var rgcd = this.r.gcd(b.r);
	var igcd = this.i.gcd(b.i);
	if (b.isimag()) return new rationalcomplex(new rational(), igcd);
	return new rationalcomplex(rgcd.gcd(igcd));
}

rationalcomplex.prototype.eval = function (base) {	//	2017.10
	this.check(base);
	return this.clone();
}