
PlaceValue: A data-type for base-agnostic arithmetic
=====================================================

Author : Anthony John Ripa

Date : 2/29/2020

<a href='https://github.com/TonyRipa/PlaceValue'>https://github.com/TonyRipa/PlaceValue</a>

Live Demo at <a target='_blank' href='http://tonyripa.github.io/PlaceValue/'>http://tonyripa.github.io/PlaceValue/</a> (Need Firefox for Ubuntu 47.0+ or equivalent)

Abstract
-----------
This project is a refactoring of arithmetic, via a new data-type (PlaceValue) which represents base-agnostic arithmetic via numbers whose digits are real. The effects of this refactoring are manifold.

Mathematical computations can be thought of as coming in two varieties: numerical and symbolic. Numerical has an advantage of being simple. Symbolic has an advantage of addressing a larger class of objects. The PlaceValue data-type (having characteristics of each of these varieties) manifests both advantages.

In much the same way that Heaviside with his Operational Calculus was able to reduce calculus to algebra, PlaceValue reduces algebra to arithmetic. By transitivity, calculus is reduced to arithmetic. Given that there are actually multiple reduction avenues available for each step, this transitive reduction turns out to be robust.

The reduction of differential equations comes with little effort. Quantum mechanics, with its two standard formulations of wave mechanics & matrix mechanics, admits a corresponding third formulation PlaceValue Mechanics.

For machine learning, convolutional networks (at least any convolutional layer of them) can be reduced to a single instance of a PlaceValue. Given that one of the four basic arithmetic operators * is essentially a convolution, this also comes with little surprise. Training this layer (i.e. deconvolution) quickly reduces to PlaceValue division.

One of the happiest gains afforded by the PlaceValue data-type is in its formulation of Measure Theory. Measure Theory has traditionally been rather limited by its reliance on measures as real numbers. Extensions relaxing this constraint have not gained wide acceptance. Using PlaceValue, the Borel-Kolmogorov paradox is quickly resolved as it was essentially an unfortunate (but necessary) consequence of a lossy type cast from PlaceValue to real.

The ease with which this data-type (including its corresponding functions and above applications) can and has been implemented in computer software can be thought of as stemming from formal language theory and PlaceValue’s underlying grammar type. Numerical types can be thought of as regular grammars, and instances of those types (numbers) can be regarded as regular expressions. Symbolic expressions, on the other hand, generally cannot and so are handled by the more complex context-free grammars, which are a superset of regular grammars. PlaceValue can be considered a regular grammar, and so admits a simple computational approach.

As all classical computation is as true for silicon hardware as it is for bio hardware, the same efficiency gains also hold for both mental and hand computations.

Introduction
------------
The convolution theorem allows for complicated operations to be performed by re-representing data (in a form that is often simpler) as well as re-representing the operation to be performed (in a form that is often simpler). This theorem has simplified many computational schemes, and is exploited by PlaceValue.

In Mathematica, we may represent the variable x as something like an expression tree of height 1 consisting a root node of type variable. We could then ask Mathematica x*x and it could represent that as an expression tree of height 2 with a root node of type operator with 2 child nodes of type variable.

In MATLAB, we may represent the variable x as something like [0,1,2,3,4,5,6,7,8,9]. We could then ask MATLAB x * x (actually x.*x) and it could return [0,1,4,9,16,25,36,49,64,81].

PlaceValue offers an alternate approach. We may represent MATLAB's x = [0,1,2,3,4,5,6,7,8,9] by a Fourier-type Transform of x = [0, 1]. PlaceValue can calculate x*x by calculating [0, 1] * [0, 1] = [0, 0, 1]. This is nothing more than 10 * 10 = 100.

By building a data-type whose base operations are constructed to take advantage of such efficiencies, many applications which are handled in an otherwise convoluted manner may now be handled in an elegant manner.

PlaceValue
---------------
<i>PlaceValue</i> is a data-type for representing base-agnostic arithmetic via numbers whose digits are real. Consider 1/11. In base ten, 1/11 = .090909… . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

The PlaceValue data-type transcends this problem by dividing in a base-agnostic way. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

WholePlaceValue
------------------------
The base class (by composition) for PlaceValue is <i>WholePlaceValue</i>. WholePlaceValue is supposed to be an analogue of integers. WholePlaceValue uses only positive powers of the base. For WholePlaceValue, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base-agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

Rational
---------------
<i>Rational.js</i> is used to represent fractions. WholePlaceValue uses them as its digits. In order to ensure that WholePlaceValue is able to operate without round off errors, its digits need to be immune to round off errors. Rational.js has a base ten integer representing a numerator, and another base ten integer representing a denominator. As a not to be relied on perk, Rational.js renders sufficient irrational approximations as their symbolic counterpart like τ (i.e. 2π). Other points of interest are that whereas IEEE's only representation for Infinity and NaN are as a kludge of special cases as specified by the IEEE Standard for Floating-Point Arithmetic (IEEE 754), Rational.js can handle them elegantly with neither kludges nor exceptions by simply failing to go through the pains of alienating number pairs like 1,0 and 0,0 respectively.

Complex
-----------
<i>complex.js</i> is a datatype for representing complex numbers. WholePlaceValue can use Complex to represent WholePlaceValue's digits. For example: ii * 2 = 2́2́. Imaginary digits look like regular digits but with a dot on top. Complex.js is basically implemented as a pair of numeric instance variables (for real and imaginary components) with instance functions appropriately defined to manipulate (carry out complex arithmetic on) its instance variables.

SparsePlaceValue1
------------------------
<i>SparsePlaceValue1</i> is a 1D data-type optimized for sparse PlaceValues. Consider 1e9 + 2e-9. We could store this like 1000000000.000000002. SparsePlaceValue1 stores it like this [[1,9],[2,-9]]. The storage gains are apparent. There are also computational gains. Furthermore, a seemingly serendipitous gain is the ability to store numbers like 1e9.5 + 2e-9. This comes in especially handy when dealing with radicals and other similar expressions.

RationalComplex
---------------
<i>rationalcomplex.js</i> is a datatype for representing complex numbers. It represents complex numbers as pairs of rational. It has all of the capabilities of complex.js, without the round-off errors.

