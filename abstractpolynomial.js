
// Author:	Anthony John Ripa
// Date:	8/3/2024
// AbstractPolynomial : Base Class for Polynomial

class abstractpolynomial {

	check(other) {	//	2019.2	Added
		if (arguments.length === 0) return this.pv.check();
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) throw new Error('AbstractPolynomial.Check 2 Fail');
		return mytype;
	}

	tohtml() { return this.pv.toString('medium') + ' Base ' + this.base; }

	equal(other) {	//	+2020.12
		this.align(other);
		var ret = this.parse(this.pv.equal(other.pv).toString());
		this.align(ret);
		return ret;
	}

	add(other) {
		this.align(other);
		return new this.constructor(this.base, this.pv.add(other.pv));
	}

	pointadd(other) {
		if (!(other instanceof this.constructor)) other = this.parse(other)	//	+2024.4
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
		this.align(other);	//	+2020.5
		return new this.constructor(this.base, this.pv.pow(other.pv));
	}

	pointpow(other) {
		if (!(other instanceof this.constructor)) other = this.parse(other)	//	+2024.4
		this.align(other);
		return new this.constructor(this.base, this.pv.pointpow(other.pv));
	}

	factorial() {		//	+2024.8
		return new this.constructor(this.base, this.pv.factorial());
	}

	round() {		//	2019.4	Added
		return new this.constructor(this.base, this.pv.round());
	}

	gcd(other) {	//	2019.5	Added
		this.align(other);
		return new this.constructor(this.base, this.pv.gcd(other.pv));
	}

	eval(other) {	//	+2021.3
		var pv = this.pv.eval(other.pv);
		if (Array.isArray(this.base))
			var base = this.base.slice(0, -1);
		else
			var base = other.pv.isconst() ? 1 : other.base;
		return new this.constructor(base, pv);
	}

	align(other) {
		this.check(other);	//	2019.2	Added
		if (this.pv.points.length == 1 && this.pv.points[0][1].is0()) this.base = other.base;
		if (other.pv.points.length == 1 && other.pv.points[0][1].is0()) other.base = this.base;
		if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }
	}

}
