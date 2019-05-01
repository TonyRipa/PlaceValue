
// Author:	Anthony John Ripa
// Date:	2/28/2019
// AbstractPolynomial : Base Class for SparseMultinomial, ComplexSparseMultinomial

class abstractpolynomial {

	check(other) {	//	2019.2	Added
		if (arguments.length === 0) return this.pv.check();
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) throw new Error('AbstractPolynomial.Check 2 Fail');
		return mytype;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base ' + this.base;
	}

	add(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.add(other.pv));
	}

	pointadd(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.pointadd(other.pv));
	}

	sub(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.sub(other.pv));
	}

	pointsub(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.pointsub(other.pv));
	}

	times(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.times(other.pv));
	}

	pointtimes(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.pointtimes(other.pv));
	}

	divide(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.divide(other.pv));
	}

	divideleft(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.divideleft(other.pv));
	}

	dividemiddle(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.dividemiddle(other.pv));
	}

	remainder(other) {	//	2019.4	Added
		this.align(other);
		return new this.constructor(this.base, this.pv.remainder(other.pv));
	}

	pointdivide(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.pointdivide(other.pv));
	}

	pow(other) {
		return new this.constructor(this.base, this.pv.pow(other.pv));
	}

	pointpow(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.pointpow(other.pv));
	}

	round() {		//	2019.4	Added
		return new this.constructor(this.base, this.pv.round());
	}

	eval(other) {	//	2017.10 Works for 1D & nD
		return new this.constructor(Array.isArray(this.base) ? this.base.slice(0, -1) : 1, this.pv.eval(other.pv)); //  2017.10
	}

	align(other) {			//	2017.10 Works for 1D
		this.check(other);	//	2019.2	Added
		if (this.pv.points.length == 1 && this.pv.points[0][1].is0()) this.base = other.base;
		if (other.pv.points.length == 1 && other.pv.points[0][1].is0()) other.base = this.base;
		if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }
	}

}