PlaceValueRatio
------------------
<i>PlaceValueRatio</i> is a PlaceValue data-type reminiscent of rational numbers. It is a ratio of 2 WholePlaceValues. For example, 1/11 is stored as a pair 1,11. 11/1 is stored as a pair 11,1. Multiplication occurs element-wise yielding 11,11. Results are automatically simplified via Euclid's algorithm to 1,1. Finally text rendering yields 1/1. PlaceValueRatio avoids round off errors that regular PlaceValue does not. For example, for PlaceValue 1/11 = 0.1<s>1</s>1<s>1</s>... but 11 * 0.1<s>1</s>1<s>1</s>... = 1.00001 .

SparsePlaceValueRatio1
------------------
<i>SparsePlaceValueRatio1</i> is a sparse version of PlaceValueRatio. It is a ratio of 2 SparsePlaceValue1s. PlaceValueRatio can handle numbers like 1/11. SparsePlaceValueRatio1 would handle that as 1 / 1E1+1. SparsePlaceValueRatio1 can handle more exotic ratios such as 1 / 1E½+1 .

Polynomial1
-------------
<i>polynomial1.js</i> is a 1D datatype for representing polynomials; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to polynomial arithmetic. Polynomial arithmetic uses a placeholder x. PlaceValue arithmetic dispenses with this placeholder.

<i>polynomial1.html</i> is a demo for polynomial1.js.

SparsePolynomial1
------------------------
<i>SparsePolynomial1</i> is a data-type optimized for sparse Polynomials; an application of the SparsePlaceValue1 datatype.

If SparsePolynomial1 wants to calculate (x^100 + 1)^2, then it asks SparsePlaceValue1 to calculate:

(1E100 + 1) ^ 2 = 1E200 + 2E100 + 1

SparsePolynomial1 then formats SparsePlaceValue1's result as x^200 + 2x^100 + 1.

If SparsePolynomial1 wants to calculate (x^.5 + 1)^2, then it asks SparsePlaceValue1 to calculate:

(1E.5 + 1) ^ 2 = 1E1 + 2E.5 + 1

SparsePolynomial1 then formats SparsePlaceValue1's result as x + 2x^.5 + 1.

PolynomialRatio1
-------------
<i>polynomialratio1.js</i> is a datatype for representing ratios of polynomials (also known as rational functions); an application of the PlaceValueRatio datatype.

If PolynomialRatio1 wants to calculate (x^4-4x^3+4x^2-3x+14)/(x^4+8x^3+12x^2+17x+6), then it asks PlaceValueRatio to calculate:

1<s>4</s>4<s>3</s>⑭ / 18⑫⑰6 = 1<s>5</s>7/173

PolynomialRatio1 then formats PlaceValueRatio's result as (x^2-5x+7)/(x^2+7x+3).

Sparse Polynomial Ratio 1
-------------
<i>sparsepolynomialratio1.js</i> is a sparse version of PolynomialRatio1; an application of the SparsePlaceValueRatio1 datatype.

If SparsePolynomialRatio1 wants to calculate (x^.5-1)/(x-1), then it asks SparsePlaceValueRatio1 to calculate:

1E½-1 / 1E1-1 = 1 / 1E½+1

SparsePolynomialRatio1 then formats SparsePlaceValueRatio1's result as 1/(x^½+1).

WholePlaceValue2
------------------------
<i>WholePlaceValue2</i> is a 2D version of WholePlaceValue. Whereas WholePlaceValue can be used to represent base-agnostic arithmetic for 1 base, WholePlaceValue2 can be used to represent base agnostic arithmetic for 2 bases. WholePlaceValue2 is used by <i>Polynomial2</i>. If Polynomial2 wants to calculate x+y, then it asks WholePlaceValue2 to calculate:
<pre>
     1    1
10 + 0 = 10
</pre>
Polynomial2 then formats WholePlaceValue2's result as x+y.

If Polynomial2 wants to calculate (x+y)^2, then it asks WholePlaceValue2 to calculate:
<pre>
            1
 1    1    20
10 * 10 = 100
</pre>
Polynomial2 then formats WholePlaceValue2's result as x^2+2xy+y^2 .

Polynomial2 can be thought of as nothing more than an algebraic looking interface to an underlying arithmetic calculation in WholePlaceValue2. Polynomial2 can be thought of as merely aliasing the axes of WholePlaceValue2 with common names like x & y. Something similar can be said for Polynomial1.

Polynomial2
-------------
<i>polynomial2.js</i> is a 2-D datatype for representing polynomials; an application of the WholePlaceValue2 datatype.

The WholePlaceValue2 data-type is particularly well-suited to 2-D polynomial arithmetic. Polynomial arithmetic uses placeholders like x & y. WholePlaceValue2 arithmetic dispenses with these placeholders.

If Polynomial2 wants to calculate (x+h)^2, then it asks WholePlaceValue2 to calculate:
<pre>
                   1
       1          20
( 10 + 0 ) ^ 2 = 100
</pre>
Polynomial2 then formats WholePlaceValue2's result as x^2+2x*h+h^2.

If Polynomial2 wants to calculate ((x+h)^2 - x^2)/h|0, then it asks WholePlaceValue2 to calculate:
<pre>
 1
20 | 0 = 20
</pre>
Polynomial2 then formats WholePlaceValue2's result as 2x.

<i>polynomial2.html</i> is a demo for polynomial2.js.

Laurent Polynomial
-------------------
<i>laurent.js</i> is a datatype for representing Laurent polynomials; an application of the PlaceValue datatype. Laurent polynomials are like regular polynomials except that their powers can be negative. For example, 1/x = x^-1 is a Laurent polynomial, not the normal kind of polynomial. Whereas Polynomial1.js inherited (by composition) from WholePlaceValue, Laurent.js inherits from PlaceValue. This is because WholePlaceValue represents places to the left of the decimal point (radix point) which are positive (or zero) powers, which is good for representing polynomials of positive (or zero) power. Laurent on the other hand, needs negative powers which PlaceValue represents as digits to the right of the radix point. Laurent polynomials are reduced to user interfaces for PlaceValue.

PlaceValue2
-------------------
<i>placevalue2.js</i> is a 2D version of PlaceValue, or a floating point version of WholePlaceValue2 (actually implemented this way). PlaceValue2 is used by <i>Laurent2.js</i>. If Laurent Multinomial wants to calculate (x+h)^2/h, then it asks PlaceValue2 to calculate:
<pre>
  1                 1
 20                20
100 E0 / 1 E0,1 = 100 E0,-1
</pre>
Laurent Multinomial then formats PlaceValue2's result as x^2h^-1+2x+h .

