﻿
// Author : Anthony John Ripa
// Date : 6/30/2023
// MarkedPlaceValue2 : a 2d datatype for representing base agnostic arithmetic via numbers whose digits are real

function markedplacevalue2(whole, exp) {	//	~2023.6
	if (arguments.length < 1) whole = new wholeplacevalue2();   //  2017.9
	if (arguments.length < 2) exp = [0, 0];                     //  2017.9
	if (!(whole instanceof wholeplacevalue2)) { var s = 'MarkedPlaceValue2 expects arg 1 (whole) to be a WholePV2 not ' + typeof whole + " : " + JSON.stringify(whole); alert(s); throw new Error(s); }
	if (!Array.isArray(exp)) { var s = 'MarkedPlaceValue2 expects arg 2 (exp) to be an array but found ' + typeof exp + " : " + JSON.stringify(exp); alert(s); throw new Error(s); }
	this.whole = whole;
	this.exp = exp
	console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(whole)=" + Array.isArray(whole));
}

markedplacevalue2.prototype.tohtml = function () {     // Replaces toStringInternal 2015.7
	return this.whole.tohtml() + 'E' + (this.exp[1] == 0 ? this.exp[0] : this.exp); // exp is 2D    // 2015.10
}

markedplacevalue2.prototype.toString = function () {
	return JSON.stringify([this.whole, this.exp]);
}

markedplacevalue2.prototype.add = function (addend) {
	var me = this.clone();
	var other = addend.clone();
	markedplacevalue2.align(me, other);
	var whole = me.whole.add(other.whole);
	return new markedplacevalue2(whole, me.exp);
}

markedplacevalue2.prototype.sub = function (subtrahend) {
	var me = this.clone();
	var other = subtrahend.clone();
	markedplacevalue2.align(me, other);
	var whole = me.whole.sub(other.whole);
	return new markedplacevalue2(whole, me.exp);
}

markedplacevalue2.prototype.pointsub = function (subtrahend) {
	var whole = this.whole.pointsub(subtrahend.whole);
	return new markedplacevalue2(whole, this.exp);
}

markedplacevalue2.prototype.pointadd = function (addend) {
	var whole = this.whole.pointadd(addend.whole);
	return new markedplacevalue2(whole, this.exp);
}

markedplacevalue2.prototype.pointtimes = function (multiplier) {
	var me = this.clone();
	var other = multiplier.clone();
	markedplacevalue2.align(me, other);
	var whole = me.whole.pointtimes(other.whole);
	return new markedplacevalue2(whole, me.exp);
}

markedplacevalue2.prototype.pointdivide = function (divisor) {
	var me = this.clone();
	var other = divisor.clone();
	markedplacevalue2.align(me, other);
	var whole = me.whole.pointdivide(other.whole);
	return new markedplacevalue2(whole, me.exp);
}

markedplacevalue2.prototype.pow = function (power) {	// 2015.8
	if (power instanceof markedplacevalue2) power = power.whole;   // laurent calls wpv    2015.8
	if (power.get(0, 0) < 0) return (new markedplacevalue2(wholeplacevalue2.parse(1), [0, 0])).divide(this.pow(new markedplacevalue2(wholeplacevalue2.parse(-power.get(0, 0)), [0, 0]))); // 2016.12
	var whole = this.whole.pow(power);
	var exp = [this.exp[0] * power.get(0, 0), this.exp[1] * power.get(0, 0)];    // exp*pow not exp^pow  2015.9 // exp is 2D    2015.10
	return new markedplacevalue2(whole, exp);
}

markedplacevalue2.align = function (a, b) {    // rename pad align 2015.9
	alignhelper(a, b);
	alignhelper(b, a);
	function alignhelper(a, b) {
		while (a.exp[0] > b.exp[0]) {
			a.exp[0]--;
			a.whole.times10(); // Delegate Shift to Whole  2015.7
		}
		while (a.exp[1] > b.exp[1]) {
			a.exp[1]--;
			a.whole.times01(); // Delegate Shift to Whole  2015.7
		}
	}
}

