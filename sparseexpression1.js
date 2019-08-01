
// Author:  Anthony John Ripa
// Date:    7/31/2019
// SparseExpression1 : a datatype for representing sparse polynomials & exponentials; an application of the SparsePlaceValue1 datatype

class sparseexpression1 extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new sparseplacevalue1(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalue1(arg)];
			else[base, pv] = [arg, new sparseplacevalue1(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (!(base instanceof String || typeof base == 'string' || base instanceof Number || typeof base == 'number'))
			{ var s = 'sparseexpression1 expects arg1 (base) to be a string or number not ' + typeof base + ': ' + JSON.stringify(base); alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue1)) { var s = 'sparseexpression1 wants arg2 to be sparseplacevalue1 not ' + typeof pv +':' + JSON.stringify(pv); alert(s); throw new Error(s); }
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		if (typeof(this.base) == 'number' || this.base == this.base.toLowerCase()) return this.pv.toString('medium') + ' Base ' + this.base;
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {
		console.log('new sparseexpression1 : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv))) }
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'SymbolNode') {
			console.log('new sparseexpression1 : SymbolNode')
			if (node.name == 'i' && this.pv.datatype !== rational) return new this.constructor(1, this.pv.parse('i'));
			return new this.constructor(node.name.toLowerCase(), this.pv.parse('1E1'));
			{ var s = 'Syntax Error: sparseexpression1 expects input like 1, exp(x), cosh(y), exp(z), sinh(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexpression1 : OperatorNode')
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
			return new this.constructor(1, new sparseplacevalue1(this.pv.datatype).parse(Number(node.value)));
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh') var ior1 = this.pv.parse(1);
			if (fn == 'cis' | fn == 'cos' | fn == 'sin') var ior1 = this.pv.parse('i');
			if (!ior1) { var s = 'Syntax Error: sparseexpression1 expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			var kids = node.args;
			var kidaspoly = new sparsepolynomial1(this.pv.datatype).parse(kids[0]);
			var base = kidaspoly.base;
			var exp = new sparseplacevalue1(this.pv.datatype).parse('2.718').pow(kidaspoly.pv.times(ior1));
			var exp2 = exp.pow(-1)
			if (fn == 'exp' | fn == 'cis') var pv = exp;
			if (fn == 'cosh' | fn == 'cos') var pv = exp.add(exp2).unscale(2);
			if (fn == 'sinh' | fn == 'sin') var pv = exp.sub(exp2).unscale(2);
			if (fn == 'sin') var pv = pv.unscale('i');
			return new this.constructor(base.toUpperCase(), pv);
		}
	}

	toString() {
		if (typeof(this.base) == 'number' || this.base == this.base.toLowerCase()) return toStringXbase(this.pv, this.base);
		return toStringCosh(this.pv, this.base)
		function toStringCosh(pv, base) {
			var s = pv.clone();
			var ret = '';
			hyper('cosh(', +1);
			hyper('sinh(', -1);
			if(s.datatype===rational)
				ret += toStringXbase(s, base);
			else
				ret += toStringCos(s, base);
			return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
			function hyper(name, sign) {
				for (var i = 4; i >= -4; i--) {
					if (i == 0) continue;
					if (i < 0) continue;
					var l = s.get(i).toreal();
					var r = s.get(-i).toreal();
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {
						var n = m * 2;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
						s = s.sub(new sparseplacevalue1(s.datatype).parse('1E' + i).add(new sparseplacevalue1(s.datatype).parse('1E' + (-i)).scale(sign)).scale(m));
					}
				}
				ret = ret.replace(/\+\-/g, '-');
			}
		}
		function toStringCos(pv, base) {
			var s = pv.clone();
			var ret = '';
			hyper('cos(', +1, 0);
			hyper('sin(', -1, 1);
			ret += toStringXbase(s, base);
			return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
			function hyper(name, sign, ind) {
				for (var i = 5; i >= -5; i--) {
					if (i == 0) continue;
					if (i < 0) continue;
					var parser = new s.datatype();
					var l = (ind == 0) ? s.get(parser.parse('i').scale(i)).r : s.get(parser.parse('i').scale(i)).i;
					if (typeof l != 'number') l = l.toreal();
					var r = (ind == 0) ? s.get(parser.parse('i').scale(-i)).r : s.get(parser.parse('i').scale(-i)).i;
					if (typeof r != 'number') r = r.toreal();
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {
						var n = m * 2 * sign;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
						s = s.sub(new sparseplacevalue1(s.datatype).parse('1E(0,' + i + ')').add(new sparseplacevalue1(s.datatype).parse('1E(0,' + (-i) + ')').scale(sign)).scale(m).scale(ind == 0 ? 1 : 'i'));
					}
				}
				ret = ret.replace(/\+\-/g, '-');
			}
		}
		function toStringXbase(pv, base) {
			var points = pv.points;
			var ret = '';
			for (var i = points.length - 1; i >= 0 ; i--) {
				var power = points[i][1].toString(false, true);
				var digit = points[i][0].toString(false, true);
				if (digit != 0) {
					ret += '+';
					if (power == 0)
						ret += digit;
					else {
						if (base == base.toLowerCase()) {
							ret += coef(digit) + base + sup(power);
						} else {
							ret += coef(digit).toString();
							ret += 'exp(';
							ret += coef(power) + base + '+';
							if (ret.slice(-1) == '+') ret = ret.slice(0, -1);
							ret += ')';
						}
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
			if (ret[0] == '+') ret = ret.substring(1);
			if (ret == '') ret = '0';
			return ret;
			function coef(x) { return x == 1 ? '' : x == -1 ? '-' : x.toString().slice(-1) == 'i' ? x + '*' : x; }
			function sup(x) { return x == 1 ? '' : '^' + x; }
		}
	}

	eval(other) {
		if (typeof(this.base) == 'number' || this.base == this.base.toLowerCase()) return new this.constructor(1, this.pv.eval(other.pv));
		return new this.constructor(1, this.pv.eval(this.pv.parse('2.718').pow(other.pv)));
	}

}