Laurent Multinomials are nothing more than a UI for PlaceValue2.

Laurent Multinomial
-------------------
<i>laurent2.js</i> is a datatype for representing Laurent multinomials; an application of the PlaceValue2 datatype. Laurent multinomials are like regular multinomials except that their powers can be negative. For example, y/x = y*x^-1 is a Laurent multinomial, not the normal kind of multinomial. Whereas Laurent.js inherited (by composition) from PlaceValue, Laurent2.js inherits from PlaceValue2. This is because PlaceValue represents places to the left or right of the decimal point (radix point) which are powers of a base, which is good for representing single variable polynomials. Laurent2 on the other hand, needs powers of 2 different bases which PlaceValue2 represents as digits to the left (or on top) of the radix point. Laurent multinomials are reduced to skins for PlaceValue2.

SparsePlaceValue2
------------------------
<i>SparsePlaceValue2.js</i> is a 2D data-type optimized for sparse PlaceValue2's. The PlaceValue2:
<pre>
500 
000
</pre>
is represented as the SparsePlaceValue2: 5E2,1 .

SparsePlaceValue
------------------------
<i>SparsePlaceValue.js</i> is a data-type optimized for sparse PlaceValues. Whereas, SparsePlaceValue1 can handle 1D situations such as 1E2, and SparsePlaceValue2 can handle 2D situations such as 1E2,3 , SparsePlaceValue can handle an arbitrary number of dimensions such as 1E2,3,4 . SparsePlaceValue accepts Rational, Complex, or RationalComplex digits.

SparsePolynomial
------------------------
<i>SparsePolynomial</i> is a data-type optimized for sparse Polynomials; an application of the SparsePlaceValue datatype.

If SparsePolynomial wants to calculate (x+y)*z, then it asks SparsePlaceValue to calculate:

(1E1 + 1E0,1) * 1E0,0,1 = 1E1,0,1 + 1E0,1,1

SparsePolynomial then formats SparsePlaceValue's result as x*z + y*z.

SparsePlaceValueRatio
------------------
<i>SparsePlaceValueRatio</i> is a sparse version of PlaceValueRatio. It is a ratio of 2 SparsePlaceValues. PlaceValueRatio can handle numbers like 1/11. SparsePlaceValueRatio would handle that as 1 / 1E1+1. SparsePlaceValueRatio can handle more exotic ratios such as 1 / 1E3,4+1 . SparsePlaceValueRatio accepts Rational, or RationalComplex digits.

Sparse Polynomial Ratio
-------------
<i>sparsepolynomialratio.js</i> is a sparse version of Polynomial Ratio; an application of the SparsePlaceValueRatio datatype.

If SparsePolynomialRatio wants to calculate (x^2+2x*y+y^2)/(x^2-y^2), then it asks SparsePlaceValueRatio to calculate:

1E2+2E1,1+1E0,2 / 1E2-1E0,2 = 1E1,-1+1 / 1E1,-1-1

SparsePolynomialRatio then formats SparsePlaceValueRatio's result as (x \* y^-1+1) / (x * y^-1-1).

Exponential
-----------
<i>exponential.js</i> is a datatype for representing exponentials; an application of the PlaceValue datatype. Exponentials are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^x or e^y. Exponential.js is little more than an exponential (or hyperbolic trigonometric) looking skin for an underlying PlaceValue datatype. Exponential takes an input like exp(2x) and stores it as 100 base e^x. It can then render it on demand in the exponential looking form exp(2x). Exponential also recognizes hyperbolic trig functions like cosh(x), which it stores as ½0.½ base e^x, and renders on demand as cosh(x). Likewise sinh(x), which it stores as ½0.<s>½</s>, and renders on demand as sinh(x).
If Exponential wants to calculate sinh(x)+cosh(x), then it asks PlaceValue to calculate:

½0.<s>½</s> + ½0.½ = 10

Exponential then formats PlaceValue's result as exp(x) .

Exponentials are nothing more than a veneer for PlaceValue.

SparseExponential1
------------------------
<i>SparseExponential1</i> is a data-type optimized for sparse Exponentials; an application of the SparsePlaceValue1 datatype. SparseExponential1 is like Exponential except that it uses a sparse PlaceValue. Exponential's reliance on PlaceValue's integer powers of its base (like 100 means base^2) allows for integer powers of e^x (like e^2x). However, SparseExponential1's reliance on SparsePlaceValue1's non-integer powers of its base (like 1E2.5 means base^2.5) allows for non-integer powers of e^x (like e^2.5x).

SparseExponential
-------------------------
<i>SparseExponential</i> is a data-type optimized for Sparse Exponentials; an application of the SparsePlaceValue datatype.

If SparseExponential wants to calculate exp(x) * exp(y), then it asks SparsePlaceValue to calculate:

1E1 * 1E0,1 = 1E1,1

SparseExponential then formats SparsePlaceValue's result as exp(x+y).

If SparseExponential wants to calculate exp(x) * cis(y), then it asks SparsePlaceValue to calculate:

1E1 * 1E0,i = 1E1,i

SparseExponential then formats SparsePlaceValue's result as exp(x+(i)y).

SparseExponentialRatio1
------------------------
<i>SparseExponentialRatio1</i> is a data-type optimized for ratios of Sparse Exponentials; an application of the SparsePlaceValueRatio1 datatype. Consider the problem of storing tanh. tanh = sinh / cosh. cosh = ½0.½. sinh = ½0.<s>½</s>. Dividing them results in the repeating placevalue 1.0<s>2</s>02... . Storing that in a placevalue is problematic. So we store it in a data-type constructed specifically for the storage of ratios of placevalues: PlaceValueRatio. Now we can store tanh exactly. ½0.<s>½</s>/½0.½ reduces to the PlaceValueRatio 10<s>1</s>/101. To be accurate, SparseExponentialRatio1 uses SparsePlaceValueRatio1 not PlaceValueRatio so it is stored sparsely as 1E2-1 / 1E2+1.

SparseExponentialRatio
------------------------
<i>SparseExponentialRatio.js</i> is a data-type optimized for ratios of Sparse Exponentials. Whereas, SparseExponentialRatio1 uses SparsePlaceValueRatio1, SparseExponentialRatio uses SparsePlaceValueRatio. Therefore, SparseExponentialRatio1 can handle 1D situations such as tan(x), while SparseExponentialRatio can handle an arbitrary number of variables such as tan(x+y+z). SparseExponentialRatio accepts Rational, & RationalComplex.

