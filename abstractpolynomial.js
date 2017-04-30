
// Author:  Anthony John Ripa
// Date:    4/30/2017
// AbstractPolynomial : Base Class for SparseMultinomial & ComplexSparseMultinomial

class abstractpolynomial {

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

    pointdivide(other) {
        this.align(other);
        return new this.constructor(this.base, this.pv.pointdivide(other.pv));
    }

    pow(other) {
        return new this.constructor(this.base, this.pv.pow(other.pv));
    }

    eval(base) {
        return new this.constructor(this.base.slice(0, -1), this.pv.eval(base.pv));
    }

}

