
// Author : Anthony John Ripa
// Date : 4/30/2019
// WholePlaceValue2 : a 2D datatype for representing base agnostic arithmetic via whole numbers whose digits are real

function wholeplacevalue2(man, trace) {
	if (arguments.length < 1) man = [[]];   //  2017.9
	if (!Array.isArray(man)) { var s = 'wholeplacevalue2 expects argument to be a 2D array but found ' + typeof man + " : " + JSON.stringify(man); alert(s); throw new Error(s); }
	if (!Array.isArray(man[0])) alert("wholeplacevalue2 expects argument to be 2D array but found 1D array of " + typeof man[0]);
	this.mantisa = removeLeadingZeros(man);
	function removeLeadingZeros(man) {
		return ensureArray2D(removeLeadingZeroCol(removeLeadingZeroRow(ensureArray2D(man))));
		function ensureArray2D(man) {
			if (man.length == 0) man = [[0]];
			if (!Array.isArray(man[0])) man = [man];
			return man;
		}
		function removeLeadingZeroRow(man) {
			var h = man.length;
			for (var row = h - 1; row >= 0; row--) {
				var AllZero = man[row].reduce(function (sum, x) { return sum && (x == 0); }, true);
				if (AllZero) man.pop()  // Remove zero-row                          2015.7
				else break;             // Leading row found; remove no more rows.  2015.7 
			}
			return man;
		}
		function removeLeadingZeroCol(man) { return math.transpose(removeLeadingZeroRow(math.transpose(man))); }
	}
}

wholeplacevalue2.parse = function (man, trace) {
	if (Array.isArray(man)) {
		console.log(trace + ' new wholeplacevalue2 : man(array) = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
	} else if (man instanceof String || typeof man == 'string' || typeof man == 'number') {
		man = man.toString();
		if (man.indexOf('mantisa') != -1) {
			var ans = JSON.parse(man)
			console.log('ans=' + JSON.stringify(ans));
			man = ans.mantisa
		} else {
			console.log(trace + 'new wholeplacevalue2 : num or string but not wpv; man = ' + man);
			man = [num2array(man)];    //  Array is 2D     2015.7
		}
		console.log(trace + ' new wholeplacevalue2 : man(str|num) = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
	} else {
		man = man.mantisa;
		console.log(trace + ' new wholeplacevalue2(object) : man = ' + JSON.stringify(this.mantisa) + ', arguments.length = ' + arguments.length);
	}
	return new wholeplacevalue2(man);
	function int2array(n) {
		var arr = n.toString().split('');
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == String.fromCharCode(822)) {
				arr[i - 1] *= -1;
				arr.splice(i, 1);
			}
		}
		return arr.reverse();   // .reverse makes lower indices represent lower powers 2015.7
	}
	function num2array(x) {
		return int2array(x.toString().replace('.', ''));
	}
}

wholeplacevalue2.prototype.tohtml = function (trace) {   // 2015.7
	trace += ' wholeplacevalue2.prototype.tohtml';
	console.log(trace);
	var ret = "<table style='display:inline-block;border-spacing:1px 0px;line-height:80%;text-align:center;'><tr><td style='padding:0'>" + this.toString(trace + ' >', "</td><td style='padding:0'>", "</td></tr><tr><td style='padding:0'>", '&nbsp;', true) + "</td></tr></table>";
	console.log(trace + ' : ' + ret);
	return ret;
}

wholeplacevalue2.prototype.toString = function (trace, hSeparator, vSeparator, space, html) {
	if (arguments.length < 4) space = ' ';
	if (arguments.length < 3) vSeparator = '\n';
	if (arguments.length < 2) hSeparator = '';
	console.log(trace + ' wholeplacevalue2.prototype.toString : ' + JSON.stringify(this.mantisa));
	if (!Array.isArray(this.mantisa[0])) alert(trace + ' wholeplacevalue2.prototype.toString : MANTISA IS 1D' + JSON.stringify(this.mantisa));
	var ret = '';
	var degreeMax = 0;
	for (var r = this.mantisa.length - 1; r >= 0; r--) {
		var degree = wholeplacevalue2.getDegree([this.mantisa[r]]).col;
		if (degree > degreeMax) degreeMax = degree;
		ret += toStringHelper(this.mantisa[r], degreeMax, hSeparator, space, html) + vSeparator;
	}
	return ret.trim();
	function toStringHelper(man, degreeMax, separator, space, html) {   //  Changed from static function to nested function.    2016.1
		if (arguments.length < 3) separator = '';   
		var ret = "";
		for (var i = man.length - 1 ; i >= 0; i--)
			ret += ((i > degreeMax) ? space : html ? wholeplacevalue2.digithtml(man, i) : wholeplacevalue2.digit(man, i)) + separator;
		return ret;
	}
}