SparseExpression1
------------------------
<i>SparseExpression1</i> is a data-type optimized for sparse Polynomials & Exponentials; an application of the SparsePlaceValue1 datatype. SparseExpression1 can represent whatever SparsePolynomial1 or SparseExponential1 can. It does this by using bases like x or e^x.

SparseExpression
------------------------
<i>SparseExpression</i> is a data-type optimized for sparse Polynomials & Exponentials; an application of the SparsePlaceValue datatype. SparseExpression can represent whatever SparsePolynomial or SparseExponential can. It does this by using bases like x or e^x.

SparseExpressionRatio1
------------------------
<i>SparseExpressionRatio1</i> is a data-type optimized for ratios of Sparse Expressions; an application of the SparsePlaceValueRatio1 datatype. SparseExpressionRatio1 can represent whatever SparsePolynomialRatio1 or SparseExponentialRatio1 can. It does this by using bases like x or e^x.

SparseExpressionRatio
------------------------
<i>SparseExpressionRatio</i> is a data-type optimized for ratios of Sparse Expressions; an application of the SparsePlaceValueRatio datatype. SparseExpressionRatio can represent whatever SparsePolynomialRatio or SparseExponentialRatio can. It does this by using bases like x or e^x.

Fourier
-----------
<i>fourier.js</i> is a datatype for representing complex exponentials; an application of the PlaceValue(Complex) datatype. Fouriers are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^ix or e^iy. Fourier.js is little more than a complex exponential (or circular trigonometric) looking skin for an underlying PlaceValue datatype. Fourier takes an input like cis(2x) and stores it as 100 base e^ix. It can then render it on demand in the complex exponential looking form cis(2x). Fourier also recognizes circular trig functions like cos(x), which it stores as ½0.½ base e^ix, and renders on demand as cos(x). Likewise sin(x), which it stores as <s>½</s>̉0.½̉  base e^xi, and renders on demand as sin(x).
If Fourier wants to calculate sin(x)*cos(x), then it asks PlaceValue to calculate:

<s>½</s>̉0.½̉  * ½0.½ = <s>¼</s>̉00.0¼̉ 

Fourier then formats PlaceValue's result as 0.5sin(2x) .

Fouriers are nothing more than a veneer for PlaceValue.

Laplace
--------
<i>laplace.js</i>. If Laplace wants to solve 1*Df(x)+1*f(x)=0 then it calculates 1/(s+1), then it asks PlaceValue(Complex) to calculate:

1 / 11 = 0.1<s>1</s>1<s>1</s> base s

Laplace then formats PlaceValue(Complex)'s result as exp(-x) .

Viewing the Laplace transform of exp(-x) [ which is 1/(s+1) ] as the fraction 1 / 11 has advantages. Specifically, viewing the 1/11 in the expanded form 0.1<s>1</s>1<s>1</s> . We can see from the expanded form what appear to be the Taylor Coefficients of the Taylor expansion of exp(-x) [ however without the factorial denominators ] . Specifically, what we are seeing is the derivatives of the function exp(-x) , since the Taylor coefficients are the derivatives including the factorials. Another (though perhaps not best) way to say this for those familiar with generating functions, is that the Laplace Transform is the generating function of the derivatives. Without PlaceValue this nature of the Laplace Transform would be more difficult to see (partly because of the overhead of placeholder variables). Furthermore, we can see why the Laplace Transform should be capable of representing a function: because having all the derivatives of a function at point is enough to represent a typical function, as one familiar with Taylor Series knows. Note: it should be noted that Laplace seems to have chosen a different sign convention than generating functions, further obscuring the symmetry.

WholePlaceValueComplex2
------------------------
<i>wholeplacevaluecomplex2.js</i> is a version of WholePlaceValue2 where the digits are allowed to be complex. One display innovation of this data-type is in its elegant representation of its complex digits. The complex digits are displayed in angle-magnitude form so as to save space. So, to represent a single digit whose value is twice the imaginary unit (a.k.a. 2i) we would render the character ② rotated by 90°. This way many such digits may be placed in a relatively small space without clutter. Apart from merely having a clutter free representation, this representation allows us to see otherwise obscured patterns. For example, Laplace's complex number s which has the property of differentiating anything that it multiplies, exposes its circular character in this representation (albeit only in 1 quadrant, for all 4 see ComplexPlaceValue). Whereas in a+bi form it looks like this:

<table><tbody><tr><td>2+2i</td><td>1+2i</td><td>2i</td></tr><tr><td>2+i</td><td>1+i</td><td>i</td></tr><tr><td>2</td><td>1</td><td>0</td></tr></tbody></table>

ComplexPlaceValue
-------------------
Whereas, placevalue extended wholeplacevalue by allowing for negative exponents to the right of the decimal point, <i>complexplacevalue.js</i> extends placevalue by allowing for imaginary exponents above the decimal point and negative imaginary exponents below the decimal point. ComplexPlaceValue also allows for the digits themselves to be complex. ComplexPlaceValue is implemented as a floating point version of <i>wholeplacevaluecomplex2.js</i> (via composition). ComplexPlaceValue finds a natural application in the ComplexExponential data type base e<sup>x</sup> where the horizontal axis represents real powers of e<sup>x</sup> to represent things such as cosh(x), and the vertical axis represents imaginary powers of e<sup>x</sup> to represent things like cos(x). Laplace's complex number s, which has the property of differentiating anything that it multiplies, exposes its full circular character in this representation. Whereas in a+bi form it looks like this:

<table>
<tr><td>2+2i</td><td>1+2i</td><td>0+2i</td><td>-1+2i</td><td>-2+2i</td></tr>
<tr><td>2+1i</td><td>1+1i</td><td>0+1i</td><td>-1+1i</td><td>-2+1i</td></tr>
<tr><td>2+0i</td><td>1+0i</td><td>0+0i</td><td>-1+0i</td><td>-2+0i</td></tr>
<tr><td>2-1i</td><td>1-1i</td><td>0-1i</td><td>-1-1i</td><td>-2-1i</td></tr>
<tr><td>2-2i</td><td>1-2i</td><td>0-2i</td><td>-1-2i</td><td>-2-2i</td></tr>
</table>

