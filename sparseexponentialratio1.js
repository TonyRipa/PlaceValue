
// Author:  Anthony John Ripa
// Date:    12/31/2018
// SparseExponentialRatio1 : a datatype for representing ratios of exponentials; an application of the sparseplacevalueratio1 datatype

class sparseexponentialratio1 extends abstractpolynomial {	//	2018.9	Renamed

	constructor(base, pv) {
		//if (arguments.length < 2) alert('sparseexponentialratio1 expects 2 arguments');
		if (arguments.length < 1) base = 1; //  2017.9
		if (arguments.length < 2) pv = new sparseplacevalueratio1(); //  2017.9
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
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponentialratio1(a.base, new sparseplacevalueratio1().parse(JSON.stringify(a.pv))) }    //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparseexponentialratio1 : SymbolNode')
			if (node.name == 'i') return new sparseexponentialratio1([], sparseplacevalueratio1.parse('i'));
			{ var s = 'Syntax Error: sparseexponentialratio1 expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexponentialratio1 : OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);        //  2017.10 this
			if (node.fn == 'unaryMinus') {
				var c = new sparseexponentialratio1([], sparseplacevalueratio1.parse(0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new sparseexponentialratio1([], sparseplacevalueratio1.parse(0)).add(a);
			} else {
				var b = this.parse(kids[1]);    //  2017.10 this
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			//return new sparseexponentialratio1([1, null], sparseplacevalueratio1.parse(Number(node.value)));
			return new sparseexponentialratio1(1, new sparseplacevalueratio1().parse(Number(node.value)));
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			var kids = node.args;
			//var kidaspoly = complexlaurent.parse(kids[0])
			var kidaspoly = new sparsepolynomial1().parse(kids[0])  //  2018.4
			var base = kidaspoly.base;
			var ten = new sparseplacevalue1().parse('1E1');   // exp is 2D    2016.1
			//var iten = sparseplacevalue1.parse('1Ei');   // exp is 2D    2016.1
			//alert(JSON.stringify([kidaspoly, ones, tens, itens]));
			var exp = new sparseplacevalue1().parse('2.718').pow(kidaspoly.pv);  //  2017.5
			//alert(JSON.stringify([exp, kidaspoly.pv]));
			//var expi = sparseplacevalueratio1.parse('2.718').pow(kidaspoly.pv.times(sparseplacevalueratio1.parse('i')));  //  2017.5
			var exp2 = exp.pow(-1)
			//var exp2 = exp.reciprocal();
			//var expi2 = expi.pow(-1)
			//alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
			//alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
			var cosh = exp.add(exp2).scale(.5);
			var sinh = exp.sub(exp2).scale(.5);
			if (fn == 'exp') var pv = exp;
			//else if (fn == 'cis') var pv = expi;
			//else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
			else if (fn == 'cosh') var pv = cosh;
			//else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
			//else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
			else if (fn == 'sinh') var pv = sinh;
			else if (fn == 'tanh') return new sparseexponentialratio1(base, new sparseplacevalueratio1(sinh, cosh));   //  2017.8
			//else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
			else alert('Syntax Error: complexexponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');    //  Check   2015.12
			return new sparseexponentialratio1(base, new sparseplacevalueratio1(pv, new sparseplacevalue1().parse(1)));
		} else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
			alert('Syntax Error: sparseexponentialratio1 expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
			return sparseexponentialratio1.parse(node.args[0]);
		}
	}

	align(other) {  //  2017.8
		if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
		if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
		if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }	//	2018.8	Added
	}

	toString() {
		if (this.pv.den.is1()) return new sparseexponential1(this.base, this.pv.num).toString();
		if (this.pv.num.divide(this.pv.den).times(this.pv.den).equals(this.pv.num)) return new sparseexponential1(this.base, this.pv.num.divide(this.pv.den)).toString();
		return '(' + new sparseexponential1(this.base, this.pv.num).toString() + ')/(' + new sparseexponential1(this.base, this.pv.den).toString() + ')';
		//return sparseexponentialratio1.toStringCosh(this.pv, this.base)
	}

	eval(base) {    //  2017.5
		return new this.constructor(1, this.pv.eval(new sparseplacevalueratio1().parse('2.718').pow(base.pv)));
	}

}
