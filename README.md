Author : Anthony John Ripa

Date : 9/30/2016

<a href='https://github.com/TonyRipa/PlaceValue'>https://github.com/TonyRipa/PlaceValue</a>

Live Demo at <a target='_blank' href='http://placevalue.neocities.org/'>http://placevalue.neocities.org/</a> (Need Firefox for Ubuntu 47.0+ or equivalent)

Abstract
-----------
This project is a refactoring of arithmetic, via a new data-type (PlaceValue) which represents base agnostic arithmetic via numbers whose digits are real. The effects of this refactoring are manifold.

Mathematical computations can be thought of as coming in two varieties: numerical and symbolic. Numerical has an advantage of being simple. Symbolic has an advantage of addressing a larger class of objects. The PlaceValue data-type (having characteristics of each of these varieties) manifests both advantages.

In much the same way that Heaviside with his Operational Calculus was able to reduce calculus to algebra, PlaceValue reduces algebra to arithmetic. By transitivity, calculus is reduced to arithmetic. Given that there are actually multiple reduction avenues available for each step, this transitive reduction turns out to be robust.

The reduction of differential equations comes with little effort. Quantum mechanics, with its two standard formulations of wave mechanics & matrix mechanics, admits a corresponding third formulation PlaceValue Mechanics.

For machine learning, convolutional networks (at least any convolutional layer of them) can be reduced to a single instance of a PlaceValue. Given that one of the four basic arithmetic operators * is essentially a convolution, this also comes with little surprise. Training this layer (i.e. deconvolution) quickly reduces to PlaceValue division.

One of the happiest gains afforded by the PlaceValue data-type is in its formulation of Measure Theory. Measure Theory has traditionally been rather limited by its reliance on measures as real numbers. Extensions relaxing this constraint have not gained wide acceptance. Using PlaceValue, the Borel-Kolmogorov paradox is quickly resolved as it was essentially an unfortunate (but necessary) consequence of a lossy type cast from PlaceValue to real.

The ease with which this data-type (including its corresponding functions and above applications) can and has been implemented in computer software can be thought of as stemming from formal language theory and PlaceValue’s underlying grammar type. Numerical types can be thought of as regular grammars, and instances of those types (numbers) can be regarded as regular expressions. Symbolic expressions, on the other hand, generally cannot and so are handled by the more complex context-free grammars, which are a superset of regular grammars. PlaceValue can be considered a regular grammar, and so admits a simple computational approach.

As all classical computation is as true for silicon hardware as it is for bio hardware, the same efficiency gains also hold for both mental and hand computations.

Introduction
==========
The convolution theorem allows for complicated operations to be performed by re-representing data (in a form that is often simpler) as well as re-representing the operation to be performed (in a form that is often simpler). This theorem has simplified many computational schemes, and is exploited by PlaceValue.

In Mathematica, we may represent the variable x as something like an expression tree of height 1 consisting a root node of type variable. We could then ask Mathematica x*x and it could represent that as an expression tree of height 2 with a root node of type operator with 2 child nodes of type variable.

In MATLAB, we may represent the variable x as something like [0,1,2,3,4,5,6,7,8,9]. We could then ask MATLAB x*x (actually x.*x) and it could return [0,1,4,9,16,25,36,49,64,81].

PlaceValue offers an alternate approach. We may represent MATLAB's x = [0,1,2,3,4,5,6,7,8,9] by a Fourier-type Transform of x = [0, 1]. PlaceValue can calculate x*x by calculating [0, 1] * [0, 1] = [0, 0, 1]. This is nothing more than 10 * 10 = 100.

By building a data-type whose base operations are constructed to take advantage of such efficiencies, many applications which are handled in an otherwise convoluted manner may now be handled in an elegant manner.

PlaceValue
---------------
<i>PlaceValue</i> is a data-type for representing base agnostic arithmetic via numbers whose digits are real. Consider 1/11. In base ten, 1/11 = .090909.. . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

The PlaceValue data-type transcends this problem by dividing in a base agnostic. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

WholePlaceValue
------------------------
The base class (by composition) for PlaceValue is <i>WholePlaceValue</i>. WholePlaceValue is supposed to be an analogue of integers. WholePlaceValue uses only positive powers of the base. For WholePlaceValue, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

