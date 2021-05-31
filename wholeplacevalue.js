
// Author:	Anthony John Ripa
// Date:	5/31/2021
// WholePlaceValue: a datatype for representing base-agnostic arithmetic via whole numbers

var P = JSON.parse; JSON.parse = function (s) { return P(s, function (k, v) { return (v == '∞') ? 1 / 0 : (v == '-∞') ? -1 / 0 : (v == '%') ? NaN : v }) }
var S = JSON.stringify; JSON.stringify = function (o) { return S(o, function (k, v) { return (v === 1 / 0) ? '∞' : (v === -1 / 0) ? '-∞' : (v != v) ? '%' : v }) }  //  2017.2  ===

class wholeplacevalue {	//	+2020.11

	//function wholeplacevalue(arg) {	//	-2020.11
	constructor(arg) {					//	+2020.11
		var man, datatype;
		if (arguments.length == 0)[man, datatype] = [[], rational];											//	2020.1	Added
		if (arguments.length == 1) {																		//	2020.1	Added
			if (arg === rational || arg === complex || arg === rationalcomplex)[man, datatype] = [[], arg];	//	2017.11
			if (Array.isArray(arg)) {																		//	2017.11
				man = arg;
				if (man.length==0) throw new Error('notype')												//	2019.5	Added
				datatype = (man.length > 0) ? man[0].constructor : rational;
			}
		}
		if (arguments.length == 2)[man, datatype] = arguments;												//	2020.1	Added
		this.datatype = datatype;
		this.mantisa = man;
		while (this.mantisa.length > 1 && this.get(this.mantisa.length - 1).is0())							//	2020.1 Added
			this.mantisa.pop();                             //  pop root
		this.check();
	}

