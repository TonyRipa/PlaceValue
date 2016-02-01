Author : Anthony John Ripa

Date : 1/31/2016

Introduction
==========
This project is a refactoring of arithmetic, via a new data-type which represents base agnostic arithmetic via numbers whose digits are real.

PlaceValue
---------------
<i>PlaceValue</i> is a data-type for representing base agnostic arithmetic via numbers whose digits are real. Why? Consider 1/11. In base ten, 1/11 = .090909.. . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

Why not divide in a base agnostic way? The PlaceValue data-type does. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

WholePlaceValue
------------------------
The base class (by composition) for PlaceValue is <i>WholePlaceValue</i>. WholePlaceValue is supposed to be an analogue of integers. WholePlaceValue uses only positive powers of the base. For WholePlaceValue, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

Polynomial
-------------
<i>polynomial.js</i> is a datatype for representing polynomials; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to polynomial arithmetic. Polynomial arithmetic uses a placeholder x. PlaceValue arithmetic dispenses with this placeholder.

<i>polynomial.html</i> is a demo for polynomial.js.

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
<i>laurent.js</i> is a datatype for representing Laurent polynomials; an application of the PlaceValue datatype. Laurent polynomials are like regular polynomials except that their powers can be negative. For example 1/x = x^-1 is a Laurent polynomial, not the normal kind of polynomial. Whereas Polynomials.js inherited (by composition) from WholePlaceValue, Laurent.js inherits from PlaceValue. This is because WholePlaceValue represents places to the left of the decimal point (radix point) which are positive (or zero) powers, which is good for representing polynomials of positive (or zero) power. Laurent on the other hand, needs negative powers which PlaceValue represents as digits to the right of the radix point. Laurent polynomials are reduced to skins for PlaceValue.

PlaceValue2
-------------------
<i>placevalue2.js</i> is a 2D version of PlaceValue, or a floating point version of WholePlaceValue2 (actually implemented this way). PlaceValue2 is used by <i>Laurent2.js</i>. If Laurent Multinomial wants to calculate (x+h)^2/h, then it asks PlaceValue2 to calculate:
<pre>
  1                 1
 20                20
100 E0 / 1 E0,1 = 100 E0,-1
</pre>
Laurent Multinomial then formats PlaceValue2's result as x^2h^-1+2x+h .

Laurent Multinomials are nothing more than a veneer for PlaceValue2.

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

Fourier
-----------
<i>fourier.js</i> is a datatype for representing complex exponentials; an application of the PlaceValueComplex datatype. Fouriers are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^ix or e^iy. Fourier.js is little more than a complex exponential (or circular trigonometric) looking skin for an underlying PlaceValue datatype. Fourier takes an input like cis(2x) and stores it as 100 base e^ix. It can then render it on demand in the complex exponential looking form cis(2x). Fourier also recognizes circular trig functions like cos(x), which it stores as ½0.½ base e^ix, and renders on demand as cos(x). Likewise sin(x), which it stores as ½0.<s>½</s>, and renders on demand as sin(x).
If Fourier wants to calculate sin(x)*cos(x), then it asks PlaceValue to calculate:

½0.<s>½</s> * ½0.½ = <s>¼</s>̉00.0¼̉ 

Fourier then formats PlaceValue's result as 0.5sin(2x) .

Fouriers are nothing more than a veneer for PlaceValue.

WholePlaceValueComplex2
------------------------
<i>wholeplacevaluecomplex2.js</i> is like a version of WholePlaceValue2 where the digits are allowed to be complex. One display innovation of this data-type is in its elegant representation of its complex digits. The complex digits are displayed in angle-magnitude form so as to save space. So, to represent a single digit whose value is twice the imaginary units (a.k.a. 2i) we would write <span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">②</span>. This way many such digit may be placed in a relatively small space without clutter. Apart from merely having a clutter free representation this representation allows us to see otherwise obscured patterns. For example, Laplace's complex number s which has the property of differentiating anything that it multiplies, exposes its circular character in this representation (albeit only in 1 quadrant, for all 4 see ComplexPlaceValue).