ComplexLaurent
---------------
<i>complexlaurent.js</i> is an algebraic looking skin for ComplexPlaceValue. Whereas ComplexPlaceValue is base agnostic, ComplexLaurent provides a base (x or otherwise) so as to provide a user interface for complex algebra. While the lettered bases are interesting, more interesting are the exponential bases found in the ComplexExponential data-type.

Complex Exponential
--------
Whereas <i>exponential.js</i> provided a hyperbolic trigonometric interface, and <i>fourier.js</i> provided a circular trigonometric interface, <i>complexexponential.js</i> provides both hyperbolic and circular trig in one interface. Whereas Exponential provided 1 axis for real powers of e<sup>x</sup>, and Fourier provided 1 axis for imaginary powers of e<sup>x</sup>, ComplexExponential provides a horizontal axis for real powers of e<sup>x</sup>, and a vertical axis for imaginary powers of e<sup>x</sup>. For example, exp(x)+cos(x) is represented via ComplexPlaceValue as

<pre>
0½
10.
0½
</pre>

It can be differentiated by pointwise multiplication by <i>s</i>. Yielding:

<table>
<tr><td>0</td><td>i/2</td></tr>
<tr><td>1</td><td>.0</td></tr>
<tr><td>0</td><td><s>i/2</s></td></tr>
</table>

This ComplexPlaceValue is then rendered by ComplexExponential.js as -sin(x)+exp(x).

Zero
-----------
<i>Zero.html</i> demonstrates PlaceValue's automatic & natural ability to model what can be called weak & strong zero for use in such things as indicator functions, something real numbers could not handle both uniformly and correctly. Normally, if you want a multiplicative coefficient value to alternately select values that you want and reject values that you don't want you use 0 & 1. This works great to reject a value like 3, you just give it a coefficient of 0, and get a contribution of 0 * 3 = 0. However, if you want to reject a value like infinity, this does not work so well. 0 * ∞ = % . This has lead some authors to write that they mean strongly zero, as opposed to this weakly zero which can be subverted by some inputs. It is a nice idea. However, it is often merely assumed that strongly zero works though there doesn't seem to be a number that it corresponds to, or that we must invoke a new ad hoc operator which maps any input (even undefined) to the number zero. Proofs that this operator plays nice are usually non-existent and left to the reader.

PlaceValue automatically comes with instances which would correspond to these strong and weak zero, and not in an ad hoc way (in fact, it would require extra work to get rid of them, and that work would be ad hoc). First, let's consider 0 * ∞ = % . This would be represented by PlaceValue internally as [0] * [∞] = [%] . These would be 1-digit PlaceValues. What PlaceValue X would we need to satisfy X * Y = X , for all (even exotic) Y ? It is hard to find a 1-digit PlaceValue that works. Similarly, for more than 1 digit. However, we don't need so many digits. A 0-digit PlaceValue suffices. [] * [∞] = [] . The so-called strong zero is merely the PlaceValue [] .

CAS
-----------
<i>CAS.html</i> which stands for either Computer Algebra System (for the algebraic looking UI) or Computer Arithmetic System (for the under the hood arithmetic implementation) is a demo for Laurent Polynomial, Multinomial & Exponential.

Calculator
--------------
<i>calculator.html</i> demonstrates a 4+ function calculator that toggles between Rational, Complex, and RationalComplex digit mode, and furthermore toggles between integer mode (WholePlaceValue) , real mode (PlaceValue) , rational mode (PlaceValueRatio) , polynomial mode (Polynomial1 & Polynomial2) , Laurent polynomial mode (Laurent Polynomial) , Laurent multinomial mode (Laurent Multinomial), and Exponential mode (Exponential).

Differentiator
----------------
<i>differentiator.html</i> is an extension of calculator that allows for easy input of functions to differentiate. <i>differentiator.html</i> does a text transform of an input. It replaces x with (x+h), subtracts the original, divides by h, then applies the "|" operator by 0. For example for x^2, it does ((x+h)^2-x^2)/h | 0. This is nothing more than using calculator.html in (Laurent) multinomial mode using ((x+h)^2-x^2)/h as the first argument, | as the operator, and 0 as the second argument. Notice that | allows for differentiation. | does not distribute over the other arithmetic operators. h/h | 0 yields 1, whereas (h|0)/(h|0) yields NaN. This allows for differentiation without a dependency on calculus but only algebra (actually only arithmetic). It is also more elegant. h/h yields 1 uniformly, instead of 1 sometimes except for a hole in the line at 0. Traditionally differentiation is impossible with only algebra, requiring complicated arguments to redefine the undefined hole in exactly the way it should have been defined in the first place. PlaceValue avoids undefining h/h|0 with all the mess that it causes, and instead treats division without any special cases. The only loss is that | doesn't distribute over the other arithmetic operators. The limit from calculus is seen as just a post hoc corrected version of | that needed to be defined to replace | because | never should have distributed over other arithmetic operators to begin with. h/h being 1 without exception is not a kludge but results from the underlying base-agnostic arithmetic. The numerator h is represented as 10. The denominator h is represented by 10. PlaceValue performs a base-agnostic arithmetic calculation 10/10 yields 1. The base-agnostic aspect of the PlaceValue datatype is its greatest strength.

Calculus
--------
<i>calculus.html</i> is an extension of differentiator that supports (complex) exponentials, and allows for both differentiation and integration. Differentiation proceeds in a Laplace like manner. The derivative of exp(kx) is k * exp(kx). The derivative of cis(kx) is ki*cis(kx). Differentiation of Sums of such Exponentials is achieved by multiplying each exponential in the sum by their respective k. Compactly, PlaceValue implements this as pointwise multiplication by …3210.<s>123</s>… , or 3̉2̉i0.<s>i</s><s>2</s>̉<s>3</s> in the imaginary case, or in the general complex case by:

<table>
<tr><td>2+2i</td><td>1+2i</td><td>0+2i</td><td>-1+2i</td><td>-2+2i</td></tr>
<tr><td>2+1i</td><td>1+1i</td><td>0+1i</td><td>-1+1i</td><td>-2+1i</td></tr>
<tr><td>2+0i</td><td>1+0i</td><td>0+0i</td><td>-1+0i</td><td>-2+0i</td></tr>
<tr><td>2-1i</td><td>1-1i</td><td>0-1i</td><td>-1-1i</td><td>-2-1i</td></tr>
<tr><td>2-2i</td><td>1-2i</td><td>0-2i</td><td>-1-2i</td><td>-2-2i</td></tr>
</table>

