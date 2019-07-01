
// Author:  Anthony John Ripa
// Date:    6/30/2019
// SparseExponentialRatio : a datatype for representing ratios of exponentials; an application of the sparseplacevalueratio datatype

class sparseexponentialratio extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [[], new sparseplacevalueratio(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === rationalcomplex)[base, pv] = [[], new sparseplacevalueratio(arg)];
			else[base, pv] = [arg, new sparseplacevalueratio(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (!Array.isArray(base)) { var s = 'sparseexponentialratio expects argument 1 (base) to be an array but found ' + typeof base; alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalueratio)) alert('sparseexponentialratio expects argument 2 (pv) to be a sparseplacevalueratio');
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {
		console.log('new sparseexponentialratio : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') return parsestr.bind(this)(strornode);
		else return parsenode.bind(this)(strornode);
		function parsestr(str) {
			if (str.includes('base')) { var a = JSON.parse(str); return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv))) }
			return parsenode.bind(this)(math.parse(str == '' ? '0' : str.replace('NaN', '(0/0)')));		
		}
		function parsenode(node) {
			if (node.type == 'SymbolNode') {
				console.log('new sparseexponentialratio : SymbolNode')
				if (node.name == 'i') return new this.constructor([], sparseplacevalueratio.parse('i'));
				{ var s = 'Syntax Error: sparseexponentialratio expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			} else if (node.type == 'OperatorNode') {
				console.log('new sparseexponentialratio : OperatorNode')
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
				return new this.constructor([], this.pv.parse(Number(node.value)));
			} else if (node.type == 'FunctionNode') {
				console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
				console.log(node)
				var fn = node.name;
				if (fn == 'exp' | fn == 'cosh' | fn == 'sinh' | fn == 'tanh') var ior1 = this.pv.num.parse(1);
				if (fn == 'cis' | fn == 'cos' | fn == 'sin' | fn == 'tan') var ior1 = this.pv.num.parse('i');
				if (!ior1) { var s = 'Syntax Error: SparseExpRatio expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }
				var arg = new sparsepolynomial(this.pv.num.datatype).parse(node.args[0]);
				var exp = this.pv.num.parse('2.718').pow(arg.pv.times(ior1));
				var exp2 = exp.pow(-1)
				var cos = exp.add(exp2).unscale(2);
				var sin = exp.sub(exp2).unscale(2);
				if (fn == 'sin' | fn == 'tan') sin = sin.unscale('i');
				if (fn == 'exp' | fn == 'cis') var pv = exp;
				if (fn == 'cosh' | fn == 'cos') var pv = cos;
				if (fn == 'sinh' | fn == 'sin') var pv = sin;
				if (fn == 'tanh' | fn == 'tan') return new this.constructor(arg.base, new sparseplacevalueratio(sin, cos));
				return new this.constructor(arg.base, new sparseplacevalueratio(pv));
			}
		}
	}

	align(other) {
		var base = [...new Set([...this.base, ...other.base])];
		alignthis2base.bind(this)(base);
		alignthis2base.bind(other)(base);
		function alignthis2base(basenew) {
			for (var i = 0; i < this.pv.num.points.length; i++)
				this.pv.num.points[i][1] = alignpower2base.bind(this)(this.pv.num.points[i][1], this.base, basenew)
			for (var i = 0; i < this.pv.den.points.length; i++)
				this.pv.den.points[i][1] = alignpower2base.bind(this)(this.pv.den.points[i][1], this.base, basenew)
			this.base = basenew;
			function alignpower2base(powerold, baseold, basenew) {
				var powernew = [];
				for (var i = 0; i < basenew.length; i++) {
					var letter = basenew[i];
					var posinold = baseold.indexOf(letter);
					powernew.push(powerold.get(posinold));
				}
				if (powernew.length != basenew.length) { var s = 'SparseExponentialRatio: alignment error'; alert(s); throw new Error(s); }
				if (powernew.length==0) return new wholeplacevalue(this.pv.num.datatype);
				else					return new wholeplacevalue(powernew);
			}
		}
	}

	toString() {
		if (this.pv.den.is1()) return new sparseexponential(this.base, this.pv.num).toString();
		if (this.pv.num.divide(this.pv.den).times(this.pv.den).equals(this.pv.num)) return new sparseexponential(this.base, this.pv.num.divide(this.pv.den)).toString();
		if (this.pv.num.points.length < 2)
			return new sparseexponential(this.base, this.pv.num).toString() + ' / (' + new sparseexponential(this.base, this.pv.den).toString() + ')';
		return '(' + new sparseexponential(this.base, this.pv.num).toString() + ') / (' + new sparseexponential(this.base, this.pv.den).toString() + ')';
	}

	eval(base) {
		return new this.constructor(this.base.slice(0, -1), this.pv.eval(this.pv.parse('2.718').pow(base.pv)));
	}

}
