
// Author:  Anthony John Ripa
// Date:    7/31/2022
// SparsePolynomial : a datatype for representing sparse polynomials; an application of the sparseplacevalue datatype

class sparsepolynomial extends abstractpolynomial {	//	2018.10	Rename

	constructor(arg) {			//	2018.12	Added
		var base, pv;
		if (arguments.length == 0) throw new Error('notype');							//	2020.1	Added
		if (arguments.length == 0)[base, pv] = [[], new sparseplacevalue(rational)];
		if (arguments.length == 1) {
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [[], new sparseplacevalue(arg)];
			else[base, pv] = [arg, new sparseplacevalue(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		//if (!Array.isArray(base)) { var s = 'sparsepolynomial expects argument 1 (base) to be an array but found ' + typeof base; alert(s); throw new Error(s); }	//	-2021.5
		if (!Array.isArray(base)) {var s='SPoly wants arg 1 (base) to be Array not '+typeof base+" : "+JSON.stringify(base);alert(s);throw new Error(s);}	//	+2021.5
		if (!(pv instanceof sparseplacevalue)){var s='sparsepolynomial wants arg 2 to be SparsePV not '+typeof pv+" : "+JSON.stringify(pv);alert(s);throw new Error(s);}
		super();
		this.base = base;
		this.pv = pv;
	}

	parse(strornode) {  //  2017.9
		console.log('new sparsepolynomial : ' + JSON.stringify(strornode))
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomial(a.base, new sparseplacevalue().parse(JSON.stringify(a.pv))) } //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2017.2  ''=0
		if (node.type == 'SymbolNode') {
			console.log('new sparsepolynomial : SymbolNode')
			if (node.name.match(this.pv.datatype.regexfull())) {    //  2018.12 regexfull
				var base = [];
				var pv = this.pv.parse(node.name);
			} else {
				var base = [node.name];
				var pv = this.pv.parse("1E1");	//	2018.12	this.pv
			}
			return new sparsepolynomial(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('new sparsepolynomial : OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);												//	2019.2	this
			if (node.fn == 'unaryMinus') {
				var c = new sparsepolynomial([], this.pv.parse(0)).sub(a);				//	2018.9	this.pv
			} else if (node.fn == 'unaryPlus') {
				var c = new sparsepolynomial([], this.pv.parse(0)).add(a);				//	2018.9	this.pv
			} else {
				var b = this.parse(kids[1]);																					//	2019.2	this
				//var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);	//	-2021.6
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '^') ? a.pow(b) : (node.op == '&') ? a.at(b) : a.eval(b);	//	+2021.6
			}
			return c;
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode : ->' + node.value + '<-');										//	2020.1	Added
			if (node.value != 'undefined') return new sparsepolynomial([], this.pv.parse(node.value));	//	2020.1	Added
			return new sparsepolynomial(this.pv.datatype);												//	2020.1	Added
		} else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
			alert('Syntax Error: sparsepolynomial expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
			return sparsepolynomial.parse(node.args[0]);
		} else if (node.type == 'ParenthesisNode') {	//	+2022.7
			return this.parse(node.content);
		} else {										//	+2022.7
			alert('othertype')
		}
	}

	align(other) {			//	2017.2
		this.check(other);	//	2019.2	Added
		var base1 = this.base.slice();
		var base2 = other.base.slice();
		var base = [...new Set([...base1, ...base2])];
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
					if (posinold == -1) { digitpowernew.push(new multi.pv.datatype()); }	//	2018.12	multi.pv.datatype
					else {  //  2017.4  manually check if defined
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new multi.pv.datatype());	//	2018.12	multi.pv.datatype
						else digitpowernew.push(digitpowerold.mantisa[posinold]);
					}
				}
				if (digitpowernew.length != basenew.length) { alert('SparsePolynomial: alignment error'); throw new Error('SparsePolynomial: alignment error'); }
				if (digitpowernew.length==0) multi.pv.points[index][1] = new wholeplacevalue(multi.pv.datatype);
				else                         multi.pv.points[index][1] = new wholeplacevalue(digitpowernew);
			}
			multi.base = basenew;
		}
	}

	toString() {
		var points = this.pv.points;
		var ret = '';
		for (var i = points.length - 1; i >= 0 ; i--) {     // reverse 2016.12
			var power = points[i][1];
			//var digit = points[i][0];							//	-2021.9
			//if (!digit.is0()) {								//	-2021.9
			var digit = points[i][0].toString(false,'medium');	//	+2021.9
			if (digit != 0) {									//	+2021.9
				ret += '+';
				if (power.is0())
					//ret += digit.toString(false, true);	//	-2020.5
					//ret += digit.toString(false);			//	+2020.5	//	-2021.9
					ret += digit;										//	+2021.9
				else {
					//ret += (!digit.is1() ? (!digit.negate().is1() ? digit : '-') : '').toString(false, true);	//	-2020.5
					//ret += (!digit.is1() ? (!digit.negate().is1() ? digit : '-') : '').toString(false);		//	+2020.5	//	-2021.9
					ret += coefficient(digit);																				//	+2021.9
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
		function coefficient(digit) { return digit == 1 ? '' : digit == -1 ? '-' : digit }	//	+2021.9
		function sup(x) {
			if (x.is1()) return '';
			var pow = x.toString(false, true).toString();
			if (pow.indexOf('/') > -1) pow = '(' + pow + ')';   //  2018.1
			//return (!x.is1()) ? '^' + pow : '';				//	-2021.9
			return '^' + pow;									//	+2021.9
		}
	}

	clone() {	//	+2021.5
		return new this.constructor([...this.base],this.pv.clone());
	}

	at(base) {	//	+2021.5
		this.align(base);
		var ret = this.clone();
		var pos = base.pv.point()[1].len() - 1;
		ret.base.push(...ret.base.splice(pos,1));
		ret.pv = ret.pv.at(base.pv);
		return ret;
	}

}