If Exponential wants to differentiate sinh(x) + 7, then it asks PlaceValue to calculate:

½7.<s>½</s> ⊗ 10.<s>1</s> = ½0.½

Exponential then formats PlaceValue's result as cosh(x) .

Integration is achieved by reversing the pointwise multiplication with pointwise division.

If Exponential wants to integrate cosh(x), then it asks PlaceValue to calculate:

½0.½ ⊘ 10.<s>1</s> = ½%.<s>½</s>

Exponential then formats PlaceValue's result as sinh(x) + NaN.

If Fourier wants to differentiate sin(x) + 7, then it asks PlaceValue(Complex) to calculate:

<s>½</s>̉7.½̉ ⊗ i0.<s>i</s> = ½0.½

Fourier then formats PlaceValue(Complex)'s result as cos(x) .

Integration is achieved by reversing the pointwise multiplication with pointwise division.

If Fourier wants to integrate cos(x), then it asks PlaceValue(Complex) to calculate:

½0.½ ⊘ i0.<s>i</s> = <s>½</s>̉%.½̉

Fourier then formats PlaceValue's result as sin(x) + NaN.

The NaN is not a mistake. It's a spectacular success. The pointwise division of the 0 in the one's place of ½0.½, with the 0 in the one's place of 10.<s>1</s>, yields 0/0 which placevalue represents as %. Exponential represents this as NaN (Not a Number). 0/0 is an underconstrained number. This underconstrained constant is what is normally understood as the Constant of Integration.

DiffEq
---------------

<i>diffeq.html</i> solves differential equations of the form D<sup>n</sup>f(x) + kf(x) = 0. Dividing both sides by D<sup>n</sup> + k it solves f(x) = 0 / D<sup>n</sup> + k. Or more precisely f(x) = 0 ⊘ ( D<sup>n</sup> ⊕ k ). But it doesn't get f(x) = 0.
For example, D<sup>2</sup>f(x) + -1f(x) = 0. f(x) = 0 ⊘ D<sup>2</sup> ⊕ -1. f(x) = 0 ⊘ 4210.124 ⊕ -1. f(x) = 0 ⊘ 310<s>1</s>.013. f(x) = %0.% base e<sup>x</sup>. f(x) = NaN * exp(x) + NaN * exp(-x). Meaning an arbitrary constant times exp(x) plus an arbitrary constant times exp(-x). With slight modification, diffeq.html also supports Fourier, ComplexExponential, and Laplace solution.

Determinant
-----------------------

<i>determinant.html</i> demonstrates an application of PlaceValue to problems in linear algebra.

The determinant of a matrix is the n-volume of the parallelotope formed from the column vectors of that matrix. Classically, if one of the parallelotope's sides is of length zero then the entire n-volume is zero. This has the effect of destroying information. 

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

PlaceValue can represent multiple measure scales, as in a unit cube 1000, and a unit square 100. In fact, in determinant.html we demonstrate that Cramer's Rule continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0).

Measure
------------
<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. Measure theory typically chooses a certain region to normalize as the unit measure. All other regions are assigned a compatible real number that represents the measure of that region. However, since there are only a relatively small amount of real numbers, this poses problems. For example, many different sets of many different sizes are all labeled as a set of measure zero.

If we assign a measure of 1 to the unit-square, then we are forced not only to label a single point as having a measure of 0, but we are also forced to label a unit line-segment as having measure 0. Attempting to circumvent this issue by instead normalizing by assigning a measure of 1 to the unit line-segment forces us to label a unit-square as having measure ∞. Either normalization is unsatisfactory. This raises problems in, for example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

PlaceValue being larger avoids these rounding errors. Using PlaceValue we can model the measure of a point as the PlaceValue 1. Similarly, we can model the measure of a unit line-segment as the PlaceValue 10. Similarly, we can model the measure of a unit-square as the PlaceValue 100. 1, 10, and 100 represent the zeroth, first, and second powers of an arbitrary base respectively. In general we can model a unit n-dimensional object as 10^n.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero. In fact, in measure.html we demonstrate that Bayes' Theorem continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0 or 0*∞).

measure.html demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox. Using PlaceValue, the conditional probability of being on a point on either a longitudinal or latitudinal great circle is .τ<sup>-1</sup> (where τ=2π).

Fractal
------------
<i>fractal.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of defining measures over fractals.

In measure.html, we saw that we can model the measure of a unit n-dimensional object as 10^n. This is well-modeled as a PlaceValue.

Fractals are not of integer dimension. For example, Cantor Dust is lg<sub>3</sub>2 ~ ⅗ dimensional. We can model the measure of a unit Cantor-Dust as the SparsePlaceValue 1E⅗.

PlaceValue Mechanics
----------------------
PlaceValue Mechanics is a refactoring of Quantum Mechanics based on the PlaceValue data-type. The two other classical versions of Quantum Mechanics are Matrix Mechanics and Wave Mechanics. Both suffer from issues relating to sparseness. Both data-types allow for large numbers of parameters of which only a painfully small subset amount to actual states in the theory. Consider for example the Heisenberg Matrix:

<table>
<tr><td>0</td><td>&radic;1</td><td>0</td><td>0</td><td>&hellip;</td></tr>
<tr><td>&radic;1</td><td>0</td><td>&radic;2</td><td>0</td><td>&hellip;</td></tr>
<tr><td>0</td><td>&radic;2</td><td>0</td><td>&radic;3</td><td>&hellip;</td></tr>
<tr><td>0</td><td>0</td><td>&radic;3</td><td>0</td><td>&hellip;</td></tr>
<tr><td>&#8942;</td><td>&#8942;</td><td>&#8942;</td><td>&#8942;</td><td>&#8945;</td></tr>
</table>

It's a doubly infinite matrix. Almost every element is 0. It's got about 2 non-zero rows out of a countably infinite number of zero rows. It's not the most economical storage scheme. Its storage efficiency is the reciprocal of a countably infinite number.

There's also Wave Mechanics. The model is real valued functions of a real variable. You can describe an uncountably infinite number of states of which only a countable number are interesting. The sparseness is even worse than Matrix Mechanics because it's now the reciprocal of an uncountably infinite number.

In PlaceValue Mechanics, PlaceValue States are represented as 1-D scalars. Furthermore, Laplace inspired refactorings make due with only the rationals (a countable set). For example, the relatively compact encoding .10<s>1</s>0&hellip; represents an eigenstate of parity, a superposition of 2 momentum states, a completely smeared out position.

