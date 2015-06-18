Author : Anthony John Ripa

Date : 6/17/2015

Introduction
==========
This project is a refactoring of arithmetic, via a new data-type which represents base agnostic arithmetic via numbers whose digits are real.

PlaceValue
---------------
<i>PlaceValue</i> is a data-type for representing base agnostic arithmetic via numbers whose digits are real. Why? Consider 1/11. In base ten, 1/11 = .090909.. . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

Why not divide in a base agnostic way? The PlaceValue data-type does. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

WholePlaceValue
------------------------
The base class for PlaceValue is <i>WholePlaceValue</i>. WholePlaceValue is supposed to be the analogue of integer division. WholePlaceValue uses only positive powers of the base. For WholePlaceValue 1/11 = 0. 12 could be a WholePlaceValue but not 1.2 . Since we do base agnostic calculations there is no borrowing or carrying so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. While WholePlaceValue never has-a decimal point, WholePlaceValue can has-a object that has-a decimal point by composition. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

Polynomial
-------------
<i>polynomial.js</i> is a datatype for representing polynomials; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to polynomial arithmetic. Polynomial arithmetic uses a placeholder x. PlaceValue arithmetic dispences with this placeholder.

<i>polynomial.html</i> is a demo for polynomial.js.

Calculator
--------------
<i>index.html</i> demonstrates a 4+ function calculator that toggles between integer mode (WholePlaceValue) , real mode (PlaceValue) , and polynomial mode (Polynomial).

Measure
------------
<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

measure.html demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox.  Using PlaceValue the conditional probability of being on a point on either a longitudinal or latitudinal great circle is 1/τ (where τ=2π). 
