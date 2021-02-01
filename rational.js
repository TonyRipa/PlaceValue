﻿
// Author:	Anthony John Ripa
// Date:	1/31/2021
// Rational: A data-type for representing Rational Numbers

class rational extends digit {				//	2019.11.Added

	constructor(num,den) {
		if (arguments.length < 1) num = 0;	//	2017.9
		if (arguments.length < 2) den = 1;
		if (!(typeof num == 'number' || num instanceof Number)) { var s = 'Rational expects arg 1 (num) to be a Number not ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }
		if (!(typeof den == 'number' || den instanceof Number)) { console.trace(); alert('Rational expects argument 2 (den) to be a Number but found ' + typeof den + ' ' + JSON.stringify(den)); }
		if (isNaN(num)) { var s = 'Rational expects argument 1 (num) to be a Number but found NaN: ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }  //  2017.7
		super();		//	2019.11	Added
		this.n = num;
		this.d = den;
		pulloutcommonconstants(this);
		function pulloutcommonconstants(me) {
			if (Math.abs(me.n) == 1 / 0 && Math.abs(me.d) == 1 / 0) { me.n = 0; me.d = 0; }
			if (me.n == 0 && me.d == 0) return;
			if (me.n == 0 || me.n == Infinity || me.n == -Infinity) { me.d = 1; return }
			if (me.d == 0) { me.n = Math.sign(me.n); return }
			if (me.d == Infinity || me.d == -Infinity) { me.n = 0; me.d = 1; return }
			var g = gcd(me.n, me.d);
			me.n = me.n / g;
			me.d = me.d / g;
			function gcd(a, b) {
				if (a < 0 && b > 0) return gcd(-a, b);
				if (a == 0) return b;
				if (b == 0) return a;
				if (a >= Math.abs(b)) return gcd(a % b, b);
				return gcd(b % a, a);
			}
		}
	}

	parse(n) {	//	2020.12
		return rational.parse(n);
	}

	//parse(n) {	//	2017.9	//	-2020.12
	static parse(n) {			//	+2020.12
		if (n instanceof String || typeof (n) == 'string') if (n.indexOf('d') != -1) { var x = JSON.parse(n); return new rational(x.n, x.d) }
		if (n instanceof Number || typeof n == 'number') return parsenumber(n);
		var N = n.toString();
		while (N[0] == '(' && N.slice(-1) == ')')
			N = N.slice(1, -1);
		if (N.indexOf("/") > -1) {
			var numden = N.split('/');
			var num = parsestring(numden[0]);
			var den = parsestring(numden[1]);
			var frac = [num[0] * den[1], num[1] * den[0]];
		} else {
			var frac = parsestring(N);
		}
		var numerator = parsenumber(frac[0]);
		var denominator = parsenumber(frac[1]);
		return numerator.divide(denominator);
		function parsenumber(n) {
			if (isNaN(n)) return new rational(0, 0);
			if (n == Infinity) return new rational(1, 0);
			if (n == -Infinity) return new rational(-1, 0);
			if (n == Math.round(n)) return new rational(n);
			var ns = n.toString();
			var den = Math.pow(10, ns.length - ns.indexOf('.') - 1);
			var num = n * den;
			return new rational(num, den);
		}
		function parsestring(n) {
			var N = n.toString();
			while (N[0] == '(' && N.slice(-1) == ')')
				N = N.slice(1, -1);
			var ret = 0;
			var signbit = 0;
			if (N[0] == '-') { signbit = 1; N = N.substr(1) }
			var flipbit = 0;
			var numb = '';
			for (var i = 0; i < N.length; i++) {
				var c = N[i];
				if ("0123456789.".indexOf(c) > -1) ret += c;
				var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
				var fracnumden = { '⅛': [1, 8], '⅙': [1, 6], '⅕': [1, 5], '¼': [1, 4], '⅓': [1, 3], '⅜': [3, 8], '⅖': [2, 5], '½': [1, 2], '⅗': [3, 5], '⅔': [2, 3], '¾': [3, 4], '⅘': [4, 5], '⅚': [5, 6] }
				if (frac[c]) ret = fracnumden[c];
				if (c == 'e') ret = 2.718;	//	+2020.5
				if (c == 'τ') ret = 6.28;
				var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
				if (num[c]) ret = num[c];
				if (c == '∞') ret = Infinity;
				if (c == '%') ret = [0,0];
				if (c == String.fromCharCode(822)) signbit = 1;
				if (c == String.fromCharCode(8315)) flipbit = 1;
			}
			if (!Array.isArray(ret)) ret = [ret, 1];
			if (flipbit) ret = [ret[1], ret[0]];
			if (signbit) ret = [-ret[0], ret[1]];
			return ret.map(Number);
		}
	}

	static regex() {  //  2017.6
		//var literal = '[e⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚%]';	//	+2020.5			//	-2020.6
		//var literal = '[e⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚%⑯㉜㊱]';					//	+2020.6	//	-2020.12
		var literal = '[e⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚%⑯㉜㊱∞]';									//	+2020.12
		var dec = String.raw`(\d+\.\d*|\d*\.\d+|\d+)`;
		var num = '(' + literal + '|' + dec + ')';
		//var frac = '(' + num + '/' + num + '|' + num + ')';		//	-2020.6
		var frac = '(' + num + '/' + num + '|' + num + '(⁻¹)?)';	//	+2020.6
		var signfrac = '(' + '[\+\-]?' + frac + ')';
		var parensignfrac = '(\\(' + signfrac + '\\))';				//	+2020.6
		return '(' + parensignfrac + '|' + signfrac + ')';			//	+2020.6
		//return signfrac;											//	-2020.6
	}

	static regexfull() {   //  2017.11
		return '^' + rational.regex() + '$';
	}

	toreal() { return this.n / this.d; }

	todigit() {
		var IMAG = String.fromCharCode(777);
		var NEG = String.fromCharCode(822);
		var s = this.toString(false, false);
		if (!(s instanceof String)) s = s.toString();
		var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
		if (len > 1 && s[0] != '(') return '(' + s + ')';
		return s;
	}

	tohtml(short) {
		if (short) {
			var candidate1 = this.toString(true);
			var candidate2 = "<table style='float:none;display:inline-table;vertical-align:bottom;text-align:center;font-size:0.5em;line-height:0.5em'><tr><td>" + this.n + "</td></tr><tr><td style='border-top:thin solid'>" + this.d + "</td></tr></table>";
			return ((candidate1.replace('<s>', '').replace('</s>', '').length) <= Math.max(this.n.toString().length, this.d.toString().length)) ? candidate1 : candidate2;
		}
		return this.n + ' / ' + this.d;
	}

	toString(sTag, long) {   //  2015.11 sTag    2017.6  long
		//if (long) return this.d == 1 ? this.n : this.n + '/' + this.d;		//	2017.7	//	-2020.5
		if (long==true) return this.d == 1 ? this.n : this.n + '/' + this.d;	//	2017.7	//	+2020.5
		var NEGBEG = long ? '-' : sTag ? '<s>' : '';
		var NEGEND = long ? '' : sTag ? '</s>' : String.fromCharCode(822);
		var candidate1 = this.digitpair(NEGBEG, NEGEND, long)//.toString().replace('(', '').replace(')', '');
		var candidate2 = this.digithelp(this.toreal(), NEGBEG, NEGEND, long).toString().replace('(0.', '(.').replace('(-0.', '(-.');//alert([candidate1,candidate2])
		return (candidate1.length <= candidate2.replace('<s>', '').replace('</s>', '').length) ? candidate1 : candidate2;
	}

	digitpair(NEGBEG, NEGEND, long) {  // 2015.12
		// 185  189  777 822 8315   9321
		// ^1   1/2  ^   -   ^-     10
		var IMAG = String.fromCharCode(777);
		var digit = [this.n, this.d];
		var num = digit[0];
		var den = digit[1];
		var a = Math.round(num * 1000) / 1000
		var b = Math.round(den * 1000) / 1000
		if (.99 < den && den < 1.01) return this.digithelp(num, NEGBEG, NEGEND, long);
		return '(' + a + '/' + b + ')';
	}

	equals(other) { return (this.n == other.n) && (this.d == other.d); }
	equal(other) { return new this.constructor(this.equals(other) ? 1 : 0); }	//	+2020.10
	is0() { return (this.n == 0) && (this.d != 0) }
	is1() { return (this.n == 1) && (this.d == 1) }  //  2017.6
	isNaN() { return (this.n == 0) && (this.d == 0) }//  2018.3
	isint() { return this.n % this.d == 0; }         //  2017.6
	ispos() { return math.sign(this.n) * math.sign(this.d) > 0 }
	isneg() { return math.sign(this.n) * math.sign(this.d) < 0 }
	above(other) { return this.sub(other).ispos(); } //  2017.6
	below(other) { return this.sub(other).isneg(); } //  2017.6

	abs() { return new rational(Math.abs(this.n), Math.abs(this.d)) }

	min(other) { return (this.below(other) ? this : other).clone() }	//	2019.5	Added
	add(other) { return (this.d == 0 && other.d == 0) ? new rational(this.n == other.n ? this.n : 0, 0) : new rational(this.n * other.d + other.n * this.d, this.d * other.d); }
	sub(other) { return (this.d == 0 && other.d == 0) ? new rational(this.n == -other.n ? this.n : 0, 0) : new rational(this.n * other.d - other.n * this.d, this.d * other.d); }
	times(other) { return new rational(this.n * other.n, this.d * other.d); }
	divide(other) { return new rational(this.n * other.d, this.d * other.n); }
	divideleft(other) { return this.divide(other) }		//  2019.11	Added
	dividemiddle(other) { return this.divide(other) }	//  2019.11	Added
	remainder(den) { return this.sub(this.divide(den).times(den)); }	//	2019.4	Added
	pointadd(other) { return this.add(other) }		//  2019.11	Added
	pointsub(other) { return this.sub(other) }		//  2019.11	Added
	pointtimes(other) { return this.times(other) }	//  2019.11	Added
	pointdivide(other) { return this.divide(other) }//  2019.11	Added
	negate() { return new rational(-this.n, this.d); }
	clone() { return new rational(this.n, this.d); } //  2017.6
	round() { return new rational(Math.round(this.toreal() * 1000) / 1000, 1); } //  2017.11
	scale(c) { return c instanceof rational ? this.times(c) : new rational(c * this.n, this.d); }	//	+2020.5

	atan2(other) { return new rational(Math.atan2(this.toreal(), other.toreal()), 1); }   //  2017.11
	sqrt() { return new rational(Math.sqrt(this.n), Math.sqrt(this.d)); }   //  2017.11
	log() { return new rational(Math.log(this.toreal()), 1); }   //  2017.11
	exp() { return new rational(Math.exp(this.toreal()), 1); }   //  2017.11
	sin() { return new rational(Math.sin(this.toreal()), 1); }   //  2017.11
	cos() { return new rational(Math.cos(this.toreal()), 1); }   //  2017.11

	pow(other) {//alert('rational.pow: ' + other)
		if (typeof other == 'number' && other == -1) return new rational(this.d, this.n);	//	+2020.12
		if (other instanceof rational && other.negate().is1()) return new rational(this.d, this.n); //  2017.7
		if (other instanceof rational) other = other.toreal();
		//return new rational(Math.pow(this.toreal(), other));							//	-2021.1
		if (isNaN(Math.pow(this.n, other))) return new this.constructor(0,0);			//	+2021.1
		return new this.constructor(Math.pow(this.n, other), Math.pow(this.d, other));	//	+2021.1
	}

	pointpow(other) { return this.pow(other) }		//  2019.11	Added

	gcd(b) {
		var a = this;
		if (a.pow(-1).is0()) return this.parse(1);	//	+2020.11
		if (b.pow(-1).is0()) return this.parse(1);	//	+2020.11
		if (a.is0()) return b;
		if (b.is0()) return a;
		return new rational(gcd(a.n, b.n), lcm(a.d, b.d));
		function gcd(a, b) {
			if (a < 0 && b > 0) return gcd(-a, b);
			if (a == 0) return b;
			if (b == 0) return a;
			if (a > Math.abs(b)) return gcd(a % b, b);
			return gcd(b % a, a);
		}
		function lcm(a, b) {
			if (a == 0 || b == 0) return 0;
			return a * b / gcd(a, b);
		}
	}

	eval(base) { //  2017.6
		return this.clone();
	}

}
