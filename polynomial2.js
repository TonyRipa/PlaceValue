
// Author:	Anthony John Ripa
// Date:	4/30/2019
// Polynomial2 : a 2-D datatype for representing polynomials; an application of the WholePlaceValue2 datatype

function polynomial2(base, pv) {
	if (arguments.length < 1) base = [1, null];             //  2017.9
	if (arguments.length < 2) pv = new wholeplacevalue2();  //  2017.9
	if (!Array.isArray(base)) { var s = 'Polynomial2 expects arg 1 (base) to be an array but found ' + typeof base + " : " + JSON.stringify(base); alert(s); throw new Error(s); }
	if (!(pv instanceof wholeplacevalue2)) { var s = 'Polynomial2 expects arg 2 (pv) to be a wholeplacevalue2 but found ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
	this.base = base
	this.pv = pv;
	return;
}

polynomial2.prototype.parse = function (strornode) {    //  2017.9
	console.log('new polynomial2 : ' + JSON.stringify(strornode))
	if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomial2(a.base, new wholeplacevalue2(a.pv.mantisa)) }
	var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
	if (node.type == 'SymbolNode') {
		console.log('new polynomial2 : SymbolNode')
		var base = [node.name, null];
		var pv = new wholeplacevalue2([[0, 1]]);
		//alert(JSON.stringify([base, new wholeplacevalue2(pv, 'new polynomial2 >'), new polynomial2(base, new wholeplacevalue2(pv, 'new polynomial2 >'))]))
		return new polynomial2(base, pv);
		//console.log('new polynomial2 : parse1 : base = ' + JSON.stringify(me.base));
	} else if (node.type == 'OperatorNode') {
		console.log('new polynomial2 : OperatorNode')
		var kids = node.args;
		//var a = new polynomial2(kids[0].type == 'OperatorNode' ? kids[0] : kids[0].value || kids[0].name);
		var a = new polynomial2().parse(kids[0]);       // polynomial2 handles unpreprocessed kid   2015.11
		if (node.fn == 'unaryMinus') {
			var c = new polynomial2([1, null], new wholeplacevalue2([[0]])).sub(a);
		} else if (node.fn == 'unaryPlus') {
			var c = new polynomial2([1, null], new wholeplacevalue2([[0]])).add(a);
		} else {
			var b = new polynomial2().parse(kids[1]);   // polynomial2 handles unpreprocessed kid   2015.11
			var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
		}
		return c;
		//console.log('new polynomial2 : parse2 : base = ' + JSON.stringify(me.base));
	} else if (node.type == 'ConstantNode') {
		return new polynomial2([1, null], new wholeplacevalue2([[Number(node.value)]]));
	} else if (node.type == 'FunctionNode') {   // Discard functions    2015.12
		alert('Syntax Error: polynomial2 expects input like 1, x, x*x, x^3, 2*x^2, or 1+x but found ' + node.name + '.');
		return polynomial2.parse(node.args[0]);
	}
}

polynomial2.prototype.tohtml = function (trace) {    //  Replacement for toStringInternal    2015.7
	console.log(trace + ' polynomial2.prototype.tohtml');
	var ret = this.pv.tohtml(trace + ' polynomial2.prototype.tohtml >') + ' Base ' + this.base;
	console.log(trace + ' polynomial2.prototype.tohtml : ' + ret);
	return ret;
}

polynomial2.prototype.toString = function () {
	if (!Array.isArray(this.base)) alert('Array 1D : ' + JSON.stringify(this));
	return polynomial2.toStringXbase2(this.pv, this.base);
}

polynomial2.prototype.add = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.add(other.pv, 'polynomial2.prototype.add >'));
}

polynomial2.prototype.pointadd = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.pointadd(other.pv));
}

polynomial2.prototype.sub = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.sub(other.pv));
}

polynomial2.prototype.pointsub = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.pointsub(other.pv));
}

polynomial2.prototype.times = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.times(other.pv));
}

polynomial2.prototype.pointtimes = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.pointtimes(other.pv));
}

polynomial2.prototype.divide = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.divide(other.pv));
}

polynomial2.prototype.remainder = function (other) {	//	2019.4	Added
	this.align(other);
	return new polynomial2(this.base, this.pv.remainder(other.pv));
}