Rational
---------------
<i>Rational.js</i> is used to represent fractions. WholePlaceValue uses them as its digits. In order to ensure that WholePlaceValue is able to operate without round off errors, its digits need to be immune to round off errors. Rational.js has a base ten integer representing a numerator, and another base ten integer representing a denominator. As a not to be relied on perk, Rational.js renders sufficient irrational approximations as their symbolic counterpart like τ (i.e. 2π). Other points of interest are that whereas IEEE's only representation for Infinity and NaN are as a kludge of special cases as specified by the IEEE Standard for Floating-Point Arithmetic (IEEE 754), Rational.js can handle them elegantly with neither kludges nor exceptions by simply failing to go through the pains of criminalizing number pairs like 1,0 and 0,0 respectively.

SparsePlaceValue
------------------------
<i>SparsePlaceValue</i> is a data-type optimized for sparse PlaceValues. Consider 1e9 + 2e-9. We could store this like 1000000000.000000002. SparsePlaceValue stores it like this [[1,9],[2,-9]]. The storage gains are apparent. There are also computational gains. Furthermore, a seemingly serendipitous gain is the ability to store numbers like 1e9.5 + 2e-9. This comes in especially handy when dealing with radicals and other similar expressions.

PlaceValueRatio
------------------
<i>PlaceValueRatio</i> is a PlaceValue data-type reminiscent of rational numbers. It is a ratio of 2 WholePlaceValues. For example, 1/11 is stored as a pair 1,11. 11/1 is stored as a pair 11,1. Multiplication occurs element-wise yielding 11,11. Results are automatically simplified via euclid's algorithm 1,1. Finally text rendering yields 1/1. PlaceValueRatio avoids round off errors that regular PlaceValue does not. For example, for PlaceValue 1/11 = 0.1<s>1</s>1<s>1</s>... but 11 * 0.1<s>1</s>1<s>1</s>... = 1.00001 .

Polynomial
-------------
<i>polynomial.js</i> is a datatype for representing polynomials; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to polynomial arithmetic. Polynomial arithmetic uses a placeholder x. PlaceValue arithmetic dispenses with this placeholder.

<i>polynomial.html</i> is a demo for polynomial.js.

Polynomial Ratio
-------------
<i>polynomialratio.js</i> is a datatype for representing ratios of polynomials (also known as rational functions); an application of the PlaceValueRatio datatype.

If PolynomialRatio wants to calculate (x^4-4x^3+4x^2-3x+14)/(x^4+8x^3+12x^2+17x+6), then it asks PlaceValueRatio to calculate:

1<s>4</s>4<s>3</s>⑭ / 18⑫⑰6 = 1<s>5</s>7/173

PolynomialRatio then formats PlaceValueRatio's result as (x^2-5x+7)/(x^2+7x+3).

Multinomial
-------------
<i>multinomial.js</i> is a datatype for representing multinomials; an application of the WholePlaceValue2 datatype.

The PlaceValue data-type is particularly well-suited to multinomial arithmetic. Multinomial arithmetic uses placeholders like x & y. PlaceValue arithmetic dispenses with these placeholders.

<i>multinomial.html</i> is a demo for multinomial.js.

WholePlaceValue2
------------------------
<i>WholePlaceValue2</i> is a 2D version of WholePlaceValue. Whereas WholePlaceValue can be used to represent base agnostic arithmetic for 1 base, WholePlaceValue2 can be used to represent base agnostic arithmetic for 2 bases. WholePlaceValue2 is used by <i>Multinomial</i>. If Multinomial wants to calculate x+y, then it asks WholePlaceValue2 to calculate:
<pre>
     1    1
10 + 0 = 10
</pre>
Multinomial then formats WholePlaceValue2's result as x+y.

If Multinomial wants to calculate (x+y)^2, then it asks WholePlaceValue to calculate:
<pre>
            1
 1    1    20
10 * 10 = 100
</pre>
Multinomial then formats WholePlaceValue2's result as x+2xy+y .