wholeplacevalue2.digithtml = function (man, i) {
	return i < 0 ? 0 : htmlifyDigit(man[i]);
	function htmlifyDigit(digit) {
		var NEGATIVE = String.fromCharCode(822);
		var signbit = digit < 0;
		if (signbit) digit = -digit;
		var arr = digit2array(digit)
		var ret = arr.join('');
		if (arr.length > 1) {
			if (signbit) { ret = "<small><span style='letter-spacing:-2px'><s>" + ret.substr(0, ret.length - 1) + '</s></span><s>' + ret[ret.length - 1] + '</s></small>';
			} else { ret = "<small><span style='letter-spacing:-2px'>" + ret.substr(0, ret.length - 1) + '</span>' + ret[ret.length - 1] + '</small>'; }
		} else if (signbit) ret = '<s>' + ret + '</s>';
		return ret;
		function digit2array(digit) {
			var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .625: '⅝', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚', .875: '⅞' }
			var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
			var cons = { 0.159: 'τ' + INVERSE, 6.28: 'τ' };
			var rounddigit = Math.round(digit * 1000) / 1000;
			var roundstr = rounddigit.toString();
			var digitstr = digit.toString();
			if (isNaN(digit)) return ['%'];
			if (cons[rounddigit]) return [cons[rounddigit]];
			if (frac[rounddigit]) return [frac[rounddigit]];
			if (digit == 0) return ['0'];
			if (0 < digit && digit < 1) {
				var str = (Math.round(digit * 10) / 10).toString();
				var dot = str.indexOf('.');
				return (digit == Math.round(digit)) ? [digit] : ['.', str[dot + 1]];
			}
			if (1 <= digit && digit <= 9) return (digit == Math.round(digit)) ? [digit] : [roundstr[0]];
			if (9 < digit && isFinite(digit)) {
				var str = (Math.round(digit)).toString();
				return str.split('');
			}
			if (digit == 1 / 0) return ['∞'];
			return ['x'];
		}
	}
}

