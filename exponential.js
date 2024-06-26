
// Author:  Anthony John Ripa
// Date:    04/30/2024
// Exponential : a datatype for representing Exponentials; an application of the MarkedPlaceValue datatype

//class exponential {					//	+2022.01	//	-2024.4
class exponential extends abstractpolynomial{			//	+2024.4

	constructor(base, pv) {				//	+2022.01
		//if (arguments.length < 2) pv = new placevalue();		//	-2022.05
		if (arguments.length < 2) pv = new markedplacevalue();	//	+2022.05
		if (Array.isArray(base)) alert('exponential expects argument 1 (base) to be StringOrNumber but found ' + typeof base);
		if (!(pv instanceof markedplacevalue)) { var s = 'exponential expects arg2 (pv) to be a markedplacevalue not ' + typeof pv + ' : ' + pv; alert(s); throw new Error(s); }
		super()	//	+2024.4
		this.base = base
		this.pv = pv;
		return;

	}

	parse(strornode) {    //  2017.9
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new exponential(a.base, new this.pv.constructor().parse(JSON.stringify(a.pv))) }
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'ConstantNode') {
			return new exponential(1, new this.pv.constructor().parse('(' + Number(node.value) + ')'));
		} else if (node.type == 'SymbolNode') {
			alert('Syntax Error: Exponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');
			console.log('SymbolNode: ' + node.type + " : " + JSON.stringify(node))
			console.log(node)
			var base = node.name;
			var pv = new this.pv.constructor(wholeplacevalue.parse(1), 1);   // 1E1 not 10 so 1's place DNE not 0.   2015.9
			return new exponential(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode: ' + node.type + " : " + JSON.stringify(node))
			console.log(node)
			var kids = node.args;
			var a = new exponential().parse(kids[0]);       // exponential handles unpreprocessed kid   2015.11
			if (node.fn == 'unaryMinus') {
				var c = new exponential(1, new this.pv.constructor(new wholeplacevalue().parse(0), 0)).sub(a);
			} else if (node.fn == 'unaryPlus') {
				var c = new exponential(1, new this.pv.constructor(wholeplacevalue.parse(0), 0)).add(a);
			} else {
				var b = new exponential().parse(kids[1]);   // exponential handles unpreprocessed kid   2015.11
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c;
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node));
			console.log(node)
			var fn = node.name;
			var kids = node.args;
			var kidaspoly = new laurent().parse(kids[0])
			//alert(kidaspoly)
			var base = kidaspoly.base;
			var exp = kidaspoly.pv.exponential();										//	+2020.5
			//var exp2 = ten.pow(-tens)
			//var exp2 = placevalue.parse('(2.718)').pow(kidaspoly.pv.negate())   //  2017.5
			var exp2 = exp.pow(-1);     //  2017.5
			//alert([exp, exp2]);
			if (fn == 'exp') var pv = exp;
			else if (fn == 'cosh') var pv = exp.add(exp2).unscale(2);
			else if (fn == 'sinh') var pv = exp.sub(exp2).unscale(2);
			else alert('Syntax Error: Exponential expects input like 1, exp(x), cosh(x), sinh(x), exp(2x), or 1+exp(x) but found ' + node.name + '.');  // Check    2015.12
			return new exponential(base, pv);
		} else {
			//alert('othertype')									//	-2022.01
			alert('Exponential.parse othertype : ' + typeof node);	//	+2022.01
		}
	}

	tohtml() {                                // Replacement for toStringInternal 2015.7
		return this.pv.tohtml(true) + ' base e<sup>' + this.base + '</sup>';    // tohtml(true) includes <s>    2015.11
	}

	//toString() {		//	-2022.02
	//	return exponential.toStringCosh(this.pv, this.base);    // 2015.11
	//}

	toString(long) {	//	+2022.02
		if (long) return exponential.toStringXbase(this.pv, this.base);
		return exponential.toStringCosh(this.pv, this.base);
	}

	/*	//	-2024.4
	add(other) {
		this.align(other);
		return new exponential(this.base, this.pv.add(other.pv));
	}

	sub(other) {
		this.align(other);
		return new exponential(this.base, this.pv.sub(other.pv));
	}

	times(other) {
		this.align(other);
		return new exponential(this.base, this.pv.times(other.pv));
	}

	divide(other) {
		this.align(other);
		return new exponential(this.base, this.pv.divide(other.pv));
	}

	divideleft(other) {
		this.align(other);
		return new exponential(this.base, this.pv.divideleft(other.pv));
	}

	dividemiddle(other) {
		this.align(other);
		return new exponential(this.base, this.pv.dividemiddle(other.pv));
	}

	remainder(other) {	//	2019.4	Added
		this.align(other);
		return new exponential(this.base, this.pv.remainder(other.pv));
	}

	pointadd(other) {
		this.align(other);
		return new exponential(this.base, this.pv.pointadd(other.pv));
	}

	pointsub(other) {
		this.align(other);
		return new exponential(this.base, this.pv.pointsub(other.pv));
	}

	pointtimes(other) {
		this.align(other);
		return new exponential(this.base, this.pv.pointtimes(other.pv));
	}

	pointdivide(other) {
		this.align(other);
		return new exponential(this.base, this.pv.pointdivide(other.pv));
	}
	*/

	align(other) {    // Consolidate alignment    2015.9
		if (this.pv.whole.mantisa.length == 1 && this.pv.exp == 0) this.base = other.base;
		if (other.pv.whole.mantisa.length == 1 && other.pv.exp == 0) other.base = this.base;
		if (this.base != other.base) { alert('Different bases : ' + JSON.stringify(this.base) + ' & ' + JSON.stringify(other.base)); return new exponential(1, new this.pv.constructor(new wholeplacevalue(['%']), 0)) }
	}

	/*	//	-2024.4
	pow(other) { // 2015.6
		return new exponential(this.base, this.pv.pow(other.pv));
	}

	pointpow(other) { // 2015.12
		return new exponential(this.base, this.pv.pointpow(other.pv));
	}
	*/

	static toStringCosh(pv, base) { // 2015.11
		var s = pv.clone();
		var ret = '';
		hyper('cosh(', +1);
		hyper('sinh(', -1);
		ret += exponential.toStringXbase(s, base);
		//alert([JSON.stringify(s), JSON.stringify(ret)]);
		return ret.substr(ret.length - 2) == '+0' ? ret.substring(0, ret.length - 2) : ret[ret.length - 1] == '+' ? ret.substring(0, ret.length - 1) : ret;
		function hyper(name, sign) {
			for (var i = 4; i >= -4; i--) {
				if (i == 0) continue; //alert([s, JSON.stringify(s)]);
				var l = s.get(i).toreal();
				var r = s.get(-i).toreal();
				var m = Math.min(l, sign * r);
				var al = Math.abs(l);
				var ar = Math.abs(r);
				//alert([i, l, r, Math.sign(l) * Math.sign(r) == sign, al >= ar, al != 0, m, Math.sign(l) * Math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001]);
				if (math.sign(l) * math.sign(r) == sign && al >= ar && al != 0 && Math.abs(m) > .001) { // Math.sign to math.sign   2016.3
					var n = m * 2;
					ret += (n == 1 ? '' : n == -1 ? '-' : Math.round(n * 1000) / 1000) + name + (i == 1 ? '' : i) + base + ')+';
					s = s.sub(new markedplacevalue(new wholeplacevalue().parse(1), i).add(new markedplacevalue(new wholeplacevalue().parse(1), -i).scale(sign)).scale(m));
				}
			}
			ret = ret.replace(/\+\-/g, '-');
		}
	}

	static toStringXbase(pv, base) {                        // added namespace  2015.7
		console.log('exponential: pv = ' + pv);
		var x = pv.whole.mantisa;
		var exp = pv.exp;						// exp for negative powers	2015.8
		console.log('exponential.toStringXbase: x=' + x);
		if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
			x.pop();                                    // Replace shift with pop because L2R 2015.7
			return exponential.toStringXbase(new markedplacevalue(new wholeplacevalue(x), 0), base);  // added namespace  2015.7
		}
		var ret = '';
		var str = x//.toString().replace('.', '');
		var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
		for (var i = str.length-1; i >=0 ; i--) {        // power is index because whole is L2R  2015.7 
		var power = i + exp;
			var digit = Math.round(1000 * str[i].toreal()) / 1000;   // power is index because whole is L2R  2015.7 
			if (digit != 0) {
				ret += '+';
				var coef = coefficient(digit); if (power == 0) { coef = digit; }
				var exp1 = ''; if (power != 0) exp1 = power + base; if (power == 1) exp1 = base; if (power == -1) exp1 = '-' + base;
				var exp2 = '';
				if (Math.abs(Math.log(digit) - Math.round(Math.log(digit))) < .01) { coef = ''; exp2 = Math.round(Math.log(digit)); }
				var exp12 = (exp1 && exp2) ? ('exp(' + exp1 + '+' + exp2 + ')') : exp1 ? ('exp(' + exp1 + ')') : exp2 ? ('exp(' + exp2 + ')') : '';
				ret += exp12 ? (coef + exp12) : coef != '' ? coef : '1';
			}
			console.log('exponential.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
		}
		ret = ret.replace(/\+\-/g, '-');
		if (ret[0] == '+') ret = ret.substring(1);
		if (ret.slice(-1) == '*') ret = ret.slice(0,-1);
		if (ret == '') ret = '0';
		return ret;
		function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*'); }
		function sup(x) {
			if (x == 1) return '';
			return pretty(x);
			function ugly(x) { return (x != 1) ? '^' + x : ''; }
			function pretty(x) {
				return x.toString().split('').map(
					function (x) { return { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[x]; }).join('');
			}
		}
	}

	eval(base) {
		var sum = 0;
		for (var i = 0; i < this.pv.whole.mantisa.length; i++) {
			var pow = Math.pow(Math.exp(base), i + this.pv.exp);  // offset by exp    2015.8    // Replace base w/ exp(base)    2016.1
			if (this.pv.whole.get(i).toreal() != 0) sum += this.pv.whole.get(i).toreal() * pow;  // Skip 0 to avoid %    2015.8
			//alert(this.pv.exp+','+this.pv.whole.get(i)+','+(i+this.pv.exp)+','+sum)
		}
		return new exponential(1, new this.pv.constructor(new wholeplacevalue().parse('(' + sum + ')'), 0));  // interpret as number  2015.8
	}

	pointeval(n) {	//	+2022.02
		return new this.constructor(this.base, this.pv.pointeval(n));
	}

	//pointeval() {	//	+2022.01	//	-2022.02
	//	return new this.constructor(this.base, this.pv.pointeval());
	//}

}