<table style="display:inline-block;border-spacing:0;line-height:80%;text-align:center;"><tbody><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.7853981633974483rad)">③</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.1071487177940904rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">②</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.4636476090008061rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.7853981633974483rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">①</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">Ⓞ</span></td></tr></tbody></table>

ComplexPlaceValue
-------------------
Whereas, placevalue extended wholeplacevalue by allowing for negative exponents to the right of the decimal point, <i>complexplacevalue.js</i> extends placevalue by allowing for imaginary exponents above the decimal point and negative imaginary exponents below the decimal point. ComplexPlaceValue (like PlaceValueComplex) also allows for the digits themselves to be complex. ComplexPlaceValue is implemented as a floating point version of <i>wholeplacevaluecomplex2.js</i> (via composition). ComplexPlaceValue finds a natural application in the Laplace data type base e<sup>x</sup> where the horizontal axis represents real powers of e<sup>x</sup> to represent things such as cosh(x), and the vertical axis represents imaginary powers of e<sup>x</sup> to represent things like cos(x). Laplace's complex number s which has the property of differentiating anything that it multiplies, exposes its full circular character in this representation.

<table style="display:inline-block;border-spacing:0;line-height:80%;text-align:center;"><tbody><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.7853981633974483rad)">③</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.1071487177940904rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(2.0344439357957027rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(2.356194490192345rad)">③</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.4636476090008061rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0.7853981633974483rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(2.356194490192345rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(2.677945044588987rad)">②</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;position:relative"><span style="position:absolute;right:-1px;bottom:-3px">.</span><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">Ⓞ</span></span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(3.141592653589793rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(3.141592653589793rad)">②</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-0.4636476090008061rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-0.7853981633974483rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-1.5707963267948966rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-2.356194490192345rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-2.677945044588987rad)">②</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-0.7853981633974483rad)">③</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-1.1071487177940904rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-1.5707963267948966rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-2.0344439357957027rad)">②</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-2.356194490192345rad)">③</span></td></tr></tbody></table>

ComplexLaurent
---------------
<i>complexlaurent.js</i> is an algebraic looking skin for ComplexPlaceValue. Whereas ComplexPlaceValue is base agnostic, ComplexLaurent provides a base (x or otherwise) so as to provide a user interface for complex algebra. Lettered bases are interesting, but not nearly as interesting as the exponential bases found in the Laplace data-type.

Laplace
--------
Whereas <i>exponential.js</i> provided a hyperbolic trigonometric interface, and <i>fourier.js</i> provided a circular trigonometric interface, <i>laplace.js</i> provides both hyberbolic and circular trig in one interface. Whereas Exponential provided 1 axis for real powers of e<sup>x</sup>, and Fourier provided 1 axis for imaginary powers of e<sup>x</sup>, Laplace provides a horizontal axis for real powers of e<sup>x</sup>, and a vertical axis for imaginary powers of e<sup>x</sup>. For example, exp(x)+cos(x) is represented via ComplexPlaceValue as

<pre>
Ⓞ½
10.
Ⓞ½
</pre>

It can be differentiated by pointwise multiplication by <i>s</i>. Yielding:

<table style="display:inline-block;border-spacing:0;line-height:80%;text-align:center;"><tbody><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">Ⓞ</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(1.5707963267948966rad)">½</span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">①</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;position:relative"><span style="position:absolute;right:-1px;bottom:-3px">.</span><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">Ⓞ</span></span></td></tr><tr><td style="display:inline-block;letter-spacing:-0px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(0rad)">Ⓞ</span></td><td style="display:inline-block;letter-spacing:-1px;padding:0"><span style="display:inline-block;transform-origin:50% 70%;transform:rotate(-1.5707963267948966rad)">½</span></td></tr></tbody></table>

This ComplexPlaceValue is then rendered by Laplace.js as -sin(x)+exp(x).

CAS
-----------

<i>CAS.html</i> which stands for either Computer Algebra System (for the algebraic looking UI) or Computer Arithmetic System (for the under the hood arithmetic implementation) is a demo for Laurent Polynomial, Multinomial & Exponential.

