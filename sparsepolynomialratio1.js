
// Author:  Anthony John Ripa
// Date:    8/31/2018
// SparsePolynomialRatio1 : a datatype for representing rational expressions; an application of the SparsePlaceValueRatio1 datatype

function sparsepolynomialratio1(arg, pv) {
	var base, pv;                                                                                           //  2018.3
	if (arguments.length == 0)[base, pv] = [1, new sparseplacevalueratio1(rational)];                       //  2018.3
	if (arguments.length == 1) {                                                                            //  2018.3
		if (arg === rational || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalueratio1(arg)];  //  2018.3 rationalcomplex
		else[base, pv] = [arg, new sparseplacevalueratio1(rational)];
	}
	if (arguments.length == 2)[base, pv] = arguments;                                                       //  2018.3
	//if (arguments.length < 1) base = 1;                                                 //  2017.9
	//if (arguments.length < 2) pv = new sparseplacevalueratio1();                        //  2017.12
	console.log('sparsepolynomialratio1 : arguments.length=' + arguments.length);
	//this.base = arg;
	this.base = base;                                                                                       //  2018.3
	if (pv instanceof sparseplacevalueratio1)  // 2017.6
		this.pv = pv;
	else if (typeof pv == 'number') {
		console.log("sparsepolynomialratio1: typeof pv == 'number'");
		this.pv = new wholeplacevalue([pv])
		console.log(this.pv.toString());
	}
	else
		{ var s = 'SparsePolynomialRatio1 expects arg 2 to be sparseplacevalueratio1 not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
		//alert('sparsepolynomialratio1: bad arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
}

sparsepolynomialratio1.prototype.parse = function (strornode) {  //  2017.9
	console.log('<strornode>')
	console.log(strornode)
	console.log('</strornode>')
	if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialratio1(a.base, new this.pv.parse(JSON.stringify(a.pv))) }    //  2018.3
	var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
	if (node.type == 'SymbolNode') {
		console.log('SymbolNode')
		//var base = node.name;
		//var pv = '1e1'//10;
		if (node.name.match(this.pv.num.datatype.regexfull())) {    //  2018.3
			var base = 1;
			var pv = this.pv.parse(node.name);
		} else {
			var base = node.name;
			var pv = this.pv.parse('1e1');
		}
		//return new sparsepolynomialratio1(base, new sparseplacevalueratio1().parse(pv));
		return new sparsepolynomialratio1(base, pv);                 //  2018.3
	} else if (node.type == 'OperatorNode') {
		console.log('OperatorNode')
		var kids = node.args;
		var a = this.parse(kids[0]);        //  2017.12 this
		if (node.fn == 'unaryMinus') {
			var c = new sparsepolynomialratio1(1, this.pv.parse(0)).sub(a);  //  2018.3
		} else if (node.fn == 'unaryPlus') {
			var c = new sparsepolynomialratio1(1, this.pv.parse(0)).add(a);  //  2018.3
		} else {
			var b = this.parse(kids[1]);    //  2017.12 this
			var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
		}
		return c
	} else if (node.type == 'ConstantNode') {
		return new sparsepolynomialratio1(1, this.pv.parse(node.value));     //  2018.3
	}
}

sparsepolynomialratio1.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
	return this.pv.toString() + ' base ' + this.base;
}

sparsepolynomialratio1.prototype.toString = function () {
	var num = sparsepolynomialratio1.toStringXbase(this.pv.num, this.base);
	if (this.pv.den.is1()) return num;
	num = (count(this.pv.num.points) < 2) ? num : '(' + num + ')';
	var den = sparsepolynomialratio1.toStringXbase(this.pv.den, this.base);
	den = (count(this.pv.den.points) < 2) ? den : '(' + den + ')';
	return num + '/' + den;
	function count(array) {
		return array.length;
	}
}

sparsepolynomialratio1.prototype.add = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.add(other.pv));
}

sparsepolynomialratio1.prototype.sub = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.sub(other.pv));
}

sparsepolynomialratio1.prototype.times = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.times(other.pv));
}

sparsepolynomialratio1.prototype.divide = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.divide(other.pv));
}

sparsepolynomialratio1.prototype.divideleft = function (other) {   //  2016.8
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.divideleft(other.pv));
}

sparsepolynomialratio1.prototype.dividemiddle = function (other) {   //  2018.4
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.dividemiddle(other.pv));
}

sparsepolynomialratio1.prototype.pointadd = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.pointadd(other.pv));
}

sparsepolynomialratio1.prototype.pointsub = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.pointsub(other.pv));
}

sparsepolynomialratio1.prototype.pointtimes = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.pointtimes(other.pv));
}

sparsepolynomialratio1.prototype.pointdivide = function (other) {
	this.align(other);
	return new sparsepolynomialratio1(this.base, this.pv.pointdivide(other.pv));
}

sparsepolynomialratio1.prototype.align = function (other) {    // Consolidate alignment    2015.9
	if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
	if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
	if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomialratio1(1, this.pv.parse('%')) }  //  2018.3  this.pv
}

sparsepolynomialratio1.prototype.pow = function (other) { // 2015.6
	return new sparsepolynomialratio1(this.base, this.pv.pow(other.pv));
}

sparsepolynomialratio1.toStringXbase = function (pv, base) {     // added namespace  2015.7
	return new sparsepolynomial1(base, pv);                     //  2018.4  outsource
}

sparsepolynomialratio1.prototype.eval = function (other) {
	return new sparsepolynomialratio1(1, this.pv.eval(other.pv));    //  2017.10
}
