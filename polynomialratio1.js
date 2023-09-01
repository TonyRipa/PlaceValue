
// Author:	Anthony John Ripa
// Date:	8/31/2023
// PolynomialRatio1: a datatype for representing rational expressions; an application of the PlaceValueRatio datatype

class polynomialratio1 extends abstractpolynomial {	//	+2023.8

	constructor(arg, pv) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new placevalueratio(rational)];                          //  2018.2
		if (arguments.length == 1) {                                                                        //  2018.2
			if (arg === rational || arg === rationalcomplex)[base, pv] = [1, new placevalueratio(arg)];     //  2018.2 rationalcomplex
			else[base, pv] = [arg, new placevalueratio(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;                                                   //  2018.2
		//if (arguments.length < 2) pv = new placevalueratio();   //  2017.9
		console.log('polynomialratio1 : arguments.length=' + arguments.length);
		super()
		this.base = base;                                                                                   //  2018.2
		if (pv instanceof Object && JSON.stringify(pv).indexOf('mantisa') != -1)  // 2015.8
			this.pv = pv;
		else if (typeof pv == 'number') {
			console.log("polynomialratio1: typeof pv == 'number'");
			this.pv = new wholeplacevalue([pv])
			console.log(this.pv.toString());
		}
		else
			{ var s = 'PolynomialRatio1 expects arg 2 to be PlaceValueRatio not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
	}

	parse(strornode) {    //  2017.9
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) {
			var a = JSON.parse(strornode);
			var ret = new polynomialratio1(a.base, this.pv.parse(JSON.stringify(a.pv)));
			if (!(this.pv.num.datatype == ret.pv.num.datatype)) { var s = "polynomialratio1.parse's arg different digit datatype\n" + this.pv.num.datatype + '\n' + ret.pv.num.datatype; alert(s); throw new Error(s); } //  2018.2
			return ret;
		}    //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode')
			//var base = node.name;
			//var pv = 10;
			if (node.name.match(this.pv.num.datatype.regexfull())) {    //  2018.2
				var base = 1;
				var pv = this.pv.parse(node.name);
			} else {
				var base = node.name;
				var pv = this.pv.parse('10');
			}
			//return new polynomialratio1(base, this.pv.parse(pv));
			return new polynomialratio1(base, pv);                       //  2018.2
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);    // 2017.11  this
			if (node.fn == 'unaryMinus') {
				var c = new polynomialratio1(1, this.pv.parse(0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new polynomialratio1(1, this.pv.parse(0)).add(a);
			} else {
				var b = this.parse(kids[1]);    // 2017.11  this
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c
		} else if (node.type == 'ConstantNode') {
			return new polynomialratio1(1, new placevalueratio(this.pv.num.parse('(' + Number(node.value) + ')'), this.pv.num.parse(1)));    //  2018.2
		}
	}

	// tohtml() { // Replacement for toStringInternal 2015.7	//	-2023.8
	// 	return this.pv.toString() + ' base ' + this.base;
	// }

	toString() {
		var num = polynomialratio1.toStringXbase(this.pv.num, this.base);
		if (this.pv.den.is1()) return num;
		num = (count(this.pv.num.mantisa) < 2) ? num : '(' + num + ')';
		var den = polynomialratio1.toStringXbase(this.pv.den, this.base);
		den = (count(this.pv.den.mantisa) < 2) ? den : '(' + den + ')';
		return num + '/' + den;
		function count(array) {
			return array.reduce(function (prev, curr) { return prev + Math.abs(Math.sign(curr)) }, 0);
		}
	}

	/*	-2023.8

	add(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.add(other.pv));
	}

	sub(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.sub(other.pv));
	}

	times(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.times(other.pv));
	}

	divide(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.divide(other.pv));
	}

	divideleft(other) {   //  2016.8
		this.align(other);
		return new polynomialratio1(this.base, this.pv.divideleft(other.pv));
	}

	remainder(other) {	//	2019.4	Added
		this.align(other);
		return new polynomialratio1(this.base, this.pv.remainder(other.pv));
	}

	pointadd(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.pointadd(other.pv));
	}

	pointsub(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.pointsub(other.pv));
	}

	pointtimes(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.pointtimes(other.pv));
	}

	pointdivide(other) {
		this.align(other);
		return new polynomialratio1(this.base, this.pv.pointdivide(other.pv));
	}

	*/

	align(other) {    // Consolidate alignment    2015.9
		if (!(this.pv.num.datatype == other.pv.num.datatype)) { var s = "PolynomialRatio1.align's arg has different digit datatype\n" + this.pv.num.datatype + '\n' + other.pv.num.datatype; alert(s); throw new Error(s); } //  2018.2
		if (this.pv.num.mantisa.length == 1) this.base = other.base;
		if (other.pv.num.mantisa.length == 1) other.base = this.base;
		if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomialratio1(1, this.pv.parse('%')) }
	}

	// pow(other) { // 2015.6	//	-2023.8
	// 	return new polynomialratio1(this.base, this.pv.pow(other.pv));
	// }

	static toStringXbase(pv, base) {                        // added namespace  2015.7
		console.log('polynomialratio1: pv = ' + pv);
		var x = pv.mantisa;
		console.log('polynomialratio1.toStringXbase: x=' + x);
		if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
			x.pop();                                    // Replace shift with pop because L2R 2015.7
			return polynomialratio1.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
		}
		var ret = '';
		var str = x//.toString().replace('.', '');
		var maxbase = x.length - 1// + exp;
		for (var power = maxbase; power >= 0; power--) {                // power is index because whole is L2R  2015.7 
			//var digit = Math.round(1000 * str[power].toreal()) / 1000;  // toreal  2016.8
			var digit = str[power].toString(false, true);   //  2018.2
			if (digit != 0) {
				ret += '+';
				if (power == 0)
					ret += digit;
				else if (power == 1)
					ret += coefficient(digit) + base;
				else
					ret += coefficient(digit) + base + '^' + power;
			}
			console.log('polynomialratio1.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
		}
		ret = ret.replace(/\+\-/g, '-');
		if (ret[0] == '+') ret = ret.substring(1);
		if (ret == '') ret = '0';
		return ret;
		function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
	}

	// eval(other) { //  2017.12	//	-2023.8
	// 	return new polynomialratio1(1, this.pv.eval(other.pv));
	// 	//var sum = 0;
	// 	//for (var i = 0; i < this.pv.mantisa.length; i++) {
	// 	//    sum += this.pv.get(i) * Math.pow(base, i);
	// 	//}
	// 	//return new polynomialratio1(1, new wholeplacevalue([sum]));
	// }

	factor() {	//	+2023.8
		return new polynomialratio1(this.base, this.pv.factor());
	}

}

