Author : Anthony John Ripa

Date : 10/21/2015

Introduction
==========
This project is a refactoring of arithmetic, via a new data-type which represents base agnostic arithmetic via numbers whose digits are real.

PlaceValue
---------------
<i>PlaceValue</i> is a data-type for representing base agnostic arithmetic via numbers whose digits are real. Why? Consider 1/11. In base ten, 1/11 = .090909.. . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

Why not divide in a base agnostic way? The PlaceValue data-type does. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

WholePlaceValue
------------------------
The base class (by composition) for PlaceValue is <i>WholePlaceValue</i>. WholePlaceValue is supposed to be the analogue of integers. WholePlaceValue uses only positive powers of the base. For WholePlaceValue, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

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
<i>laurent.js</i> is a datatype for representing Laurent polynomials; an application of the PlaceValue datatype. Laurent polynomials are like regular polynomials except that their powers can be negative. For example 1/x = x^-1 is a Laurent polynomial, not the normal kind of polynomial. Whereas Polynomials.js inherited (by composition) from WholePlaceValue, Laurent.js inherits from PlaceValue. This is because WholePlaceValue represents places to the left of the decimal point (radix point) which are positive (or zero) powers, which is right for representing polynomials of positive (or zero) power. Laurent on the other hand, needs negative powers which PlaceValue represents as digits to the right of the radix point. Laurent polynomials are reduced to skins for PlaceValue.

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
<i>laurent2.js</i> is a datatype for representing Laurent multinomials; an application of the PlaceValue2 datatype. Laurent multinomials are like regular multinomials except that their powers can be negative. For example y/x = y*x^-1 is a Laurent multinomial, not the normal kind of multinomial. Whereas Laurent.js inherited (by composition) from PlaceValue, Laurent2.js inherits from PlaceValue2. This is because PlaceValue represents places to the left or right of the decimal point (radix point) which are powers of a base, which is right for representing single variable polynomials. Laurent2 on the other hand, needs powers of 2 different bases which PlaceValue2 represents as digits to the left (or on top) of the radix point. Laurent multinomials are reduced to skins for PlaceValue2.

<i>CAS.html</i> which stands for either Computer Algebra System (for the algebraic looking UI) or Computer Arithmetic System (for the under the hood arithmetic implementation) is a demo for Laurent Polynomial & Multinomial.

Calculator
--------------
<i>index.html</i> demonstrates a 4+ function calculator that toggles between integer mode (WholePlaceValue) , real mode (PlaceValue) , polynomial mode (Polynomial) , multinomial mode (Multinomial) , Laurent polynomial mode (Laurent Polynomial) , and Laurent multinomial mode (Laurent Multinomial).

Differentiator
----------------
<i>differentiator.html</i> is an extention of calculator that allows for easy input of functions to differentiate. <i>differentiator.html</i> does a text transform of an input. It replaces x with (x+h), substracts the original, divides by h, then applies the "|" operator by 0. For example for x^2, it does ((x+h)^2-x^2)/h | 0. This is nothing more than using calculator.html in multinomial mode using ((x+h)^2-x^2)/h as the first argument, | as the operator, and 0 as the second argument. Notice that | allows for differentiation. | does not distribute over the other arithmetic operators. h/h | 0 yields 1, whereas (h|0)/(h|0) yeilds NaN. This allows for differentiation without a dependency on calculus but only algebra (actually only arithmetic). It is also more elegant. h/h yields 1 uniformly, instead of 1 sometimes except for a hole in the line at 0. Traditionally differentiation is impossible with only algebra, requiring complicated arguments to redefine the undefined hole in exactly the way it should have been defined in the first place. PlaceValue avoids undefining h/h|0 with all the mess that it causes, and instead treats division without any special cases. The only loss is that | doesn't distribute over the other arithmetic operators. The limit from calculus is seen as just a post hoc corrected version of | that needed to be defined to replace | because | never should have distributed over other arithmetic operators to begin with. h/h being 1 without exception is not a kludge but results from the underlying base agnostic arithmetic. The numerator h is represented as 10. The denominator h is represented by 10. PlaceValue performs a base-agnostic arithmetic calculation 10/10 yields 1. The base agnostic aspect of the PlaceValue datatype is its greatest strength.

Measure
------------
<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

measure.html demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox.  Using PlaceValue the conditional probability of being on a point on either a longitudinal or latitudinal great circle is .τ<sup>-1</sup> (where τ=2π). 
