
// Author:	Anthony John Ripa
// Date:	1/31/2019
// SparseComplexExponential : a datatype for representing sparse complex exponentials; an application of the sparseplacevalue(complex) datatype

class sparsecomplexexponential extends abstractpolynomial {

	constructor(base, pv) {
		//if (arguments.length < 2) alert('sparsecomplexexponential expects 2 arguments');
		if (arguments.length < 2) pv = new sparseplacevalue(complex);   //  2017.9
		if (arguments.length < 1) base = [];                            //  2017.9
		if (!Array.isArray(base)) { var s = 'sparsecomplexexponential expects argument 1 (base) to be an array but found ' + typeof base + ' : ' + base; alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue)) alert('sparsecomplexexponential expects argument 2 (pv) to be a sparseplacevalue');
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {  //  2017.9
		console.log('new sparsecomplexexponential : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsecomplexexponential(a.base, new sparseplacevalue(complex).parse(JSON.stringify(a.pv))) }   //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparsecomplexexponential : SymbolNode')
			if (node.name == 'i') return new sparsecomplexexponential([], this.pv.parse('i'));
			{ var s = 'Syntax Error: SparseComplexExponential expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			//var base = [node.name];
			//var pv = sparseplacevaluecomplex.parse("1E1");  //new sparseplacevaluecomplex([[0, 1]]);
			//return new sparsecomplexexponential(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('new sparsecomplexexponential : OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);       // sparsecomplexexponential handles unpreprocessed kid   2015.11
			if (node.fn == 'unaryMinus') {
				var c = new sparsecomplexexponential([], this.pv.parse(0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new sparsecomplexexponential([], this.pv.parse(0)).add(a);
			} else {
				var b = this.parse(kids[1]);	//	2018.11	this.parse
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			return new sparsecomplexexponential([], new sparseplacevalue(complex).parse(Number(node.value)));
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			var kids = node.args;
			//var kidaspoly = complexlaurent.parse(kids[0])
			//var kidaspoly = new complexsparsemultinomial().parse(kids[0])	//	2019.1	Removed
			var kidaspoly = new sparsepolynomial(complex).parse(kids[0])	//	2019.1	Added
			var base = kidaspoly.base;
			//kidaspoly.pv = new sparseplacevaluecomplex().parse(kidaspoly.pv.toString()) //2018.10 temporary conversion fix because CSmulti now uses SPV //2018.11 Rem
			//var ten = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [1, 0]);		// exp is 2D    2016.1
			var ten = new sparseplacevalue(complex).parse('1E1');   // exp is 2D    2016.1
			//var iten = new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, 1]);		// exp is 2D    2016.1
			var iten = new sparseplacevalue(complex).parse('1Ei');   // exp is 2D    2016.1
			//var ones = kidaspoly.pv.get([]).r;
			//var tens = kidaspoly.pv.get([complex.parse(1)]).r;
			//var iones = kidaspoly.pv.get([]).i;
			//var itens = kidaspoly.pv.get([complex.parse(1)]).i;
			//alert(JSON.stringify([kidaspoly, ten, iten]));
			//var exp = ten.pow(tens); if (itens != 0) exp = exp.times(iten.pow(itens));
			//exp = exp.scale({ 'r': Math.exp(ones) * Math.cos(iones), 'i': Math.exp(ones) * Math.sin(iones) });
			var exp = new sparseplacevalue(complex).parse('2.718').pow(kidaspoly.pv);  //  2017.5
			//alert(JSON.stringify(exp))
			//var expi = iten.pow(tens); if (itens != 0) expi = expi.divide(ten.pow(itens));
			//expi = expi.scale({ 'r': Math.exp(-iones) * Math.cos(ones), 'i': Math.exp(-iones) * Math.sin(ones) });
			var expi = new sparseplacevalue(complex).parse('2.718').pow(kidaspoly.pv.times(new sparseplacevalue(complex).parse('i')));  //  2017.5
			//exp2 = exp2.scale({ 'r': Math.exp(-ones) * Math.cos(-iones), 'i': Math.exp(-ones) * Math.sin(-iones) });
			//expi2 = expi2.scale({ 'r': Math.exp(iones) * Math.cos(-ones), 'i': Math.exp(iones) * Math.sin(-ones) });
			var exp2 = exp.pow(-1)
			var expi2 = expi.pow(-1)
			//alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
			//alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
			if (fn == 'exp') var pv = exp;
			else if (fn == 'cis') var pv = expi;
			else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
			else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
			else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
			else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
			else alert('Syntax Error: complexexponential expects input like 1, cis(x), cos(x), sin(x), cis(2x), or 1+cis(x) but found ' + node.name + '.');    //  Check   2015.12
			return new sparsecomplexexponential(base, pv);
		} else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
			alert('Syntax Error: sparsecomplexexponential expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
			return sparsecomplexexponential.parse(node.args[0]);
		}
	}

	align(other) {	//	2017.2
		var base1 = this.base.slice();
		var base2 = other.base.slice();
		var base = [...new Set([...base1, ...base2])];
		//if (base[0] == 1) base.shift();
		alignmulti2base(this, base);
		alignmulti2base(other, base);
		if (this.pv.points.length > 1)							//	2018.11	Prevent type loss
			this.pv = new sparseplacevalue(this.pv.points);		//	2017.2	Clean this's zeros
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
					if (posinold == -1) { digitpowernew.push(complex.parse(0)); }
					else {	//	2017.4	manually check if defined
						//var temp = digitpowerold[posinold] | complex.parse(0);
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(complex.parse(0));
						else digitpowernew.push(digitpowerold.mantisa[posinold]);
					}
				}
				if (digitpowernew.length != basenew.length) { alert('sparsecomplexexponential: alignment error'); throw new Error('sparsecomplexexponential: alignment error'); }
				multi.pv.points[index][1] = new wholeplacevalue(digitpowernew);	//	2018.11	wholeplacevalue
			}
			multi.base = basenew;
		}
	}