Multinomial can be thought of as nothing more than an algebraic looking interface to an underlying arithmetic calculation in WholePlaceValue2. Multinomial can be thought of as merely aliasing the axes of WholePlaceValue2 with common names like x & y. Something similar can be said for polynomial.

Laurent Polynomial
-------------------
<i>laurent.js</i> is a datatype for representing Laurent polynomials; an application of the PlaceValue datatype. Laurent polynomials are like regular polynomials except that their powers can be negative. For example 1/x = x^-1 is a Laurent polynomial, not the normal kind of polynomial. Whereas Polynomial.js inherited (by composition) from WholePlaceValue, Laurent.js inherits from PlaceValue. This is because WholePlaceValue represents places to the left of the decimal point (radix point) which are positive (or zero) powers, which is good for representing polynomials of positive (or zero) power. Laurent on the other hand, needs negative powers which PlaceValue represents as digits to the right of the radix point. Laurent polynomials are reduced to user interfaces for PlaceValue.

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
<i>laurent2.js</i> is a datatype for representing Laurent multinomials; an application of the PlaceValue2 datatype. Laurent multinomials are like regular multinomials except that their powers can be negative. For example y/x = y*x^-1 is a Laurent multinomial, not the normal kind of multinomial. Whereas Laurent.js inherited (by composition) from PlaceValue, Laurent2.js inherits from PlaceValue2. This is because PlaceValue represents places to the left or right of the decimal point (radix point) which are powers of a base, which is good for representing single variable polynomials. Laurent2 on the other hand, needs powers of 2 different bases which PlaceValue2 represents as digits to the left (or on top) of the radix point. Laurent multinomials are reduced to skins for PlaceValue2.

Exponential
-----------
<i>exponential.js</i> is a datatype for representing exponentials; an application of the PlaceValue datatype. Exponentials are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^x or e^y. Exponential.js is little more than an exponential (or hyperbolic trigonometric) looking skin for an underlying PlaceValue datatype. Exponential takes an input like exp(2x) and stores it as 100 base e^x. It can then render it on demand in the exponential looking form exp(2x). Exponential also recognizes hyperbolic trig functions like cosh(x), which it stores as ½0.½ base e^x, and renders on demand as cosh(x). Likewise sinh(x), which it stores as ½0.<s>½</s>, and renders on demand as sinh(x).
If Exponential wants to calculate sinh(x)+cosh(x), then it asks PlaceValue to calculate:

½0.<s>½</s> + ½0.½ = 10

Exponential then formats PlaceValue's result as exp(x) .

Exponentials are nothing more than a veneer for PlaceValue.

PlaceValueComplex
-------------------
<i>placevaluecomplex.js</i> is a complex version of PlaceValue. PlaceValueComplex is used by <i>Fourier.js</i>. If Fourier wants to calculate sin(x)^2, then it asks PlaceValueComplex to calculate:

<s>½</s>̉0.½̉ base e<sup>xi</sup> ^ 2 = <s>¼</s>0½.0<s>¼</s> base e<sup>xi</sup>

Fourier then formats PlaceValueComplex's result as -0.5cos(2x)+.5 .

Fouriers are nothing more than a veneer for PlaceValueComplex.

WholePlaceValueComplex
------------------------
The base class (by composition) for PlaceValueComplex is <i>WholePlaceValueComplex</i>. WholePlaceValueComplex is supposed to be an analogue of integers. WholePlaceValueComplex uses only positive powers of the base. For WholePlaceValueComplex, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1. We also allow for imaginary digits ii * 2 = 2̉2̉. Imaginary digits look like regular digits but with a dot on top.

Complex
-----------
<i>complex.js</i> is a datatype for representing complex numbers. WholePlaceValueComplex uses Complex to represent WholePlaceValueComplex's digits. Complex.js is basically implemented as a pair of numeric instance variables (for real and imaginary components) with instance functions appropriately defined to manipulate (carry out complex arithmetic on) its instance variables.

