
// Author:  Anthony John Ripa
// Date:    9/30/2021
// SparsePolynomial1: a datatype for representing sparse polynomials; an application of the SparsePlaceValue1 datatype

class sparsepolynomial1 extends abstractpolynomial {    //  2018.4

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new sparseplacevalue1(rational)];    //  2017.10
		if (arguments.length == 1) {                                                    //  2017.10
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalue1(arg)];    //  2017.11 rationalcomplex
			else[base, pv] = [arg, new sparseplacevalue1(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		//if (arguments.length < 1) base = 1;                     //  2017.9
		//if (arguments.length < 2) pv = new sparseplacevalue1(); //  2017.9
		if (Array.isArray(base)) alert('sparsepolynomial1 expects argument 1 (base) to be a string but found array: ' + typeof base);
		if (!(pv instanceof sparseplacevalue1)) { var s = 'sparsepolynomial1 expects arg 2 to be SparsePlaceValue1 not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
		super();
		this.base = base;
		this.pv = pv;
	}

	parse(strornode) {   //  2017.9
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomial1(a.base, this.pv.parse(JSON.stringify(a.pv))) } //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode: node.name = ' + node.name);
			console.log('SymbolNode: node.name match = ' + node.name.match(this.pv.datatype.regexfull()));
			if (node.name.match(this.pv.datatype.regexfull())) {    //  2017.11 regexfull
				var base = 1;
				var pv = this.pv.parse(node.name);  //  2017.10
			} else {
				var base = node.name;
				//var pv = this.pv.parse('1e1');//	2017.10	//	-2020.5
				var pv = this.pv.parse('1E1');				//	+2020.5
			}
			return new sparsepolynomial1(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);        // sparsepolynomial1 handles unpreprocessed kid    2015.11
			if (node.fn == 'unaryMinus') {
				var c = new sparsepolynomial1(1, this.pv.parse(0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new sparsepolynomial1(1, this.pv.parse(0)).add(a);
			} else {
				var b = this.parse(kids[1]);    // sparsepolynomial1 handles unpreprocessed kid    2015.11
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode: ' + node.value)
			//alert(JSON.stringify(this.pv.points))
			return new sparsepolynomial1(1, this.pv.parse(Number(node.value)));
		}
	}

	toString() {
		var pv = this.pv;
		var base = this.base;
		console.log('sparsepolynomial1: pv = ' + pv);
		var x = pv.points;
		console.log('sparsepolynomial1.toStringXbase: x=' + x);
		//if (x[x.length - 1] == 0 && x.length > 1) {         // Replace 0 w x.length-1 because L2R 2015.7
		//    x.pop();                                        // Replace shift with pop because L2R 2015.7
		//    return sparsepolynomial1.toStringXbase(new sparseplacevalue1(x, 0), base);   // added namespace  2015.7
		//}
		var ret = '';
		var maxbase = x.length - 1
		for (var i = maxbase; i >= 0; i--) {
			//var digit = Math.round(1000 * x[i][0]) / 1000;
			//var digit = x[i][0];	//	2017.10				//	-2021.9
			var digit = x[i][0].toString(false,'medium');	//	+2021.9
			var power = x[i][1]
			if (digit != 0) {
				ret += '+';
				if (power == 0)
					ret += digit;										//	+2021.9
					//ret += digit.toString(false);			//	+2020.5	//	-2021.9
					//ret += digit.toString(false, true);	//	-2020.5
				//else if (power == 1)									//	-2021.9
				//	ret += coefficient(digit) + base;					//	-2021.9
				else
					ret += coefficient(digit) + base + sup(power);		//	+2021.9
					//ret += coefficient(digit) + base + '^' + power;	//	-2021.9
			}
			console.log('sparsepolynomial1.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
		}
		ret = ret.replace(/\+\-/g, '-');
		if (ret[0] == '+') ret = ret.substring(1);
		if (ret == '') ret = '0';
		return ret;
		//function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString(false, true) + (isFinite(digit) ? '' : '*') }	//	-2020.5
		//function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString(false) + (isFinite(digit) ? '' : '*') }		//	+2020.5	//	-2021.9
		function coefficient(digit) { return digit == 1 ? '' : digit == -1 ? '-' : digit }																		//	+2021.9
		function sup(x) {												//	+2021.9
			if (x.is1()) return '';
			var pow = x.toString(false, true).toString();
			if (pow.includes('/')) pow = '(' + pow + ')';
			return '^' + pow;
		}
	}

	//eval(base) {
	//    return new sparsepolynomial1(1, this.pv.eval(base.pv));
	//}

}
