
// Author:  Anthony John Ripa
// Date:    2/28/2024
// MarkedPlaceValue: a datatype for representing base-agnostic arithmetic

//class placevalue {			//	-2022.05
class markedplacevalue {		//	+2022.05

	constructor(arg) {			//	+2022.01
		var man, exp;
		if (arguments.length == 0)[man, exp] = [new wholeplacevalue(rational), 0];												//  2017.12
		if (arguments.length == 1) {
			if ([rational, complex, rationalcomplex].includes(arg)) [man, exp] = [new wholeplacevalue(arg), 0];					//  2018.6
			else[man, exp] = [arg, 0];
		}
		if (arguments.length == 2)[man, exp] = arguments;																		//  2017.12
		if (!(man instanceof wholeplacevalue)) { var s = 'markedplacevalue expects argument 1 to be a wholeplacevalue but found ' + typeof man; alert(s); throw new Error(s); }   //  2018.5  added throw
		if (!(exp instanceof Number) && !(typeof exp == 'number')) { var s = 'markedplacevalue expects argument 2 to be a number but found ' + typeof exp; alert(s); throw new Error(s); }
		this.whole = man;
		this.exp = this.whole.is0() ? 0 : exp;  //  2018.5  0 man has no exp
		var translate = x => x == rational ? 'rational' : x == complex ? 'complex' : x == rationalcomplex ? 'rationalcomplex' : 'other';	//	+2022.05
		console.log('this.whole = ' + this.whole + ', this.whole.datatype = ' + translate(this.whole.datatype) + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
	}

	parse(man) {    // 2017.9
		if (man instanceof String || typeof (man) == 'string') if (man.indexOf('whole') != -1) { var a = JSON.parse(man); return new this.constructor(this.whole.parse(JSON.stringify(a.whole)), a.exp) }
		var exp = 0;
		if (typeof (man) == "number") man = man.toString();     // 2015.11
		if (typeof (man) == "string" && man.indexOf('whole') != -1) {
			console.log("new markedplacevalue : arg is stringified markedplacevalue");
			var ans = JSON.parse(man);
			man = ans.whole;
			exp = ans.exp;
		} else if (man instanceof Object && JSON.stringify(man).indexOf('whole') != -1) {   // 2015.8
			console.log("new markedplacevalue : arg is markedplacevalue");
			exp = man.exp;      // get exp from man before
			man = man.whole;    // man overwrites self 2015.8
		}
		var whole = this.whole.parse((typeof man == 'string') ? getcoef(man.replace(/\.(?![^\(]*\))/g, '')) : man);		//	+2022.01
		return new this.constructor(whole, exp + getexp(man));													//	2018.6
		function getcoef(x) {	//	+2022.01
			if (!x.includes('E')) return x;
			return x.split('E')[0];
		}
		function getexp(x) {
			if (Array.isArray(x)) return 0;     // If man is Array, man has no exp contribution 2015.8 
			if (x.mantisa) return 0;  // To check for wholeplacevalue-like objects, replace (x instanceof wholeplacevalue) with (x.mantisa)    2015.9
			if (x.toString().indexOf('E') != -1) {	//	+2020.5
				return Number(x.substr(1 + x.indexOf('E'))) + getexp(x.substr(0, x.indexOf('E')))
			}
			var NEGATIVE = String.fromCharCode(822); var MINUS = String.fromCharCode(8315); var ONE = String.fromCharCode(185);
			x = x.toString().replace(new RegExp(NEGATIVE, 'g'), '').replace(new RegExp(MINUS, 'g'), '').replace(new RegExp(ONE, 'g'), '').replace(/\([^\(]*\)/g, 'm');
			return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.length + 1;
		}
	}

	check(other) {	//	+2022.8
		if (!(this instanceof markedplacevalue)) throw new Error("MarkedPlaceValue.Check 1 Fail : This isn't MarkedPlaceValue");
		var translate = x => x == rational ? 'rational' : x == complex ? 'complex' : x == rationalcomplex ? 'rationalcomplex' : 'other';
		if (arguments.length === 0) return this.whole.check();
		if (!(other instanceof markedplacevalue)) throw new Error("MarkedPlaceValue.Check 2 Fail : Other isn't MarkedPlaceValue");
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) throw new Error(`MarkedPlaceValue.Check 2 Fail: mytype(${translate(mytype)}) , othertype(${translate(othertype)})`);
		return mytype;
	}

	get(i) {       // 2015.11
		return this.whole.get(i - this.exp);
	}

	set(i, v) {	//	+2024.2
		this.check()
		return this.whole.set(i - this.exp, v)
	}

	getreal(i) { return this.whole.getreal(i - this.exp) }		//	2018.6	laplace

	tohtml(short) {        // Long and Short HTML  2015.11
		if (short) return this.toString(true);
		return this.whole.tohtml(true) + 'E' + this.exp;  // Replaces toStringInternal 2015.7
	}

	toString(sTag) {       //  sTag    2015.11
		var ret = "";
		for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
			if (i == this.whole.mantisa.length + this.exp) ret += '@';                  // Need '@' to see our '.' among digit's '.'    2015.11
			if (sTag)
				ret += this.whole.get(this.whole.mantisa.length - i - 1).tohtml(true);    //  .get(...).toString(sTag)    2016.7
			else
				ret += this.whole.get(this.whole.mantisa.length - i - 1).todigit();													//	+2022.03
				//ret += this.whole.get(this.whole.mantisa.length - i - 1).toString(sTag);	//	.get(...).toString(sTag)	2016.7	//	-2022.03
		}
		for (var i = 0; i < this.exp; i++) ret += '0';
		if (ret.indexOf('@') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
		if (ret[ret.length - 1] == '@') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
		while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
		if (ret[0] == '@') ret = '0' + ret;                                                                     // '.x' -> '0.x'
		if (ret == '') ret = '0';                                                                               // ''   -> '0'
		ret = ret.replace('@', '.');                                                // '@' -> '.'   2015.11
		return ret;
	}

	isconst() {		//	+2021.3
		return this.whole.isconst() && this.exp==0 ;
	}

	is0() { this.check(); return this.whole.is0() }					//	2023.10
	equals(other) { this.check(); return this.sub(other).is0() }	//	2023.10
	isneg() { return this.whole.isneg() }	//	+2022.8

	add(addend) {
		var me = this.clone();
		var other = addend.clone();
		//markedplacevalue.align(me, other);//	-2022.10
		me.align(other);					//	+2022.10
		var whole = me.whole.add(other.whole);
		return new this.constructor(whole, me.exp);
	}

	sub(subtrahend) {
		var me = this.clone();
		var other = subtrahend.clone();
		//markedplacevalue.align(me, other);//	-2022.10
		me.align(other);					//	+2022.10
		var whole = me.whole.sub(other.whole);
		return new this.constructor(whole, me.exp);
	}

	pointsub(subtrahend) {
		var whole = this.whole.pointsub(subtrahend.whole);
		return new this.constructor(whole, this.exp);
	}

	pointadd(addend) {
		var whole = this.whole.pointadd(addend.whole);
		return new this.constructor(whole, this.exp);
	}

	pointtimes(multiplier) {
		var me = this.clone();
		var other = multiplier.clone();
		//markedplacevalue.align(me, other);//	-2022.10
		me.align(other);					//	+2022.10
		var whole = me.whole.pointtimes(other.whole);
		return new this.constructor(whole, me.exp);
	}

	pointdivide(divisor) {
		var me = this.clone();
		var other = divisor.clone();
		//markedplacevalue.align(me, other);//	-2022.10
		me.align(other);					//	+2022.10
		var whole = me.whole.pointdivide(other.whole);
		return new this.constructor(whole, me.exp);
	}

	pointpow(power) {	// 2015.12
		if (power instanceof markedplacevalue) power = power.whole;   // laurent calls wpv    2015.8
		if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([power]);  // 2015.11
		var man = this.whole.mantisa.map(function (x) { return x.pow(power.get(0)) });
		var ret = new this.constructor(new wholeplacevalue(man), this.exp);
		return ret;
	}

	pow(power) {	// 2015.8
		if (typeof power == 'number') power = new this.whole.datatype().parse(power);     //  2017.5  exponential calls with number
		if (power instanceof this.whole.datatype) power = new wholeplacevalue([power]);   //  2017.5
		if (power instanceof wholeplacevalue) power = new markedplacevalue(power, 0);         //  2017.5  laurent calls wpv
		//alert(JSON.stringify([this,power]))
		if (power.exp == 0) {   //  2017.5
			if (power.get(0).toreal() < 0) return (new markedplacevalue(this.whole.parse(1), 0)).divide(this.pow(power.negate()));    //  2018.5  this.whole
			var whole = this.whole.pow(power.whole);
			var exp = this.exp * power.get(0).toreal();    // exp*pow not exp^pow  2015.9
		} else if (power.exp == 1) {    //  2017.5
			return this.pow(this.parse(power.toString()))	//	+2020.5
		} else { alert('PV >Bad Exponent = ' + power.toString()); return markedplacevalue.parse('%') }
		return new this.constructor(whole, exp);
	}

	exponential() {	//	+2020.5
		if (this.exp == 0) {
			if (this.get(1).toreal() < 0) return (new this.constructor(this.whole.parse(1), 0)).divide(this.negate().exponential());
			var whole = this.whole.exponential();
			var exp = 0;
		} else if (this.exp == 1) {
			//var whole = new wholeplacevalue().parse(1);	//	-2022.05
			var whole = this.whole.parse(1);				//	+2022.05
			var exp = this.get(1).toreal();
		} else { alert('PV >Bad Exponent = ' + power.toString()); return markedplacevalue.parse('%') }
		return new this.constructor(whole, exp);
	}

	//static align(a, b) {    // rename pad align 2015.9	//	-2022.10
	//	if (a.whole.is0()) a.exp = b.exp;   //  2017.6
	//	while (a.exp > b.exp) {
	//		a.exp--;
	//		a.whole.times10();              // Delegate Shift to Whole  2015.7
	//	}
	//	while (b.exp > a.exp) {
	//		b.exp--;
	//		b.whole.times10();              // Delegate Shift to Whole  2015.7
	//	}
	//}

	align(other) {											//	+2022.10
		if (this.whole.is0()) this.exp = other.exp;
		while (this.exp > other.exp) {
			this.exp--;
			this.whole.times10();
		}
		while (other.exp > this.exp) {
			other.exp--;
			other.whole.times10();
		}
	}

	times(top) {
		if (!(top instanceof Object && JSON.stringify(top).indexOf('whole') != -1)) top = new this.constructor(top);  // 2015.11
		var whole = this.whole.times(top.whole);
		return new this.constructor(whole, this.exp + top.exp);
	}

	negate() {         //  2017.5
		return new this.constructor(this.whole.negate(), this.exp);
	}

	scale(scalar) {   // 2015.11
		if (arguments.length == 0) {	//	+2024.2
			let ret = this.clone()
			for (let i = 0; i < this.whole.len(); i++) {
				let p = i + this.exp
				ret.set(p, this.get(p).scale(p))
			}
			return ret
		} else {
			var whole = this.whole.scale(scalar);
			return new this.constructor(whole, this.exp);			
		}
	}

	unscale(scalar) {   // 2016.7
		var whole = this.whole.unscale(scalar);
		return new this.constructor(whole, this.exp);
	}

	divide(denominator) {
		var me = this.clone();
		if (!(denominator instanceof Object && JSON.stringify(denominator).indexOf('whole') != -1)) denominator = markedplacevalue.parse(denominator);  // 2015.11
		var pads = 0;						// 2015.11
		pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : pad(me, denominator, 6);		// 2016.1
		var whole = me.whole.divide(denominator.whole);
		console.log('markedplacevalue.prototype.divide : return new markedplacevalue(whole, ' + me.exp + '-' + denominator.exp +')')
		var ret = new this.constructor(whole, me.exp - denominator.exp);
		unpad(ret,pads);					// 2015.11
		return ret;
		function pad(n, d, sigfig) {
			var i = 0;						// 2015.11
			while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
				i++;						// 2015.11
				console.log('markedplacevalue.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
				n.exp--;
				n.whole.times10();      // Delegate Shift to Whole  2015.7
			}
			return i;						// 2015.11
		}
		function unpad(pv, pads) {			// 2015.11
			while (pads>0) {
				if (pv.whole.get(0)==0) {
					pv.whole.div10();               //  2018.6  Delegate Shift to Whole
					pv.exp++
				}
				pads--;
			}		
		}
	}

	dividemiddle(den) {    // 2016.3
		if (den.whole.mantisa.length == 1) return new this.constructor(this.whole.dividemiddle(den.whole), this.exp - den.exp);	//	+2020.12
		return new this.constructor(this.whole.dividemiddle(den.whole), this.exp - den.exp - 1);  // The offset 1 is because whole.dividemiddle is always off by a factor of 10.
	}

	divideleft(den) {      // 2016.3
		return new this.constructor(this.whole.divideleft(den.whole), this.exp - den.exp);
	}

	remainder(den) {	//	2019.4	Added
		return this.sub(this.divide(den).times(den));
	}

	clone() {
		return new this.constructor(this.whole.clone(), this.exp);
	}

	eval(base) {	//	+2021.3
		if (!(base instanceof this.constructor)) base = this.parse('('+base+')');	//	+2022.8
		var sum = new this.constructor();
		for (let i = 0; i < this.whole.mantisa.length; i++)
			sum = sum.add(base.pow(i+this.exp).scale(this.whole.get(i)));
		return sum;
	}

	pointeval(n = 3) {					//	+2022.02
		if (n instanceof this.constructor) n = n.get(0).toreal();	//	+2023.01
		let range = math.range(-n,n+1)._data;
		return new this.constructor(new wholeplacevalue(range.map(base => this.eval(this.parse('('+base+')')).whole.mantisa[0])),-n);
	}

	regroup(base) {						//	+2022.8
		return new this.constructor(this.whole.regroup(base), this.exp);
	}

	//pointeval() {	//	+2022.01	//	-2022.02
	//	return new placevalue(new wholeplacevalue([-3,-2,-1,0,1,2,3].map(base => this.eval(this.parse('('+base+')')).whole.mantisa[0])),-3);
	//}

}