Fourier
-----------
<i>fourier.js</i> is a datatype for representing complex exponentials; an application of the PlaceValueComplex datatype. Fouriers are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^ix or e^iy. Fourier.js is little more than a complex exponential (or circular trigonometric) looking skin for an underlying PlaceValue datatype. Fourier takes an input like cis(2x) and stores it as 100 base e^ix. It can then render it on demand in the complex exponential looking form cis(2x). Fourier also recognizes circular trig functions like cos(x), which it stores as ½0.½ base e^ix, and renders on demand as cos(x). Likewise sin(x), which it stores as <s>½</s>̉0.½̉  base e^xi, and renders on demand as sin(x).
If Fourier wants to calculate sin(x)*cos(x), then it asks PlaceValue to calculate:

<s>½</s>̉0.½̉  * ½0.½ = <s>¼</s>̉00.0¼̉ 

Fourier then formats PlaceValue's result as 0.5sin(2x) .

Fouriers are nothing more than a veneer for PlaceValue.

WholePlaceValueComplex2
------------------------
<i>wholeplacevaluecomplex2.js</i> is a version of WholePlaceValue2 where the digits are allowed to be complex. One display innovation of this data-type is in its elegant representation of its complex digits. The complex digits are displayed in angle-magnitude form so as to save space. So, to represent a single digit whose value is twice the imaginary unit (a.k.a. 2i) we would render the character ② rotated by 90°. This way many such digits may be placed in a relatively small space without clutter. Apart from merely having a clutter free representation, this representation allows us to see otherwise obscured patterns. For example, Laplace's complex number s which has the property of differentiating anything that it multiplies, exposes its circular character in this representation (albeit only in 1 quadrant, for all 4 see ComplexPlaceValue). Whereas in a+bi form it looks like this:

<table><tbody><tr><td>2+2i</td><td>1+2i</td><td>2i</td></tr><tr><td>2+i</td><td>1+i</td><td>i</td></tr><tr><td>2</td><td>1</td><td>0</td></tr></tbody></table>

ComplexPlaceValue
-------------------
Whereas, placevalue extended wholeplacevalue by allowing for negative exponents to the right of the decimal point, <i>complexplacevalue.js</i> extends placevalue by allowing for imaginary exponents above the decimal point and negative imaginary exponents below the decimal point. ComplexPlaceValue (like PlaceValueComplex) also allows for the digits themselves to be complex. ComplexPlaceValue is implemented as a floating point version of <i>wholeplacevaluecomplex2.js</i> (via composition). ComplexPlaceValue finds a natural application in the ComplexExponential data type base e<sup>x</sup> where the horizontal axis represents real powers of e<sup>x</sup> to represent things such as cosh(x), and the vertical axis represents imaginary powers of e<sup>x</sup> to represent things like cos(x). Laplace's complex number s, which has the property of differentiating anything that it multiplies, exposes its full circular character in this representation. Whereas in a+bi form it looks like this:

<table>
<tr><td>2+2i</td><td>1+2i</td><td>0+2i</td><td>-1+2i</td><td>-2+2i</td></tr>
<tr><td>2+1i</td><td>1+1i</td><td>0+1i</td><td>-1+1i</td><td>-2+1i</td></tr>
<tr><td>2+0i</td><td>1+0i</td><td>0+0i</td><td>-1+0i</td><td>-2+0i</td></tr>
<tr><td>2-1i</td><td>1-1i</td><td>0-1i</td><td>-1-1i</td><td>-2-1i</td></tr>
<tr><td>2-2i</td><td>1-2i</td><td>0-2i</td><td>-1-2i</td><td>-2-2i</td></tr>
</table>

ComplexLaurent
---------------
<i>complexlaurent.js</i> is an algebraic looking skin for ComplexPlaceValue. Whereas ComplexPlaceValue is base agnostic, ComplexLaurent provides a base (x or otherwise) so as to provide a user interface for complex algebra. Lettered bases are interesting, but not nearly as interesting as the exponential bases found in the ComplexExponential data-type.

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

CAS
-----------

<i>CAS.html</i> which stands for either Computer Algebra System (for the algebraic looking UI) or Computer Arithmetic System (for the under the hood arithmetic implementation) is a demo for Laurent Polynomial, Multinomial & Exponential.

