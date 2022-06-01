
// Author:  Anthony John Ripa
// Date:    05/31/2022
// Laurent: a datatype for representing Laurent polynomials; an application of the MarkedPlaceValue datatype

//function laurent(base, pv) {								//	-2022.05
function laurent(arg) {										//	+2022.05
	//if (arguments.length < 1) base = 1;		//  2017.9	//	-2022.05
	//if (arguments.length < 2) pv = new placevalue();		//	-2022.05
	var base, pv;																//	+2022.05
	if (arguments.length == 0)[base, pv] = [1, new markedplacevalue(rational)];	//	+2022.05
	if (arguments.length == 1) {												//	+2022.05
		if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new markedplacevalue(arg)];
		else[base, pv] = [arg, new markedplacevalue(rational)];
	}
	if (arguments.length == 2)[base, pv] = arguments;							//	+2022.05
	if (Array.isArray(base)) alert('laurent expects argument 1 (base) to be StringOrNumber but found ' + typeof base);
	if (!(pv instanceof markedplacevalue)) { var s = 'Laurent expects arg 2 (pv) to be a markedplacevalue but found ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
	this.base = base
	this.pv = pv;
	return;
}

laurent.prototype.parse = function (strornode) {    //  2017.9
	console.log('<strornode>')
	console.log(strornode)
	console.log('</strornode>')
	if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new laurent(a.base, new this.pv.constructor(new wholeplacevalue().parse(JSON.stringify(a.pv.whole)), a.pv.exp)) }    //  2017.10
	var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
	if (node.type == 'ConstantNode') {
		//return new laurent(1, new this.pv.constructor(new wholeplacevalue().parse('(' + Number(node.value) + ')'), 0));	//	-2022.05
		return new laurent(1, this.pv.parse('(' + Number(node.value) + ')'));												//	+2022.05
	} else if (node.type == 'SymbolNode') {
		console.log('SymbolNode')
		//var base = node.name;																							//	-2020.5
		//var pv = new placevalue(new wholeplacevalue().parse(1), 1);   // 1E1 not 10 so 1's place DNE, not 0.   2015.9	//	-2020.5
		if (node.name.match(this.pv.whole.datatype.regexfull())) {														//	+2020.5
			var base = 1;
			var pv = this.pv.parse(node.name);
		} else {
			var base = node.name;
			var pv = this.pv.parse('10');
		}
		return new laurent(base, pv);
	} else if (node.type == 'OperatorNode') {
		console.log('OperatorNode')
		var kids = node.args;
		//var a = new laurent().parse(kids[0]);	// laurent handles unpreprocessed kid   2015.11				//	-2022.05
		var a = this.parse(kids[0]);																		//	+2022.05
		if (node.fn == 'unaryMinus') {
			//var c = new laurent(1, new this.pv.constructor(new wholeplacevalue().parse(0), 0)).sub(a);	//	-2022.05
			var c = new laurent(1, this.pv.parse(0)).sub(a);												//	+2022.05
		} else if (node.fn == 'unaryPlus') {
			//var c = new laurent(1, new this.pv.constructor(new wholeplacevalue().parse(0), 0)).add(a);	//	-2022.05
			var c = new laurent(1, this.pv.parse(0)).add(a);												//	+2022.05
		} else {
			//var b = new laurent().parse(kids[1]);   // laurent handles unpreprocessed kid   2015.11		//	-2022.05
			var b = this.parse(kids[1]);   																	//	+2022.05
			var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
		}
		return c;
		//me.base = c.base;
		//me.pv = c.pv;
	}
}

laurent.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
	return this.pv.tohtml(true) + ' base ' + this.base;
}

laurent.prototype.toString = function () {
	return laurent.toStringXbase(this.pv, this.base);
}

