
// Author:	Anthony John Ripa
// Date:	5/31/2020
// Complex:	A data-type for representing Complex Numbers

//function complex(real, imag) {	//	2019.11	Removed
class complex extends digit {		//	2019.11	Added

	constructor(real, imag) {
		if (arguments.length < 1) real = 0;
		if (arguments.length < 2) imag = 0;
		if (!(typeof real == 'number' || real instanceof Number)) { var s = 'complex expects arg1 (real) to be a Number not ' + typeof real + ' ' + JSON.stringify(real); alert(s); throw new Error(s); }
		if (!(typeof imag == 'number' || imag instanceof Number)) { console.trace(); alert('complex expects argument 2 (imag) to be a Number but found ' + typeof imag + ' ' + JSON.stringify(imag)); end; }    //  2016.7
		super();		//	2019.11	Added
		this.r = real;
		this.i = imag;
	}

	parse(n) {    //  2017.10
		return complex.parse(n);
	}

	static parse(n) {
		if (typeof n.r != 'undefined') return new complex(n.r, n.i)	//	2018.11
		if (n instanceof String || typeof (n) == 'string') if (n.indexOf('i') != -1 && n.indexOf('r') != -1) { var x = JSON.parse(n); return new complex(x.r, x.i) }    //  2017.3
		if (typeof n == "number") return new complex(n, 0); //  2017.3
		if (n instanceof Number) return new complex(n, 0);  //  2017.3
		var N = n.toString();
		if (N[0] == '-') return complex.parse(N.substring(1)).negate();				//	2017.3
		if (N[0] == '+') return complex.parse(N.substring(1));						//	2017.11
		var ret = 0;
		if (N.indexOf(',') != -1) {
			if (N[0] == '(' && N.slice(-1) == ')') N = N.slice(1,-1);				//	2019.5	Added
			var parts = N.split(',');												//	2019.5	Added
			var re = Number(parts[0]); //if (Array.isArray(re)) re = re[0];
			var im = Number(parts[1]); //if (Array.isArray(im)) im = im[1];
			ret = [re, im]
		} else {
			ret = single(N);
		}
		function single(N) {
			if (N[0] == '(' && N.slice(-1) == ')') return single(N.slice(1,-1));	//	2019.5	Added
			var ret = '';
			for (var i = 0; i < N.length; i++) {
				var c = N[i];
				if ("0123456789.".indexOf(c) > -1) ret += c;
				var frac = { '⅛': .125, '⅙': 1 / 6, '⅕': .2, '¼': .25, '⅓': 1 / 3, '⅜': .375, '⅖': .4, '½': .5, '⅗': .6, '⅔': 2 / 3, '¾': .75, '⅘': .8, '⅚': 5 / 6 } // Replaced .333 with 1/3 for precision 2015.6
				if (frac[c]) ret = frac[c];
				if (c == 'e') ret = 2.718;	//	+2020.5
				if (c == 'τ') ret = 6.28;
				var num = { '⑩': 10, '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15, '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20, '㉑': 21, '㉒': 22, '㉓': 23, '㉔': 24, '㉕': 25, '㉖': 26, '㉗': 27, '㉘': 28, '㉙': 29, '㉚': 30, '㉛': 31, '㉜': 32, '㉝': 33, '㉞': 34, '㉟': 35, '㊱': 36, '㊲': 37, '㊳': 38, '㊴': 39, '㊵': 40, '㊶': 41, '㊷': 42, '㊸': 43, '㊹': 44, '㊺': 45, '㊻': 46, '㊼': 47, '㊽': 48, '㊾': 49, '㊿': 50 }
				if (num[c]) ret = num[c];
				if (c == '∞') ret = Infinity;
				if (c == '%') ret = NaN;
				if (c == 'i') ret = N.length > 1 ? [0, ret] : [0, 1];   // 2015.12
				if (c == 'I') ret = N.length > 1 ? [0, ret] : [0, 1];   // 2017.10
				if (c == String.fromCharCode(777)) ret = [0, ret];
				if (c == String.fromCharCode(822)) { if (Array.isArray(ret)) { ret[0] *= -1; ret[1] *= -1; } else ret *= -1; }
				if (c == String.fromCharCode(8315)) ret = 1 / ret;
			}
			return ret;
		}
		var digit = ret;
		if (Array.isArray(digit) && digit.length == 2) return new complex(Number(digit[0]), Number(digit[1]));
		if (Array.isArray(digit)) return new complex(Number(digit[0]));
		return new complex(Number(digit));
	}