polynomial2.prototype.pointdivide = function (other) {
	this.align(other);
	return new polynomial2(this.base, this.pv.pointdivide(other.pv));
}

polynomial2.prototype.align = function (other) {    // obviate need for different kinds of addition 2015.7
	//alert(JSON.stringify([this, other]));
	alignHelper(other, this);
	if (alignHelper(this, other)) flip(this,other);	// If (this flipped) flipback;	2015.8
	//if (shouldFlip(this.pv.mantisa, other.pv.mantisa)) flip(this, other);
	if (this.base.toString() != other.base.toString()) alert('Different bases : ' + JSON.stringify(this) + ' & ' + JSON.stringify(other));
	function shouldFlip(matrix1, matrix2) { return matrix1.length + matrix2.length > matrix1[0].length + matrix2[0].length }
	function flip(me, it) {
		it.base = me.base = [me.base[1], me.base[0]];
		me.pv.mantisa = math.transpose(me.pv.mantisa);
		it.pv.mantisa = math.transpose(it.pv.mantisa);
	}
	function alignHelper(it, me) {
		function isnum(x) { return !isNaN(x) }
		try {
			if (isnum(it.base[0]) && isnum(it.base[1])) {
				it.base = me.base;
			} else if (it.base[0] == me.base[0] && isnum(it.base[1])) {
				it.base = me.base;
			} else if (it.base[1] == me.base[1] && isnum(it.base[0])) {
				it.base = me.base;
			} else if (it.base[0] == me.base[1] && it.base[1] == me.base[0]) {
				it.base = me.base;
				it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
				return true	// signal flip	2015.8
			} else if (isNaN(me.base[0]) && isnum(me.base[1]) && isnum(it.base[1])) {
				me.base[1] = it.base[0];
				it.base = me.base;
				it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
				return true	// signal flip	2015.8
			} else if (isNaN(me.base[0]) && isnum(me.base[1]) && it.base[1] == me.base[0]) {
				me.base[1] = it.base[0];
				it.base = me.base;
				it.pv.mantisa = math.transpose(it.pv.mantisa);  // mathjs transpose 2015.7
				return true	// signal flip	2015.8
			}
		} catch (e) { alert(e.stack); }
	}
}

polynomial2.prototype.pow = function (other) { // 2015.7
	return new polynomial2(this.base, this.pv.pow(other.pv));
}

polynomial2.toStringXbase2 = function(pv, base) {   // Added namespace  2015.9
	var man = pv.mantisa;
	console.log('polynomial2.toStringXbase2: man=' + man);
	var ret = '';
	var row = man[0]//.toString().replace('.', '');
	for (var c = row.length - 1; c >= 0; c--) {
		for (var r = 0; r < man.length; r++) {
			var powerx = c;      // power is index because whole is L2R  2015.7
			var powery = r;      // power is index because whole is L2R  2015.7
			var digit = Math.round(pv.get(r, c) * 1000) / 1000; // get() 2015.7
			if (pv.get(r, c) != 0) {
				ret += '+';
				if (powerx == 0 && powery == 0)
					ret += digit;
				else {
					ret += (digit != 1 ? (digit != -1 ? digit : '-') : '').toString();
					if (powerx != 0) ret += base[0] + sup(powerx);
					if (powerx == 1 && powery != 0) ret += '*';
					if (powery != 0) ret += base[1] + sup(powery);
					//console.log('polynomial2.toStringXbase2: powerx=' + powerx + ', digit=' + digit + ', ret=' + ret);
				}
			}
		}
	}
	ret = ret.replace(/\+\-/g, '-');
	if (ret[0] == '+') ret = ret.substring(1);
	if (ret == '') ret = '0';
	return ret;
	function sup(x) {
	if (x == 1) return '';
		return ugly(x);
		function ugly(x) { return (x != 1) ? '^' + x : ''; }
		function pretty(x) {
			return x.toString().split('').map(
				function (x) { return { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[x]; }).join('');
		}
	}
}

polynomial2.prototype.eval = function (base) {	// 2015.8
	if (isNaN(this.base[1]))
		return new polynomial2([this.base[0], null], this.pv.eval(base));
	else {
		var me = new polynomial2([null, null], new wholeplacevalue2([[0]]));
		me.pv.mantisa = math.transpose(this.pv.mantisa);
		return new polynomial2([null, null], me.pv.eval(base));
	}
}