Apart from compression considerations, there are pedagogical considerations (dependencies). You cannot teach Wave Mechanics without Calculus. You cannot teach Matrix Mechanics without Linear Algebra. Too many dependencies have to be installed, before you can install either of these two versions of Quantum Mechanics.

PlaceValue Mechanics (like the rest of PlaceValue arithmetic), depends only on arithmetic.

Say, you want to apply a momentum operator to our state .10<s>1</s>0&hellip;. Simply multiply by i0, yielding i.0<s>i</s>0i&hellip;. It's basically the constant i, times Laplace's derivative operator s (in this case 10 base s), times our state of interest. Had we simply wanted the derivative of our state it would be 10 * .10<s>1</s>0&hellip; = 1.0<s>1</s>01&hellip;

The position operator is almost as beautiful. It shifts right instead of left (i.e. .1 instead of 10), but has the necessity of pointwise scaling by .012345&hellip; . Applied to our state .10<s>1</s>0&hellip; the position operator yields .030<s>5</s>0&hellip; .

We actually have enough now to show Heisenberg's Uncertainty Principle. And do just that in <i>Mechanics.html</i>. For pedagogical simplicity (and without loss of generality) we do it with the pseudo-momentum operator 10, and the true momentum operator i0. Formally, we show xp-px=iħ. Or in natural units, xp-px=i. Furthermore, since the factor i plays no interesting part in xp-px (while it does play an interesting part in the Schrodinger Equation with the sign of p^2), we also show a simplified construction with xp-px=1.

In Wave Mechanics, Heisenberg's Uncertainty Principle follows from the fact that the derivative operator doesn't commute with multiplication by x. Which is ungraspable without calculus. It is somewhat more elegant in Matrix Mechanics, where Heisenberg's Uncertainty Principle follows from the fact that Matrix Multiplication is not always commutative, and specifically is not for position and momentum matrices. This is ungraspable without linear algebra. In PlaceValue mechanics, Heisenberg's Uncertainty Principle follows from the fact that arithmetic multiplication doesn't commute with an even more naive kind of multiplication (point-wise multiplication [12⊗34=38]). This is graspable in elementary school.

<i>mechanics2.html</i> is a different refactoring of Q.M. . Whereas mechanics.html was based on the Laplace inspired data-type laplace.js, mechanics2.html is based on the Fourier inspired data-type fourier2.js. Whereas mechanics.html's underlying data-type laplace.js was inspired by the Laplace transform, mechanics2.html's underlying data-type fourier2.js is not inspired by the Fourier transform but the Fourier series, and a 2D version at that. One benefit of mechanics2.html is the ease of representing multidimensional space-time states as integers, albeit 2D integers. For example, ψ(x)=exp(i(2x+t)) is

<pre>
100
000
</pre> 

One downside of this economy appears to be that fourier2.js as used by mechanics2.html is not large enough to handle all quantum states of interest (i.e. solutions of the Schrödinger Equation), whereas laplace.js as used by mechanics.html is large enough (at least in the 1D case). The quantum states that mechanics2 can represent can be plugged into the Schrödinger Equation and checked to see what value of mass that solution has (admittedly a backward kind of situation). But that's what you get for its barebones approach which may be better for pedagogical and academic purposes than for anything else. Mechanics.html on the other hand allows for full normal forward solution of the Schrödinger Equation, as one would expect.

ConvNet
------------
<i>convnet.html</i> is a demo for convolutional learning. As PlaceValue multiplication is convolutional by nature, PlaceValue division is deconvolutional by nature. There is however an unfortunate asymmetry in its naive definition of division. 1/11 = 0.1<s>1</s>1<s>1</s>... sums inverse powers of its agnostic base. This results in a convergent series when the base is greater than 1, but a divergent series when the base is less than 1. This elicits a new kind of division to restore symmetry. The old division may be called right division as new digits are continually added to the right to complete the sum. This is somewhat arbitrary, and problematic for bases less than 1. A solution is a new kind of division: left division. ...1<s>1</s>1<s>1</s>1 = 1 \ 11 . For bases less than 1, this sums positive powers of its base and yields a convergent sum.

What kind of division would be appropriate for deconvolution? Right division would asymmetrically magnify remainder differences indefinitely to the right in a way that is not logically convergent for convolutional learning. Left division suffers similar problems but in the other direction. They are both really overfitting noise. What deconvolution really needs is a balance between the 2 that does not accumulate error indefinitely on either side. Deconvolution needs a kind of center division that best fits noise into the middle without diverging off either end. Many plausible approaches may come to mind to suit such constraints. We take a rather naive approach of the best linear approximation of an overdetermined system. This can be understood as solving Ax=b for a matrix A with more rows than columns, and so A is not classically invertible. We solve the system via the Moore-Penrose pseudoinverse. In other words, we do a least squares approximation. Using this definition of center division, we find that 1 ÷ 11 = 1.

The value of 1 ÷ 11 may not be of particular interest. Getting a filter to learn edge detection automatically may be. A simple edge may be represented by a number like 11110000. The edge is seen at the fifth position. The filter we seek would output 10000 to indicate that the edge is in position 5. So, we seek some filter f such that f x 11110000 = 10000. Solving for f : f = 10000 ÷ 11110000. This yields the desired well-known filter 1<s>1</s>.

Generating Functions
---------------------
<i>generatingfunction.html</i> is a demo for generating functions.

Consider 1/<s>1</s>1 = 11111. This expresses succinctly what generating functions express unsuccinctly and asymmetrically with 2 different data-types (sequence & function) as well as needlessly introducing a placeholder variable (x). That is, the sequence 1,1,1,1,1 has the generating function 1/(1-x).

Consider 101 = 101. This expresses succinctly what generating functions express unsuccinctly and asymmetrically with 2 different data-types (sequence & function) as well as needlessly introducing a placeholder variable (x). That is, the sequence 1,0,1 has the generating function x^2+1.

Generating functions could be useful if you were adept at manipulating algebraic expressions, and you wanted to translate that power into the domain of sequences. However, it requires you to pay the extra cognitive overhead of making one-way translations asymmetrically back and forth from one domain to a different domain. It also results in having twice as many theorems etc. (one for each domain).