	static regex() {   //  2017.10
		//var literal = '[⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';	//	-2020.5
		var literal = '[e⅛⅙⅕¼⅓⅜⅖½⅗⅔¾⅘⅚iI]';		//	+2020.5
		var dec = String.raw`(\d+\.\d*|\d*\.\d+|\d+)`;
		var num = '(' + literal + '|' + dec + ')';
		var signnum = '(' + '[\+\-]?' + num + '[iI]?' + ')';    //  2017.11
		var pair = '(' + String.raw`\(` + signnum + ',' + signnum + String.raw`\)` + ')';   //  2017.10 String.raw
		var pairor1 = '(' + pair + '|' + signnum + ')';
		//var frac = '(' + num + '/' + num + '|' + num + ')';
		return pairor1;
	}

	static regexfull() {   //  2017.11
		return '^' + complex.regex() + '$';
	}

	tohtml() { return this.toString(true) }		//	2018.6	Arg is true for (Laplace.js for Mechanics.html)

	toreal() { return this.r; }   //  2017.10

	todigit() {
		var IMAG = String.fromCharCode(777);
		var NEG = String.fromCharCode(822);
		var s = this.toString(false, false);
		if (!(s instanceof String)) s = s.toString();
		var len = s.length - (s.split(NEG).length - 1) - (s.split(IMAG).length - 1)
		if (len > 1 && s[0] != '(') return '(' + s + ')';
		return s;
	}

	toString(sTag, long) {                        //  sTag    2015.11
		if (sTag) return this.digitpair('<s>', '</s>', true, long);
		return this.digitpair('', String.fromCharCode(822), false, long);
	}

	digitpair(NEGBEG, NEGEND, fraction, long) {  // 2015.12
		// 185  189  822 8315   9321
		// ^1   1/2  -   ^-     10
		var IMAG = String.fromCharCode(777);
		var digit = [this.r, this.i]; //alert(JSON.stringify(digit));
		//if (digit[1] == 0) return this.digithelp(digit[0], NEGBEG, NEGEND, true);
		var real = digit[0];
		var imag = digit[1];
		var a = Math.round(real * 1000) / 1000
		var b = Math.round(imag * 1000) / 1000
		//if (real != real) return '%';
		//if (-.01 < imag && imag < .01) return long ? a : this.digithelp(real, NEGBEG, NEGEND, true);	//	-2020.5
		if (-.01 < imag && imag < .01) return long ? a : this.digithelp(real, NEGBEG, NEGEND, long);	//	+2020.5
		if (real == 0) {
			if (long == 'medium') return b == 1 ? 'i' : '(' + a + ',' + b + ')';   //  2017.4  medium
			if (long) return (b == 1 ? '' : b == -1 ? '-' : b) + 'i';   //  2017.11
			return b == 1 ? 'i' : b == -1 ? NEGBEG + 'i' + NEGEND : this.digithelp(imag, NEGBEG, NEGEND, true) + IMAG;
		}
		//return '(' + this.digithelp(real, NEGBEG, NEGEND, true) + ',' + this.digithelp(imag, NEGBEG, NEGEND, true) + ')';
		if (long == 'medium') return '(' + a + ',' + b + ')';
		if (long) return '(' + a + '+' + (b == 1 ? '' : b) + 'i)';
		return '(' + a + ',' + b + ')';
	}

	//digithelp(digit, NEGBEG, NEGEND, fraction) {  // 2015.11		//	2019.11	Removed
	//	// 185  189  822 8315   9321
	//	// ^1   1/2  -   ^-     10
	//	var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
	//	var IMAG = String.fromCharCode(777);
	//	var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
	//	var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
	//	var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
	//	if (typeof (digit) == 'string') return digit;
	//	var rounddigit = Math.round(digit * 1000) / 1000;
	//	if (isNaN(digit)) return '%';
	//	if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;
	//	if (num[-digit]) return NEGBEG + num[-digit] + NEGEND;
	//	if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
	//	if (-1 < digit && digit < 0) {
	//		if (fraction) if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
	//		var flip = -1 / digit;
	//		if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
	//		if (cons[rounddigit]) return cons[rounddigit];
	//	}
	//	if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
	//	if (digit == 0) return '0';
	//	if (0 < digit && digit < 1) {
	//		if (frac[rounddigit]) return frac[rounddigit];
	//		if (cons[rounddigit]) return cons[rounddigit];	// cons b4 flip prevents .159=6^-1	2015.8
	//		if (0 < digit && digit < .5) {                  // prevents 1/1.1                       2015.9
	//			var flip = Math.round(1 / digit);		// round prevents 1/24.99999		2015.8
	//			if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
	//		}
	//	}
	//	if (cons[rounddigit]) return cons[rounddigit];
	//	if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : '(' + rounddigit + ')';
	//	if (num[digit]) return num[digit]
	//	if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
	//	if (digit == 1 / 0) return '∞';
	//	return 'x';
	//}

