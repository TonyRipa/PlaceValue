
// Author:	Anthony John Ripa
// Date:	3/31/2025
// BasedPlaceValueRatio: a datatype for representing base-gnostic arithmetic; an application of the PlaceValueRatio datatype

class basedplacevalueratio extends abstractpolynomial {

	constructor(arg) {
		var base, pv
		if (arguments.length == 0)[base, pv] = [10, new placevalueratio(rational)]
		if (arguments.length == 1) {
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [10, new placevalueratio(arg)]
			else[base, pv] = [arg, new placevalueratio(rational)]
		}
		if (arguments.length == 2)[base, pv] = arguments
		if (Array.isArray(base)) alert('BasedPlaceValueRatio expects argument 1 (base) to be a string but found array: ' + typeof base)
		if (!(pv instanceof placevalueratio)) { var s = 'BasedPlaceValueRatio expects arg 2 to be PlaceValueRatio not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s) }
		pv = pv.regroup(pv.parse('('+base+')'))
		super()
		this.base = base
		this.pv = pv
	}

	parse(str) {
		str = str.toString()
		if (str.includes('num')) {
			var a = JSON.parse(str)
			return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv)))
		}
		let base, pv;
		if (str.toUpperCase().includes('BASE')) {
			let i = str.toUpperCase().indexOf('BASE')
			let left = str.slice(0, i).trim()
			let right = str.slice(i + 4).trim()
			pv = this.pv.parse(left)
			base = Number(right)
		} else {
			base = 10
			pv = this.pv.parse(str)
		}
		return new this.constructor(base, pv)
	}

	align(other) {
		this.check(other);
		if (this.base != other.base) {
			let temp = other.regroup(this.base)
			other.pv = temp.pv
			other.base = temp.base
		}
	}

	toString() {
		let sign = this.pv.isneg() ? '-' : ''
		let pv = this.pv.isneg() ? this.pv.negate() : this.pv
		return sign + pv.toString() + ' Base ' + this.base
	}

	unscale(scalar) {
		return new this.constructor(this.base, this.pv.unscale(scalar))
	}

	divide(den) {
		return this.unscale(den.eval())
	}

	regroup(base) {
		if (!(base instanceof this.constructor)) base = new this.constructor(this.base, this.pv.parse('('+base+')'))
		this.check(base)
		base = base.pv.eval(base.base)
		let base10 = this.pv.eval(this.base)
		let pv = this.pv.parse('('+base10+')')
		return new this.constructor(base, pv)
	}

	eval() {
		return this.pv.eval(this.base)
	}

}