	toString() {
		return sparsecomplexexponential.toStringCosh(this.pv, this.base)
	}

	static toStringCosh(pv, base) { // 2015.11
		var s = pv.clone();
		var ret = '';
		hyper('cosh(', +1);
		hyper('sinh(', -1);
		ret += sparsecomplexexponential.toStringCos(s, base);
		//alert([JSON.stringify(s), JSON.stringify(ret)]);
		return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
		function hyper(name, sign) {
			for (var b = 0; b < 3; b++) {   //  2017.5
				for (var i = 4; i >= -4; i--) {
					if (i == 0) continue;
					if (i < 0) continue;	//	2018.11
					//var l = s.get([0, i]).r;
					//var r = s.get([0, -i]).r;
					var l = s.get(Array(b).fill(complex.parse(0)).concat([complex.parse(i)])).r;    //  2017.5
					var r = s.get(Array(b).fill(complex.parse(0)).concat([complex.parse(-i)])).r;   //  2017.5
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
						var n = m * 2;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
						//s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [i, 0]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [-i, 0]).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
						//alert(JSON.stringify(s));
						s = s.sub(s.parse('1E' + '0,'.repeat(b) + i).add(s.parse('1E' + '0,'.repeat(b) + (-i)).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
						//alert(JSON.stringify(s));
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
		}
	}

	static toStringCos(pv, base) { // 2015.11
		var s = pv.clone();
		//alert(JSON.stringify(['complexexponential.toStringCosh', pv, s]));
		var ret = '';
		hyper('cos(', +1, 0);
		hyper('sin(', -1, 1);
		ret += sparsecomplexexponential.toStringXbase(s, base);
		return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
		function hyper(name, sign, ind) {//alert('hyper')
			for (var b = 0; b < 3; b++) {   //  2017.5
				for (var i = 5; i >= -5; i--) {
					if (i == 0) continue;
					if (i < 0) continue;	//	2018.11
					//var l = (ind == 0) ? s.get(i, 0).r : s.get(i, 0).i;
					//var r = (ind == 0) ? s.get(-i, 0).r : s.get(-i, 0).i;
					var l = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).i;   //  2017.5
					var r = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).i; //  2017.5
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
						//alert('if')
						var n = m * 2 * sign;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
						//s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
						s = s.sub(new sparseplacevalue(complex).parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(new sparseplacevalue(complex).parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
		}
	}

	static toStringXbase(pv, base) {
		//alert(JSON.stringify(['s',pv,base]))
		//return sparseexponential.toStringXbase(this.pv, this.base)
		var points = pv.points;
		var ret = '';
		for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
			var power = points[i][1];
			var digit = points[i][0];
			if (!digit.is0()) {
				ret += '+';
				if (power.is0())
					ret += digit.toString(false, true);
				else {
					ret += coef(digit).toString(false, true);	//	2018.11	added (false,true)
					ret += 'exp(';
					for (var j = 0; j < power.mantisa.length; j++)	//{	2017.10
						if (!power.get(j).is0()) ret += coef(power.get(j).toString(false, true)) + base[j] + '+';
						//if (power[j] == 1) ret += '+';
						//ret += '+';
					if (ret.slice(-1) == '+') ret = ret.slice(0, -1);
					ret += ')';
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

	eval(base) {    //  2017.5
		return new this.constructor(this.base.slice(0, -1), this.pv.eval(new sparseplacevalue(complex).parse('2.718').pow(base.pv)));
	}

}