	static zero() { if (!complex.n0) complex.n0 = new complex(0); return complex.n0; }		//	2019.11	Added
	static  one() { if (!complex.n1) complex.n1 = new complex(1); return complex.n1; }		//	2019.11	Added

	equals(other) { return (this.r == other.r) && (this.i == other.i); }
	isreal() { return this.i == 0; }														//	2017.5
	is0() { return this.equals(complex.zero()); }
	is1() { return this.equals(complex.one()); }											//	2018.10
	below(other) { return this.r != other.r ? this.r < other.r : this.i < other.i; }		//	2017.3
	above(other) { return this.r != other.r ? this.r > other.r : this.i > other.i; }		//	2017.3
	below0() { return this.below(complex.zero()); }											//	2017.3
	above0() { return this.above(complex.zero()); }											//	2017.3
	isneg() { return this.below0() }														//	2017.10
	isint() { return this.isreal() && Number.isInteger(this.r); }							//	2017.10

	min(other) { return (this.below(other) ? this : other).clone() }						//	2019.5	Added
	add(other) { return new complex(this.r + other.r, this.i + other.i); }
	sub(other) { return new complex(this.r - other.r, this.i - other.i); }
	exp() { return this.i == 0 ? new complex(Math.exp(this.r), 0) : new complex(Math.exp(this.r) * Math.cos(this.i), Math.exp(this.r) * Math.sin(this.i)); }  //  2017.3
	ln() { return new complex(Math.log(Math.sqrt(this.r * this.r + this.i * this.i)), Math.atan2(this.i, this.r)) }
	log() { return this.ln() }	//	+2020.5
	nor() { return new complex(this.r * this.r + this.i * this.i) }
	norm() { return Math.sqrt(this.r * this.r + this.i * this.i) }
	lnn() { return this.nor().ln() }
	arg() { return Math.atan2(this.i, this.r) }
	round() { return new complex(Math.round(1000 * this.r) / 1000, Math.round(1000 * this.i) / 1000) }
	negate() { return new complex(-this.r, -this.i) } //  2017.3
	clone() { return new complex(this.r, this.i); }   //  2017.10
	//scale(c) { return new complex(c * this.r, c * this.i); }	//	2017.11	//	-2020.5
	scale(c) { return c instanceof complex ? this.times(c) : new complex(c * this.r, c * this.i); }	//	+2020.5
	remainder(den) { return this.sub(this.divide(den).times(den)); } //  2019.4  Added

	times(y) {
		//if (!(y instanceof complex) && typeof y.r != 'undefined' && typeof y.i != 'undefined') y = new complex(y.r, y.i);   // 2017.5	// 2019.9 Removed
		if (!(y instanceof complex)) y = complex.parse(y);	//	2019.9	Added
		if (!(y instanceof complex)) { var s = 'complex.times expects argument (y) to be a Complex but found ' + typeof y + ' ' + JSON.stringify(y); alert(s); throw new Error(s); }    //  2017.5
		var x = this;
		var c = complex;
		return x.i == 0 ? y.i == 0 ? new c(x.r * y.r, 0) : new c(x.r * y.r, x.r * y.i) : x.r == 0 ? new c(-x.i * y.i, x.i * y.r) : new c(x.r * y.r - x.i * y.i, x.r * y.i + x.i * y.r);
	}

	divide(y) {
		var x = this;
		var c = complex;
		return y.i == 0 ? x.i == 0 ? new c(x.r / y.r, 0) : x.r == 0 ? new c(0, x.i / y.r) : new c(x.r / y.r, x.i / y.r) : new c((x.r * y.r + x.i * y.i) / (y.r * y.r + y.i * y.i), (x.i * y.r - x.r * y.i) / (y.r * y.r + y.i * y.i));
	}

	pow(p) {
		if (!(p instanceof complex)) p = complex.parse(p);  //  2017.11
			var b = this;
			var c = complex;
			if (b.norm() == 0) var ret = new c(Math.pow(0, p.r), 0);
			else if (b.i == 0) var ret = p.times(b.ln()).exp(); //  2017.3
			else var ret = new c(Math.pow(b.norm(), p.r) * Math.exp(-p.i * b.arg()), 0).times(new c(0, p.r * b.arg() + .5 * p.i * b.lnn().r).exp());
			return ret.round();
	}

	divideleft(other) { return this.divide(other); }	//	2017.10
	dividemiddle(other) { return this.divide(other); }	//	2017.10
	pointadd(other) { return this.add(other); }			//	2017.10
	pointsub(other) { return this.sub(other); }			//	2017.10
	pointtimes(other) { return this.times(other); }		//	2017.10
	pointdivide(other) { return this.divide(other); }	//	2017.10
	pointpow(other) { return this.pow(other); }			//	2017.10

	eval(base) {	//	2017.10
		return this.clone();
	}

}