markedplacevalue2.prototype.times = function (top) {
	var whole = this.whole.times(top.whole);
	return new markedplacevalue2(whole, [this.exp[0] + top.exp[0], this.exp[1] + top.exp[1]]);    // exp is 2D    2015.10
}

markedplacevalue2.prototype.divide = function (denominator) {
	var me = this.clone();
	var pads = 0;						// 2015.11
	pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : padup(me, denominator, 4);   // 2016.1
	if (denominator.whole.mantisa[0].length != 1 || me.whole.mantisa[0].length < denominator.whole.mantisa[0].length) pad(me, denominator, 4);  // 2015.9 // [0] 2015.10
	//if (denominator.whole.mantisa.length != 1 || me.whole.mantisa.length < denominator.whole.mantisa.length) padup(me, denominator, 4);  // 2015.9 // [0] 2015.10
	var whole = me.whole.divide(denominator.whole);
	console.log('markedplacevalue2.prototype.divide : return new markedplacevalue2(whole, ' + me.exp + '-' + denominator.exp +')')
	var ret = new markedplacevalue2(whole, [me.exp[0] - denominator.exp[0], me.exp[1] - denominator.exp[1]]);
	unpad(ret, pads);					// 2015.11
	depad(ret);                         // 2015.11
	return ret;
	function pad(n, d, sigfig) {
		var i = 0;						// 2015.11
		while (n.whole.mantisa[0].length < sigfig + d.whole.mantisa[0].length) {    // [0] 2015.10
			i++;						// 2015.11
			console.log('markedplacevalue2.prototype.divide.padback : ' + n.whole.mantisa[0].length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
			n.exp[0]--; // exp is 2D    2015.10
			n.whole.times10();      // Delegate Shift to Whole  2015.7
		}
		return i;						// 2015.11
	}
	function padup(n, d, sigfig) {
		var i = 0;						// 2015.11
		while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
			i++;						// 2015.11
			console.log('markedplacevalue2.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
			n.exp[1]--; // exp is 2D    2015.10
			n.whole.times01();      // Delegate Shift to Whole  2015.7
		}
		return i;						// 2015.11
	}
	function unpad(pv, pads) {			// 2015.11
		while (pads > 0) {
			if (pv.whole.mantisa[0].reduce(function (x, y) { return x && y == 0 }, true)) {
				pv.whole.mantisa.shift(); if (pv.whole.mantisa.length == 0) pv.whole.mantisa = [[]];    // LengthCheck  2015.12
				pv.exp[1]++
			}
			pads--;
		}
	}
	function depad(pv) {			// 2015.11
		//  while (pv.exp[1] < 0 && pv.whole.mantisa[0].length && pv.whole.mantisa[0].reduce(function (x, y) { return x && y == 0 }, true)) {	//	LengthCheck 2015.12
		while (pv.exp[1] < 0 && pv.whole.mantisa.length > 1 && pv.whole.mantisa[0].reduce(function (x, y) { return x && y == 0 }, true)) {		//	2018.6	LengthCheck
			pv.whole.mantisa.shift()
			pv.exp[1]++
		}
	}
}

markedplacevalue2.prototype.remainder = function (den) {	//	2019.4	Added
	return this.sub(this.divide(den).times(den));
}

markedplacevalue2.prototype.clone = function () {
	return new markedplacevalue2(this.whole.clone(), this.exp.slice(0));  // exp is 2D    2015.10
}

markedplacevalue2.prototype.eval = function (base) {	// 2015.8
	var ret = [];
	for (var col = 0; col < this.whole.mantisa[0].length; col++) {
		var sum = 0;
		for (var row = 0; row < this.whole.mantisa.length; row++) {
			//alert([this.whole.get(row, col), Math.pow(base, row + this.exp[1])]);
			if (this.whole.get(row, col) != 0)   // Only add non-zero digits; Prevents 0*∞=%.   2016.1
				sum += this.whole.get(row, col) * Math.pow(base, row + this.exp[1]);  // Offset pow by exp    2015.11   // UnOffset get 2015.12
		}
		ret.push(sum);
	}
	return new markedplacevalue2(new wholeplacevalue2([ret]), [this.exp[0], 0]);    // exp[0]   2015.12
}