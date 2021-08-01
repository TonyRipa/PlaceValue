
// Author:	Anthony John Ripa
// Date:	7/31/2021
// Digit:	Base Class for Rational

class digit {

	digithelp(digit, NEGBEG, NEGEND, long) { //  2017.7  long
		// 185  189  777 822 8315   9321
		// ^1   1/2  ^   -   ^-     10
		var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
		var IMAG = String.fromCharCode(777);
		var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
		var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ', 2.718: 'e' , 7.389: 'e²' };	//	+2020.5
		var num = { 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
		if (typeof (digit) == 'string') return digit;
		//var rounddigit = Math.round(digit * 1000) / 1000;								//	-2021.7
		var rounddigit = digit == Infinity ? digit : Math.round(digit * 1000) / 1000;	//	+2021.7
		if (isNaN(digit)) return '%';
		//if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;	//	-2021.7
		if (digit == -Infinity) return NEGBEG + '∞' + NEGEND;	//	+2021.7
		if (!long && num[-digit]) return NEGBEG + num[-digit] + NEGEND;
		if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
		if (!long) if (-1 < digit && digit < 0) {
			if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
			if (cons[rounddigit]) return cons[rounddigit];
			if (0 < -digit && -digit < .5) {                // prevents 1/1.041666666           2016.7
				var flip = -Math.round(1 / digit);          
				if (flip < 100 && Math.abs(Math.abs(1 / digit) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
			}
		}
		if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
		if (digit == 0) return '0';
		if (!long) if (0 < digit && digit < 1) {
			if (frac[rounddigit]) return frac[rounddigit];
			if (cons[rounddigit]) return cons[rounddigit];	// cons b4 flip prevents .159=6^-1	2015.8
			if (0 < digit && digit < .5) {                  // prevents 1/1.1                   2015.9
				var flip = Math.round(1 / digit);           // round prevents 1/24.99999		2015.8
				if (flip < 100 && Math.abs(Math.abs(1 / digit) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
			}
		}
		if (!long) if (cons[rounddigit]) return cons[rounddigit];
		if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? Math.trunc(digit) : '(' + rounddigit + ')';	//	+2021.6
		if (!long) if (num[digit]) return num[digit]
		if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
		//if (digit == 1 / 0) return '∞';	//	-2021.7
		if (digit == Infinity) return '∞';	//	+2021.7
		return 'x';
	}

}
