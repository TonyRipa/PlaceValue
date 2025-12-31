
# PlaceValue: A data-type for base-agnostic arithmetic

Author : Anthony John Ripa

Date : 12/31/2025

<a href='https://github.com/TonyRipa/PlaceValue'>https://github.com/TonyRipa/PlaceValue</a>

Live Demo at <a target='_blank' href='http://tonyripa.github.io/PlaceValue/'>http://tonyripa.github.io/PlaceValue/</a> (Need Firefox 79.0+ or equivalent)

## 1. Overview

### Abstract

PlaceValue refactors arithmetic via a new data type that models base-agnostic computation using real-valued digits. The implications are manifold.

Mathematical computation broadly comes in two varieties: numerical and symbolic. Numerical methods are simple; symbolic methods address a larger class of objects. PlaceValue (combining characteristics of both) aims to retain both advantages.

Analogous to Heaviside’s operational calculus (reducing differential operators to algebra), PlaceValue reduces algebra to arithmetic; consequently many routine calculus manipulations reduce to arithmetic. Multiple independent reduction avenues at each step make the overall reduction robust. We demonstrate this with worked examples (e.g., polynomial long-division as PlaceValue division, and Laplace-style differentiation as pointwise multiplication), emphasizing that no ad hoc limits or placeholder variables are required.

Differential equations follow with little additional machinery. Quantum mechanics, with its standard wave and matrix formulations, suggests a complementary perspective we call “PlaceValue mechanics.”

In machine learning, a convolutional layer can be represented as a single PlaceValue instance, since one of the four basic arithmetic operators (\*) is essentially a convolution. Training (deconvolution) then reduces to PlaceValue division.

Measure theory also benefits. Classical approaches are constrained by representing measures solely as real numbers. Using PlaceValue, the coordinate-dependence behind the Borel–Kolmogorov paradox is avoided: the paradox arises from a lossy cast from PlaceValue to reals. By keeping scale explicitly in the representation (point, line, area, volume correspond to successive powers of a base), conditional and independence calculations remain well-posed even when classical treatments collapse to 0/0 or ∞/∞.

Implementation is straightforward. Viewed through formal-language theory, traditional numeric types behave like regular grammars (numbers as regular expressions), symbolic expressions typically require context-free grammars (a strict superset of regular), and PlaceValue remains regular—hence simple and efficient.

Because the model is computational rather than hardware-specific, the same efficiency gains extend to mental, manual, and silicon computation alike.

### Introduction

The convolution theorem allows for complicated operations to be performed by re-presenting data (in a form that is often simpler) as well as re-presenting the operation to be performed (in a form that is often simpler). This theorem has simplified many computational schemes, and is exploited by PlaceValue.

In Mathematica, we may represent the variable x as something like an expression tree of height 1 consisting of a root node of type variable. We could then ask Mathematica x\*x and it could represent that as an expression tree of height 2 with a root node of type operator with 2 child nodes of type variable.

In MATLAB, we may represent the variable x as something like [0,1,2,3,4,5,6,7,8,9]. We could then ask MATLAB x * x (actually x .\* x) and it could return [0,1,4,9,16,25,36,49,64,81].

PlaceValue offers an alternate approach. We may represent MATLAB's x = [0,1,2,3,4,5,6,7,8,9] by a Fourier-type Transform of x = [0, 1]. PlaceValue can calculate x\*x by calculating [0, 1] \* [0, 1] = [0, 0, 1]. This is nothing more than 10 \* 10 = 100.

By building a data-type whose base operations are constructed to take advantage of such efficiencies, many applications which are handled in an otherwise convoluted manner may now be handled in an elegant manner.

### Related Work

The closest related works appear to be Moore 1962, and Wildberger 2010.

In "Convolution Products and Quotients and Algebraic Derivatives of Sequences", Moore discusses sequences, written like $\\{0,0,2,6,12,20,...\\}$, and operations on them. He uses the familiar convolutional product $\\{e_0,e_1,e_2,e_3,...\\}\\{n_0,n_1,n_2,n_3,...\\} = \\{e_0n_0,e_0n_1+e_1n_0,e_0n_2+e_1n_1+e_2n_0,...\\}$. He notes $\\{0,0,0,...\\}$ and $\\{1,0,0,0,...\\}$ function as the zero and unit elements respectively. He denotes the sequence $\tau = \\{0,1,0,...\\}$. He notes $\tau^n = \\{0_1,...,0_n,1,0,...\\}$.  This allows us to express the sequence $\\{e_0,e_1,e_2,e_3,...\\}$ as the sum $e_0+e_1\tau+e_2\tau^2+\cdots$ . He notes that the class of sequences with ordinary addition and convolutional product forms a commutative ring with no non-zero divisors (i.e. an integral domain). He notes the integral domain can be used to create a field of ordered pairs. He notes a special case called the summing operator $\frac{1}{1-\tau}=\\{1,1,1,...\\}$ . He notes the sequence $\\{n\\}$ (or in greek $\\{\nu\\}$) is $\frac{\tau}{(1-\tau)^2}$ . He defines the derivative operator as $D\\{e_n\\}=\\{(n+1)e_{n+1}\\}=\\{e_1,2e_2,3e_3,...\\}$ .