Calculator
--------------
<i>calculator.html</i> demonstrates a 4+ function calculator that toggles between integer mode (WholePlaceValue) , real mode (PlaceValue) , polynomial mode (Polynomial) , multinomial mode (Multinomial) , Laurent polynomial mode (Laurent Polynomial) , Laurent multinomial mode (Laurent Multinomial), Exponential mode (Exponential), Imaginary Exponential mode (Fourier), and Complex Exponential mode (Complex Exponential).

Differentiator
----------------
<i>differentiator.html</i> is an extension of calculator that allows for easy input of functions to differentiate. <i>differentiator.html</i> does a text transform of an input. It replaces x with (x+h), subtracts the original, divides by h, then applies the "|" operator by 0. For example for x^2, it does ((x+h)^2-x^2)/h | 0. This is nothing more than using calculator.html in (Laurent) multinomial mode using ((x+h)^2-x^2)/h as the first argument, | as the operator, and 0 as the second argument. Notice that | allows for differentiation. | does not distribute over the other arithmetic operators. h/h | 0 yields 1, whereas (h|0)/(h|0) yields NaN. This allows for differentiation without a dependency on calculus but only algebra (actually only arithmetic). It is also more elegant. h/h yields 1 uniformly, instead of 1 sometimes except for a hole in the line at 0. Traditionally differentiation is impossible with only algebra, requiring complicated arguments to redefine the undefined hole in exactly the way it should have been defined in the first place. PlaceValue avoids undefining h/h|0 with all the mess that it causes, and instead treats division without any special cases. The only loss is that | doesn't distribute over the other arithmetic operators. The limit from calculus is seen as just a post hoc corrected version of | that needed to be defined to replace | because | never should have distributed over other arithmetic operators to begin with. h/h being 1 without exception is not a kludge but results from the underlying base agnostic arithmetic. The numerator h is represented as 10. The denominator h is represented by 10. PlaceValue performs a base-agnostic arithmetic calculation 10/10 yields 1. The base agnostic aspect of the PlaceValue datatype is its greatest strength.

Calculus
--------
<i>calculus.html</i> is an extension of differentiator that supports (complex) exponentials, and allows for both differentiation and integration. Differentiation proceeds in a Laplace like manner. The derivative of exp(kx) is k*exp(kx). The derivative of cis(kx) is ki*cis(kx). Differentiation of Sums of such Exponentials is achieved by multiplying each exponential in the sum by their respective k. Compactly, PlaceValue implements this as pointwise multiplication by …3210.<s>123</s>… , or 3̉2̉i0.<s>i</s><s>2</s>̉<s>3</s> in the imaginary case, or in the general complex case by:

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

If Fourier wants to differentiate sin(x) + 7, then it asks PlaceValueComplex to calculate:

<s>½</s>̉7.½̉ ⊗ i0.<s>i</s> = ½0.½

Fourier then formats PlaceValueComplex's result as cos(x) .

Integration is achieved by reversing the pointwise multiplication with pointwise division.

If Fourier wants to integrate cos(x), then it asks PlaceValueComplex to calculate:

½0.½ ⊘ i0.<s>i</s> = <s>½</s>̉%.½̉

Fourier then formats PlaceValue's result as sin(x) + NaN.

The NaN is not a mistake. It's a spectacular success. The pointwise division of the 0 in the one's place of ½0.½, with the 0 in the one's place of 10.<s>1</s>, yields 0/0 which placevalue represents as %. Exponential represents this as NaN (Not a Number). 0/0 is an underconstrained number. This underconstrained constant is what is normally understood as the Constant of Integration.

DiffEq
---------------

<i>diffeq.html</i> solves differential equations of the form D<sup>n</sup>f(x) + kf(x) = 0. Dividing both sides by D<sup>n</sup> + k it solves f(x) = 0 / D<sup>n</sup> + k. Or more precisely f(x) = 0 ⊘ ( D<sup>n</sup> ⊕ k ). But it doesn't get f(x) = 0.
For example, D<sup>2</sup>f(x) + -1f(x) = 0. f(x) = 0 ⊘ D<sup>2</sup> ⊕ -1. f(x) = 0 ⊘ 4210.124 ⊕ -1. f(x) = 0 ⊘ 310<s>1</s>.013. f(x) = %0.% base e<sup>x</sup>. f(x) = NaN*exp(x)+NaN*exp(-x). With slight modification, it now also supports Fourier, ComplexExponential, and Laplace solution.

