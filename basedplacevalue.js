
// Author:	Anthony John Ripa
// Date:	7/31/2022
// BasedPlaceValue: a datatype for representing base-gnostic arithmetic; an application of the WholePlaceValue datatype

class basedplacevalue extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [10, new wholeplacevalue(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [10, new wholeplacevalue(arg)];
			else[base, pv] = [arg, new wholeplacevalue(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (Array.isArray(base)) alert('BasedPlaceValue expects argument 1 (base) to be a string but found array: ' + typeof base);
		if (!(pv instanceof wholeplacevalue)) { var s = 'BasedPlaceValue expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
		pv = pv.regroup(pv.parse('('+base+')'));
		super();
		this.base = base;
		this.pv = pv;
	}

	parse(str) {
		str = str.toString();	//	+2022.07
		if (str instanceof String || typeof (str) == 'string') if (str.includes('mantisa')) {
			var a = JSON.parse(str);
			return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv)));
		}
		let base, pv;
		if (str.toUpperCase().includes('BASE')) {
			let i = str.toUpperCase().indexOf('BASE');
			let left = str.slice(0, i).trim();
			let right = str.slice(i + 4).trim();
			pv = this.pv.parse(left);
			base = Number(right);
		} else {
			base = 10;
			pv = this.pv.parse(str);
		}
		return new this.constructor(base, pv);
	}

	align(other) {
		this.check(other);
		//if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new this.constructor(10, this.pv.parse('%')) }	//	-2022.7
		if (this.base != other.base) {																															//	+2022.7
			let temp = other.regroup(this.base);
			other.pv = temp.pv;
			other.base = temp.base;
		}
	}

	toString() {
		let sign = this.pv.isneg() ? '-' : '';
		let pv = this.pv.isneg() ? this.pv.negate() : this.pv;
		return sign + pv.toString() + ' Base ' + this.base;
	}

	comparebig(other) { this.check(other); return this.pv.comparebig(other.pv); }		//	+2022.7

	clone() { this.check(); return new this.constructor(this.base, this.pv.clone()) }	//	+2022.7

	dividenaive(den) {																	//	+2022.7
		this.check(den);
		let num = this.clone();
		let count = 0;
		while (num.comparebig(den) > -1) {
			num = num.sub(den);
			count++;
		}
		let ratio = this.pv.parse('('+count+')');
		return new this.constructor(this.base, ratio);
	}

	divide(den) {																		//	+2022.7
		this.check(den);
		let num = this.clone();
		let len = this.pv.mantisa.length;
		let rat = new Array(len).fill(new this.pv.datatype());
		let base = num.base;
		for (let cursor = len - 1; cursor >= 0; cursor--) {
			let numpart = new this.constructor(base, new this.pv.constructor(num.pv.mantisa.slice(cursor)));
			rat[cursor] = numpart.dividenaive(den).pv.mantisa[0];
			let ratio = new this.constructor(base, new this.pv.constructor(rat.slice(0, cursor+1)));
			num = num.sub(ratio.times(den));
		}
		return new this.constructor(base, new this.pv.constructor(rat));
	}

	regroup(base) {																		//	+2022.7
		if (!(base instanceof this.constructor)) base = new this.constructor(this.base, this.pv.parse('('+base+')'));
		this.check(base);
		base = base.pv.eval(base.base);
		let base10 = this.pv.eval(this.base);
		let pv = this.pv.parse('('+base10+')');
		return new this.constructor(base, pv);
	}

}
