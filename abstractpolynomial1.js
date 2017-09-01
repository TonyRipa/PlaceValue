
// Author:  Anthony John Ripa
// Date:    8/31/2017
// AbstractPolynomial1 : Base class for SparsePolynomialRational & SparseExponential1

class abstractpolynomial1 extends abstractpolynomial {

    align(other) {
        if (this.pv.points.length == 1 && this.pv.points[0][1].is0()) this.base = other.base;
        if (other.pv.points.length == 1 && other.pv.points[0][1].is0()) other.base = this.base;
        if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }
    }

}