	parse(man) {  //  2017.9
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
					//if (c == '.' || c == 'e' || c == 'E') break;    // Truncate    2015.9	//	-2020.5
					if (c == '.' || c == 'E') break;	//	+2020.5
					if ([String.fromCharCode(185), String.fromCharCode(777), String.fromCharCode(822), String.fromCharCode(8315)].indexOf(c) > -1) ret[ret.length - 1] += c;
					else ret.push(c);
				}
			}
			return ret.reverse();   // .reverse makes lower indices represent lower powers 2015.7
		}
	}

	check(other) {	//	2018.12	Added Type-Checker
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

	len() {			//	+2021.5
		this.check();
		return this.mantisa.length;
	}

	push(x) {		//	+2021.5
		this.check();
		return this.mantisa.push(x);
	}

	splice(...a) {	//	+2021.5
		this.check();
		return this.mantisa.splice(...a);
	}

	slice(...a) {	//	+2021.5
		this.check();
		return this.mantisa.slice(...a);
	}

	get(i) {
		this.check();
		if (i < 0 || this.mantisa.length <= i) return new this.datatype();          // check <0 2015.12
		return this.mantisa[i];
	}

	getreal(i) {  //  2017.11
		this.check();
		return this.get(i).toreal();
	}

	getimag(i) {  //  2017.11
		this.check();
		return this.get(i).sub(this.datatype.parse(this.getreal(i))).toreal();
	}

	tohtml(short) {    // Replaces toStringInternal 2015.7
		this.check();
		return this.mantisa.map(function (x) { return x.tohtml(true) }).reverse().join(short ? '' : ',');         // R2L
	}

	toString(sTag) {						//	sTag	2015.11
		this.check();
		var ret = "";
		for (var i = 0 ; i < this.mantisa.length; i++) ret = this.get(i).todigit() + ret;   //  2017.11 todigit
		return ret;
	}

	tosvg() {								//	+2020.11
		var ret = '';
		var arr = this.mantisa;																								//	-2020.12
		if (arr.some(x=>x.pow(-1).is0())) arr = arr.map(x=>x.pow(-1).is0() ? this.datatype.parse(1) : new this.datatype());	//	+2020.12
		for (var x=0; x<this.mantisa.length; x++) {
			var color = 200;
			//var coef = this.mantisa[x];				//	-2020.12
			var coef = arr[x];							//	+2020.12
			for (let i = 0; i<coef.toreal(); i++) {
				var h = (i+1>coef.toreal()) ? coef.toreal()-i : 1;
				ret += `<rect width="50" height="${50*h}" x="${50*x}" y="${50*i}" fill='rgb(${color},${color},${color})'/>`;
			}
		}
		var w = this.mantisa.length * 50;
		//var h = (math.max(1,this.mantisa.map(y=>y.toreal()))) * 50;	//	-2020.12
		var h = (math.max(1,arr.map(y=>y.toreal()))) * 50;				//	+2020.12
		return `<svg style='border:thin solid black' transform="scale(1,-1)" height='100px' viewbox='0 0 ${w} ${h}'><g stroke='#789'>${ret}</g></sgv>`
	}

	equals(other) {
		this.check();
		var ret = true
		for (var i = 0; i < Math.max(this.mantisa.length, other.mantisa.length) ; i++)
			ret = ret && this.get(i).equals(other.get(i))   //  2017.11 delegate =
		return ret;
	}

	equal(other) { return this.parse(this.equals(other) ? 1 : 0); }	//	+2020.10

	comparelittle(other) {					//	2019.4	Added
		this.check(other)
		for (var i = 0; i < this.mantisa.length + other.mantisa.length ; i++) {
			if (this.get(i).above(other.get(i))) return 1;
			if (this.get(i).below(other.get(i))) return -1;
		}
		return 0;
	}

	comparebig(other) {						//	2019.4	Added
		this.check(other);
		for (var i = this.mantisa.length + other.mantisa.length; i >= 0 ; i--) {
			if (this.get(i).above(other.get(i))) return 1;
			if (this.get(i).below(other.get(i))) return -1;
		}
		return 0;
	}

	isconst() { return this.mantisa.length <= 1; }					//	+2021.3
	is0() { this.check(); return this.equals(this.parse(0)); }      //  2016.5
	is1() { this.check(); return this.equals(this.parse(1)); }      //  2016.5
	is1hi() { this.check(); return this.slice(-1)[0].is1() && this.slice(0,-1).every(x=>x.is0()); }	//	+2021.5
	isNaN() { this.check(); return this.equals(this.parse('%')); }  //  2018.3

	above(other) { this.check(other); return this.get(0).above(other.get(0)) }	//	2017.7
	isneg() { this.check(); return this.parse(0).above(this) == 1 }				//	2019.5	Added

	add(other) { this.check(other); return this.f(function (x, y) { return x.add(y) }, other); }
	sub(other) { this.check(other); return this.f((x, y)=>x.sub(y),other);}	//	2018.12
	//wholeplacevalue.prototype.pointequals = function (other) { this.check(other); return this.f((x, y)=>new this.datatype(x.equals(y)?1:0),other);}	//	-2020.10
	//pointequals(other) { this.check(other); return this.f((x, y)=>x.equal(y),other);}								//	+2020.10	//	-2020.11
	pointequal(other) { this.check(other); return this.f((x, y)=>x.equal(y),other);}												//	+2020.11
	pointtimes(other) { this.check(other); return this.f(function (x, y) { return x.times(y) }, other); }
	pointdivide(other) { this.check(other); return this.f(function (x, y) { return x.divide(y) }, other); }
	pointmin(other) { this.check(other); return this.f(function (x, y) { return x.min(y) }, other); }	//	2019.5	Added
	clone() { this.check(); return this.f(function (x) { return x }, this); }
	negate() { this.check(); return this.f(function (x) { return x.negate() }, this); }     //  2016.5

	f(f, other) { // template for binary operations   2015.9
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

	pointsub(subtrahend) {
		this.check(subtrahend); 
		var man = [];
		for (var i = 0; i < this.mantisa.length; i++) {
			man.push(this.get(i).sub(subtrahend.get(0)));  // get(0) is the one's place 2015.7
		}
		return new wholeplacevalue(man)//.round();    // 1-1.1≠-.100009   2015.9
	}

	pointadd(addend) {
		this.check(addend); 
		var man = [];
		for (var i = 0; i < this.mantisa.length; i++) {
			man.push(this.get(i).add(addend.get(0)));      // get(0) is the one's place 2015.7
		}
		return new wholeplacevalue(man);
	}

	pow(power) { // 2015.6
		if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new this.datatype().parse(power)]);
		this.check(power);
		//if (power.mantisa.length == 1) {		//	+2020.5		//	-2020.11
		if (power.mantisa.length <= 1) {						//	+2020.11
			//if(power.get(0).toreal()!= Math.round(power.get(0).toreal())) { alert('WPV .Bad Exponent = ' +power.tohtml());return wholeplacevalue.parse('%')}//-2020.11
			//if (power.get(0).toreal() != Math.round(power.get(0).toreal())){alert('WPV .Bad Exponent = ' + power.tohtml());return this.parse('%') }//+2020.11//-2021.1
			if (!power.get(0).isint()) {	//	+2021.1
				if (power.get(0).toreal() == .5) return this.sqrt();
				alert('WPV .Bad Exponent = ' + power.tohtml());
				return this.parse('%');
			}
			//if (power.get(0).toreal() < 0) return this.parse(0);		//	2018.1	this.parse		//	-2020.5
			if (power.get(0).toreal() < 0) return this.parse(1).divide(this.pow(power.negate()));	//	+2020.5
			if (power.is0()) return this.parse(1);//alert(JSON.stringify(power))
			return this.times(this.pow(power.get(0).toreal() - 1));
		} else if (this.mantisa.length == 1) {	//	+2020.5
			//if (this.mantisa.length == 1) return new wholeplacevalue([this.get(0).pow(power.get(0))]).times10s(power.get(1).toreal());  //  2017.5  2^32=4000	//	-2020.5
			var ret = [];											//	+2020.5
			for (var i = 0; i < 2 ; i++) {							//	+2020.5
				if (i == 0) { ret.push(this.parse(this.get(0).pow(power.get(0)).toString())); continue; }
				var taylor = new this.constructor(this.datatype);
				for (var t = 0 ; t < 4 ; t++ ) {
					var taylorterm = this.parse(1);
					if (this.get(0).toString() != 'e') taylorterm = taylorterm.scale(this.get(0).log().pow(t));
					taylorterm = taylorterm.scale(1/math.factorial(t));
					taylorterm = taylorterm.times10s(t);
					taylor = taylor.add(taylorterm);
				}
				ret.push(taylor.pow(power.get(1).toreal()));
			}
			return ret.reduce((acc, cur) => acc.times(cur));	//	+2020.5
		}
		if (power.mantisa.length > 1) { alert('WPV >Bad Exponent = ' + power.toString()); return this.parse('%') }
	}

	exponential(power) {	//	+2020.5
		return this.parse('10').pow(this.get(1).toreal()).scale(this.parse('e').pow(this.get(0)));
	}

	pointpow(power) { // 2015.12
		if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([new this.datatype().parse(power)]);	//	2018.6	Added
		this.check(power);
		var ret = this.clone();
		ret.mantisa = ret.mantisa.map(function (x) { return x.pow(power.get(0)) });
		return ret;
	}

	div10() { this.check(); this.mantisa.shift() }							//	2018.6	Caller can unpad w/out knowing L2R or R2L
	times10() { this.check(); this.mantisa.unshift(new this.datatype()) }	//	Caller can pad w/out knowing L2R or R2L  2015.7
	//div10s(s) { this.check(); me = this.clone(); while (s-- > 0) me.mantisa.shift(); return me.clone(); }  // 2017.6    clone	//	-2021.1
	div10s(s) { this.check(); var me = this.clone(); while (s-- > 0) me.mantisa.shift(); return me.clone(); }					//	+2021.1
	//times10s(s){this.check(); if(s<0) return this.div10s(-s); me = this.clone(); while (s-- > 0) me.mantisa.unshift(new this.datatype()); return me;}//2017.6 -2020.11
	times10s(s) {this.check(); if(s < 0) return this.div10s(-s); var me = this.clone(); while (s-- > 0) me.mantisa.unshift(new this.datatype()); return me;} //	+2020.11

	times(top) {
		if (!(top instanceof wholeplacevalue)) { var s = 'wholeplacevalue.times expects arg to be a wholeplacevalue but found ' + typeof top + ' ' + JSON.stringify(top); alert(s); throw new Error(s); }   //  2018.2
		this.check(top);	//	~2021.3
		if (!(this.datatype == top.datatype)) { var s = 'wholePV.times arg (wholeplacevalue) different digit datatype\n' + this.datatype + '\n' + top.datatype; alert(s); throw new Error(s); }             //  2018.2
		var prod = new wholeplacevalue(this.datatype);
		for (var b = 0; b < this.mantisa.length; b++) {
			var sum = [];
			for (var t = 0; t < top.mantisa.length; t++) {
				//sum.push(this.get(b).is0() || top.get(t).is0() ? new this.datatype() : this.get(b).times(top.get(t))); // Check 0 so ∞*10=∞0 not ∞% 2015.6   // get() 2015.7	//	2020.1	Removed
				sum.push(this.get(b).times(top.get(t)));	//	2020.1	Added
			}
			for (var i = 0; i < b; i++) sum.unshift(new this.datatype()); // change push to unshift because L2R   2015.7
			//prod = prod.add(new wholeplacevalue(sum));				//	2020.1	Removed
			prod = prod.add(new wholeplacevalue(sum,this.datatype));	//	2020.1	Added
		}
		return prod;
	}

	scale(scalar, trace) {
		this.check(); 
		if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);
		var ret = this.clone(trace + ' wholeplacevalue.prototype.scale >');
		ret.mantisa = ret.mantisa.map(function (x) { return x.times(scalar) });
		return ret;
	}

	unscale(scalar, trace) {  //  2016.5
		this.check(); 
		if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);
		var ret = this.clone(trace + ' wholeplacevalue.prototype.unscale >');
		ret.mantisa = ret.mantisa.map(function (x) { return x.divide(scalar) });
		return ret;
	}

	sqrt() {	//	+2021.1
		var rad = this.clone();
		var iter = 4;
		var root = sqrth(rad.div10s(1), [rad.get(0).pow(.5).scale(2)], iter);
		return root;
		function sqrth(rad, troot, c) {
			if (c == 0) return new wholeplacevalue(troot).unscale(2);
			var root = rad.get(0).divide(troot[0]);
			var troot1 = [...troot,root]
			var remainder = rad.sub(new wholeplacevalue(troot1).scale(root)).div10s(1);
			//troot = [...troot,root.scale(2)];	//	-2021.4
			troot.push(root.scale(2));			//	+2021.4
			return sqrth(remainder, troot, c - 1);
		}
	}

	static getDegree(me) {			//	2018.6	1-arg
		me.check(); 
		for (var i = me.mantisa.length - 1; i >= 0; i--)
			if (!me.get(i).is0()) return { 'deg': i, 'val': me.get(i) };
		return { 'deg': 0, 'val': me.get(0) };
	}

	divide(den) { // 2015.8
		this.check(den);
		var num = this;
		var iter = num.mantisa.length;
		var quotient = divideh(num, den, iter);
		return quotient;
		function divideh(num, den, c) {
			//if (c == 0) return new wholeplacevalue([new num.datatype().parse(0)], 'wholeplacevalue.prototype.divide >');	//	2020.1	Removed
			if (c == 0) return new wholeplacevalue([new num.datatype().parse(0)]);											//	2020.1	Added
			var d = wholeplacevalue.getDegree(den);		//	2018.6	arg=den
			//var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');	//	-2021.1
			var quotient = num.div10s(d.deg).unscale(d.val);											//	+2021.1
			if (d.val.is0()) return quotient;
			var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
			//function shift(me, left) {																//	-2021.1
			//	//var ret = new wholeplacevalue([new me.datatype()], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');	//	2020.1	Removed
			//	var ret = new wholeplacevalue([new me.datatype()]).add(me);																				//	2020.1	Added
			//	for (var r = 0; r < left; r++) ret.mantisa.shift();
			//	return ret;
			//}
		}
	}

	remainder(den) {  //  2016.5
		this.check(den);
		return this.sub(this.divide(den).times(den));
	}

	static getDegreeLeft(me) {			//	2020.1	Added
		me.check(); 
		for (var i = 0 ; i < me.mantisa.length; i++)
			if (!me.get(i).is0()) return { 'deg': i, 'val': me.get(i) };
		return { 'deg': 0, 'val': me.get(0) };
	}

	//wholeplacevalue.getDegreeLeft = function (man) {		//	2020.1	Removed
	//	for (var i = 0 ; i < man.length ; i++)
	//		if (!man[i].is0()) return { 'deg': i, 'val': man[i] };
	//	return { 'deg': 0, 'val': man[this.datatype.parse(0)] };
	//}

	divideleft(den) { // 2016.3
		this.check(den);
		var num = this;
		var iter = 5//num.mantisa.length;
		var quotient = divideh(num, den, iter);
		quotient.mantisa = quotient.mantisa.slice(0,5)	//	2018.10	Discard Error
		return new wholeplacevalue(quotient.mantisa);	//	2018.10	Clean zeros
		function divideh(num, den, c) {
			num.check(den);
			//if (c == 0) return new wholeplacevalue([new num.datatype()], 'wholeplacevalue.prototype.divide >');	//	2020.1	Removed
			if (c == 0) return new wholeplacevalue([new num.datatype()]);											//	2020.1	Added
			//var d = wholeplacevalue.getDegreeLeft(den.mantisa);	//	2020.1	Removed
			var d = wholeplacevalue.getDegreeLeft(den);				//	2020.1	Added
			//var quotient = shift(num, d.deg).unscale(d.val, 'wholeplacevalue.prototype.divide >');	//	-2021.1
			var quotient = num.div10s(d.deg).unscale(d.val);											//	+2021.1
			if (d.val.is0()) return quotient;
			var remainder = num.sub(quotient.times(den), 'wholeplacevalue.prototype.divide >')
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
			//function shift(me, left) {																//	-2021.1
			//	//var ret = new wholeplacevalue([new me.datatype()], 'wholeplacevalue.prototype.add >').add(me, 'wholeplacevalue.prototype.shift >');	//	2020.1	Removed
			//	var ret = new wholeplacevalue([new me.datatype()]).add(me);	//	2020.1	Removed
			//	for (var r = 0; r < left; r++) ret.mantisa.shift();
			//	return ret;
			//}
		}
	}

	dividemiddle(den) {   // 2016.3
		this.check(den);
		if (den.mantisa.length == 1) return this.divide(den);	//	+2020.12
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
		var Atb = math.multiply(At, b);
		//var I = math.matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);	//	-2020.12
		try {
			//var AtAinv = math.divide(I, AtA);						//	-2020.12
			var x = math.divide(math.transpose(Atb),AtA);			//	+2020.12
		} catch (e) {
			return this.parse('%0');
		}
		//var x = math.multiply(AtAinv, Atb);						//	-2020.12
		//x = x.transpose().valueOf()[0];							//	-2020.12
		x = x.transpose().valueOf();								//	+2020.12
		x.reverse();
		return new wholeplacevalue(x.map(function (x) { return Math.round(100 * x) / 100 }).map(new this.datatype().parse));
	}

	gcd(arg) {			//	2019.5
		if (arguments.length == 0) return this.gcd0();
		if (arguments.length == 1) return this.gcd1(arg);
		alert('GCD Error : Too many args');
	}

	gcd0() {			//	2016.5
		this.check();
		var list = [];
		for (var i = 0; i < this.mantisa.length; i++)
			list.push(this.get(i));
		//if (list.length == 0) return new this.datatype.parse(1);	//	-2020.5
		if (list.length == 0) return new this.datatype().parse(1);	//	+2020.5
		if (list.length == 1) return list[0].is0() ? new this.datatype().parse(1) : list[0];    //  Disallow 0 to be a GCD for expediency.  2016.5
		return list.reduce(function (x, y) { return x.gcd(y) }, new this.datatype());
	}

	gcd1(b, count) {	//	2019.5
		var a = this;
		a.check();
		b.check();
		if (arguments.length < 2) count = 0;
		count++;
		if (count == 10) return a.parse(1);
		console.log(a.toString(), b.toString());
		if (a.mantisa[0].isneg() && b.mantisa[0].ispos()) { "alert(1)"; return a.negate().gcd1(b,count); }
		if (a.is0()) { "alert(2)"; return b; }
		if (b.is0()) { "alert(3)"; return a; }
		if (a.mantisa[a.mantisa.length - 1].above(b.mantisa[b.mantisa.length - 1])) { "alert(5 + ': ' + a + ' , ' + b)"; return a.remainder(b).gcd1(b,count); }
		"alert(6 + ': ' + a + ' , ' + b)"; return b.remainder(a).gcd1(a,count);
	}

	eval(base) {
		this.check(base);
		//var sum = new this.datatype();		//	-2021.3
		var sum = new this.constructor();		//	+2021.3
		for (var i = 0; i < this.mantisa.length; i++) {
			//sum = sum.add(this.get(i).times(base.get(0).pow(i)));  // get(0)   2016.1	//	-2021.3
			sum = sum.add(base.pow(i).scale(this.get(i)));								//	+2021.3
		}
		//return new wholeplacevalue([sum]);	//	-2021.3
		return sum;								//	+2021.3
	}

	pointeval() {	//	+2020.11
		return new wholeplacevalue([0,1,2,3,4].map(base => this.eval(this.parse(base)).mantisa[0]));
	}

	unpointeval() {	//	+2020.12
		var man = this.mantisa.map(x=>x.toreal());
		var n = man.length;
		var matrix = [];
		for (let r = 0; r < n; r++) {
			var row = [];
			for (let c = 0; c < n; c++)
				row.push(math.pow(r,c));
			matrix.push(row);
		}
		var x = math.divide(man, math.transpose(matrix));
		return new wholeplacevalue(x.map(e=>new this.datatype(e).round()));
	}

}