Calculator
--------------
<i>index.html</i> demonstrates a 4+ function calculator that toggles between integer mode (WholePlaceValue) , real mode (PlaceValue) , polynomial mode (Polynomial) , multinomial mode (Multinomial) , Laurent polynomial mode (Laurent Polynomial) , Laurent multinomial mode (Laurent Multinomial), Exponential mode (Exponential), and Complex Exponential mode (Fourier).

Differentiator
----------------
<i>differentiator.html</i> is an extention of calculator that allows for easy input of functions to differentiate. <i>differentiator.html</i> does a text transform of an input. It replaces x with (x+h), substracts the original, divides by h, then applies the "|" operator by 0. For example for x^2, it does ((x+h)^2-x^2)/h | 0. This is nothing more than using calculator.html in (Laurent) multinomial mode using ((x+h)^2-x^2)/h as the first argument, | as the operator, and 0 as the second argument. Notice that | allows for differentiation. | does not distribute over the other arithmetic operators. h/h | 0 yields 1, whereas (h|0)/(h|0) yeilds NaN. This allows for differentiation without a dependency on calculus but only algebra (actually only arithmetic). It is also more elegant. h/h yields 1 uniformly, instead of 1 sometimes except for a hole in the line at 0. Traditionally differentiation is impossible with only algebra, requiring complicated arguments to redefine the undefined hole in exactly the way it should have been defined in the first place. PlaceValue avoids undefining h/h|0 with all the mess that it causes, and instead treats division without any special cases. The only loss is that | doesn't distribute over the other arithmetic operators. The limit from calculus is seen as just a post hoc corrected version of | that needed to be defined to replace | because | never should have distributed over other arithmetic operators to begin with. h/h being 1 without exception is not a kludge but results from the underlying base agnostic arithmetic. The numerator h is represented as 10. The denominator h is represented by 10. PlaceValue performs a base-agnostic arithmetic calculation 10/10 yields 1. The base agnostic aspect of the PlaceValue datatype is its greatest strength.

Calculus
--------
<i>calculus.html</i> is an extension of differentiator that supports (complex) exponentials, and allows for both differentiation and integration. Differentiation procedes in a LaPlace like manner. The derivative of exp(kx) is k*exp(kx). The derivative of cis(kx) is ki*cis(kx). Differentiation of Sums of such Exponentials is achieved by multiplying each exponential in the sum by their respective k. Compactly, PlaceValue implements this as pointwise multiplication by …3210.<s>123</s>… or 3̉2̉i0.<s>i</s><s>2</s>̉<s>3</s> in the complex case.

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

<i>diffeq.html</i> solves differential equations of the form D<sup>n</sup>f(x) + kf(x) = 0. Dividing both sides by D<sup>n</sup> + k is solves f(x) = 0 / D<sup>n</sup> + k. Or more precisely f(x) = 0 ⊘ ( D<sup>n</sup> ⊕ k ). But it doesn't get f(x) = 0.
For example, D<sup>2</sup>f(x) + -1f(x) = 0. f(x) = 0 ⊘ D<sup>2</sup> ⊕ -1. f(x) = 0 ⊘ 4210.124 ⊕ -1. f(x) = 0 ⊘ 310<s>1</s>.013. f(x) = %0.% base e<sup>x</sup>. f(x) = NaN*exp(x)+NaN*exp(-x).

Measure
------------
<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

measure.html demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox.  Using PlaceValue the conditional probability of being on a point on either a longitudinal or latitudinal great circle is .τ<sup>-1</sup> (where τ=2π). 

Dependencies
---------------
Polynomial																		depends on WholePlaceValue.
Exponential&Fourier	depends on Laurent			depends on PlaceValue			depends on WholePlaceValue.
Fourier											depends on PlaceValueComplex	depends on WholePlaceValueComplex.
Multinomial																		depends on WholePlaceValue2.
Laurent2										depends on PlaceValue2			depends on WholePlaceValue2.
Laplace				depends on ComplexLaurent	depends on ComplexPlaceValue	depends on WholePlaceValueComplex2.