Possibly the worst part is that it moves attention away from seeing symmetries inside the domain (you can think of this as patterns intrinsic to the terrain of study) toward seeing symmetries between domains (you can think of this as patterns you see between two different maps that you made of the same terrain). In other words, we shift from studying the terrain, to studying idiosyncratic properties of maps, that have no bearing on the terrain.

Using PlaceValue, we can see immediately that if 1/<s>1</s>1 = 11111 then we should also have another equation 1/11111 = <s>1</s>1 . This is an example of the so-called intrinsic symmetry (of the terrain). Trying to see this simple symmetry, using the needlessly complicated maps of the formalism of generating functions is prohibitively expensive.

The astute reader might note the sign issue that I magicked over. I wrote 1/<s>1</s>1 = 11111. This is not quite true. 1/<s>1</s>1 = .<s>11111</s> . So, the sign is different. Unfortunately, the powers are also different because of the position of the base point. Instead of using /, I really should have used \ . I should write 1\ <s>1</s>1 = 11111. Now it's right. In short, to model generating functions as PlaceValue use \ instead of /. In long, don't model generating functions; know when to use / and when to use \ .

Summary
---------
PlaceValue is an intuitive and powerful data-type that can handle a wide range of academically relevant use-cases.

Future Work
------------
Consider a list of whole numbers. It would look something like this : [0,1,2,3,...] . There is a naturalness to the fact that the first number that you encounter when reading the list also happens to be the first whole number. There is also a naturalness to the ... being at the end meaning they continue in 'this' way (the word 'this' here is a backward reference to the sequence already read, and so already recognized). Alternatively we could write [...,3,2,1,0]. There is an unnaturalness to the fact that the last number that you encounter when reading the list happens to be the first whole number. There is also an unnaturalness to the ... being at the beginning meaning they continue in 'this' way (the word 'this' here is a forward reference to the sequence not yet read, and so not yet recognized).

When the list is laid out in the same order as the reading order there are good outcomes; when it is not there are bad outcomes. This may seem so obvious as not to mention. I wouldn't write the word duck as kcud because then I have to scan forward to pronounced the d first then scan backward to pronounce the rest. Some things are so obvious they go without saying, until you see someone break the convention, then we are forced to talk about it.

Apparently we inherited our number system from Arabs. They followed the convention of writing the numbers in the same order that they read in. As it happens, they read in a different order, but this shouldn't matter. Unfortunately, due to broken convention during translation, now it matters a lot. When translating out of Arabic, the word order was correctly translated, but the number order was not translated. This had the unfortunate effect of reversing the number order. Whereas, the number twelve should have been translated to 21 (first the smallest digit, then the next smallest, ...) it was wrongly translated as 12. Written as 21 you know immediate the weight of the value 2 and move on. With the mistranslation, you have to read ahead just to find the weight of each digit. Also instead of starting with the bounded sized end we start with the unbounded sized end.

I have kept this bizarre mistranslation convention in my work so the number twelve is written as 12. This has made coding inelegant, by forcing me to break the symmetry of my code with intermittent calls to the reverse() function (as well as writing some for-loops backwards), diverting my attention off the task at hand with this constant mental overhead, of broken translation. This is all to serve the user, who I assume has likely grown up with a backwards convention.

For future work, I would clean the code by removing the overhead of intermittent calls to the reverse() function (as well as rewriting backwards for-loops). This would present the number twelve as 21, which is better in the long run.

Dependencies
---------------
<table>
<tr><td>SparseExponential1</td><td>depends on Sparse Polynomial1</td><td></td><td>depends on SparsePlaceValue1</td><td>depends on Rational or Complex or RationalComplex.</td></tr>
<tr><td>SparseExpression1</td><td>depends on Sparse Polynomial1</td><td></td><td>depends on SparsePlaceValue1</td><td>depends on Rational or Complex or RationalComplex.</td></tr>
<tr><td>SparseExponential</td><td>depends on Sparse Polynomial</td><td></td><td>depends on SparsePlaceValue</td><td>depends on Rational or Complex or RationalComplex.</td></tr>
<tr><td>SparseExpression</td><td>depends on Sparse Polynomial</td><td></td><td>depends on SparsePlaceValue</td><td>depends on Rational or Complex or RationalComplex.</td></tr>
<tr><td>Sparse Polynomial Ratio 1</td><td></td><td>depends on Sparse PlaceValueRatio1</td><td>depends on SparsePlaceValue1</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Sparse Exponential Ratio 1</td><td></td><td>depends on Sparse PlaceValueRatio1</td><td>depends on SparsePlaceValue1</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Sparse Expression Ratio 1</td><td></td><td>depends on Sparse PlaceValueRatio1</td><td>depends on SparsePlaceValue1</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Sparse Polynomial Ratio</td><td></td><td>depends on Sparse PlaceValueRatio</td><td>depends on SparsePlaceValue</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Sparse Exponential Ratio</td><td></td><td>depends on Sparse PlaceValueRatio</td><td>depends on SparsePlaceValue</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Sparse Expression Ratio</td><td></td><td>depends on Sparse PlaceValueRatio</td><td>depends on SparsePlaceValue</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Polynomial1</td><td></td><td></td><td>depends on WholePlaceValue</td><td>depends on Rational or Complex or RationalComplex.</td></tr>
<tr><td>PolynomialRatio1</td><td></td><td>depends on PlaceValueRatio</td><td>depends on WholePlaceValue</td><td>depends on Rational or RationalComplex.</td></tr>
<tr><td>Exponential &amp; Fourier</td><td>depends on Laurent</td><td>depends on PlaceValue</td><td>depends on WholePlaceValue</td><td>depends on Rational.</td></tr>
<tr><td>Fourier &amp; Laplace</td><td></td><td>depends on PlaceValue</td><td>depends on WholePlaceValue</td><td>depends on Complex.</td></tr>
<tr><td>Polynomial2</td><td></td><td></td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>Laurent2</td><td></td><td>depends on PlaceValue2</td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>Complex Exponential &amp; Fourier2</td><td>depends on Complex Laurent</td><td>depends on ComplexPlaceValue</td><td>depends on Whole PlaceValueComplex2.</td><td></td></tr>
</table>

External Dependencies
----------------------
<a target='_blank' href='http://jquery.com'>jQuery</a> & <a href='http://mathjs.org'>mathjs</a>

System Requirements
--------------------
A standards-compliant browser (Firefox for Ubuntu 47.0+ or equivalent)