Determinant
-----------------------

<i>determinant.html</i> demonstrates an application of PlaceValue to problems in linear algebra.

The determinant of a matrix is the n-volume of the parallelotope formed from the column vectors of that matrix. Classically, if one of the parallelotope's sides is of length zero then the entire n-volume is zero. This has the effect of destroying information. 

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

PlaceValue can represent multiple measure scales, as in a unit cube 1000, and a unit square 100. In fact, in determinant.html we demonstrate that Cramer's Rule continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0).

Measure
------------
<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

In fact, in measure.html we demonstrate that Bayes' Theorem continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0 or 0*∞).

measure.html demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox. Using PlaceValue, the conditional probability of being on a point on either a longitudinal or latitudinal great circle is .τ<sup>-1</sup> (where τ=2π).

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

It's a doubly infinite matrix. Almost every element is 0. It's got about 2 non-zero rows out of a countably infinite number of zero rows. It's not the most economical storage scheme. It's storage efficiency is the reciprocal of a countably infinite number.

There's also Wave Mechanics. The model is real valued functions of a real variable. You can describe an uncountably infinite number of states of which only a countable number are interesting. The sparseness is even worse than Matrix Mechanics because it's now the reciprocal of an uncountably infinite number.

In PlaceValue Mechanics, PlaceValue States are represented as 1-D scalars. Furthermore, Laplace inspired refactorings make due with only the rationals (a countable set). For example, the relatively compact encoding .10<s>1</s>0&hellip; represents an eigenstate of parity, a superposition of 2 momentum states, a completely smeared out position.

Apart from compression considerations, there are pedagogical considerations (dependencies). You cannot teach Wave Mechanics without Calculus. You cannot teach Matrix Mechanics without Linear Algebra. Too many dependencies have to be installed, before you can install either of these two versions of Quantum Mechanics.

PlaceValue Mechanics (like the rest of PlaceValue arithmetic), depends only on arithmetic.

Say, you want to apply a momentum operator to our state .10<s>1</s>0&hellip;. Simply multiply by i0, yielding i.0<s>i</s>0i&hellip;. It's basically the constant i, times Laplace's derivative operator s (in this case 10 base s), times our state of interest. Had we simply wanted the derivative of our state it would be 10 * .10<s>1</s>0&hellip; = 1.0<s>1</s>01&hellip;

The position operator is almost as beautiful. It shifts right instead of left (i.e. .1 instead of 10), but has the necessity of pointwise scaling by .012345&hellip; . Applied to our state .10<s>1</s>0&hellip; the position operator yields .030<s>5</s>0&hellip; .

We actually have enough now to show Heisenberg's Uncertainty Principle. And do just that in <i>Mechanics.html</i>. For pedagogical simplicity (and without loss of generality) we do it with the pseudo-momentum operator 10, and the true momentum operator i0. Formally, we show xp-px=iħ. Or in natural units, xp-px=i. Furthermore since the factor i plays no interesting part in xp-px (while it does play an interesting part in the Schrodinger Equation with the sign of p^2), we also show a simplified construction with xp-px=1.

In Wave Mechanics, Heisenberg's Uncertainty Principle follows from the fact that the derivative operator doesn't commute with multiplication by x. Which is ungraspable without calculus. It is somewhat more elegant in Matrix Mechanics, where Heisenberg's Uncertainty Principle follows from the fact that Matrix Multiplication is not always commutative, and specifically is not for position and momentum matrices. This is ungraspable without linear algebra. In PlaceValue mechanics, Heisenberg's Uncertainty Principle follows from the fact that arithmetic multiplication doesn't commute with an even more naive kind of multiplication (point-wise multiplication [12⊗34=38]). This is graspable in elementary school.

<i>mechanics2.html</i> is a different refactoring of Q.M. . Whereas mechanics.html was based on the Laplace inspired data-type laplace.js, mechanics2.html is based on the Fourier inspired data-type fourier2.js. Whereas mechanics.html's underlying data-type laplace.js was inspired by the Laplace transform, mechanics2.html's underlying data-type fourier2.js is not inspired by the Fourier transform but the Fourier series, and a 2D version at that. One benefit of mechanics2.html is the ease of representing multidimensional space-time states as integers, albeit 2D integers. For example ψ(x)=exp(i(2x+t)) is