wholeplacevalue2.digit = function (man, i) {    // Removed uncalled parameter html, since callers call digithtml() instead. 2016.1
	// 185  189  822 8315   9321
	// ^1   1/2  -   ^-     10
	var NEGATIVE = String.fromCharCode(822);
	var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
	var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .625: '⅝', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚', .875: '⅞' }
	var cons = { '-0.159': 'τ' + NEGATIVE + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
	var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
	var digit = i < 0 ? 0 : man[i];
	var rounddigit = Math.round(digit * 1000) / 1000;
	var rounderdigit = Math.round(digit * 10) / 10;
	var roundstr = rounddigit.toString();
	var digitstr = digit.toString();
	if (isNaN(digit)) return '%';
	if (digit == -1 / 0) return '∞' + NEGATIVE;
	if (digit < -9 && isFinite(digit)) {
		var str = (Math.round(digit)).toString();
		return '(' + rounderdigit + ')';
	}
	if (-1 < digit && digit <= .01) {
		var flip = -1 / digit;
		if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + NEGATIVE + INVERSE;
	}
	if (cons[rounddigit]) return cons[rounddigit];
	if (digit != 1 && Math.round(digit * 10) / 10 == 1) return "<small><span style='letter-spacing:-2px'>-</span>1</small>";
	if (0 > digit && digit > -1) {
		var str = (Math.round(digit * 10) / 10).toString();
		str = digit.toString();
		var dot = str.indexOf('.');
		return (digit == Math.round(digit)) ? digit : rounderdigit;
	}
	if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? Math.abs(digit).toString().split('').join(NEGATIVE) + NEGATIVE : '(' + rounderdigit + ')';
	if (digit == 0) return '0';
	if (.01 <= digit && digit < 1) {
		var flip = Math.round(1 / digit);   // round prevents 1/24.99999    2015.7
		if (flip < 100 && Math.abs(digit - 1 / flip) < .001) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;    // flip<100&|digit-1/flip|     2015.7
	}
	if (frac[rounddigit]) return frac[rounddigit];
	if (cons[rounddigit]) return cons[rounddigit];
	if (0 < digit && digit < 1) {
		var str = (Math.round(digit * 10) / 10).toString();
		var dot = str.indexOf('.');
		return (digit == Math.round(digit)) ? digit : rounderdigit;
	}
	if (1 <= digit && digit <= 9) return (digit == Math.round(digit)) ? digit : rounderdigit;
	if (9 < digit && isFinite(digit)) {
		var str = (Math.round(digit)).toString();
		return '(' + rounderdigit + ')';
	}
	if (digit == 1 / 0) return '∞';
	return 'x';
}

wholeplacevalue2.prototype.get = function (row, col) {
	var man = this.mantisa;
	if (Array.isArray(man[0])) return get2(row, col);
	return get1(row, col);
	function get1(row, col) {
		if (col > 0) return 0;
		if (row >= man.length) return 0;    // lenth→length 2015.7
		return Number(man[row]);
	}
	function get2(row, col) {
		if (row >= man.length) return 0;
		if (col >= man[0].length) return 0;
		return Number(man[row][col]);
	}
}

wholeplacevalue2.prototype.add = function (other, trace) { return this.f(function (x, y) { return x + y }, other, trace + ' wholeplacevalue2.prototype.add >'); }
wholeplacevalue2.prototype.sub = function (other, trace) { return this.f(function (x, y) { return x - y }, other, trace + ' wholeplacevalue2.prototype.sub >'); }
wholeplacevalue2.prototype.pointtimes = function (other, trace) { return this.f(function (x, y) { return x * y }, other, trace + ' wholeplacevalue2.prototype.pointtimes >'); }
wholeplacevalue2.prototype.pointdivide = function (other, trace) { return this.f(function (x, y) { return x / y }, other, trace + ' wholeplacevalue2.prototype.pointdivide >'); }
wholeplacevalue2.prototype.clone = function (trace) { return this.f(function (x) { return x }, this, trace + ' wholeplacevalue2.prototype.clone >'); }
wholeplacevalue2.prototype.round = function (trace) { return this.f(function (x) { return Math.round(x) }, this, trace + ' wholeplacevalue2.prototype.clone >'); }

wholeplacevalue2.prototype.f = function (f, other, trace) {
	if (this.mantisa.length == 0) this.mantisa = [[0]];
	if (!Array.isArray(this.mantisa[0])) this.mantisa = [this.mantisa];
	console.log(trace + JSON.stringify(other));
	var h = Math.max(this.mantisa.length, other.mantisa.length);
	var w = Math.max(this.mantisa[0].length, other.mantisa[0].length);
	var ret = [];
	for (var r = 0; r < h; r++) {
		var row = [];
		for (var c = 0; c < w; c++) {
			row.push(f(this.get(r, c), other.get(r, c)));
		}
		ret.push(row)
	}
	return new wholeplacevalue2(ret, trace);
}

wholeplacevalue2.prototype.pointadd = function (other) {
	var h = Math.max(this.mantisa.length, other.mantisa.length);
	var w = Math.max(this.mantisa[0].length, other.mantisa[0].length);
	var ret = [];
	for (var r = 0; r < h; r++) {
		var row = [];
		for (var c = 0; c < w; c++) {
			row.push(this.get(r, c) + other.get(0, 0));
		}
		ret.push(row)
	}
	return new wholeplacevalue2(ret, 'wholeplacevalue2.prototype.pointadd >');
}

wholeplacevalue2.prototype.pointsub = function (other) {
	var h = Math.max(this.mantisa.length, other.mantisa.length);
	var w = Math.max(this.mantisa[0].length, other.mantisa[0].length);
	var ret = [];
	for (var r = 0; r < h; r++) {
		var row = [];
		for (var c = 0; c < w; c++) {
			row.push(this.get(r, c) - other.get(0, 0));
		}
		ret.push(row)
	}
	return new wholeplacevalue2(ret, 'wholeplacevalue2.prototype.pointsub >');
}

wholeplacevalue2.prototype.pow = function (power) { // 2015.7
	if (!(power instanceof wholeplacevalue2)) power = new wholeplacevalue2([[power]], 'wholeplacevalue2.prototype.pow1 >');
	if (power.mantisa.length > 1) { alert('WPV2 >Bad Exponent = ' + power.tohtml()); return new wholeplacevalue2([['%']], 'wholeplacevalue2.prototype.pow2 >') }
	if (this.mantisa.length == 1 && this.mantisa[0].length == 1) {  // check mantisa[0]     2015.7
		if (this.mantisa == 0 && power.mantisa == 0) return new wholeplacevalue2([['%']], 'wholeplacevalue2.prototype.pow3 >');
		else return new wholeplacevalue2([[Math.pow(this.mantisa, power.mantisa)]], 'wholeplacevalue2.prototype.pow4 >');
	}
	if (power.mantisa != Math.round(power.mantisa)) { alert('WPV2 .Bad Exponent = ' + power.tohtml()); return new wholeplacevalue2([['%']], 'wholeplacevalue2.prototype.pow5 >') }
	if (power.mantisa < 0) return new wholeplacevalue2([[0]], 'wholeplacevalue2.prototype.pow6 >');
	if (power.mantisa == 0) return new wholeplacevalue2([[1]], 'wholeplacevalue2.prototype.pow7 >');
	return this.times(this.pow(power.mantisa - 1));
}

wholeplacevalue2.prototype.times10 = function() { this.mantisa.map(function(x) { return x.unshift(0) }) }           // Caller can pad w/o know L2R or R2L  2015.7 // 2D 2015.10
wholeplacevalue2.prototype.times01 = function() { this.mantisa.unshift(new Array(this.mantisa[0].length).fill(0)) } // Caller can pad w/o know L2R or R2L  2015.7 // 2D 2015.10

wholeplacevalue2.prototype.times = function (other) {
	var h = this.mantisa.length;
	var w = this.mantisa[0].length;
	var ret = new wholeplacevalue2([[0]], 'wholeplacevalue2.prototype.times >');
	for (var r = 0; r < h; r++)
		for (var c = 0; c < w; c++) {
			ret = ret.add(unshift(other.scale(this.get(r, c)), r, c), 'wholeplacevalue2.prototype.times >');
		}
	return ret;
	function unshift(me, up, left) {
		var ret = new wholeplacevalue2([[0]], 'wholeplacevalue2.prototype.add >').add(me, 'wholeplacevalue2.prototype.unshift >');
		for (var r = 0; r < ret.mantisa.length; r++) {
			for (var i = 0; i < left; i++) ret.mantisa[r].unshift(0);
		}
		for (var r = 0; r < up; r++) {
			ret.mantisa.unshift(math.zeros(ret.mantisa[0].length)._data);
		}
		return ret;
	}
}

wholeplacevalue2.prototype.scale = function (scalar, trace) {
	var ret = this.clone(trace + ' wholeplacevalue2.prototype.scale >');
	for (var r = 0; r < ret.mantisa.length; r++)
		for (var c = 0; c < ret.mantisa[0].length; c++)
			ret.mantisa[r][c] *= scalar;
	return ret;
}

wholeplacevalue2.getDegree = function (man, show) {
	var h = man.length;
	var w = man[0].length;
	for (var col = w - 1; col >= 0; col--) {
		for (var row = h - 1; row >= 0; row--) {
			if (man[row][col] != 0) return { 'row': row, 'col': col, 'val': man[row][col] };
		}
	}
	return { 'row': 0, 'col': 0, 'val': man[0][0] };
}

wholeplacevalue2.prototype.divide = function (den) {
	var num = this;
	var iter = num.mantisa.length + num.mantisa[0].length;
	var quotient = divideh(num, den, iter);
	return quotient;
	function divideh(num, den, c) {
		if (c == 0) return new wholeplacevalue2([[0]], 'wholeplacevalue2.prototype.divide >');
		var d = wholeplacevalue2.getDegree(den.mantisa, true);
		var quotient = shift(num, d.row, d.col).scale(1 / d.val, 'wholeplacevalue2.prototype.divide >');
		if (d.val == 0) return quotient;
		var remainder = num.sub(quotient.times(den), 'wholeplacevalue2.prototype.divide >')
		var q2 = divideh(remainder, den, c - 1);
		quotient = quotient.add(q2);
		return quotient;
		function shift(me, up, left) {
			var ret = new wholeplacevalue2([[0]], 'wholeplacevalue2.prototype.add >').add(me, 'wholeplacevalue2.prototype.shift >');
			for (var r = 0; r < ret.mantisa.length; r++) {
				for (var i = 0; i < left; i++) ret.mantisa[r].shift();
			}
			for (var r = 0; r < up; r++) ret.mantisa.shift();
			return ret;
		}
	}
}

wholeplacevalue2.prototype.remainder = function (den) { //  2019.4  Added
	return this.sub(this.divide(den).times(den));
}

wholeplacevalue2.prototype.eval = function (base) {	// 2015.8
	var ret = [];
	for (var col = 0; col < this.mantisa[0].length; col++) {
		var sum = 0;
		for (var row = 0; row < this.mantisa.length; row++) {
			sum += this.get(row, col) * Math.pow(base, row);
		}
		ret.push(sum);
	}
	//alert(ret);
	return new wholeplacevalue2([ret]);
}
