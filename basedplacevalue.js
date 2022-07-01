
// Author:	Anthony John Ripa
// Date:	6/30/2022
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
		if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new this.constructor(10, this.pv.parse('%')) }
	}

	toString() {
		let sign = this.pv.isneg() ? '-' : '';
		let pv = this.pv.isneg() ? this.pv.negate() : this.pv;
		return sign + pv.toString() + ' Base ' + this.base;
	}

}
