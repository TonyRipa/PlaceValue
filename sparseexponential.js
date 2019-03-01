
// Author:	Anthony John Ripa
// Date:	2/28/2019
// SparseExponential : a datatype for representing sparse exponentials; an application of the sparseplacevalue datatype

class sparseexponential extends abstractpolynomial {

	//constructor(base, pv) {	//	2019.2	Removed
	constructor(arg) {			//	2019.2	Arg
		var base, pv;			//	2019.2
		//if (arguments.length < 2) pv = new sparseplacevalue();	//  2017.9	//	2018.9	sparseplacevalue	//	2019.2	Removed
		//if (arguments.length < 1) base = [];					//  2017.9										//	2019.2	Removed
		if (arguments.length == 0)[base, pv] = [[], new sparseplacevalue(rational)];	//	2019.2
		if (arguments.length == 1) {                                                    //  2019.2
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [[], new sparseplacevalue(arg)];	//	2019.2
			else[base, pv] = [arg, new sparseplacevalue(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;	//	2019.2
		if (!Array.isArray(base)) { var s = 'sparseexponential expects argument 1 (base) to be an array but found ' + typeof base; alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue)) { var s = 'sparseexponential expects argument 2 (pv) to be a sparseplacevalue not ' + typeof base +':'+base; alert(s); throw new Error(s); }
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {	//  2017.9
		console.log('new sparseexponential : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponential(a.base, this.pv.parse(JSON.stringify(a.pv))) }	//	2019.2	this.pv
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode;	//	2017.2	''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparseexponential : SymbolNode')
			//if (node.name == 'i') return new sparseexponential([], sparseplacevalue.parse('i'));							//	2019.2	Removed
			if (node.name == 'i' && this.pv.datatype !== rational) return new sparseexponential([], this.pv.parse('i'));	//	2019.2	RationalCheck,this.pv
			{ var s = 'Syntax Error: sparseexponential expects input like 1, cis(x), cos(y), exp(z), sin(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			//var pv = sparseplacevalue.parse("1E1");  //new sparseplacevalue([[0, 1]]);
			//return new sparseexponential(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexponential : OperatorNode')
			var kids = node.args;
			//var a = sparseexponential.parse(kids[0]);		//	sparseexponential handles unpreprocessed kid	2015.11	//	2018.9	Removed
			var a = this.parse(kids[0]);																				//	2018.9	this
			if (node.fn == 'unaryMinus') {
				//var c = new sparseexponential([], sparseplacevalue.parse(0)).sub(a);	//	2018.9	Removed
				//var c = new sparseexponential([], this.pv.parse(0)).sub(a);				//	2018.9	this.pv	//	2019.2	Removed
				var c = this.parse('0').sub(a);	//	2019.2	this.parse
			} else if (node.fn == 'unaryPlus') {
				//var c = new sparseexponential([], sparseplacevalue.parse(0)).add(a);	//	2019.2	Removed
				var c = this.parse('0').add(a);	//	2019.2	this.parse
			} else {
				//var b = sparseexponential.parse(kids[1]);	//	sparseexponential handles unpreprocessed kid	2015.11	//	2018.9	Removed
				var b = this.parse(kids[1]);																			//	2018.9	this
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			//return new sparseexponential([], new sparseplacevalue().parse(Number(node.value)));	//	2019.2	Removed
			return new sparseexponential([], this.pv.parse(Number(node.value)));	//	2019.2	this.pv
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh') var ior1 = this.pv.parse(1);	//	2019.2
			if (fn == 'cis' | fn == 'cos' | fn == 'sin') var ior1 = this.pv.parse('i');	//	2019.2
			if (!ior1) { var s = 'Syntax Error: sparseexponential1 expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }	//	2019.2
			var kids = node.args;
			//var kidaspoly = new sparsepolynomial().parse(kids[0]);				//	2018.10	SparseMulti	->	SparsePoly	//	2019.2	Removed
			var kidaspoly = new sparsepolynomial(this.pv.datatype).parse(kids[0]);	//	2019.2	this.pv.datatype
			var base = kidaspoly.base;
			//var ten = new sparseplacevalue().parse('1E1');	//	exp is 2D	2016.1	//	2019.2	Removed
			//var iten = sparseplacevalue.parse('1Ei');		//	exp is 2D	2016.1
			//var exp = new sparseplacevalue().parse('2.718').pow(kidaspoly.pv);	//	2017.5	//	2019.2	Removed
			var exp = this.pv.parse('2.718').pow(kidaspoly.pv.times(ior1));	//	2019.2	this.pv,times(ior1)
			//alert(JSON.stringify([kidaspoly, ten, exp]));
			//var expi = sparseplacevalue.parse('2.718').pow(kidaspoly.pv.times(sparseplacevalue.parse('i')));	//	2017.5
			var exp2 = exp.pow(-1)
			//var expi2 = expi.pow(-1)
			//alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
			//alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
			//if (fn == 'exp') var pv = exp;	//	2019.2	Removed
			if (fn == 'exp' | fn == 'cis') var pv = exp;	//	2019.2	|cis
			//else if (fn == 'cis') var pv = expi;
			//else if (fn == 'cosh') var pv = exp.add(exp2).scale(.5);	//	2019.2	Removed
			if (fn == 'cosh' | fn == 'cos') var pv = exp.add(exp2).unscale(2);	//	2019.2	Remove else, Add |cos
			//else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
			//else if (fn == 'sinh') var pv = exp.sub(exp2).scale(.5);	//	2019.2	Removed
			if (fn == 'sinh' | fn == 'sin') var pv = exp.sub(exp2).unscale(2);	//	2019.2	Remove else, Add |sin
			//else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
			if (fn == 'sin') var pv = pv.unscale('i');							//	2019.2	Remove else
			//else alert('Syntax Error: complexexponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');	//	Check	2015.12	//	2019.2	Removed
			//alert(pv)
			return new sparseexponential(base, pv);
		} /* else if (node.type == 'FunctionNode') {	//	Discard functions	2015.12
			alert('Syntax Error: sparseexponential expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
			return sparseexponential.parse(node.args[0]);
		} */	//	2019.2	Removed
	}

	align(other) {			//	2017.2
		this.check(other);	//	2019.2	Check
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
					//if (posinold == -1) { digitpowernew.push(new rational().parse(0)); }	//	2019.2	Removed
					if (posinold == -1) { digitpowernew.push(new multi.pv.datatype()); }	//	2019.2	multi.pv.datatype()
					else {  //  2017.4  manually check if defined
						//var temp = digitpowerold[posinold] | 0;
						//if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(rational.parse(0));		//	2019.2	Removed
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new multi.pv.datatype());	//	2019.2	multi.pv.datatype
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
		return sparseexponential.toStringCosh(this.pv, this.base)
	}

	static toStringCosh(pv, base) { // 2015.11
		var s = pv.clone();
		var ret = '';
		hyper('cosh(', +1);
		hyper('sinh(', -1);
		if (s.datatype===rational)								//	2019.2
			ret += sparseexponential.toStringXbase(s, base);	//	2019.2
		else													//	2019.2
			ret += sparseexponential.toStringCos(s, base);		//	2019.2
		//ret += sparseexponential.toStringCos(s, base);
		//ret += sparseexponential.toStringXbase(s, base);		//	2019.2	Removed
		//alert([JSON.stringify(s), JSON.stringify(ret)]);
		return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
		function hyper(name, sign) {
			for (var b = 0; b < 3; b++) {   //  2017.5
				for (var i = 4; i >= -4; i--) {
					if (i == 0) continue;
					if (i < 0) continue;	//	2018.9
					//var l = s.get([0, i]).r;
					//var r = s.get([0, -i]).r;
					//var l = s.get(Array(b).fill(new rational().parse(0)).concat([new rational().parse(i)])).toreal();    //  2017.5	//	2018.9	Removed
					var l = s.get(new wholeplacevalue(s.datatype).parse('(' + (+i) + ')E' + b)).toreal();	//	2019.2	s.datatype
					//var r = s.get(new wholeplacevalue(Array(b).fill(rational.parse(0)).concat([rational.parse(-i)]))).toreal();   //  2017.9
					//var r = s.get(wholeplacevalue.parse('(' + (-i) + ')' + '0'.repeat(b))).toreal();   //  2017.9
					var r = s.get(new wholeplacevalue(s.datatype).parse('(' + (-i) + ')E' + b)).toreal();	//	2019.2	s.datatype
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					//if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3	//	2018.9	Removed
					if (math.sign(l) * math.sign(r) == sign && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3					//	2018.9	Removed ar >= al
						var n = m * 2;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
						//alert(JSON.stringify(s));
						//s = s.sub(sparseplacevalue.parse('1E' + '0,'.repeat(b) + i).add(sparseplacevalue.parse('1E' + '0,'.repeat(b) + (-i)).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
						//s = s.sub(new sparseplacevalue().parse('1E' + '0,'.repeat(b) + i).add(new sparseplacevalue().parse('1E' + '0,'.repeat(b) + (-i)).scale(sign)).scale(m));2019.2Rem
						s = s.sub(s.parse('1E' + '0,'.repeat(b) + i).add(s.parse('1E' + '0,'.repeat(b) + (-i)).scale(sign)).scale(m));	//	2019.2	s.parse
						//alert(JSON.stringify(s));
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
		}
	}

	static toStringCos(pv, base) { // 2015.11
		//alert(JSON.stringify(['pv', pv]));
		var s = pv.clone();
		//alert(JSON.stringify(['complexexponential.toStringCosh', pv, s]));
		var ret = '';
		hyper('cos(', +1, 0);
		hyper('sin(', -1, 1);
		ret += sparseexponential.toStringXbase(s, base);
		return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
		function hyper(name, sign, ind) {//alert('hyper')
			for (var b = 0; b < 1; b++) {   //  2017.5
				for (var i = 5; i >= -5; i--) {
					if (i == 0) continue;
					if (i < 0) continue;			//	2019.2
					var parser = new s.datatype();	//	2019.2
					//var l = (ind == 0) ? s.get(i, 0).r : s.get(i, 0).i;
					//var r = (ind == 0) ? s.get(-i, 0).r : s.get(-i, 0).i;
					//var l = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, i)])).i;   //  2017.5	//	2019.2	Removed
					//var r = (ind == 0) ? s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).r : s.get(Array(b).fill(complex.parse(0)).concat([new complex(0, -i)])).i; //  2017.5	//	2019.2	Removed
					var l = s.get(Array(b).fill(new s.datatype()).concat([parser.parse('i').scale(i)]));	//	2019.2
					l = (ind == 0) ? l.r : l.i;					//	2019.2
					if (typeof l != 'number') l = l.toreal();	//	2019.2
					var r = s.get(Array(b).fill(new s.datatype()).concat([parser.parse('i').scale(-i)]));	//	2019.1
					r = (ind == 0) ? r.r : r.i;					//	2019.2
					if (typeof r != 'number') r = r.toreal();	//	2019.2
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([name,i, l, r, Math.sign(l), Math.sign(r), sign, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
						//alert('if')
						var n = m * 2 * sign;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base[b] + ')+';
						//s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': sign, /'i': /0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
						//s = s.sub(sparseplacevalue.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(sparseplacevalue.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale/({ 'r':/ sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));	//	2019.2	Removed
						//s = s.sub(sparseplacevalue.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(sparseplacevalue.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale({ 'r': sign, 'i': 0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));		//	2019.2
						s = s.sub(s.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(s.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale(sign)).scale(m).scale(ind == 0 ? 1 : 'i'));	//	2019.2
					}
				}
			}
			ret = ret.replace(/\+\-/g, '-');
		}
	}

	static toStringXbase(pv, base) {
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
					ret += coef(digit).toString(false, true);	//	2018.9	added (false,true)
					ret += 'exp(';
					for (var j = 0; j < power.mantisa.length; j++) {
						if (!power.get(j).is0()) ret += coef(power.get(j).toString(false, true)) + base[j] + '+';
						//if (power[j] == 1) ret += '+';
						//ret += '+';
					}
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
		return new this.constructor(this.base.slice(0, -1), this.pv.eval(this.yv.parse('2.718').pow(base.pv)));		//	2019.2	this.pv.parse
	}

}
