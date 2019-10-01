
// Author:  Anthony John Ripa
// Date:    9/30/2019
// SparseExpressionRatio1 : a datatype for representing ratios of expressions; an application of the sparseplacevalueratio1 datatype

class sparseexpressionratio1 extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new sparseplacevalueratio1(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalueratio1(arg)];
			else[base, pv] = [arg, new sparseplacevalueratio1(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (!(base instanceof String || typeof base == 'string' || base instanceof Number || typeof base == 'number'))
			{ var s = 'sparseexpressionratio1 expects arg1 (base) to be a string or number not ' + typeof base + ': ' + JSON.stringify(base); alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalueratio1)) alert('sparseexpressionratio1 expects argument 2 (pv) to be a sparseplacevalueratio1');
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		if (typeof(this.base) == 'number' || this.base == this.base.toLowerCase()) return this.pv.toString('medium') + ' Base ' + this.base;
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {
		console.log('new sparseexpressionratio1 : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') return parsestr.bind(this)(strornode);
		else return parsenode.bind(this)(strornode);
		function parsestr(str) {
			if (str.includes('base')) { var a = JSON.parse(str); return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv))) }
			return parsenode.bind(this)(math.parse(str == '' ? '0' : str.replace('NaN', '(0/0)')));
		}
		function parsenode(node) {
			if (node.type == 'SymbolNode') {
				console.log('new sparseexpressionratio1 : SymbolNode')
				if (node.name == 'i') return new this.constructor(1, sparseplacevalueratio1.parse('i'));
				return new this.constructor(node.name.toLowerCase(), this.pv.parse('1E1'));
				//{ var s = 'Syntax Error: sparseexpressionratio1 expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			} else if (node.type == 'OperatorNode') {
				console.log('new sparseexpressionratio1 : OperatorNode')
				var kids = node.args;
				var a = this.parse(kids[0]);
				if (node.fn == 'unaryMinus') {
					var c = this.parse('0').sub(a);
				} else if (node.fn == 'unaryPlus') {
					var c = this.parse('0').add(a);
				} else {
					var b = this.parse(kids[1]);
					var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
				}
				return c;
			} else if (node.type == 'ConstantNode') {
				return new this.constructor(1, this.pv.parse(Number(node.value)));
			} else if (node.type == 'FunctionNode') {
				console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
				console.log(node)
				var fn = node.name;
				if (fn == 'exp' | fn == 'cosh' | fn == 'sinh' | fn == 'tanh') var ior1 = this.pv.num.parse(1);
				if (fn == 'cis' | fn == 'cos' | fn == 'sin' | fn == 'tan') var ior1 = this.pv.num.parse('i');
				if (!ior1) { var s = 'Syntax Error: SparseExpRatio1 expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }
				var arg = new sparsepolynomial1(this.pv.num.datatype).parse(node.args[0]);
				var exp = this.pv.num.parse('2.718').pow(arg.pv.times(ior1));
				var exp2 = exp.pow(-1)
				var cosh = exp.add(exp2).unscale(2);
				var sinh = exp.sub(exp2).unscale(2);
				if (fn == 'sin' | fn == 'tan') sinh = sinh.unscale('i');
				if (fn == 'exp' | fn == 'cis') var pv = exp;
				if (fn == 'cosh' | fn == 'cos') var pv = cosh;
				if (fn == 'sinh' | fn == 'sin') var pv = sinh;
				if (fn == 'tanh' | fn == 'tan') return new this.constructor(arg.base, new sparseplacevalueratio1(sinh, cosh));
				return new this.constructor(arg.base.toUpperCase(), new sparseplacevalueratio1(pv));
			}
		}
	}

	align(other) {
		this.check(other);
		if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
		if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
		if (this.base != other.base) { var s = 'Different bases : ' + this.base + ' & ' + other.base; alert(s); throw new Error(s); }
	}

	toString() {
		if (this.pv.den.is1()) return new sparseexpression1(this.base, this.pv.num).toString();
		if (this.pv.num.divide(this.pv.den).times(this.pv.den).equals(this.pv.num)) return new sparseexpression1(this.base, this.pv.num.divide(this.pv.den)).toString();
		if (this.pv.num.points.length < 2)
			return new sparseexpression1(this.base, this.pv.num).toString() + ' / (' + new sparseexpression1(this.base, this.pv.den).toString() + ')';
		return '(' + new sparseexpression1(this.base, this.pv.num).toString() + ')/(' + new sparseexpression1(this.base, this.pv.den).toString() + ')';
	}

	eval(other) {
		if (typeof(this.base) == 'number' || this.base == this.base.toLowerCase()) return new this.constructor(1, this.pv.eval(other.pv));
		return new this.constructor(1, this.pv.eval(this.pv.parse('2.718').pow(other.pv)));
	}

}