laurent.prototype.add = function (other) { this.align(other); return new laurent(this.base, this.pv.add(other.pv)); }
laurent.prototype.sub = function (other) { this.align(other); return new laurent(this.base, this.pv.sub(other.pv)); }
laurent.prototype.times = function (other) { this.align(other); return new laurent(this.base, this.pv.times(other.pv)); }
laurent.prototype.divide = function (other) { this.align(other); return new laurent(this.base, this.pv.divide(other.pv)); }
laurent.prototype.divideleft = function (other) { this.align(other); return new laurent(this.base, this.pv.divideleft(other.pv)); }
laurent.prototype.dividemiddle = function (other) { this.align(other); return new laurent(this.base, this.pv.dividemiddle(other.pv)); }
laurent.prototype.remainder = function (other) { this.align(other); return new laurent(this.base, this.pv.remainder(other.pv)); }
laurent.prototype.pointadd = function (other) { this.align(other); return new laurent(this.base, this.pv.pointadd(other.pv)); }
laurent.prototype.pointsub = function (other) { this.align(other); return new laurent(this.base, this.pv.pointsub(other.pv)); }
laurent.prototype.pointtimes = function (other) { this.align(other); return new laurent(this.base, this.pv.pointtimes(other.pv)); }
laurent.prototype.pointdivide = function (other) { this.align(other); return new laurent(this.base, this.pv.pointdivide(other.pv)); }
laurent.prototype.pointpow = function (other) { this.align(other); return new laurent(this.base, this.pv.pointpow(other.pv)); }

laurent.prototype.align = function (other) {    // Consolidate alignment    2015.9
	if (this.pv.whole.mantisa.length == 1 && this.pv.exp == 0) this.base = other.base;
	if (other.pv.whole.mantisa.length == 1 && other.pv.exp == 0) other.base = this.base;
	if (this.base != other.base) { console.trace(); alert('Laurent Different bases : ' + this.base + ' & ' + other.base); return new laurent('0/0') }
}

laurent.prototype.pow = function (other) { // 2015.6
	this.align(other);	//	+2020.5
	return new laurent(this.base, this.pv.pow(other.pv));
}

laurent.toStringXbase = function (pv, base) {                        // added namespace  2015.7
	console.log('laurent: pv = ' + pv);
	var x = pv.whole.mantisa;
	var exp = pv.exp;						// exp for negative powers	2015.8
	console.log('laurent.toStringXbase: x=' + x);
	if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
		x.pop();                                    // Replace shift with pop because L2R 2015.7
		return laurent.toStringXbase(new markedplacevalue(x), base);  // added namespace  2015.7
	}
	var ret = '';
	var str = x//.toString().replace('.', '');
	var maxbase = x.length - 1 + exp;				// exp for negative powers	2015.8
	for (var i = str.length-1; i >=0 ; i--) {        // power is index because whole is L2R  2015.7 
	var power = i + exp;
		var digit = Math.round(1000 * str[i].toreal()) / 1000;  // toreal   2016.7 
		if (digit != 0) {
			ret += '+';
			if (power == 0)
				ret += digit;
			else if (power == 1)
				ret += coefficient(digit) + base;
			else
				ret += coefficient(digit) + base + sup(power);
		}
		console.log('laurent.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
	}
	ret = ret.replace(/\+\-/g, '-');
	if (ret[0] == '+') ret = ret.substring(1);
	if (ret == '') ret = '0';
	return ret;
	function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }
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

laurent.prototype.eval = function (other) {		//	+2021.3
	var pv = this.pv.eval(other.pv);
	if (Array.isArray(this.base))
		var base = this.base.slice(0, -1);
	else
		var base = other.pv.isconst() ? 1 : other.base;
	return new this.constructor(base, pv);
}

//laurent.prototype.eval = function (base) {	//	-2021.3
//	var sum = new rational(0);
//	for (var i = 0; i < this.pv.whole.mantisa.length; i++) {
//		//var pow = Math.pow(base, i + this.pv.exp);  // offset by exp    2015.8
//		var pow = base.pv.whole.get(0).pow(i + this.pv.exp);  // offset by exp    2015.8
//		//if (this.pv.whole.get(i) != 0) sum += this.pv.whole.get(i) * pow  // Skip 0 to avoid %    2015.8
//		if (!this.pv.whole.get(i).is0()) sum = sum.add(this.pv.whole.get(i).times(pow))  // Skip 0 to avoid %    2015.8
//	}
//	return new laurent(1, new placevalue(new wholeplacevalue([sum]), 0));  // interpret as number  2015.8
//}
