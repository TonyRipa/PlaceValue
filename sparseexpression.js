
// Author:	Anthony John Ripa
// Date:	10/31/2019
// SparseExpression : a datatype for representing sparse expressions; an application of the SparsePlaceValue datatype

class sparseexpression extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [[], new sparseplacevalue(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [[], new sparseplacevalue(arg)];
			else[base, pv] = [arg, new sparseplacevalue(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (!Array.isArray(base)) { var s = 'sparseexpression expects argument 1 (base) to be an array but found ' + typeof base; alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue)) { var s = 'sparseexpression expects argument 2 (pv) to be a sparseplacevalue not ' + typeof base +':'+base; alert(s); throw new Error(s); }
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base ' + this.base.map(b => (b == b.toLowerCase()) ? b : 'e<sup>' + b + '</sup>');
	}

	parse(strornode) {
		console.log('new sparseexpression : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv))) }
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'SymbolNode') {
			console.log('new sparseexpression : SymbolNode')
			if (node.name == 'i' && this.pv.datatype !== rational) return new this.constructor([], this.pv.parse('i'));
			return new this.constructor([node.name.toLowerCase()], this.pv.parse('1E1'));
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexpression : OperatorNode')
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
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh') var ior1 = this.pv.parse(1);
			if (fn == 'cis' | fn == 'cos' | fn == 'sin') var ior1 = this.pv.parse('i');
			if (!ior1) { var s = 'Syntax Error: sparseexpression expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			var kids = node.args;
			var kidaspoly = new sparsepolynomial(this.pv.datatype).parse(kids[0]);
			var base = kidaspoly.base;
			var exp = this.pv.parse('2.718').pow(kidaspoly.pv.times(ior1));
			var exp2 = exp.pow(-1)
			if (fn == 'exp' | fn == 'cis') var pv = exp;
			if (fn == 'cosh' | fn == 'cos') var pv = exp.add(exp2).unscale(2);
			if (fn == 'sinh' | fn == 'sin') var pv = exp.sub(exp2).unscale(2);
			if (fn == 'sin') var pv = pv.unscale('i');
			//return new this.constructor([base[0].toUpperCase()], pv);		//	2019.10	Removed
			return new this.constructor(base.map(b=>b.toUpperCase()), pv);	//	2019.10	Added
		}
	}

	align(other) {
		this.check(other);
		var base1 = this.base.slice();
		var base2 = other.base.slice();
		var base = [...new Set([...base1, ...base2])];
		alignmulti2base(this, base);
		alignmulti2base(other, base);
		this.pv = new sparseplacevalue(this.pv.points);
		function alignmulti2base(multi, basenew) {
			for (var i = 0; i < multi.pv.points.length; i++)
				alignmultidigit2base(multi, i, basenew);
			function alignmultidigit2base(multi, index, basenew) {
				var digitpowernew = [];
				var baseold = multi.base;
				var digitold = multi.pv.points[index]
				var digitpowerold = digitold[1];
				for (var i = 0; i < basenew.length; i++) {
					var letter = basenew[i];
					var posinold = baseold.indexOf(letter);
					if (posinold == -1) { digitpowernew.push(new multi.pv.datatype()); }
					else {
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new multi.pv.datatype());
						else digitpowernew.push(digitpowerold.mantisa[posinold]);
					}
				}
				if (digitpowernew.length != basenew.length) { alert('SparseMultinomial: alignment error'); throw new Error('SparseMultinomial: alignment error'); }
				if (digitpowernew.length==0) multi.pv.points[index][1] = new wholeplacevalue(multi.pv.datatype);
				else						 multi.pv.points[index][1] = new wholeplacevalue(digitpowernew);
			}
			multi.base = basenew;
		}
	}

	toString() {
		return toStringCosh(this.pv, this.base)
		function toStringCosh(pv, base) {
			var s = pv.clone();
			var ret = '';
			hyper('cosh(', +1);
			hyper('sinh(', -1);
			if (s.datatype===rational)
				ret += toStringXbase(s, base);
			else
				ret += toStringCos(s, base);
			return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
			function hyper(name, sign) {
				for (var b = 0; b < base.length; b++) {
					for (var i = 4; i >= -4; i--) {
						if (i == 0) continue;
						if (i < 0) continue;
						if (base[b] == base[b].toLowerCase()) continue;
						var l = s.get(new wholeplacevalue(s.datatype).parse('(' + (+i) + ')E' + b)).toreal();
						var r = s.get(new wholeplacevalue(s.datatype).parse('(' + (-i) + ')E' + b)).toreal();
						var m = Math.min(l, sign * r);
						var al = Math.abs(l);
						var ar = Math.abs(r);
						if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {
							var n = m * 2;
							ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
							s = s.sub(s.parse('1E' + '0,'.repeat(b) + i).add(s.parse('1E' + '0,'.repeat(b) + (-i)).scale(sign)).scale(m));
						}
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
				for (var b = 0; b < 3; b++) {
					for (var i = 5; i >= -5; i--) {
						if (i == 0) continue;
						if (i < 0) continue;
						var parser = new s.datatype();
						var l = s.get(Array(b).fill(new s.datatype()).concat([parser.parse('i').scale(i)]));
						l = (ind == 0) ? l.r : l.i;
						if (typeof l != 'number') l = l.toreal();
						var r = s.get(Array(b).fill(new s.datatype()).concat([parser.parse('i').scale(-i)]));
						r = (ind == 0) ? r.r : r.i;
						if (typeof r != 'number') r = r.toreal();
						var m = Math.min(l, sign * r);
						var al = Math.abs(l);
						var ar = Math.abs(r);
						if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) {
							var n = m * 2 * sign;
							ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
							s = s.sub(s.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(s.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale(sign)).scale(m).scale(ind == 0 ? 1 : 'i'));
						}
					}
				}
				ret = ret.replace(/\+\-/g, '-');
			}
		}
		function toStringXbase(pv, base) {
			var points = pv.points;
			var ret = '';
			for (var i = points.length - 1; i >= 0 ; i--) {
				var power = points[i][1];
				var digit = points[i][0];
				if (!digit.is0()) {
					ret += '+';
					if (power.is0())
						ret += digit.toString(false, true);
					else {
						ret += coef(digit).toString(false, true);
						for (var j = 0; j < power.mantisa.length; j++) {
							if (!power.get(j).is0())
								if (base[j] == base[j].toLowerCase()) ret += base[j] + sup(power.get(j).toString(false, true));
								else ret += 'exp(' + coef(power.get(j).toString(false, true)) + base[j] + ')';
							if (power.get(j).is1()) ret += '*';
						}
						if (ret.slice(-1) == '*') ret = ret.slice(0, -1);
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
			if (ret[0] == '+') ret = ret.substring(1);
			if (ret == '') ret = '0';
			return ret;
			function coef(x) {
				return x == 1 ? '' : x == -1 ? '-' : x;
			}
			function sup(x) {
				if (x == 1) return '';
				return (x != 1) ? '^' + x : '';
			}
		}
	}

	eval(other) {
		var pv = (this.base.length == 0 || this.base.slice(-1)[0] == this.base.slice(-1)[0].toLowerCase()) ? other.pv : this.pv.parse('2.718').pow(other.pv);
		return new this.constructor(this.base.slice(0, -1), this.pv.eval(pv));
	}

}