In [Math Foundations](http://youtube.com/watch?v=91c5Ti6Ddio&list=PLIljB45xT85DGxj1x_dyaSggbauAgrB6R), Wildberger creates an entire course (compatible with Moore 1962) where he fills out an entire field of study based on objects he calls polynumbers. These polynumbers are like Moore's sequences, but are written vertically. For example,
<pre>
___ ___ ___
| | | | | |
 1 + 3 = 4
 2       2
</pre>
. These caps distinguish the integer 1 from the polynumber
<pre>
___
| |
 1
</pre>
. Also Wildberger calls the special polynumber $\alpha = $
<pre>
___
| |
 0
 1
</pre>
, which is like Moore's $\tau$ .

## 2. Core Data Types (1D)

### 2.1 Digits & Scalars

#### Rational

<i>Rational.js</i> is used to represent fractions. WholePlaceValue uses them as its digits. In order to ensure that WholePlaceValue is able to operate without round off errors, its digits need to be immune to round off errors. Rational.js has a base ten integer representing a numerator, and another base ten integer representing a denominator. As a not to be relied on perk, Rational.js renders sufficient irrational approximations as their symbolic counterpart like τ (i.e. 2π). Other points of interest are that whereas IEEE's only representation for Infinity and NaN are as a kludge of special cases as specified by the IEEE Standard for Floating-Point Arithmetic (IEEE 754), Rational.js can handle them elegantly with neither kludges nor exceptions by simply failing to go through the pains of alienating number pairs like 1,0 and 0,0 respectively.

#### Complex

<i>complex.js</i> is a datatype for representing complex numbers. WholePlaceValue can use Complex to represent WholePlaceValue's digits. For example: ii * 2 = 2́2́. Imaginary digits look like regular digits but with a dot on top. Complex.js is basically implemented as a pair of numeric instance variables (for real and imaginary components) with instance functions appropriately defined to manipulate (carry out complex arithmetic on) its instance variables.

#### RationalComplex

<i>rationalcomplex.js</i> is a datatype for representing complex numbers. It represents complex numbers as pairs of rational. It has all of the capabilities of complex.js, without the round-off errors.

### 2.2 PlaceValue Foundations

#### WholePlaceValue

WholePlaceValue is supposed to be an analogue of whole numbers. WholePlaceValue uses only positive powers of the base. For WholePlaceValue, 1/11 = 0 (like integer division). 12 could be a WholePlaceValue but not 1.2 . Since we do base-agnostic calculations there is no borrowing or carrying, so 100 / 11 = 1<s>1</s>. We allow for negative digits. Furthermore, since there is no borrowing or carrying we allow for non-integer digits 11/2 = ½½. WholePlaceValue does not have a PlaceMark (radix point). However, WholePlaceValue can have a digit that has a PlaceMark. For example, 565/5 = 1(1.2)1. The first digit is 1; the second is 1.2; the third is 1.

#### MarkedPlaceValue

<i>MarkedPlaceValue</i> is a data-type for representing base-agnostic arithmetic via numbers whose digits are real. MarkedPlaceValue is a PlaceValue that has a PlaceMark. Consider 1/11. In base ten, 1/11 = .090909… . In base 2, 1/11 = .010101 . The answer depends on the base. This is annoying. This violates the programming principle of loose coupling. In base ten, when we do division we are relying on the idiosyncrasies of roll-over (carrying) in that number system. We commit the same sin when we divide in base 2.

The MarkedPlaceValue data-type transcends this problem by dividing in a base-agnostic way. 1/11 = 0.1<s>1</s>1<s>1</s>... . So, in base ten, this tells us that 1/11 is 1/10 - 1/100 + 1/1000 - 1/10000 ... . It also tells us that in base 2, 1/11 (i.e. 1/3) is 1/2 - 1/4 + 1/8 - 1/16 ... . We don't rely on the particularity of the base, and can divide regardless of the base, and we get the same uniform answer in all cases.

The base class (by composition) for MarkedPlaceValue is <i>WholePlaceValue</i>.

### 2.3 Variants (1D)

#### SparsePlaceValue1

<i>SparsePlaceValue1</i> is a 1D data-type optimized for sparse PlaceValues. Consider 1e9 + 2e-9. We could store this like 1000000000.000000002. SparsePlaceValue1 stores it like this [[1,9],[2,-9]]. The storage gains are apparent. There are also computational gains. Furthermore, a seemingly serendipitous gain is the ability to store numbers like 1e9.5 + 2e-9. This comes in especially handy when dealing with radicals and other similar expressions.

#### PlaceValueRatio

<i>PlaceValueRatio</i> is a PlaceValue data-type reminiscent of rational numbers. It is a ratio of 2 WholePlaceValues. For example, 1/11 is stored as a pair 1,11. 11/1 is stored as a pair 11,1. Multiplication occurs element-wise yielding 11,11. Results are automatically simplified via Euclid's algorithm to 1,1. Finally text rendering yields 1/1. PlaceValueRatio avoids round off errors that MarkedPlaceValue does not. For example, for MarkedPlaceValue 1/11 = 0.1<s>1</s>1<s>1</s>... but 11 * 0.1<s>1</s>1<s>1</s>... = 1.00001 .

#### SparsePlaceValueRatio1

<i>SparsePlaceValueRatio1</i> is a sparse version of PlaceValueRatio. It is a ratio of 2 SparsePlaceValue1s. PlaceValueRatio can handle numbers like 1/11. SparsePlaceValueRatio1 would handle that as 1 / 1E1+1. SparsePlaceValueRatio1 can handle more exotic ratios such as 1 / 1E½+1 .

#### BasedPlaceValue

<i>basedplacevalue.js</i> is a 1D datatype for representing PlaceValues that have a base; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to arithmetic in different bases. Based arithmetic works for a particular base. PlaceValue arithmetic works for all bases.

#### BasedMarkedPlaceValue

<i>basedmarkedplacevalue.js</i> is a 1D datatype for representing PlaceValues that have a base; an application of the MarkedPlaceValue datatype.

The PlaceValue data-type is particularly well-suited to arithmetic in different bases. Based arithmetic works for a particular base. PlaceValue arithmetic works for all bases.

#### RepeatingBasedMarkedPlaceValue

<i>repeatingbasedmarkedplacevalue.js</i> is a 1D datatype for representing PlaceValues that have a base; an application of the BasedMarkedPlaceValue datatype.

The PlaceValue data-type is particularly well-suited to arithmetic in different bases. Based arithmetic works for a particular base. PlaceValue arithmetic works for all bases.

An example of the repeating is 1/3 = 0.[3] where the brackets surround the repeating part.

#### OmegaRepeatingBasedMarkedPlaceValue

<i>omegarepeatingbasedmarkedplacevalue.js</i> is a 1D datatype for representing PlaceValues that have a base; an application of the BasedMarkedPlaceValue datatype.

The PlaceValue data-type is particularly well-suited to arithmetic in different bases. Based arithmetic works for a particular base. PlaceValue arithmetic works for all bases.

#### BasedPlaceValueRatio

<i>basedplacevalueratio.js</i> is a 1D datatype for representing PlaceValues that have a base; an application of the PlaceValueRatio datatype.

The PlaceValue data-type is particularly well-suited to arithmetic in different bases. Based arithmetic works for a particular base. PlaceValue arithmetic works for all bases.

## 3. Algebraic Structures

### 3.1 Polynomials (1D)

#### Polynomial1

<i>polynomial1.js</i> is a 1D datatype for representing polynomials; an application of the WholePlaceValue datatype.

The PlaceValue data-type is particularly well-suited to polynomial arithmetic. Polynomial arithmetic uses a placeholder x. PlaceValue arithmetic dispenses with this placeholder.

<i>polynomial1.html</i> is a demo for polynomial1.js.

#### SparsePolynomial1

<i>SparsePolynomial1</i> is a data-type optimized for sparse Polynomials; an application of the SparsePlaceValue1 datatype.

If SparsePolynomial1 wants to calculate (x^100 + 1)^2, then it asks SparsePlaceValue1 to calculate:

(1E100 + 1) ^ 2 = 1E200 + 2E100 + 1

SparsePolynomial1 then formats SparsePlaceValue1's result as x^200 + 2x^100 + 1.

If SparsePolynomial1 wants to calculate (x^.5 + 1)^2, then it asks SparsePlaceValue1 to calculate:

(1E.5 + 1) ^ 2 = 1E1 + 2E.5 + 1

SparsePolynomial1 then formats SparsePlaceValue1's result as x + 2x^.5 + 1.

Since SparsePolynomial1 uses SparsePlaceValue1, it allows for arbitrary powers including imaginary. While Taylor Series allows expressing sin(x) as a polynomial (sums of integer powers of x), functions like ln(x) cannot be so expressed. When imaginary powers are allowed ln(x) can be expressed. ln(x) = ix^-i - ix^i - ½ix^-2i + ½ix^2i + ⅓ix^-3i - ⅓ix^3i + … . This formula can be found from using the complex Fourier Series for x. x = ie^-ix - ie^ix - ½ie^-2ix + ½ie^2ix + ⅓ie^-3ix - ⅓ie^3ix + … . Then replace all instances of x with ln(x), and simplify. This appears to mean that if we allow sums of the form x^z for complex z, then restricting z to reals (the real axis) yields a smaller space of functions (polynomial series or analytic functions) whereas restricting z to pure imaginaries (the imaginary axis) yields a larger space of functions (Fourier series or beyond analytic).

#### PolynomialRatio1

<i>polynomialratio1.js</i> is a datatype for representing ratios of polynomials (also known as rational functions); an application of the PlaceValueRatio datatype.

If PolynomialRatio1 wants to calculate (x^4-4x^3+4x^2-3x+14)/(x^4+8x^3+12x^2+17x+6), then it asks PlaceValueRatio to calculate:

1<s>4</s>4<s>3</s>⑭ / 18⑫⑰6 = 1<s>5</s>7/173

PolynomialRatio1 then formats PlaceValueRatio's result as (x^2-5x+7)/(x^2+7x+3).

#### Sparse Polynomial Ratio 1

<i>sparsepolynomialratio1.js</i> is a sparse version of PolynomialRatio1; an application of the SparsePlaceValueRatio1 datatype.

If SparsePolynomialRatio1 wants to calculate (x^.5-1)/(x-1), then it asks SparsePlaceValueRatio1 to calculate:

1E½-1 / 1E1-1 = 1 / 1E½+1

SparsePolynomialRatio1 then formats SparsePlaceValueRatio1's result as 1/(x^½+1).

### 3.2 Multivariate

#### WholePlaceValue2

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

#### Polynomial2

<i>polynomial2.js</i> is a 2-D datatype for representing polynomials; an application of the WholePlaceValue2 datatype.

The WholePlaceValue2 data-type is particularly well-suited to 2-D polynomial arithmetic. Polynomial arithmetic uses placeholders like x & y. WholePlaceValue2 arithmetic dispenses with these placeholders.

If Polynomial2 wants to calculate (x+h)^2, then it asks WholePlaceValue2 to calculate:
<pre>
                   1
       1          20
( 10 + 0 ) ^ 2 = 100
</pre>
Polynomial2 then formats WholePlaceValue2's result as x^2+2x\*h+h^2.

If Polynomial2 wants to calculate ((x+h)^2 - x^2)/h|0, then it asks WholePlaceValue2 to calculate:
<pre>
 1
20 | 0 = 20
</pre>
Polynomial2 then formats WholePlaceValue2's result as 2x.

Note that 2\*x+h|0 seems ambiguous. Do we want to substitute 0 in for the variable x or h? The last variable (which in WholePlaceValue2 corresponds to the vertical axis) is the one chosen. We may use the @ operator to permute. 2x+h @ x = h+2x . So, 2x+h|0 = 2x ; 2x+h@x|0 = h ; 2x+h@h|0 = 2x . As a notational aside, @ is sometimes written as & .

One way to interpret PlaceValues is that they are (implicitly) functions. They are functions of their last variable. They are curried (i.e. they are functions of multiple variables that are encoded as telescoping functions of 1 variable [alternatively they are telescoping functions of 1 variable that model functions of multiple variables]). 

<i>polynomial2.html</i> is a demo for polynomial2.js.

#### MarkedPlaceValue2

<i>markedplacevalue2.js</i> is a 2D version of MarkedPlaceValue, or a floating point version of WholePlaceValue2 (actually implemented this way). MarkedPlaceValue2 is used by <i>Laurent2.js</i>. If Laurent Multinomial wants to calculate (x+h)^2/h, then it asks MarkedPlaceValue2 to calculate:
<pre>
  1                 1
 20                20
100 E0 / 1 E0,1 = 100 E0,-1
</pre>
Laurent Multinomial then formats MarkedPlaceValue2's result as x^2h^-1+2x+h .

Laurent Multinomials are nothing more than a UI for MarkedPlaceValue2.

#### SparsePlaceValue2

<i>SparsePlaceValue2.js</i> is a 2D data-type optimized for sparse MarkedPlaceValue2's. The MarkedPlaceValue2:
<pre>
500 
000
</pre>
is represented as the SparsePlaceValue2: 5E2,1 .

#### SparsePlaceValue

<i>SparsePlaceValue.js</i> is a data-type optimized for sparse PlaceValues. Whereas, SparsePlaceValue1 can handle 1D situations such as 1E2, and SparsePlaceValue2 can handle 2D situations such as 1E2,3 , SparsePlaceValue can handle an arbitrary number of dimensions such as 1E2,3,4 . SparsePlaceValue accepts Rational, Complex, or RationalComplex digits.

Evaluation can be done can be done along any dimension (x,y,z,...) or even across dimensions (x/y,y/z,x\*y,...).

#### SparsePolynomial

<i>SparsePolynomial</i> is a data-type optimized for sparse Polynomials; an application of the SparsePlaceValue datatype.

If SparsePolynomial wants to calculate (x+y)\*z, then it asks SparsePlaceValue to calculate:

(1E1 + 1E0,1) * 1E0,0,1 = 1E1,0,1 + 1E0,1,1

SparsePolynomial then formats SparsePlaceValue's result as x * z + y * z.

#### SparsePlaceValueRatio

<i>SparsePlaceValueRatio</i> is a sparse version of PlaceValueRatio. It is a ratio of 2 SparsePlaceValues. PlaceValueRatio can handle numbers like 1/11. SparsePlaceValueRatio would handle that as 1 / 1E1+1. SparsePlaceValueRatio can handle more exotic ratios such as 1 / 1E3,4+1 . SparsePlaceValueRatio accepts Rational, or RationalComplex digits.

#### Sparse Polynomial Ratio

<i>sparsepolynomialratio.js</i> is a sparse version of Polynomial Ratio; an application of the SparsePlaceValueRatio datatype.

If SparsePolynomialRatio wants to calculate (x^2+2x\*y+y^2)/(x^2-y^2), then it asks SparsePlaceValueRatio to calculate:

1E2+2E1,1+1E0,2 / 1E2-1E0,2 = 1E1,-1+1 / 1E1,-1-1

SparsePolynomialRatio then formats SparsePlaceValueRatio's result as (x \* y^-1+1) / (x * y^-1-1).

#### WholePlaceValueComplex2

<i>wholeplacevaluecomplex2.js</i> is a version of WholePlaceValue2 where the digits are allowed to be complex. One display innovation of this data-type is in its elegant representation of its complex digits. The complex digits are displayed in angle-magnitude form so as to save space. So, to represent a single digit whose value is twice the imaginary unit (a.k.a. 2i) we would render the character ② rotated by 90°. This way many such digits may be placed in a relatively small space without clutter. Apart from merely having a clutter free representation, this representation allows us to see otherwise obscured patterns. For example, Laplace's complex number s which has the property of differentiating anything that it multiplies, exposes its circular character in this representation (albeit only in 1 quadrant, for all 4 see ComplexPlaceValue). Whereas in a+bi form it looks like this:

<table><tbody><tr><td>2+2i</td><td>1+2i</td><td>2i</td></tr><tr><td>2+i</td><td>1+i</td><td>i</td></tr><tr><td>2</td><td>1</td><td>0</td></tr></tbody></table>

### 3.3 Laurent

#### Laurent Polynomial

<i>laurent.js</i> is a datatype for representing Laurent polynomials; an application of the MarkedPlaceValue datatype. Laurent polynomials are like regular polynomials except that their powers can be negative. For example, 1/x = x^-1 is a Laurent polynomial, not the normal kind of polynomial. Whereas Polynomial1.js inherited (by composition) from WholePlaceValue, Laurent.js inherits from MarkedPlaceValue. This is because WholePlaceValue represents places to the left of the PlaceMark which are positive (or zero) powers, which is good for representing polynomials of positive (or zero) power. Laurent on the other hand, needs negative powers which MarkedPlaceValue represents as digits to the right of the PlaceMark. Laurent polynomials are reduced to user interfaces for MarkedPlaceValue.

#### Laurent Multinomial

<i>laurent2.js</i> is a datatype for representing Laurent multinomials; an application of the MarkedPlaceValue2 datatype. Laurent multinomials are like regular multinomials except that their powers can be negative. For example, y/x = y\*x^-1 is a Laurent multinomial, not the normal kind of multinomial. Whereas Laurent.js inherited (by composition) from MarkedPlaceValue, Laurent2.js inherits from MarkedPlaceValue2. This is because MarkedPlaceValue represents places to the left or right of the PlaceMark which are powers of a base, which is good for representing single variable polynomials. Laurent2 on the other hand, needs powers of 2 different bases which MarkedPlaceValue2 represents as digits to the left (or on top) of the PlaceMark. Laurent multinomials are reduced to skins for MarkedPlaceValue2.

#### ComplexLaurent

<i>complexlaurent.js</i> is an algebraic looking skin for ComplexPlaceValue. Whereas ComplexPlaceValue is base agnostic, ComplexLaurent provides a base (x or otherwise) so as to provide a user interface for complex algebra. While the lettered bases are interesting, more interesting are the exponential bases found in the ComplexExponential data-type.

## 4. Transforms & Analytic Families

### Exponential

<i>exponential.js</i> is a datatype for representing exponentials; an application of the MarkedPlaceValue datatype. Exponentials are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^x or e^y. Exponential.js is little more than an exponential (or hyperbolic trigonometric) looking skin for an underlying MarkedPlaceValue datatype. Exponential takes an input like exp(2x) and stores it as 100 base e^x. It can then render it on demand in the exponential looking form exp(2x). Exponential also recognizes hyperbolic trig functions like cosh(x), which it stores as ½0.½ base e^x, and renders on demand as cosh(x). Likewise sinh(x), which it stores as ½0.<s>½</s>, and renders on demand as sinh(x).
If Exponential wants to calculate sinh(x)+cosh(x), then it asks MarkedPlaceValue to calculate:

½0.<s>½</s> + ½0.½ = 10

Exponential then formats MarkedPlaceValue's result as exp(x) .

Exponentials are nothing more than a veneer for MarkedPlaceValue.

### Fourier

<i>fourier.js</i> is a datatype for representing complex exponentials; an application of the MarkedPlaceValue(Complex) datatype. Fouriers are like polynomials (specifically Laurent Polynomials) whose base instead of being like x or y, would be e^ix or e^iy. Fourier.js is little more than a complex exponential (or circular trigonometric) looking skin for an underlying MarkedPlaceValue datatype. Fourier takes an input like cis(2x) and stores it as 100 base e^ix. It can then render it on demand in the complex exponential looking form cis(2x). Fourier also recognizes circular trig functions like cos(x), which it stores as ½0.½ base e^ix, and renders on demand as cos(x). Likewise sin(x), which it stores as <s>½</s>̉0.½̉  base e^xi, and renders on demand as sin(x).
If Fourier wants to calculate sin(x)\*cos(x), then it asks MarkedPlaceValue to calculate:

<s>½</s>̉0.½̉  * ½0.½ = <s>¼</s>̉00.0¼̉ 

Fourier then formats MarkedPlaceValue's result as 0.5sin(2x) .

Fouriers are nothing more than a veneer for MarkedPlaceValue.

### Laplace

<i>laplace.js</i>. If Laplace wants to solve 1\*Df(x)+1\*f(x)=0 then it calculates 1/(s+1), then it asks MarkedPlaceValue(Complex) to calculate:

1 / 11 = 0.1<s>1</s>1<s>1</s> base s

Laplace then formats MarkedPlaceValue(Complex)'s result as exp(-x) .

Viewing the Laplace transform of exp(-x) [ which is 1/(s+1) ] as the fraction 1 / 11 has advantages. Specifically, viewing the 1/11 in the expanded form 0.1<s>1</s>1<s>1</s> . We can see from the expanded form what appear to be the Taylor Coefficients of the Taylor expansion of exp(-x) [ however without the factorial denominators ] . Specifically, what we are seeing is the derivatives of the function exp(-x) , since the Taylor coefficients are the derivatives including the factorials. Another (though perhaps not best) way to say this for those familiar with generating functions, is that the Laplace Transform is the generating function of the derivatives. Without PlaceValue, this nature of the Laplace Transform would be more difficult to see (partly because of the overhead of placeholder variables). Furthermore, we can see why the Laplace Transform should be capable of representing a function: because having all the derivatives of a function at point is enough to represent a typical function (we say typical instead of analytic because Laplace can represent Dirac Delta), as one familiar with Taylor Series knows. Note: it should be noted that Laplace seems to have chosen a different sign convention than generating functions, further obscuring the symmetry.

Ordinarily differentiating loses information because the derivative of any constant is 0. Applying the anti-derivative recovers most of the function, except the lost constant. One benefit of this approach of representing a function as sequence .f(0)f'(0)f"(0)... is that differentiation is shifting. And shifting is invertible, if the endpoint is retained. If we differentiate .f(0)f'(0)f"(0)... by shifting to f(0).f'(0)f"(0)... then we can shift back to .f(0)f'(0)f"(0)... . However, if we do a lossy shift from .f(0)f'(0)f"(0)... to .f'(0)f"(0)... then shifting back cannot recover. Traditional differentiation can be seen as lossy shifting. This approach allows for non-lossy shifting. This is exemplified by the classic Laplace derivative formula f'(t)=sF(s)-f(0).

Note that Laplace transforms are convenient for linear differential equations, because addition and constant multiplication work as expected irrespective of the (un)seen factorial factors. Full support for multiplication requires more care than is typically convenient. To that end, we have added factorial-arithmetic to WholePlaceValue. 

### Complex Exponential

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

### SparseExponential1

<i>SparseExponential1</i> is a data-type optimized for sparse Exponentials; an application of the SparsePlaceValue1 datatype. SparseExponential1 is like Exponential except that it uses a sparse PlaceValue. Exponential's reliance on PlaceValue's integer powers of its base (like 100 means base^2) allows for integer powers of e^x (like e^2x). However, SparseExponential1's reliance on SparsePlaceValue1's non-integer powers of its base (like 1E2.5 means base^2.5) allows for non-integer powers of e^x (like e^2.5x).

### SparseExponential

<i>SparseExponential</i> is a data-type optimized for Sparse Exponentials; an application of the SparsePlaceValue datatype.

If SparseExponential wants to calculate exp(x) * exp(y), then it asks SparsePlaceValue to calculate:

1E1 * 1E0,1 = 1E1,1

SparseExponential then formats SparsePlaceValue's result as exp(x+y).

If SparseExponential wants to calculate exp(x) * cis(y), then it asks SparsePlaceValue to calculate:

1E1 * 1E0,i = 1E1,i

SparseExponential then formats SparsePlaceValue's result as exp(x+(i)y).

### SparseExponentialRatio1

<i>SparseExponentialRatio1</i> is a data-type optimized for ratios of Sparse Exponentials; an application of the SparsePlaceValueRatio1 datatype. Consider the problem of storing tanh. tanh = sinh / cosh. cosh = ½0.½. sinh = ½0.<s>½</s>. Dividing them results in the repeating MarkedPlaceValue 1.0<s>2</s>02... . Storing that in a MarkedPlaceValue is problematic. So we store it in a data-type constructed specifically for the storage of ratios of placevalues: PlaceValueRatio. Now we can store tanh exactly. ½0.<s>½</s>/½0.½ reduces to the PlaceValueRatio 10<s>1</s>/101. To be accurate, SparseExponentialRatio1 uses SparsePlaceValueRatio1 not PlaceValueRatio so it is stored sparsely as 1E2-1 / 1E2+1.

### SparseExponentialRatio

<i>SparseExponentialRatio.js</i> is a data-type optimized for ratios of Sparse Exponentials. Whereas, SparseExponentialRatio1 uses SparsePlaceValueRatio1, SparseExponentialRatio uses SparsePlaceValueRatio. Therefore, SparseExponentialRatio1 can handle 1D situations such as tan(x), while SparseExponentialRatio can handle an arbitrary number of variables such as tan(x+y+z). SparseExponentialRatio accepts Rational, & RationalComplex.

### SparseExpression1

<i>SparseExpression1</i> is a data-type optimized for sparse Polynomials & Exponentials; an application of the SparsePlaceValue1 datatype. SparseExpression1 can represent whatever SparsePolynomial1 or SparseExponential1 can. It does this by using bases like x or e^x.

### SparseExpression

<i>SparseExpression</i> is a data-type optimized for sparse Polynomials & Exponentials; an application of the SparsePlaceValue datatype. SparseExpression can represent whatever SparsePolynomial or SparseExponential can. It does this by using bases like x or e^x.

### SparseExpressionRatio1

<i>SparseExpressionRatio1</i> is a data-type optimized for ratios of Sparse Expressions; an application of the SparsePlaceValueRatio1 datatype. SparseExpressionRatio1 can represent whatever SparsePolynomialRatio1 or SparseExponentialRatio1 can. It does this by using bases like x or e^x.

### SparseExpressionRatio

<i>SparseExpressionRatio</i> is a data-type optimized for ratios of Sparse Expressions; an application of the SparsePlaceValueRatio datatype. SparseExpressionRatio can represent whatever SparsePolynomialRatio or SparseExponentialRatio can. It does this by using bases like x or e^x.

### ComplexPlaceValue

Whereas, markedplacevalue extended wholeplacevalue by allowing for negative exponents to the right of the PlaceMark, <i>complexplacevalue.js</i> extends markedplacevalue by allowing for imaginary exponents above the PlaceMark and negative imaginary exponents below the PlaceMark. ComplexPlaceValue also allows for the digits themselves to be complex. ComplexPlaceValue is implemented as a floating point version of <i>wholeplacevaluecomplex2.js</i> (via composition). ComplexPlaceValue finds a natural application in the ComplexExponential data type base e<sup>x</sup> where the horizontal axis represents real powers of e<sup>x</sup> to represent things such as cosh(x), and the vertical axis represents imaginary powers of e<sup>x</sup> to represent things like cos(x). Laplace's complex number s, which has the property of differentiating anything that it multiplies, exposes its full circular character in this representation. Whereas in a+bi form it looks like this:

<table>
<tr><td>2+2i</td><td>1+2i</td><td>0+2i</td><td>-1+2i</td><td>-2+2i</td></tr>
<tr><td>2+1i</td><td>1+1i</td><td>0+1i</td><td>-1+1i</td><td>-2+1i</td></tr>
<tr><td>2+0i</td><td>1+0i</td><td>0+0i</td><td>-1+0i</td><td>-2+0i</td></tr>
<tr><td>2-1i</td><td>1-1i</td><td>0-1i</td><td>-1-1i</td><td>-2-1i</td></tr>
<tr><td>2-2i</td><td>1-2i</td><td>0-2i</td><td>-1-2i</td><td>-2-2i</td></tr>
</table>

## 5. Operations, Tools & Demos

### Zero

<i>Zero.html</i> demonstrates PlaceValue's automatic & natural ability to model what can be called weak & strong zero for use in such things as indicator functions, something real numbers could not handle both uniformly and correctly. Normally, if you want a multiplicative coefficient value to alternately select values that you want and reject values that you don't want you use 0 & 1. This works great to reject a value like 3, you just give it a coefficient of 0, and get a contribution of 0 * 3 = 0. However, if you want to reject a value like infinity, this does not work so well. 0 * ∞ = % . This has lead some authors to write that they mean strongly zero, as opposed to this weakly zero which can be subverted by some inputs. It is a nice idea. However, it is often merely assumed that strongly zero works though there doesn't seem to be a number that it corresponds to, or that we must invoke a new ad hoc operator which maps any input (even undefined) to the number zero. Proofs that this operator plays nice are usually non-existent and left to the reader.

PlaceValue automatically comes with instances which would correspond to these strong and weak zero, and not in an ad hoc way (in fact, it would require extra work to get rid of them, and that work would be ad hoc). First, let's consider 0 * ∞ = % . This would be represented by PlaceValue internally as [0] * [∞] = [%] . These would be 1-digit PlaceValues. What PlaceValue X would we need to satisfy X * Y = X , for all (even exotic) Y ? It is hard to find a 1-digit PlaceValue that works. Similarly, for more than 1 digit. However, we don't need so many digits. A 0-digit PlaceValue suffices. [] * [∞] = [] . The so-called strong zero is merely the PlaceValue [] .

### Synthetic Division

<i>SyntheticDivision.html</i> is an implementation of Synthetic Division using PlaceValue. Synthetic Division is something of a high-school trick to divide polynomials using the same kind of long-division that one would ordinarily use to divide integers. I call it a trick because it is a one-off curiosity that is not taught as part of a broader approach. Failing to write the x's and paying attention only to the position is Synthetic Division. Also, failing to write the x's and paying attention only to the position is PlaceValue Division. This makes PlaceValue Division the same thing as Synthetic Division. When I say same thing, I do not mean same in the sense that Polynomial Division is the same as Synthetic Division (though this is true because they amount to the same thing apart from the x's) ; I mean same in an even stronger sense because the mapping is extremely direct (you deal only with the coefficients, and you deal with them the same way). A benefit of PlaceValue is that its division is not a one-off trick, but a necessary part of a coherent whole.

### CAS

<i>CAS.html</i> which stands for either Computer Algebra System (for the algebraic looking UI) or Computer Arithmetic System (for the under the hood arithmetic implementation) is a demo for Laurent Polynomial, Multinomial & Exponential.

### Calculator

<a href='https://tonyripa.github.io/PlaceValue/calculator.html'>calculator.html</a> demonstrates a 4+ function calculator that toggles between Rational, Complex, and RationalComplex digit mode, and furthermore toggles between integer mode (WholePlaceValue) , real mode (MarkedPlaceValue) , rational mode (PlaceValueRatio) , polynomial mode (Polynomial1 & Polynomial2) , Laurent polynomial mode (Laurent Polynomial) , Laurent multinomial mode (Laurent Multinomial), and Exponential mode (Exponential).

### Differentiator

<i>differentiator.html</i> is an extension of calculator that allows for easy input of functions to differentiate. <i>differentiator.html</i> does a text transform of an input. It replaces x with (x+h), subtracts the original, divides by h, then applies the "|" operator by 0. For example for x^2, it does ((x+h)^2-x^2)/h | 0. This is nothing more than using calculator.html in (Laurent) multinomial mode using ((x+h)^2-x^2)/h as the first argument, | as the operator, and 0 as the second argument. Notice that | allows for differentiation. | does not distribute over the other arithmetic operators. h/h | 0 yields 1, whereas (h|0)/(h|0) yields NaN. This allows for differentiation without a dependency on calculus but only algebra (actually only arithmetic). It is also more elegant. h/h yields 1 uniformly, instead of 1 sometimes except for a hole in the line at 0. Traditionally differentiation is impossible with only algebra, requiring complicated arguments to redefine the undefined hole in exactly the way it should have been defined in the first place. PlaceValue avoids undefining h/h|0 with all the mess that it causes, and instead treats division without any special cases. The only loss is that | doesn't distribute over the other arithmetic operators. The limit from calculus is seen as just a post hoc corrected version of | that needed to be defined to replace | because | never should have distributed over other arithmetic operators to begin with. h/h being 1 without exception is not a kludge but results from the underlying base-agnostic arithmetic. The numerator h is represented as 10. The denominator h is represented by 10. PlaceValue performs a base-agnostic arithmetic calculation 10/10 yields 1. The base-agnostic aspect of the PlaceValue datatype is its greatest strength.

### Infinitesimal

<i>infinitesimal.html</i> is a modification of differentiator.html. Whereas differentiator.html evaluates h at 0, infinitesimal.html does not. So, when the input is x^2 the output is 2x+h. The point is to demonstrate that since PlaceValue is base-agnostic, it is not limited to standard number cases. PlaceValue can model nonstandard analysis where h is a hyperreal and/or infinitesimal. Non Standard Analysis uses the Transfer Principle to extend the rules of manipulating real numbers to manipulating hyperreal numbers. PlaceValue gets this principle for free by putting the base-agnostic manipulation rules first.

### Calculus

<i>calculus.html</i> is an extension of differentiator that supports (complex) exponentials, and allows for both differentiation and integration. Differentiation proceeds in a Laplace like manner. The derivative of exp(kx) is k * exp(kx). The derivative of cis(kx) is ki\*cis(kx). Differentiation of Sums of such Exponentials is achieved by multiplying each exponential in the sum by their respective k. Compactly, MarkedPlaceValue implements this as pointwise multiplication by …3210.<s>123</s>… , or 3̉2̉i0.<s>i</s><s>2</s>̉<s>3</s> in the imaginary case, or in the general complex case by:

<table>
<tr><td>2+2i</td><td>1+2i</td><td>0+2i</td><td>-1+2i</td><td>-2+2i</td></tr>
<tr><td>2+1i</td><td>1+1i</td><td>0+1i</td><td>-1+1i</td><td>-2+1i</td></tr>
<tr><td>2+0i</td><td>1+0i</td><td>0+0i</td><td>-1+0i</td><td>-2+0i</td></tr>
<tr><td>2-1i</td><td>1-1i</td><td>0-1i</td><td>-1-1i</td><td>-2-1i</td></tr>
<tr><td>2-2i</td><td>1-2i</td><td>0-2i</td><td>-1-2i</td><td>-2-2i</td></tr>
</table>

If Exponential wants to differentiate sinh(x) + 7, then it asks MarkedPlaceValue to calculate:

½7.<s>½</s> ⊗ 10.<s>1</s> = ½0.½

Exponential then formats MarkedPlaceValue's result as cosh(x) .

Integration is achieved by reversing the pointwise multiplication with pointwise division.

If Exponential wants to integrate cosh(x), then it asks MarkedPlaceValue to calculate:

½0.½ ⊘ 10.<s>1</s> = ½%.<s>½</s>

Exponential then formats MarkedPlaceValue's result as sinh(x) + NaN.

If Fourier wants to differentiate sin(x) + 7, then it asks MarkedPlaceValue(Complex) to calculate:

<s>½</s>̉7.½̉ ⊗ i0.<s>i</s> = ½0.½

Fourier then formats MarkedPlaceValue(Complex)'s result as cos(x) .

Integration is achieved by reversing the pointwise multiplication with pointwise division.

If Fourier wants to integrate cos(x), then it asks MarkedPlaceValue(Complex) to calculate:

½0.½ ⊘ i0.<s>i</s> = <s>½</s>̉%.½̉

Fourier then formats MarkedPlaceValue's result as sin(x) + NaN.

The NaN is not a mistake. It's a spectacular success. The pointwise division of the 0 in the one's place of ½0.½, with the 0 in the one's place of 10.<s>1</s>, yields 0/0 which placevalue represents as %. Exponential represents this as NaN (Not a Number). 0/0 is an underconstrained number. This underconstrained constant is what is normally understood as the Constant of Integration.

### DiffEq

<i>diffeq.html</i> solves differential equations of the form Dⁿf(x) + kf(x) = 0. Dividing both sides by D<sup>n</sup> + k it solves f(x) = 0 / D<sup>n</sup> + k. Or more precisely f(x) = 0 ⊘ ( D<sup>n</sup> ⊕ k ). But it doesn't get f(x) = 0.
For example, D<sup>2</sup>f(x) + -1f(x) = 0. f(x) = 0 ⊘ D<sup>2</sup> ⊕ -1. f(x) = 0 ⊘ 4210.124 ⊕ -1. f(x) = 0 ⊘ 310<s>1</s>.013. f(x) = %0.% base e<sup>x</sup>. f(x) = NaN * exp(x) + NaN * exp(-x). Meaning an arbitrary constant times exp(x) plus an arbitrary constant times exp(-x). With slight modification, diffeq.html also supports Fourier, ComplexExponential, and Laplace solution.

### Determinant

<i>determinant.html</i> demonstrates an application of PlaceValue to problems in linear algebra.

The determinant of a matrix is the n-volume of the parallelotope formed from the column vectors of that matrix. Classically, if one of the parallelotope's sides is of length zero then the entire n-volume is zero. This has the effect of destroying information. 

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero.

PlaceValue can represent multiple measure scales, as in a unit cube 1000, and a unit square 100. In fact, in determinant.html we demonstrate that Cramer's Rule continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0).

determinant.html also provides an optional preprocessing step (left-multiply by A transpose) which has the effect of averaging over-determined variables.

### 5.1 Probability & Measure Applications

#### Measure

<i>measure.html</i> demonstrates an application of PlaceValue to problems in measure theory. Measure theory typically chooses a certain region to normalize as the unit measure. All other regions are assigned a compatible real number that represents the measure of that region. However, since there are only a relatively small amount of real numbers, this poses problems. For example, many different sets of many different sizes are all labeled as a set of measure zero.

If we assign a measure of 1 to the unit-square, then we are forced not only to label a single point as having a measure of 0, but we are also forced to label a unit line-segment as having measure 0. Attempting to circumvent this issue by instead normalizing by assigning a measure of 1 to the unit line-segment forces us to label a unit-square as having measure ∞. Either normalization is unsatisfactory. This raises problems in, for example, the problem of the conditional probability of being on a line-segment in a plane given that you are on another line-segment in that plane.

PlaceValue being larger avoids these rounding errors. Using PlaceValue we can model the measure of a point as the PlaceValue 1. Similarly, we can model the measure of a unit line-segment as the PlaceValue 10. Similarly, we can model the measure of a unit-square as the PlaceValue 100. 1, 10, and 100 represent the zeroth, first, and second powers of an arbitrary base respectively. In general, we can model a unit n-dimensional object as 10^n.

Negative powers are also useful, and come up frequently. Any time we want to talk about "per unit-length" it comes up. One per unit-length is .1 . One per unit-area is .01 . In general, One per unit-n-dimensional object is 10^-n.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero. In fact, in measure.html we demonstrate that Bayes' Theorem continues to hold even in cases which are classically indeterminate forms (i.e. expressions which classically reduce to the form 0/0 or 0\*∞).

#### Independence

<i>independence.html</i> demonstrates an application of PlaceValue to the problem of independence in probability theory. In Classical Probability, two events A and B are said to be Independent if P(A) * P(B) = P(A ∩ B). Otherwise, the events are said to be dependent. All probabilities are assigned a compatible real number that represents the likelihood of that event. However, since there are only a relatively small amount of real numbers, this poses problems. For example, many different sets of many different sizes are all labeled as a set of measure zero.

If we assign a measure of 1 to the unit-line-segment, then we are forced not only to label its left end-point as having a measure of 0, but we are also forced to label the measure of the set of both end-points as having measure 0.

Consider event A of choosing the left end-point of the unit-line-segment. Consider event B of choosing either end-point of the unit-line-segment. We can test for independence using the above test for independence. P(A) * P(B) ≟ P(A ∩ B) . 0 * 0 ≟ 0 . 0 ≟ 0 . True ∴ Independent .

This result is unsatisfying. Event A is selecting the left end-point from a unit-line-segment. The probability of event A happening is P(A) = 0. Event B is selecting either end-point from a unit-line-segment. These events should not be independent because if we have selected either end-point then the probability that the point that we selected is the left end-point is larger than P(A) = 0.

Let's redo the above example using PlaceValue.

The probability of A is the measure of the left end-point divided by the measure of the unit-line-segment. P(A) = 1 / 10 = 0.1 . This is one point per unit-length. Alternatively, we may write this using E-notation as 1E-1. This indicates that the magnitude is 1, while the size-scale is -1. Similarly, the probability of B is the measure of the pair of end-points divided by the measure of the unit-line-segment. P(A) = 2 / 10 = 0.2 . This is two points per unit-length. Alternatively, we may write this using E-notation as 2E-1. This indicates that the magnitude is 2, while the size-scale is -1. We now test for independence. P(A) * P(B) ≟ P(A ∩ B) . 1E-1 * 2E-1 ≟ 1E-1 . 2E-2 ≟ 1E-1 . False ∴ Dependent

We got the right answer using PlaceValue, whereas we got the wrong answer using Classical techniques.

The PlaceValue data-type is particularly well-suited to problems associated with sets of measure zero. In fact, in independence.html we demonstrate that the independence test P(A) * P(B) ≟ P(A ∩ B) continues to hold even in cases which fail classically.

#### Conditional

<i>conditional.html</i> demonstrates an application of PlaceValue to the problem of conditional in probability theory.

Consider Pearl 2014 Probability & Statistics. Pearl distinguishes between two kinds of frameworks: extensional & intensional. In extensional systems, probability is in some sense distributive; P(A & B) is always f(P(A),P(B)) for some f. In intensional systems, probability is not distributive; there is not always some f such that P(A & B) is f(P(A),P(B)). Probability theory is not intensional because there is not always some f such that P(A & B) is f(P(A),P(B)). This does not preclude the possibility that in some cases there is some f such that P(A & B) is f(P(A),P(B)). For example, when event A is independent of event B, we may take f to be multiplication, yielding P(A & B) = P(A) * P(B). Extensional systems work (when they don't fail) by making such simplifying assumptions a permanent feature of the system.

In Probability Theory, P(A & B) is calculated by representing events as sets of primitive independent events (elementary events). For example, we may take the set of all possible elementary events U = {e₁,e₂,e₃}. Our event A may be {e₁,e₂}. Our event B may be {e₂,e₃}. We perform A & B with set intersection A & B = {e₁,e₂} ∩ {e₂,e₃} = {e₂}. So, P(A & B) = P({e₂}). Assuming that we know the probability of all the elementary events, then we now know P(A & B).

Pearl continues with the concept of P(A|B). Pearl describes the "|B" as meaning "given that I know B". So, P(A|B) is the probability of A given that I know B. Pearl notes that P(A|B) has been alternately defined as P(A|B) = P(A&B)/P(B). However, Pearl prefers "|B" as meaning "given that I know B" because he believes it's more fundamental than P(A&B)/P(B). Pearl's approach may be more fundamental, but P(A|B) = P(A&B)/P(B) gives an actual algorithm for calculating P(A|B). Unfortunately, the algorithm fails when P(B)=0.

We provide a compromise. P(A|B) ≝ Odds(A&B : B) . The advantage is two-fold. Firstly, this definition provides a calculation as easy as P(A|B) = P(A&B)/P(B) whenever it's defined. Secondly, it works in situations where P(A&B) and/or P(B) are not available. This ameliorates some of Pearl's concern. We retain a mathematical formalism without abandoning principle.

One way to formalize why this works is that we avoided an extensional definition, or defining P(A|B) in terms of probabilities of parts. Much like how the intensionality of Probability Theory requires P(A&B) not to be defined in terms of probabilities of parts (instead opting for operating on the parts themselves before calculating a probability) we did the same with P(A|B). Defining P(A|B) = P(A&B)/P(B) is an extensional definition, and therefore it is fragile. P(A|B) = Odds(A&B : B) is an intensional definition allowing for robustness.

#### Borel's Paradox

<i>measure.html</i> demonstrates an application of PlaceValue and possible resolution of the Borel-Kolmogorov Paradox.

Traditionally, calculating the probability of being on a point on a latitudinal great circle is .τ⁻¹ (where τ=2π). Whereas, the probability of being on a point on a longitudinal great circle is different by a factor of cos(θ). This is because the limit of rings, and lunes are different. Traditional approaches are not robust to reparameterization, and so are not well-defined.

The PlaceValue representation of a circle is always τ0. There’s no 2 ways about it. Using PlaceValue, the conditional probability of being on a point on either a longitudinal or latitudinal great circle is .τ⁻¹ .

Coordinate-free geometry solves the problem immediately by symmetry. Problems arise by assuming that we need coordinate geometry. This is false. We do not. But what if we did? I could set up a lat-long coordinate system. And tell you I’m on the prime meridian. The problem is immediately solved by symmetry. Problems arise assuming that the coordinates change the probability. This is false. They do not. But what if they did?  Maybe I’m rounding degrees between –0.5° & +0.5° to 0°.  Now I’m more likely away from the pole by a factor of cos(θ). But where’s the pole? By symmetry, equally likely anywhere on the circle. Object that I can’t presume uniformity. This point is unconcedable. My lack of prior knowledge guarantees by the Principle of Indifference a uniform prior.

One way to look at this, is the difference between exact and approximate methods. If I say that I'm at a latitude of 0° (exactly), then you should search uniformly for me on the Prime Meridian. If I say that I'm at a latitude of 0° (approximately), then you should search uniformly between a latitude of –0.5° & +0.5° which is thicker near the equator.

The Traditional Approach is entirely unsatisfying. It says that we need information that we don't have and so can't proceed. This is completely un-Bayesian. Go with whatever prior you have no matter how Naive. If completely uniformed go with an uninformed prior. If you think the uniform prior is too naive, then use a more informative prior. If you think the uniform prior is too presumptuous, use a less presumptuous prior (if there is one). If you can't decide which prior to use then average your favorite candidate priors. If you're leaning toward one then use a weighted prior. Different people may disagree on priors; that is also fine. They need not agree.

One might object that this is neither a situation of priors, nor a situation of approximation. Both traditional methods are valid, and so both must be right. Actually, what it shows is that traditional methods are inadequate and/or broken.

Before Calculus was invented, people tried to understand the concept of instantaneous velocity. Algebra gave 0/0. 0/0 is indeterminate. 0/0 could be 1. 0/0 could be 2. Many speculated that there was no such thing as an instantaneous velocity. One must first choose a step-size to compute rise over run. Others knew by various arguments that for example the derivative of x^2 must be 2x, and a correct Calculus when it comes must give 2x as the answer; if it gives 3x we will know that it is wrong. Calculus came and the derivative of x^2 was 2x. Calculus well-handles finite indeterminate forms. Calculus does not quite well-handle small indeterminate forms, like when the answer is 0. Probability Density functions are such a problem. This led Kolmogorov to say "The concept of a conditional probability with regard to an isolated hypothesis whose probability equals 0 is inadmissible." Sour Grapes. Basically, he thinks that if it is not well-defined with limits, then the concept itself is not well-defined. Had Kolmogorov lived centuries ago he may have been among those who claimed that if it is not well-defined with algebra, then the concept itself is not well-defined. Unfortunately, this simply is not the case. If the problem does not map uniquely to our current framework, that does not mean that the problem itself is not well-defined. In fact, it suggests current techniques are insufficient. Algebra could not handle indeterminate forms. Calculus could well-handle only indeterminate forms that are not small. PlaceValue handles all of these cases, whether they are small or not. Before PlaceValue, by symmetry, we knew how to resolve Borel's Paradox. Using PlaceValue, we now get the answer formally, that we had already gotten informally.

Finally, PlaceValue's answer has the advantage of following immediately from the Definition of Probability: P(A|B) = μ(A) / μ(B) = 1 / τ0 .

#### Dirac Delta Function

<i>delta.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of differentiating the unit-step function.

We start with a more mundane example. As we saw in measure.html, PlaceValue can accommodate different size-scales e.g. points, lines, planes, without overflow or underflow. Assume we have a function that looks like a unit-square. To integrate, we get the width. Then we get the height. Then we get their product. The width is a unit-length. The height is a unit-length. The unit-length is represented by the PlaceValue 10. Their product is the PlaceValue 100. This represents a unit-area. The unit-area is the answer to that integration problem.

As we saw in measure.html, PlaceValue can accommodate different size-scales e.g. points, lines, planes, without overflow or underflow. This is particularly handy for the Dirac Delta Function. The Dirac Delta Function is supposed to have such a large value at x=0 that integrating past x=0 contributes a unit amount of area, even though the width is only that of a point. This is difficult if you are stuck working with a data-type such as real numbers. This is not a problem for the relatively larger data-type of PlaceValue. For PlaceValue, a point may be represented by the PlaceValue 1, a unit-line-segment by the PlaceValue 10, and a unit-square by the PlaceValue 100. If you want the product to be a unit-area i.e. 100, while the width is a point i.e. 1, then you set the height to be 100.
The Dirac Delta Function is 0 everywhere, except at x=0, where the value is the PlaceValue 100.

### 5.2 Other Applications

#### Fractal

<i>fractal.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of defining measures over fractals.

In measure.html, we saw that we can model the measure of a unit n-dimensional object as 10^n. This is well-modeled as a PlaceValue.

Fractals are not of integer dimension. For example, Cantor Dust is lg<sub>3</sub>2 ~ ⅗ dimensional. We can model the measure of a unit Cantor-Dust as the SparsePlaceValue 1E⅗.

#### Line

<i>line.html</i> demonstrates an application of PlaceValue to problems in measure theory. For example, the problem of defining measuring incomensurates.

In measure.html, we saw that we can model the measure of a unit n-dimensional object as 10^n. This is well-modeled as a PlaceValue.

What if the object is a line in one dimension and a line-segment in the other? This would be like a thick line, or a plane segment. SparsePlaceValue accomodates multiple bases. The first base can be a unit line segment. The second base can be a line. The measure of a line by unit-line-segment object would be 1E1,1. If it is twice as thick the measure would be 2E1,1.

#### Sum

 ( *For reading convenience this section will flip the normal left-right convention, so the number twelve will be written 21, and / means* \\ )

<i>sum.html</i> demonstrates an application of PlaceValue to problems in summing so-called "divergent sums". For example, the problem of summing 1 - 1 + 1 - 1 + … . We do this by not treating base 1 as a special case.

Earlier we spoke of two kinds of division: left-division and right-division. We noted one was good for bases less than 1, while the other was good for bases greater than 1. We also introduced center-division, which was good for base 1. We now consider using base 1, without center division, but instead with one of the original divisions.

Consider 1 / 11 = 1<s>1</s>1<s>1</s>1<s>1</s>… . We apply |1 to both sides, 1/11 | 1 = 1<s>1</s>1<s>1</s>1<s>1</s>… | 1 . Simplifying we get, 1/2 = 1-1+1-1+… .

1-1+1-1+… is usually considered a divergent sum. By not treating it as an exception, we conclude 1-1+1-1+… = 1/2 . We get no other answer with PlaceValue. We get no contradiction; it is consistent. Beyond consistency, we demonstrate in the next section (set.html) that the answers that PlaceValue provides are exactly the ones needed to calculate correct probabilities for set ratios (finite or infinite).

#### Set

 ( *For reading convenience this section will flip the normal left-right convention, so the number twelve will be written 21, and / means* \\ )

<i>set.html</i> demonstrates an application of PlaceValue to problems in measuring so-called "countably infinite sets". For example, the problem of calculating the probability of drawing an even number out of the set of integers.

Suppose we have a collection of numbers 0,1,3. With PlaceValue, we have a place for different values. To indicate that 0 is in our collection we put a 1 at index 0, yielding the number 1. To indicate that 1 is in our collection we put a 1 at index 1, yielding the number 01. To indicate that both 0 & 1 are in our collection we put a 1 at index 0 & 1, yielding the number 11. To indicate that 0,1,3 are in our collection we put a 1 at index 0, 1, & 3, yielding the number 1101.

Now that we have a way to represent collections, we can introduce measuring the collection. We simply apply our previously discussed | operator, and for our operand we use 1. We could say we evaluate at 1, or we can say it is a base 1 number. It doesn't matter what we say. What we've done is count all the numbers in our set. By using base one, we don't given more (or less) weight based on position. Our total is the number of 1s in the PlaceValue, and so is the number of elements in our collection.

With this approach, we can now measure the previous example collections. The first example was the collection 0, which we represent with the PlaceValue 1. 1|1 = 1, so the count is 1. The second example was the collection 1, which we represent with the PlaceValue 01. 01|1 = 1, so the count is 1. The third example was the collection 0,1 , which we represent with the PlaceValue 11. 11|1 = 2, so the count is 2. The fourth example was the collection 0,1,3 , which we represent with the PlaceValue 1101. 1101|1 = 3, so the count is 3.

We now have both a way to represent collections, and a way to measure them. We continue with harder collections.

How would we represent the collection 0,1,2,… ? Apparently, it would be the PlaceValue 111… . And how do we get the count? Apparently, it would be 111…|1 = ∞. It seems consistent. How would we represent the collection 0,2,4,… ? Apparently, it would be the PlaceValue 010101… . And how do we get the count? Apparently, it would be 010101…|1 = ∞. This is at least as consistent as the standard approach. To calculate the probability of even given int we could divide probabilities yielding ∞/∞. However this indeterminate form, resulting from destroyed information, can no longer yield any useful information like 1/2. Apparently, doing it this way is also as weak as the standard approach.

This is not unlike the corresponding awkwardness of traditional calculus. Simply, h/h | 0 yields 1, whereas (h|0)/(h|0) yields NaN. With PlaceValue 10/10 yields 1, regardless of the base.

The probability of even given int is 010101… / 111… . We can plug the base in at the end, instead of the beginning. No problem.

What about the problem of dividing infinite sequences? Is that hard? Well, they are repeating sequences and so have a rational (i.e. a ratio) expression. We can either convert to rational and solve, or better yet just start with ratios. If starting with a sequence, we can use an algorithm to convert. Alternatively, we can remember common sequences.

<table>
<tr><td>1 / 11</td><td>=</td><td>1<s>1</s>1<s>1</s>1<s>1</s>… </td><td> , </td><td>1 / 1<s>1</s>1<s>1</s>1<s>1</s>… = 11</td></tr>
<tr><td>1 / 1<s>1</s></td><td>=</td><td>111111… </td><td> , </td><td>1 / 111111… = 1<s>1</s></td></tr>
<tr><td>1 / 101</td><td>=</td><td>10<s>1</s>010… </td><td> , </td><td>1 / 10<s>1</s>010… = 101</td></tr>
<tr><td>1 / 10<s>1</s></td><td>=</td><td>101010… </td><td> , </td><td>1 / 101010… = 10<s>1</s></td></tr>
</table>

The probability of even given int = 1/10<s>1</s> / 1/1<s>1</s> = 1<s>1</s> / 10<s>1</s> = 1<s>1</s> / 1<s>1</s>\*11 = 1/11 . We could leave the answer as 1/11 or interpret 1/11 base 1 as 1/2. 1/2 is the correct answer that we were looking for. The probability of even given int is 1/2.

We get the right answer 1/2 without having to resort to ad hoc limits of subset of all even numbers over subsets of all ints. It is cleaner. It is rational arithmetic.

Earlier we saw that classical approaches in some cases yields the indeterminate form ∞/∞ which is of little use because the information has been destroyed. We now investigate the 0/0 cases.

What is the probability of drawing the number 0 out of all ints? Classically 1/∞ = 0. What is the probability of drawing the number 0 or 1 out of all ints? Classically 2/∞ = 0. What is the probability of drawing the number 0 out of all ints given that you've drawn 0 or 1 out of all ints? Classically 0/0 which is an uninformative indeterminate form. If the size of the sample-space (i.e. the denominator) is ∞, while the size of the samples (i.e. the numerator) is finite, then the ratio is 0. Using this 0 is further computations can result in an indeterminate form 0/0. Earlier we saw if the size of the sample-space (i.e. the denominator) is ∞, while the size of the samples (i.e. the numerator) is ∞, then the ratio is an indeterminate form ∞/∞. Taken together we see that classically, when the sample-space is infinite indeterminate form arise often, either as 0/0 or ∞/∞.

We now try the small over large ratio again, this time with PlaceValue.

What is the probability of drawing the number 0 out of all ints?  1/111111… = 1<s>1</s>. We could leave the answer as 1<s>1</s> or interpret 1<s>1</s> base 1 as 0. This is identical to the classical result. What is the probability of drawing the number 0 or 1 out of all ints? 11/111111… = 11 / 1/1<s>1</s> = 11 * 1<s>1</s> = 10<s>1</s>. We could leave the answer as 10<s>1</s> or interpret 10<s>1</s> base 1 as 0. This is identical to the classical result. What is the probability of drawing the number 0 out of all ints given that you've drawn 0 or 1 out of all ints? 1<s>1</s> / 10<s>1</s> = 1<s>1</s> / 1<s>1</s>\*11 = 1/11 . We could leave the answer as 1/11 or interpret 1/11 base 1 as 1/2. This is the correct answer, and differs from the classical result which is an indeterminate form 0/0.

Why does this work so well when classical results work so poorly? Well, the simple answer is that we are just not throwing away information. More sophisticated answers would probably mirror the question of why probability updates work better than logic updates. Logic relies heavily on modularity including the law of detachment, which throws away information of how the information was gotten. We are left with only the projection of the formula into a space of values. Modularity guarantees that functions of composite formulas be simplifiable by application of those functions to subformulas and then combining the values of those subformulas to get the sought after value of the composite formula. This makes some things easy to compute, and others hard if not impossible. This approach is often called extensional semantics. In general, functions of composite formulas cannot just be decomposed into simple values of subformulas. The more general approach is often called intensional semantics. The problems of calculus and probability don't seem to work well with extensional semantics. The simplifying assumptions of extensional semantics over-simplify and destroy the needed information. With an intensional semantics, which does not over-simplify, the answers are readily gotten. PlaceValue can be seen as such an example.

Furthermore, it seems like ratios may preserve information better than sequences. Consider 1/11. Earlier we calculated 1/11 | 1 = 1/2. This was simple and true (as in trust-worthy). Recall 1 / 11 = 1<s>1</s>1<s>1</s>1<s>1</s>… . Now let's substitute. 1/11 | 1 = 1<s>1</s>1<s>1</s>1<s>1</s>… | 1. What is 1<s>1</s>1<s>1</s>1<s>1</s>… | 1 ? Well, we can immediately re-substitute back to 1/11 | 1 = 1/2. So, it seems that the answer must be 1/2. Can we get it without re-substituting? 1<s>1</s>1<s>1</s>1<s>1</s>… | 1 = 1-1+1-1+1-1… . What does 1-1+1-1+1-1… equal? Well, ordinary calculus calls this a divergent sum because the partial sums 1,0,1,0,1,0,… don't converge. Advanced calculus redefines addition again (the original calculus redefinition of addition was insufficient) to something like limits of partial averages, which converge on 1/2. So using advanced calculus, we know the sum 1-1+1-1+1-1… = 1/2. Conveniently, this is consistent with our 1/11 | 1 = 1/2. Inconveniently, it required stretching the already stretched definition of addition by limits, to that of limits of limits. The expansion of a ratio to a sequence seems to have the same awkward character of extensional semantics. The ratio seems to possess all of the information. The sequence seems to be a shadow. In this case, the shadows may contain all the information. However, manipulating these shadows requires delicate care otherwise you just immediately call 1-1+1-1+1-1… an indeterminate form, and conclude extensional information loss. By comparison, ratio manipulation is more robust. Intensional semantics suggest that we keep the ratio form. Expanding into extensional sequence values results in forms that are indeterminate for traditional calculus, or made determinate by advanced calculus. The robust information preservation of ratios appear to make ratios better forms than sequences. We could define an intensional semantics where the formulas are ratios and compositions thereof, and that not all functions of formulas are guaranteed to be gotten from compositions of functions of subformulas.

However, there is an issue. Consider the probability of odd given even. We can't just do 010101… / 101010… = 10/10<s>1</s> / 1/10<s>1</s> = 10 / 1 = 10. Then 10|1 = 1. 1 is the wrong answer. This is because P(A|B) = P(A&B)/P(B) . So, we do 010101…⊗101010… / 101010… = 000000… / 101010… = 0. 0 is the right answer. The probability of drawing an odd from an even is 0. Here we use ⊗ to calculate the conjunction (and). If we cannot find a way to perform conjunction without sequences, then at least for the time being we are forced to keep them (as an aside we don't appear forced to because every other 1/10<s>1</s> ⊗ every third 1/100<s>1</s> seems to be every sixth = 2*3 so we can ⊗ without converting to sequence). Either way, we are still not forced to distribute | over every operator (this is a false entensional assumption).

While ⊗ seems to compel us to use the expansion instead of the ratio, at least in some (and perhaps in all) cases we can apply ⊗ to the ratios directly. Repeating expansions like 1 / 1<s>1</s> = .111111… can have ⊗ applied to the repetend. All repeating expansions have a repetend. There are simple rules for deriving the repetend exactly from the ratio. If the denominator is of the form 100...00<s>1</s> with n zeros in the middle then the numerator is the repetend and the length of the repetend is n+1 (with zero padding if necessary). Furthermore, every repeating expansion is of the form with denominator 100...00<s>1</s> .

It is not entirely clear where to place the blame of the information loss. It does appear that PlaceValue Ratios contain the same amount of information as repeating PlaceValues, similar to how fractions and decimal expansions have the same information. Perhaps it is the | operator that is destroying the information. Perhaps no information is destroyed when translating between ratios and expansions. This seems right, given all the examples that we've seen. It seems that all of the examples that we have seen (from the simple to the complex) are examples of configurations that correspond to some PlaceValue Ratio (or equivalently PlaceValue Expansion) and that the | operator projects some distinct configurations to the same object thereby destroying information.

Another important point of note is that while it may seem that the ratio form is good because it converges, it should be noted that the sequence form always comes in pairs (an increasing sequence and a decreasing sequence). While it may be the case that both diverge, it may not. The ratio 1/21 can produce the divergent alternating sequence …<s>㉜</s>⑯<s>8</s>4<s>2</s>1. We know from evaluating the ratio that the answer is 1/3, meaning that the sequence sum must also be 1/3. We can also produce the sequence .½<s>¼</s>⅛<s>⑯</s>⁻¹㉜⁻¹<s>64</s>⁻¹… . The sum of this sequence is convergent and does converge to 1/3. It is handy to be able to translate between ratio, and left and right division, and know that they must be equal.

<table>
<tr><td>…<s>1</s>1<s>1</s>1<s>1</s>1</td><td> = </td><td>1 / 11</td><td> = </td><td>.1<s>1</s>1<s>1</s>1<s>1</s>… </td></tr>
<tr><td>…111111</td><td> = </td><td>1 / 1<s>1</s></td><td> = </td><td>.111111… </td></tr>
<tr><td>…<s>㉜</s>⑯<s>8</s>4<s>2</s>1</td><td> = </td><td>1 / 21</td><td> = </td><td>.½<s>¼</s>⅛<s>⑯</s>⁻¹㉜⁻¹<s>64</s>⁻¹… </td></tr>
<tr><td>…<s>64</s>⁻¹㉜⁻¹<s>⑯</s>⁻¹⅛<s>¼</s>½</td><td> = </td><td>1 / 12</td><td> = </td><td>.1<s>2</s>4<s>8</s>⑯<s>㉜</s>… </td></tr>
</table>

#### LC Circuits

<i>circuit.html</i> models LC Circuits using the PlaceValue datatype, instead of real functions. It is analogous to Laplace solution of differential equations, or operational calculus.

#### PlaceValue Mechanics

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

Those already familiar with Taylor's Series, Laplace Transform, Generating Functions, and Exponential Generating Functions may have an alternate explanation for the simplicity of these operators, including the pointwise scaling. If you imagine a sequence of Taylor coefficients of a function, where the nth slot represents the coefficient of the nth power of x. If I shift the sequence by 1 spot, I have just multiplied by x (or divided if I shift the other way). If I take the derivative of the function, then by the power-rule ( Dx^n = nx^(n-1) ) each element will first be scaled by its power of x (which also corresponds to its position in the sequence) then it will be shifted by 1. Differentiating is scaling and shifting. Integrating is the reverse. Now the same holds for Exponential Generating Functions (i.e. the Laplace Transform of a function), except for the fact that since in an Exponential Generating Function the nth slot represents not the nth coefficient of x^n, but the nth coefficient of x^n/n!. Now shifting is differentiating. Now multiplying by x is scaling and shifting.

We actually have enough now to show Heisenberg's Uncertainty Principle. And do just that in <i>Mechanics.html</i>. For pedagogical simplicity (and without loss of generality) we do it with the pseudo-momentum operator 10, and the true momentum operator i0. Formally, we show xp-px=iħ. Or in natural units, xp-px=i. Furthermore, since the factor i plays no interesting part in xp-px (while it does play an interesting part in the Schrodinger Equation with the sign of p^2), we also show a simplified construction with xp-px=1.

In Wave Mechanics, Heisenberg's Uncertainty Principle follows from the fact that the derivative operator doesn't commute with multiplication by x. Which is ungraspable without calculus. It is somewhat more elegant in Matrix Mechanics, where Heisenberg's Uncertainty Principle follows from the fact that Matrix Multiplication is not always commutative, and specifically is not for position and momentum matrices. This is ungraspable without linear algebra. In PlaceValue mechanics, Heisenberg's Uncertainty Principle follows from the fact that arithmetic multiplication doesn't commute with an even more naive kind of multiplication (point-wise multiplication [12⊗34=38]). This is graspable in elementary school.

<i>mechanics2.html</i> is a different refactoring of Q.M. . Whereas mechanics.html was based on the Laplace inspired data-type laplace.js, mechanics2.html is based on the Fourier inspired data-type fourier2.js. Whereas mechanics.html's underlying data-type laplace.js was inspired by the Laplace transform, mechanics2.html's underlying data-type fourier2.js is not inspired by the Fourier transform but the Fourier series, and a 2D version at that. One benefit of mechanics2.html is the ease of representing multidimensional space-time states as integers, albeit 2D integers. For example, ψ(x)=exp(i(2x+t)) is

<pre>
100
000
</pre> 

One downside of this economy appears to be that fourier2.js as used by mechanics2.html is not large enough to handle all quantum states of interest (i.e. solutions of the Schrödinger Equation), whereas laplace.js as used by mechanics.html is large enough (at least in the 1D case). The quantum states that mechanics2 can represent can be plugged into the Schrödinger Equation and checked to see what value of mass that solution has (admittedly a backward kind of situation). But that's what you get for its barebones approach which may be better for pedagogical and academic purposes than for anything else. Mechanics.html on the other hand allows for full normal forward solution of the Schrödinger Equation, as one would expect.

#### Convolution

<i>convolution.html</i> is a demo for lossless 2D image convolution and deconvolution. PlaceValue multiplication is convolution. PlaceValue division is deconvolution. The demo displays both representations : image & PlaceValue . Users may enter their own image by entering the corresponding PlaceValue . To be precise the demo uses SparsePlaceValue.

One interesting innovation is how the relationship between the images is represented. In many applications, we see representation such as a * b = c . One way to interpret this is that all operators are binary. So a * b = c would mean (a * b) = c where a * b stands in relation (equivalence) to c. Also the a * b part is another binary relation. In Prolog we might write this as mul(A,B,C) indicating that A,B, & C stand in multiplicative relation to eachother, with position disambiguating meaning. This is reminiscent of SmallTalk where we have mixfix operators. Something like 'A hit B with C' where 'hit with' is a mixfix operator. Instead of seeing a * b = c  as 2 binaries we can see it as 1 trinary. There is an advantage. One advantage is division is not a separate operation. To express that c is the quotient of a & b, I would normally write c = a / b. Now I needed a whole new operation. I could implicitly write c * b = a , but this would be understood as an implicit expression of that relation. There is a broken symmetry. I can be explicit for multiplication but only implicit for division with 1 symbol, or I must use 2 symbols. With trinary operators we always express symmetrically. There is the issue of C being on the right in the expression mul(A,B,C). This is true. However, we are not limited to solving only for the last, we can solve for any. This is because Prolog does not distinguish between in and out variables. If I write c = a * b, then in most languages the a * b is computed and stored into c. I can't specify the c and a and ask for b. Well, I can but I must change all the syntax just to ask for the a (instead of keeping the relation the same and querying a). For example, instead of c=a\*b to solve for a I would write a = b/c. I must specify an execution plan basically, instead of merely specifying the relation, and then querying. In Prolog plus(2,3,C) , will respond with C=5. plus(2,W,5) , will respond with W=3. The relation can always be expressed in the same way, and only the querying changes. Prolog's representations are with characters. However, one can easily imagine doing the same thing with graph representations. plus(A,B,C) could look like a circuit element of an OR-gate where the A & B are presented on the leads of the left side of the OR-Gate, and C is presented on the lead of the right side of the OR-gate. Really, this would be a PLUS-Gate. I could put 1 and 2 on the left of the PLUS-Gate and C (or just leave it blank) on the right side of the PLUS-gate, and it would produce the missing 3. Since the variables are not constrained to be only in for some and only out for others then similarly, I could put a 3 on the right side, and a 1 on the top-left lead, and B (or just leave blank) the bottom-left gate, and it would produce the missing 2.

We may use this understanding of relation to represent image relations. We use a graphical element that has 3 prongs (1 Product, and 2 Factors). The images are arranged equally spaced, at equal angles, circularly around the relator. If we want to find the product (convolution) of 2 images, then we spin the relator (like a dial) until the 2 Factor Prongs are on the things that we want to convolve. Then whatever the product is pointing to we clear it out. Then when everything is setup we request that that configuration be solved (hit a button). The result is that the empty part is filled in with the correct answer (in this case the product [convolution]). We may deconvolve, by having the product-prong point to something, have 1 of the factor-prongs point to something else, and clear out the remaining factor. Then when everything is setup we request that that configuration be solved (hit a button). The result is that the empty part is filled in with the correct answer (in this case the quotient [de-convolution]).

The relational approach demystifies some asymmetries, as well as providing a relatively strait-forward interface, for specifying what you know, and what you want to know.

Apart from the 2D mode, there is also a 1D mode.

The 2D mode could be thought of as an image of the heat-map (displaying z=f(x,y) as the intensity z as a function of x & y) of the data.

The 1D mode may be thought of as a graph (in the elementary-school-graph sense, not the graph-theory sense) of the data. In this sense of graph we may think y=f(x) where the height is graphed as a function of x.

For example, the PlaceValue 421 (in big-endian) would look like this:

<pre>
  *
  *
 **
***
</pre>

This is relatively normal. However, we may rethink of the concept of graphing (or plotting) not as a different mode for visualizing the data, but really just a different way of representing the digits.

For example, in Chinese the digit 1 is _ , the digit 2 is =, and the digit 3 is ≡. Instead of writing 123, I can write \_=≡. If we stop and think about it, plotting a sequence of data is not a data visualization approach, it is a different number system, or merely different digit.

123

\_=≡

<pre>
  *
 **
***
</pre>

The idea that we are doing a fundamentally visual thing, whereas before we were doing a fundamentally symbolic thing, is not right. The difference between digital and analog is absent.

There seems to be something fundamental about

<pre>
  *
 **
***
</pre>

We may think of this as analog, but it is also digital. If we encode the digits as 123, it does seem to have lost its analog character. We may also consider representing ½23. Then we would use ½ of an object.

<pre>
  ▇
 ▇▇
▄▇▇
</pre>

This still seems to be both fully analog, and fully digital at the same time.

What if I want to represent 12π (sequence 1,2,π) ? Now I may be in trouble. I can represent this symbolically (digitally). However, if I represent this in analog, then I seem to lose the symbolic (digit) information

<pre>
  ▁
  ▇
 ▇▇
▇▇▇
</pre>

I used a digital approximation. I don't have access to an exact block of height (π-3). And if I did how could you confirm just from the height that it was exactly (π-3)? It may be possible but it is not clear.

Furthermore, we may allow negative digits.

In sum, it seems that if we are not graphing real numbers just integers (and maybe rationals too), then there is no distinction between the sequence and the graph of a sequence, for appropriate choice of digit representation. On the bright side, for real numbers, we can think that digital approximations, and analog approximations are the same, for appropriate choice of digit representation.

#### ConvNet

<i>convnet.html</i> is a demo for convolutional learning. As PlaceValue multiplication is convolutional by nature, PlaceValue division is deconvolutional by nature. There is however an unfortunate asymmetry in its naive definition of division. 1/11 = 0.1<s>1</s>1<s>1</s>... sums inverse powers of its agnostic base. This results in a convergent series when the base is greater than 1, but a divergent series when the base is less than 1. This elicits a new kind of division to restore symmetry. The old division may be called right division as new digits are continually added to the right to complete the sum. This is somewhat arbitrary, and problematic for bases less than 1. A solution is a new kind of division: left division. ...1<s>1</s>1<s>1</s>1 = 1 \ 11 . For bases less than 1, this sums positive powers of its base and yields a convergent sum.

What kind of division would be appropriate for deconvolution? Right division would asymmetrically magnify remainder differences indefinitely to the right in a way that is not logically convergent for convolutional learning. Left division suffers similar problems but in the other direction. They are both really overfitting noise. What deconvolution really needs is a balance between the 2 that does not accumulate error indefinitely on either side. Deconvolution needs a kind of center division that best fits noise into the middle without diverging off either end. Many plausible approaches may come to mind to suit such constraints. We take a rather naive approach of the best linear approximation of an overdetermined system. This can be understood as solving Ax=b for a matrix A with more rows than columns, and so A is not classically invertible. We solve the system via the Moore-Penrose pseudoinverse. In other words, we do a least squares approximation. Using this definition of center division, we find that 1 ÷ 11 = 1.

The value of 1 ÷ 11 may not be of particular interest. Getting a filter to learn edge detection automatically may be. A simple edge may be represented by a number like 11110000. The edge is seen at the fifth position. The filter we seek would output 10000 to indicate that the edge is in position 5. So, we seek some filter f such that f x 11110000 = 10000. Solving for f : f = 10000 ÷ 11110000. This yields the desired well-known filter 1<s>1</s>.

#### Generating Functions

<i>generatingfunction.html</i> is a demo for generating functions.

Consider 1/<s>1</s>1 = 11111. This expresses succinctly what generating functions express unsuccinctly and asymmetrically with 2 different data-types (sequence & function) as well as needlessly introducing a placeholder variable (x). That is, the sequence 1,1,1,1,1 has the generating function 1/(1-x).

Consider 101 = 101. This expresses succinctly what generating functions express unsuccinctly and asymmetrically with 2 different data-types (sequence & function) as well as needlessly introducing a placeholder variable (x). That is, the sequence 1,0,1 has the generating function x^2+1.

Generating functions could be useful if you were adept at manipulating algebraic expressions, and you wanted to translate that power into the domain of sequences. However, it requires you to pay the extra cognitive overhead of making one-way translations asymmetrically back and forth from one domain to a different domain. It also results in having twice as many theorems etc. (one for each domain).

Possibly the worst part is that it moves attention away from seeing symmetries inside the domain (you can think of this as patterns intrinsic to the terrain of study) toward seeing symmetries between domains (you can think of this as patterns you see between two different maps that you made of the same terrain). In other words, we shift from studying the terrain, to studying idiosyncratic properties of maps, that have no bearing on the terrain.

Using PlaceValue, we can see immediately that if 1/<s>1</s>1 = 11111 then we should also have another equation 1/11111 = <s>1</s>1 . This is an example of the so-called intrinsic symmetry (of the terrain). Trying to see this simple symmetry, using the needlessly complicated maps of the formalism of generating functions is prohibitively expensive.

The astute reader might note the sign issue that I magicked over. I wrote 1/<s>1</s>1 = 11111. This is not quite true. 1/<s>1</s>1 = .<s>11111</s> . So, the sign is different. Unfortunately, the powers are also different because of the position of the PlaceMark. Instead of using /, I really should have used \ . I should write 1\ <s>1</s>1 = 11111. Now it's right. In short, to model generating functions as PlaceValue use \ instead of /. In long, don't model generating functions; know when to use / and when to use \ .

#### Indeterminates

The branch of mathematics that is commonly referred to as Abstract Algebra talks about things called indeterminates. These indeterminates are used in what is called polynomial rings. Rings support addition, subtraction, and multiplication, for elements in a certain set. In a polynomial ring, the set elements look like polynomials, in that the elements are syntactically indistinguishable from the syntax of polynomials. For example, x+5 is a polynomial. Also x+5 is an element of a polynomial ring. Since the syntax is identical, one may be tempted to think that they are the same thing. They are not the same thing. Correspondences can be made. However, just because one of the two has a certain property, it doesn't mean the other does. Polynomials can be added. So can elements of a polynomial ring. x is a polynomial. x is an element of a polynomial ring. One difference is that while it is possible for the polynomial x to be equal to 0, it is not possible for the element of a polynomial ring x to be equal to 0. Since the x's are different, we give them different names. The x in a polynomial is called a variable. The x in a polynomial ring is called an indeterminate. This distinction allows for a clarity which is not possible with polynomials. In the case of polynomial rings, the x may support the operation of substitution, in which x may be substituted with another element. Substitution can be thought of as a function that maps from polynomials rings to reals. For polynomial rings the question of x being equal to 0 may be considered a type error. x is of type polynomial ring; 0 is of type real. Alternatively, if the 0 were also of type polynomial ring, it would still not be the case that x = 0.

What if h is an indeterminate, and m is a variable, and we want to solve m \* h = h ? The answer is m = 1. The answer isn't 1 if h≠0 else 0/0. In other words, the answer is simple, not a function with a point discontinuity. Why is the answer simple? One response is that it just works. We can calculate the slope of the tangent line simply without worrying about misleading complications requiring extra complications. This answer suggests that the logic required for calculus is simple. The logic should fit the complexity of the domain. So, the answer is that it happens to correctly model the situation. This is a primitive argument. We could ask why. However, we can always ask why in infinite regress. Every explanation will either end at a primitive, or always require a new explanation for the new question infinitely, or end in a loop. This is the same as network chains that either terminate, or continue in a chain forever, or loop back on themselves. In our case, the simple model of indeterminates work, and that is that. It is a primitive argument.

Another approach is to attempt to ground it in a different logic that is already accepted for some other reason. That logic also is either primitive, loopy, or infinite regress. However, that logic is part of a network that is well-understood, so merely connecting your unclear explanation to it, counts as something of a proof. There is a field of study in mathematics called analysis, including real analysis and complex analysis. Why indeterminates work can be given an explanation by this field. We may imagine a sketch in that language. It may go something like the following. When we divide functions in analysis we may get removable discontinuities. To find things like the derivative we look at the limits, not the point where the discontinuity exists. However, we may remove the discontinuities by replacing the point discontinuities with the limit points. Instead of taking the limit, we may consider the functions after the discontinuities have been removed. We can then consider the values where the function was (but after removal isn't) discontinuous. Evaluating there gives us the same answer as taking the limit, because it has essentially already been taken. The reason indeterminates and operations on them work, in the same way limits do and always give the same answer, is because these operations always transform a continuous function into another continuous function (or at least not point-wise discontinuous). Instead of taking the limit, indeterminates basically skip a step, in an otherwise valid real analysis derivation. This is an explanation that a real analyst might give, claiming that indeterminates work for reasons given by real analysis. We appreciate the vote of confidence of the real analyst, without conceding that their reasoning is in any sense the real reason.

We offer another line of reasoning, which we would not presume to label the real reason, but merely another form of justification. Besides modeling continuous functions, indeterminates can also be thought of as instead modeling objects like line-segments. For example, a rectangle may be x by y, where x and y are indeterminates. These may not be exactly traditional geometric shapes in that there need not be a metric. We may have no length for x or y. At least we do not represent the sides as lengths, but as sides. If the rectangle is x\*y we can recover one side by dividing x\*y by y . We may do x\*y/y yielding x. We may map this space of shapes to another space of numbers with a length map. length(x\*y/y) = length(x) = 5. This would hold even if length(y) = 0. The shape manipulations are done in the shape space. It is not relevant that afterwards we project into a smaller space, where information might get lost. This approach is a different proof scheme than the real-analysis proof scheme. It claims the justifications for the manipulations are different.

Another way of looking at the situation, which is closer to the real analyst approach is in terms of function spaces. We may think the indeterminate x is like the identity function x->x. We can have a function arithmetic x+x=2x (where x is an indetermiate) which corresponds to function space addition x->x + x->x = x->2x. The indeterminate x is an abstraction which could model many things, shapes in the previous argument, and functions in this argument. The indeterminates are just abstractions. However, now we consider them as modeling functions. What about x/x = 1? This is a function space where x->x / x->x = x->1. The identity function divided by the identify function is the one-function. This is an example of a field of fractions made from an integral domain. An integral domain is a ring with no zero divisors. If a\*b=a*\c and a is not the zero element then b=c. We have a function space where cancellation always works. This corresponds to indeterminates modeling integral domains. The astute observer might note that this doesn't actual prove in the same way as the previous 2 proofs. Here we just assume that the function space is an integral domain and/or field. This is effectively, just an assumption about the range of possible answers. The function with a removable discontinuity is just not considered. This is like in machine learning, where the hypothesis space must be assumed. We assume the hypothesis space contains no removable discontinuities. We can use indetermiates to model the function space of such things. Again all proofs terminate in primitives, loop, or regress infinitely. This proof assumes a certain space of answers.

Given these 3 proofs, it may seem that just accepting that indeterminates give the answer is not sufficient. We should always stop to think about it more. For example, while x/x=1, we could imagine another element in the function space: 0 if x≠0 else 1. If this is allowed in the function space, then the function space is not an integral domain m \* x = x has more solutions than m = 1. Assume y represents 0 if x≠0 else 1. We can check if m = 1+y is a solution. m \* x = x. Substitute. (1+y) \* x = x. Distribute. 1 \* x + y \* x = x. Simplify. x + y \* x = x. Subtract x . y \* x = 0. If y is 0 everywhere except origin, and x is 0 at origin then the product is 0 everywhere. 0 = 0. So, the solution is more than m = 1. We also have m = 1 + y as a solution. This is precisely what the real analyst worried might happen. We may have a discontinuity at the origin. By having y we no longer have an integral domain, because we have zero-divisors.

What is the upshot of all this? The upshot is perhaps just because the indeterminates were an integral domain doesn't mean the problem they were modeling is. The problem they were modeling is an integral domain. Continuous functions can be canceled, because the cancellation property holds. The real analyst provides a justification for this. Shape reasoning provides provides an alternate and independent justification. There is also the idea of a function hypothesis, and assuming a space of continuous functions. Indeterminates divide simply. This can be used for calculus. Why this is so depends on who you ask.

PlaceValues are right-sized for this type of problem. They can model continuous (not point-discontinuous) functions. They seem isomorphic to polynomial rings. They don't need the syntax x of an indeterminate. Instead the PlaceValue 10 corresponds to the indeterminate x. When working with PlaceValue you don't have the distraction of looking at a symbol x, wondering what it is, and worrying if it is 0. This is the case for WholePlaceValue. For SparsePlaceValue instead of writing 10 we write 1E1. This is like 1x¹. When we see 1E1 we don't concern ourselves worrying what the E is, and if it is 0. The E separates the coefficient from the power (if we think of them as polynomials). Alternately, thinking about WholePlaceValue 500 means we have a 5 in the 2's place. We can instead represent this like a dictionary data-type as in JSON {2:5} where 2 is the key and 5 is the value. Similarly, we can write 5E2. The E separates the Key from the Value. Revisiting indeterminates, when we see 5x², then we can think of the x as a syntax separating the Key from the Value. x and E and : are all the same. They are syntax separators. We don't ask if they are 0. That doesn't make sense.

## Summary & Future Work

### Summary

PlaceValue is an intuitive and powerful data-type that can handle a wide range of academically relevant use-cases.

### Future Work

Consider a list of whole numbers. It would look something like this : [0,1,2,3,…] . There is a naturalness to the fact that the first number that you encounter when reading the list also happens to be the first whole number. There is also a naturalness to the … being at the end meaning they continue in 'this' way (the word 'this' here is a backward reference to the sequence already read, and so already recognized). Alternatively we could write [...,3,2,1,0]. There is an unnaturalness to the fact that the last number that you encounter when reading the list happens to be the first whole number. There is also an unnaturalness to the ... being at the beginning meaning they continue in 'this' way (the word 'this' here is a forward reference to the sequence not yet read, and so not yet recognized).

When the list is laid out in the same order as the reading order there are good outcomes; when it is not there are bad outcomes. This may seem so obvious as not to mention. I wouldn't write the word duck as kcud because then I have to scan forward to pronounced the d first then scan backward to pronounce the rest. Some things are so obvious they go without saying, until you see someone break the convention, then we are forced to talk about it.

Apparently we inherited our number system from Arabs. They followed the convention of writing the numbers in the same order that they read in. As it happens, they read in a different order, but this shouldn't matter. Unfortunately, due to broken convention during translation, now it matters a lot. When translating out of Arabic, the word order was correctly translated, but the number order was not translated. This had the unfortunate effect of reversing the number order. Whereas, the number twelve should have been translated to 21 (first the smallest digit, then the next smallest, ...) it was wrongly translated as 12. Written as 21 you know immediate the weight of the value 2 and move on. With the mistranslation, you have to read ahead just to find the weight of each digit. Also instead of starting with the bounded sized end we start with the unbounded sized end.

I have kept this bizarre mistranslation convention in my work so the number twelve is written as 12. This has made coding inelegant, by forcing me to break the symmetry of my code with intermittent calls to the reverse() function (as well as writing some for-loops backwards), diverting my attention off the task at hand with this constant mental overhead, of broken translation. This is all to serve the user, who I assume has likely grown up with a backwards convention.

For future work, I would clean the code by removing the overhead of intermittent calls to the reverse() function (as well as rewriting backwards for-loops). This would present the number twelve as 21, which is better in the long run.

## Appendices

### Dependencies

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
<tr><td>Exponential &amp; Fourier</td><td>depends on Laurent</td><td>depends on MarkedPlaceValue</td><td>depends on WholePlaceValue</td><td>depends on Rational.</td></tr>
<tr><td>Fourier &amp; Laplace</td><td></td><td>depends on MarkedPlaceValue</td><td>depends on WholePlaceValue</td><td>depends on Complex.</td></tr>
<tr><td>Polynomial2</td><td></td><td></td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>Laurent2</td><td></td><td>depends on MarkedPlaceValue2</td><td>depends on WholePlaceValue2.</td><td></td></tr>
<tr><td>Complex Exponential &amp; Fourier2</td><td>depends on Complex Laurent</td><td>depends on ComplexPlaceValue</td><td>depends on Whole PlaceValueComplex2.</td><td></td></tr>
</table>

### External Dependencies

<a target='_blank' href='http://jquery.com'>jQuery</a> & <a href='http://mathjs.org'>mathjs</a>

### System Requirements

A standards-compliant browser (Firefox 79.0+ or equivalent)
