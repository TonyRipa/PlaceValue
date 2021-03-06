
// Author:  Anthony John Ripa
// Date:    5/31/2020
// SparseExponential1 : a datatype for representing sparse exponentials; an application of the SparsePlaceValue1 datatype

class sparseexponential1 extends abstractpolynomial {

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new sparseplacevalue1(rational)];    //  2017.10
		if (arguments.length == 1) {                                                    //  2017.10
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalue1(arg)];    //  2017.11
			else[base, pv] = [arg, new sparseplacevalue1(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (!(base instanceof String || typeof base == 'string' || base instanceof Number || typeof base == 'number'))
			{ var s = 'sparseexponential1 expects arg1 (base) to be a string or number not ' + typeof base + ': ' + JSON.stringify(base); alert(s); throw new Error(s); }
		if (!(pv instanceof sparseplacevalue1)) { var s = 'sparseexponential1 wants arg2 to be sparseplacevalue1 not ' + typeof pv +':' + JSON.stringify(pv); alert(s); throw new Error(s); }
		super();
		this.base = base
		this.pv = pv;
	}

	tohtml() {
		return this.pv.toString('medium') + ' Base e<sup>' + this.base + '</sup>';
	}

	parse(strornode) {  //  2017.9
		console.log('new sparseexponential1 : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparseexponential1(a.base, this.pv.parse(JSON.stringify(a.pv))) }   //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparseexponential1 : SymbolNode')
			if (node.name == 'i' && this.pv.datatype !== rational) return new sparseexponential1(1, this.pv.parse('i'));
			{ var s = 'Syntax Error: sparseexponential1 expects input like 1, exp(x), cosh(y), exp(z), sinh(2x), or 1+cosh(y) but found ' + node.name + '.'; alert(s); throw new Error(s); }
		} else if (node.type == 'OperatorNode') {
			console.log('new sparseexponential1 : OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);       // sparseexponential1 handles unpreprocessed kid   2015.11
			if (node.fn == 'unaryMinus') {
				var c = this.parse('0').sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = this.parse('0').add(a);
			} else {
				var b = this.parse(kids[1]);   // sparseexponential1 handles unpreprocessed kid   2015.11
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			//return new sparseexponential1([1, null], sparseplacevalue1.parse(Number(node.value)));
			return new sparseexponential1(1, new sparseplacevalue1(this.pv.datatype).parse(Number(node.value)));
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh') var ior1 = this.pv.parse(1);
			if (fn == 'cis' | fn == 'cos' | fn == 'sin') var ior1 = this.pv.parse('i');
			if (!ior1) { var s = 'Syntax Error: sparseexponential1 expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s); }
			var kids = node.args;
			///var kidaspoly = complexlaurent.parse(kids[0])
			var kidaspoly = new sparsepolynomial1(this.pv.datatype).parse(kids[0])  //  2018.4
			var base = kidaspoly.base;
			//var ten = new sparseplacevalue1().parse('1E1');   // exp is 2D    2016.1
			///var iten = sparseplacevalue1.parse('1Ei');   // exp is 2D    2016.1
			///alert(JSON.stringify([kidaspoly, ones, tens, itens]));
			//var exp = kidaspoly.pv//sparseplacevalue1.parse('2.718').pow(kidaspoly.pv);  //  2017.5
			//var exp = new sparseplacevalue1().parse('2.718').pow(kidaspoly.pv);  //  2017.5
			//var exp = new sparseplacevalue1(this.pv.datatype).parse('2.718').pow(kidaspoly.pv.times(ior1));		//	2017.10	//	-2020.5
			var exp = kidaspoly.pv.times(ior1).exponential();														//	+2020.5
			///alert(JSON.stringify(exp))
			///var expi = sparseplacevalue1.parse('2.718').pow(kidaspoly.pv.times(sparseplacevalue1.parse('i')));  //  2017.5
			var exp2 = exp.pow(-1)
			///var expi2 = expi.pow(-1)
			///alert(JSON.stringify(['ones', ones, 'itens', itens, 'tens', tens, 'exp', exp.whole, 'exp2', exp2.whole, 'exp.add(exp2)', exp.add(exp2), 'exp.add(exp2).scale({ r: .5, i: 0 })', exp.add(exp2).scale({ 'r': .5, 'i': 0 })]));
			///alert(JSON.stringify(['expi', expi.whole, 'expi2', expi2.whole, 'expi.add(expi2)', expi.add(expi2), 'expi.add(expi2).scale({ r: .5, i: 0 })', expi.add(expi2).scale({ 'r': .5, 'i': 0 })]));
			if (fn == 'exp' | fn == 'cis') var pv = exp;
			///else if (fn == 'cis') var pv = expi;
			///else if (fn == 'cosh') var pv = exp.add(exp2).scale({ 'r': .5, 'i': 0 });
			///else if (fn == 'cos') var pv = expi.add(expi2).scale({ 'r': .5, 'i': 0 });
			///else if (fn == 'sinh') var pv = exp.sub(exp2).scale({ 'r': .5, 'i': 0 });
			///else if (fn == 'sin') var pv = expi.sub(expi2).scale({ 'r': 0, 'i': -.5 });
			if (fn == 'cosh' | fn == 'cos') var pv = exp.add(exp2).unscale(2);
			if (fn == 'sinh' | fn == 'sin') var pv = exp.sub(exp2).unscale(2);
			if (fn == 'sin') var pv = pv.unscale('i');
			return new sparseexponential1(base, pv);
		}
	}

	toString() {
		return toStringCosh(this.pv, this.base)									//	2019.8	Added
		//static toStringCosh(pv, base) { // 2015.11							//	2019.8	Removed
		function toStringCosh(pv, base) {										//	2019.8	Added
			var s = pv.clone();
			var ret = '';
			hyper('cosh(', +1);
			hyper('sinh(', -1);
			if(s.datatype===rational)
				ret += toStringXbase(s, base);									//	2019.8	Added
				//ret += sparseexponential1.toStringXbase(s, base);				//	2019.8	Removed
			else
				ret += toStringCos(s, base);									//	2019.8	Added
				//ret += sparseexponential1.toStringCos(s, base);				//	2019.8	Removed
			//ret += sparseexponential1.toStringXbase(s, base);
			//alert([JSON.stringify(s), JSON.stringify(ret)]);
			return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
			function hyper(name, sign) {
				//for (var i = 4; i >= -4; i--) {								//	2019.8	Removed
				//for (var index = s.points.length - 1; index >= 0; index--) {	//	2019.8	Added	//	2019.9	Removed
				//	var i = s.points[index][1].toreal();						//	2019.8	Added	//	2019.9	Removed
				for (var i of s.points.map(coef_pow => coef_pow[1].toreal())) {	//	2019.9	Added
					if (i == 0) continue;
					if (i < 0) continue;										//	2019.9	Added
					//var l = s.get([0, i]).r;
					//var r = s.get([0, -i]).r;
					var l = s.get(i).toreal();
					var r = s.get(-i).toreal();
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
						var n = m * 2;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
						//s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [i, 0]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [-i, 0]).scale({ 'r': sign, 'i': 0 })).scale({ 'r': m, 'i': 0 }));
						//alert(JSON.stringify(s));
						s = s.sub(new sparseplacevalue1(pv.datatype).parse('1E' + i).add(new sparseplacevalue1(pv.datatype).parse('1E' + (-i)).scale(sign)).scale(m));
						//alert(JSON.stringify(s));
					}
				}
				ret = ret.replace(/\+\-/g, '-');
			}
		}
		//static toStringCos(pv, base) {  // 2017.10							//	2019.8	Removed
		function toStringCos(pv, base) {										//	2019.8	Added
			//alert(JSON.stringify(['pv', pv]));
			var s = pv.clone();
			//alert(JSON.stringify(['complexexponential.toStringCosh', pv, s]));
			var ret = '';
			hyper('cos(', +1, 0);
			hyper('sin(', -1, 1);
			//ret += sparseexponential1.toStringXbase(s, base);					//	2019.8	Removed
			ret += toStringXbase(s, base);										//	2019.8	Added
			return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
			function hyper(name, sign, ind) {//alert('hyper')
				//for (var i = 5; i >= -5; i--) {								//	2019.8	Removed
				//for (var index = s.points.length - 1; index >= 0; index--) {	//	2019.8	Added	//	2019.9	Removed
				//	var i = s.points[index][1].times({'r':0,'i':-1}).toreal();	//	2019.8	Added	//	2019.9	Removed
				for (var i of s.points.map(coef_pow => coef_pow[1].times('i').toreal())) {	//	2019.9	Added
					if (i == 0) continue;
					//console.log(s.datatype)
					var parser = new s.datatype();
					//var l = (ind == 0) ? s.get(parser.parse('i').times(parser.parse(i))).r : s.get(parser.parse('i').times(parser.parse(i))).i;
					var l = (ind == 0) ? s.get(parser.parse('i').scale(i)).r : s.get(parser.parse('i').scale(i)).i;
					//alert(JSON.stringify([l instanceof Object, l instanceof Number, typeof l]))
					if (typeof l != 'number') l = l.toreal();
					//var r = (ind == 0) ? s.get(parser.parse('i').times(parser.parse(-i))).r : s.get(parser.parse('i').times(parser.parse(-i))).i;
					var r = (ind == 0) ? s.get(parser.parse('i').scale(-i)).r : s.get(parser.parse('i').scale(-i)).i;
					if (typeof r != 'number') r = r.toreal();
					var m = Math.min(l, sign * r);
					var al = Math.abs(l);
					var ar = Math.abs(r);
					//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
					if (math.sign(l) * math.sign(r) == sign && ar >= al && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
						//alert('if')
						var n = m * 2 * sign;
						ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
						//s = s.sub(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, i]).add(new complexplacevalue(new wholeplacevaluecomplex2([[1]]), [0, -i]).scale({ 'r': gn, /'i': /0 })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
						s = s.sub(new sparseplacevalue1(pv.datatype).parse('1E(0,' + i + ')').add(new sparseplacevalue1(pv.datatype).parse('1E(0,' + (-i) + ')').scale(sign)).scale(m).scale(ind == 0 ? 1 : 'i'));
						//s = s.sub(sparseplacevalue1.parse('1E' + '0,'.repeat(b) + '(0,' + i + ')').add(sparseplacevalue1.parse('1E' + '0,'.repeat(b) + '(0,' + (-i) + ')').scale//({ 'r': sign, i':  })).scale(ind == 0 ? { 'r': m, 'i': 0 } : { 'r': 0, 'i': m }));
					}
				}
				ret = ret.replace(/\+\-/g, '-');
			}
		}
		//static toStringXbase(pv, base) {	//	2019.8	Removed
		function toStringXbase(pv, base) {	//	2019.8	Added
			//return sparseexponential1.toStringXbase(this.pv, this.base)
			var points = pv.points;
			var ret = '';
			for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
				var power = points[i][1];
				var digit = points[i][0]//.toString(false, true);//Math.round(points[i][0] * 1000) / 1000; // get() 2015.7
				if (!digit.is0()) {
					ret += '+';
					if (power.is0())
						ret += digit.toString(false, true);//.toreal();
					else {
						//ret += coef(digit.toreal()).toString();
						//ret += coef(digit.toString(false, true)).toString();	//	2017.12	//	-2020.5
						ret += coef(digit.toString(false)).toString();			//	2017.12	//	+2020.5
						ret += 'exp(';
						//for (var j = 0; j < power.length; j++) {
						ret += coef(power.toString(false, true)) + base + '+';
						//}
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
				return x == 1 ? '' : x == -1 ? '-' : x.toString().slice(-1) == 'i' ? x + '*' : x;   //  2017.12
			}
			function sup(x) {
				if (x == 1) return '';
				return (x != 1) ? '^' + x : '';
			}
		}
	}

	eval(other) {    //  2017.5
		return new this.constructor(1, this.pv.eval(this.pv.parse('2.718').pow(other.pv)));    //  2017.10 this.pv.parse
	}

}
