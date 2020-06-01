
// Author:  Anthony John Ripa
// Date:    5/31/2020
// SparseExponentialRatio1 : a datatype for representing ratios of exponentials; an application of the sparseplacevalueratio1 datatype

class sparseexponentialratio1 extends abstractpolynomial {	//	2018.9	Renamed

	constructor(arg) {																							//	2019.3	arg
		var base, pv;																							//	2019.3
		if (arguments.length == 0)[base, pv] = [1, new sparseplacevalueratio1(rational)];						//	2019.3
		if (arguments.length == 1) {																			//	2019.3
			if (arg === rational || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalueratio1(arg)];	//	2019.3
			else[base, pv] = [arg, new sparseplacevalueratio1(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;														//	2019.3
		//if (arguments.length < 1) base = 1;	//	2017.9														//	2019.3	Removed
		//if (arguments.length < 2) pv = new sparseplacevalueratio1();	//	2017.9								//	2019.3	Removed
		if (!(base instanceof String || typeof base == 'string' || base instanceof Number || typeof base == 'number'))
			{ var s = 'sparseexponentialratio1 expects arg1 (base) to be a string or number not ' + typeof base + ': ' + JSON.stringify(base); alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalueratio1)) alert('sparseexponentialratio1 expects argument 2 (pv) to be a sparseplacevalueratio1');
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {  //  2017.9
		console.log('new sparseexponentialratio1 : ' + JSON.stringify(strornode))
		//if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponentialratio1(a.base, new sparseplacevalueratio1().parse(JSON.stringify(a.pv))) }    //  2017.10	//	2019.3	Removed
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponentialratio1(a.base, this.pv.parse(JSON.stringify(a.pv))) }	//	2019.3	this.pv
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparseexponentialratio1 : SymbolNode')
			//if (node.name == 'i') return new sparseexponentialratio1([], sparseplacevalueratio1.parse('i'));					//	-2020.5
			if (node.name.match(this.pv.num.datatype.regexfull())) return new this.constructor(1, this.pv.parse(node.name));	//	+2020.5
			{ var s = 'Syntax Error: sparseexponentialratio1 expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexponentialratio1 : OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);        //  2017.10 this
			if (node.fn == 'unaryMinus') {
				//var c = new sparseexponentialratio1([], sparseplacevalueratio1.parse(0)).sub(a);	//	2019.3	Removed
				var c = new sparseexponentialratio1(1, this.pv.parse(0)).sub(a);					//	2019.3	this.pv
			} else if (node.fn == 'unaryPlus') {
				//var c = new sparseexponentialratio1([], sparseplacevalueratio1.parse(0)).add(a);	//	2019.3	Removed
				var c = new sparseexponentialratio1(1, this.pv.parse(0)).add(a);					//	2019.3	this.pv
			} else {
				var b = this.parse(kids[1]);    //  2017.10 this
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			//return new sparseexponentialratio1(1, new sparseplacevalueratio1().parse(Number(node.value)));	//	2019.3	Removed
			return new sparseexponentialratio1(1, this.pv.parse(Number(node.value)));	//	2019.3	this.pv
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh' | fn == 'tanh') var ior1 = this.pv.num.parse(1);	//	2019.3
			if (fn == 'cis' | fn == 'cos' | fn == 'sin' | fn == 'tan') var ior1 = this.pv.num.parse('i');	//	2019.3
			if (!ior1) { var s = 'Syntax Error: SparseExpRatio1 expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }	//	2019.3
			var kids = node.args;
			//var kidaspoly = complexlaurent.parse(kids[0])
			//var kidaspoly = new sparsepolynomial1().parse(kids[0])	//	2018.4		//	2019.3	Removed
			var kidaspoly = new sparsepolynomial1(this.pv.num.datatype).parse(kids[0])	//	2019.3	this.pv.num.datatype
			var base = kidaspoly.base;
			var ten = new sparseplacevalue1().parse('1E1');   // exp is 2D    2016.1
			//var iten = sparseplacevalue1.parse('1Ei');   // exp is 2D    2016.1
			//alert(JSON.stringify([kidaspoly, ones, tens, itens]));
			//var exp = new sparseplacevalue1().parse('2.718').pow(kidaspoly.pv);			//	2017.5	//	2019.3	Removed
			//var exp = this.pv.num.parse('2.718').pow(kidaspoly.pv.times(ior1));			//	2019.3	this.pv.num,ior1	//	-2020.5
			var exp = kidaspoly.pv.times(ior1).exponential();																//	+2020.5
			//alert(JSON.stringify([exp, kidaspoly.pv]));
			//var expi = sparseplacevalueratio1.parse('2.718').pow(kidaspoly.pv.times(sparseplacevalueratio1.parse('i')));  //  2017.5
			var exp2 = exp.pow(-1)
			//var exp2 = exp.reciprocal();
			//var expi2 = expi.pow(-1)
			//alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
			//alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
			//var cosh = exp.add(exp2).scale(.5);						//	2019.3	Removed
			//var sinh = exp.sub(exp2).scale(.5);						//	2019.3	Removed
			var cosh = exp.add(exp2).unscale(2);						//	2019.3	Unscale
			var sinh = exp.sub(exp2).unscale(2);						//	2019.3	Unscale
			if (fn == 'sin' | fn == 'tan') sinh = sinh.unscale('i');	//	2019.6	Added
			//if (fn == 'exp') var pv = exp;							//	2019.3	Removed
			if (fn == 'exp' | fn == 'cis') var pv = exp;				//	2019.3	Added cis
			//else if (fn == 'cis') var pv = expi;
			//else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
			//else if (fn == 'cosh') var pv = cosh;						//	2019.3	Removed
			if (fn == 'cosh' | fn == 'cos') var pv = cosh;				//	2019.3	-Else +Cos
			//else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
			//else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
			//else if (fn == 'sinh') var pv = sinh;						//	2019.3	Removed
			if (fn == 'sinh' | fn == 'sin') var pv = sinh;				//	2019.3	-Else +Sin
			//if (fn == 'sin') pv = pv.unscale('i');					//	2019.3	//	2019.6	Removed
			//else if (fn == 'tanh') return new sparseexponentialratio1(base, new sparseplacevalueratio1(sinh, cosh));			//	2017.8	//	2019.3	Removed
			if (fn == 'tanh' | fn == 'tan') return new sparseexponentialratio1(base, new sparseplacevalueratio1(sinh, cosh));	//	2017.8	//	2019.3	-Else +Tan
			//else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
			//else alert('Syntax Error: complexexponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');    //  Check   2015.12	//	2019.3	Removed
			//return new sparseexponentialratio1(base, new sparseplacevalueratio1(pv, new sparseplacevalue1().parse(1)));	//	2019.3	Removed
			return new sparseexponentialratio1(base, new sparseplacevalueratio1(pv));										//	2019.3	-sparseplacevalueratio1(pv)
		}
	}

	align(other) {			//	2017.8
		this.check(other);	//	2019.2	Added Check
		if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
		if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
		if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }	//	2018.8	Added
	}

	toString() {
		if (this.pv.den.is1()) return new sparseexponential1(this.base, this.pv.num).toString();
		if (this.pv.num.divide(this.pv.den).times(this.pv.den).equals(this.pv.num)) return new sparseexponential1(this.base, this.pv.num.divide(this.pv.den)).toString();
		return '(' + new sparseexponential1(this.base, this.pv.num).toString() + ')/(' + new sparseexponential1(this.base, this.pv.den).toString() + ')';
	}

	eval(base) {    //  2017.5
		//return new this.constructor(1, this.pv.eval(new sparseplacevalueratio1().parse('2.718').pow(base.pv)));	//	2019.3	Removed
		return new this.constructor(1, this.pv.eval(this.pv.parse('2.718').pow(base.pv)));							//	2019.3	this.pv
	}

}