<pre>
100
000
</pre> 

One downside of this economy appears to be that fourier2.js as used by mechanics2.html is not large enough to handle all quantum states of interest (i.e. solutions of the Schrödinger Equation), whereas laplace.js as used by mechanics.html is large enough (at least in the 1D case). The quantum states that mechanics2 can represent can be plugged into the Schrödinger Equation and checked to see what value of mass that solution has (admittedly a backward kind of situation). But that's what you get for its barebones approach which may be better for pedagogical and academic purposes than for anything else. Mechanics.html on the other hand allows for full normal forward solution of the Schrödinger Equation, as one would expect.

ConvNet
------------
<i>convnet.html</i> is a demo for convolutional learning. As PlaceValue multiplication is convolutional by nature, PlaceValue division is deconvolutional by nature. There is however an unfortunate asymmetry in its naive definition of division. 1/11 = 0.1<s>1</s>1<s>1</s>... sums inverse powers of its agnostic base. This results in a convergent series when the base is greater than 1, but a divergent series when the base is less than 1. This elicits a new kind of division to restore symmetry. The old division may be called right division as new digits are continually added to the right to complete the sum. This is somewhat arbitrary, and problematic for bases less than 1. A solution is a new kind of division left division. ...1<s>1</s>1<s>1</s>1 = 1 \ 11 . For bases less than 1, this sums positive powers of its base and yields a convergent sum.

What kind of division would be appropriate for deconvolution? Right division would asymmetrically magnify remainder differences indefinitely to the right in a way that is not logically convergent for convolutional learning. Left division suffers similar problems but in the other direction. They are both really overfitting noise. What deconvolution really needs is a balance between the 2 that does not accumulate error indefinitely on either side. Deconvolution needs a kind of center division that best fits noise into the middle without diverging off either end. Many plausible approaches may come to mind to suit such constraints. We take a rather naive approach of the best linear approximation of an overdetermined system. This can be understood as solving Ax=b for a matrix A with more rows than columns, and so A is not classically invertible. We solve the system via the Moore-Penrose pseudoinverse. In other words, we do a least squares approximation. Using this definition of center division we find that 1 ÷ 11 = 1.

The value of 1 ÷ 11 may not be of particular interest. Getting a filter to learn edge detection automatically may be. A simple edge may be represented by a number like 11110000. The edge is seen at the fifth position. The filter we seek would output 10000 to indicate that the edge is in position 5. So, we seek some filter f such that f x 11110000 = 10000. Solving for f : f = 10000 ÷ 11110000. This yields the desired well known filter 1<s>1</s>.

Dependencies
---------------
<table>
<tr><td>Polynomial</td><td></td><td></td><td>depends on WholePlaceValue</td><td>depends on Rational.</td></tr>
<tr><td>PolynomialRatio</td><td></td><td>depends on PlaceValueRatio</td><td>depends on WholePlaceValue</td><td>depends on Rational.</td></tr>
<tr><td>Exponential&amp;Fourier</td><td>depends on Laurent</td><td>depends on PlaceValue</td><td>depends on WholePlaceValue</td><td>depends on Rational.</td></tr>
<tr><td>Fourier&amp;Laplace</td><td></td><td>depends on PlaceValueComplex</td><td>depends on WholePlaceValueComplex</td><td>depends on Complex.</td></tr>
<tr><td>Multinomial</td><td></td><td></td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>Laurent2</td><td></td><td>depends on PlaceValue2</td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>ComplexExponential &amp; Fourier2</td><td>depends on ComplexLaurent</td><td>depends on ComplexPlaceValue</td><td>depends on WholePlaceValueComplex2.</td><td></td></tr>
</table>

External Dependencies
----------------------
<a href='http://jquery.com'>jQuery</a> & <a href='http://mathjs.org'>mathjs</a>

System Requirements
--------------------
A standards-compliant browser (Firefox for Ubuntu 47.0+ or equivalent)
