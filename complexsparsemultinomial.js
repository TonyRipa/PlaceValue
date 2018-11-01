
// Author:  Anthony John Ripa
// Date:    10/31/2018
// ComplexSparseMultinomial : a datatype for representing complex sparse multinomials; an application of the sparseplacevalue(complex) datatype

class complexsparsemultinomial extends abstractpolynomial {

	constructor(base, pv) {
		//if (arguments.length < 2) alert('complexsparsemultinomial expects 2 arguments');
		if (arguments.length < 1) base = [];                            //  2017.9
		if (arguments.length < 2) pv = new sparseplacevalue(complex);   //  2017.9	//	2018.10	sparseplacevalue(complex)
		if (!Array.isArray(base)) { var s = 'complexsparsemultinomial expects arg1 (base) to be an array not ' + typeof base + ' : ' + base; alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue)) { var s = 'complexsparsemultinomial expects arg2 (pv) to be a sparseplacevalue not ' + typeof pv + ' : ' + pv; alert(s); throw new Error(s); }
		super();
		this.base = base
		this.pv = pv;
	}

	parse(strornode) {  //  2017.9
		console.log('new complexsparsemultinomial : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new complexsparsemultinomial(a.base, new sparseplacevalue(complex).parse(JSON.stringify(a.pv))) }   //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new complexsparsemultinomial : SymbolNode')
			if (node.name == 'i') return new complexsparsemultinomial([], this.pv.parse('i'));
			var base = [node.name];
			var pv = new sparseplacevalue(complex).parse("1E1");  //new sparseplacevaluecomplex([[0, 1]]);
			return new complexsparsemultinomial(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('new complexsparsemultinomial : OperatorNode')
			var kids = node.args;
			var a = new complexsparsemultinomial().parse(kids[0]);       // complexsparsemultinomial handles unpreprocessed kid   2015.11
			if (node.fn == 'unaryMinus') {
				var c = new complexsparsemultinomial([], this.pv.parse(0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new complexsparsemultinomial([], this.pv.parse(0)).add(a);
			} else {
				var b = new complexsparsemultinomial().parse(kids[1]);   // complexsparsemultinomial handles unpreprocessed kid   2015.11
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			return new complexsparsemultinomial([], new sparseplacevalue(complex).parse(Number(node.value)));
		} else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
			alert('Syntax Error: complexsparsemultinomial expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
			return complexsparsemultinomial.parse(node.args[0]);
		}
	}

	align(other) {  // 2017.2
		var base1 = this.base.slice();
		var base2 = other.base.slice();
		var base = [...new Set([...base1, ...base2])];
		//base.sort().reverse();
		//if (base[0] == 1) base.shift();
		alignmulti2base(this, base);
		alignmulti2base(other, base);
		this.pv = new sparseplacevalue(this.pv.points);     //  2017.2  Clean this's zeros
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
					if (posinold == -1) { digitpowernew.push(new complex().parse(0)); }
					else {  //  2017.4  manually check if defined
						//var temp = digitpowerold[posinold] | 0;
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new complex().parse(0));
						else digitpowernew.push(digitpowerold.mantisa[posinold]);
					}
				}
				if (digitpowernew.length != basenew.length) { alert('SparseMultinomial: alignment error'); throw new Error('SparseMultinomial: alignment error'); }
				multi.pv.points[index][1] = new wholeplacevalue(digitpowernew);
			}
			multi.base = basenew;
		}
	}

	toString() {
		var points = this.pv.points;
		var ret = '';
		for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
			var power = points[i][1];
			var digit = points[i][0];
			if (!digit.is0()) {
				ret += '+';
				if (power.is0())
					ret += digit.toString(false, true);
				else {
					ret += (!digit.is1() ? (!digit.negate().is1() ? digit : '-') : '').toString(false, true);
					for (var j = 0; j < power.mantisa.length; j++) {
						if (!power.get(j).is0()) ret += this.base[j] + sup(power.get(j));
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
		function sup(x) {
			if (x.is1()) return '';
			var pow = x.toString(false, true).toString();
			if (pow.indexOf('/') > -1) pow = '(' + pow + ')';   //  2018.1
			return (!x.is1()) ? '^' + pow : '';
		}
	}

}
