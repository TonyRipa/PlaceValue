
// Author:  Anthony John Ripa
// Date:    4/30/2017
// WholePlaceValueComplex2 : a 2D datatype for representing base agnostic arithmetic via whole numbers whose digits are complex

function wholeplacevaluecomplex2(man, trace) {
    if (!Array.isArray(man)) { console.trace(); alert("wholeplacevalue2 expects argument to be 2D array but found " + typeof man + man); }
    if (!Array.isArray(man[0])) alert("wholeplacevalue2 expects argument to be 2D array but found 1D array of " + typeof man[0]);
    this.mantisa = man; return;
}

wholeplacevaluecomplex2[0] = new wholeplacevaluecomplex2([[0]]);

wholeplacevaluecomplex2.prototype.get = function (row, col) {
    return { 'r': this.getreal(row, col), 'i': this.getimag(row, col) };
}

wholeplacevaluecomplex2.prototype.getreal = function (row, col) {
    var man = this.mantisa;
    if (Array.isArray(man[0])) return get2(row, col);
    return get1(row, col);
    function get1(row, col) {
        alert('g1')
        if (col > 0) return 0;
        if (row >= man.length) return 0;    // lenth→length 2015.7
        return Number(man[row]);
    }
    function get2(row, col) {
        if (row < 0 || man.length <= row) return 0;
        if (col < 0 || man[0].length <= col) return 0;
        //if (typeof man[row][col] == 'object') return Number(man[row][col].r);
        if (man[row][col] instanceof Object) return Number(man[row][col].r);
        //alert('g2: ' + JSON.stringify(man[row][col]) + ',' + Number(man[row][col]));
        return Number(man[row][col]);
    }
}

wholeplacevaluecomplex2.prototype.getimag = function (row, col) {
    var man = this.mantisa;
    if (Array.isArray(man[0])) return get2(row, col);
    return get1(row, col);
    function get1(row, col) {
        if (col > 0) return 0;
        if (row >= man.length) return 0;    // lenth→length 2015.7
        return Number(man[row]);
    }
    function get2(row, col) {
        if (row < 0 || man.length <= row) return 0;
        if (col < 0 || man[0].length <= col) return 0;
        if (typeof man[row][col] == 'object' && man[row][col].i) return Number(man[row][col].i);
        return 0;
    }
}

wholeplacevaluecomplex2.prototype.tohtml = function (trace, radix) {   // Called by Calculus.html
    //alert(radix)
    if (arguments.length < 2) radix = [0, 0];
    radix = radix.slice(0)
    trace += ' wholeplacevaluecomplex2.prototype.tohtml';
    console.log(trace);
    //return "<table style='display:inline-block;border-spacing:1px 0px;line-height:80%;text-align:center;'><tr><td style='padding:0'>" + this.toString(trace + ' >', "</td><td style='padding:0'>", "</td></tr><tr><td style='padding:0'>", '&nbsp;', true) + "</td></tr></table>";
    var matrix = wholeplacevaluecomplex2.digithtml(this.mantisa);
    //alert([matrix.length > 1, matrix[0]]);
    //alert(JSON.stringify([matrix, radix[0]]));
    while (radix[0] > 0) { radix[0]--; matrix.map(function (row) { row.unshift('Ⓞ'); }) };
    //alert(JSON.stringify([matrix, radix[0]]));
    while (radix[1] > 0) { radix[1]--; matrix.unshift(new Array(matrix[0].length).fill('Ⓞ')); };
    while (matrix.length <= -radix[1]) matrix.push(new Array(matrix[0].length).fill('Ⓞ'));
    while (matrix[0].length <= -radix[0]) matrix = matrix.map(function (row) { row.push('Ⓞ'); return row; });
    matrix = rtrim(matrix, 1);
    matrix = math.transpose(rtrim(math.transpose(matrix), 0));
    matrix = ltrim(matrix, 1);
    //alert(JSON.stringify([matrix, radix]));
    matrix = math.transpose(ltrim(math.transpose(matrix), 0));
    //if (radix[0] != 0 || radix[1] != 0) matrix[-radix[1]][-radix[0]] += ".";
    if (radix[0] != 0 || radix[1] != 0) matrix[-radix[1]][-radix[0]] = "<span style='display:inline-block;position:relative'><span style='position:absolute;right:-1px;bottom:-3px'>.</span>" + matrix[-radix[1]][-radix[0]] + "</span>";
    return allrows(matrix);
    function rtrim(m, i) { while (radix[i] < 0 && m.length > 1 && m[0].reduce(function (t, e) { return t && (e.indexOf('Ⓞ') > -1) }, true)) { m.shift(); radix[i]++; }; return m; }
    function ltrim(m, i) { while (m.length > 1-radix[i] && m.length > 1 && m[m.length - 1].reduce(function (t, e) { return t && (e.indexOf('Ⓞ') > -1) }, true)) { m.pop(); }; return m; }
    function allrows(rows) { return "<table style='display:inline-block;border-spacing:0;line-height:80%;text-align:center;'>" + rows.reverse().map(onerow).join('') + "</table>" }
    function onerow(row) { return "<tr><td style='display:inline-block;letter-spacing:-0px;padding:0'>" + row.reverse().join("</td><td style='display:inline-block;letter-spacing:-1px;padding:0'>") + "</td></tr>" }
}

wholeplacevaluecomplex2.prototype.toString = function (trace, hSeparator, vSeparator, space, html) {   // Called by Calculus.html
    if (arguments.length < 5) html = true;
    if (arguments.length < 4) space = ' ';
    if (arguments.length < 3) vSeparator = '\n';
    if (arguments.length < 2) hSeparator = '';
    console.log(trace + ' wholeplacevaluecomplex2.prototype.toString : ' + JSON.stringify(this.mantisa));
    if (!Array.isArray(this.mantisa[0])) alert(trace + ' wholeplacevaluecomplex2.prototype.toString : MANTISA IS 1D' + JSON.stringify(this.mantisa));
    var ret = '';
    var degreeMax = 0;
    for (var r = this.mantisa.length - 1; r >= 0; r--) {
        var degree = getDeg(this.mantisa[r]);
        if (degree > degreeMax) degreeMax = degree;
        ret += toStringHelper(this.mantisa[r], degreeMax, hSeparator, space, html) + vSeparator;
    }
    return ret.trim();
    function getDeg(row) {
        for (var deg = row.length - 1; deg > 0; deg--)
            if (row[deg].r != 0 || row[deg].i != 0) return deg;
        return 0;
    }
    function toStringHelper(man, degreeMax, separator, space, html) {   //  Changed from static function to nested function.    2016.1
        if (arguments.length < 3) separator = '';
        var ret = "";
        for (var i = man.length - 1 ; i >= 0; i--)
            ret += ((i > degreeMax) ? space : html ? wholeplacevaluecomplex2.digithtml(man[i]) : wholeplacevaluecomplex2.digit(man, i)) + separator;
        return ret;
    }
}

wholeplacevaluecomplex2.digithtml = function (digit) {                // Uses digithelp   2016.1
    //var digit = i < 0 ? 0 : man[i];
    if (Array.isArray(digit)) return digit.map(function (elem) { return wholeplacevaluecomplex2.digithtml(elem) });
    if (!(digit instanceof Object)) digit = { 'r': digit, 'i': 0 };
    return '<span style="display:inline-block;transform-origin:50% 50%;transform:rotate(' + wholeplacevaluecomplex2.arg(digit) + 'rad)">' + wholeplacevaluecomplex2.digithelp(wholeplacevaluecomplex2.norm(digit)) + '</span>'; //  2017.4  50% 50%
    //if (digit instanceof Object) return ['[' + (digit.r == Infinity ? '∞' : Math.round(digit.r * 1000) / 1000) + ',' + Math.round(digit.i * 1000) / 1000 + ']'];
}

wholeplacevaluecomplex2.digit = function (man, i) {                    // Uses digithelp   2016.1
    var digit = i < 0 ? 0 : man[i];
    return wholeplacevaluecomplex2.digithelp(digit, '', String.fromCharCode(822))
}

wholeplacevaluecomplex2.digithelp = function (digit, NEGBEG, NEGEND) { // 2016.1
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    if (arguments.length < 3) NEGBEG = NEGEND = '';
    var INVERSE = String.fromCharCode(8315) + String.fromCharCode(185);
    var IMAG = String.fromCharCode(777);
    var frac = { .125: '⅛', .167: '⅙', .2: '⅕', .25: '¼', .333: '⅓', .375: '⅜', .4: '⅖', .5: '½', .6: '⅗', .667: '⅔', .75: '¾', .8: '⅘', .833: '⅚' }
    var cons = { '-0.159': NEGBEG + 'τ' + NEGEND + INVERSE, 0.159: 'τ' + INVERSE, 6.28: 'τ' };
    var num = { 0.1: '◎', 0.2: '◯', 0: 'Ⓞ', 0.4: '◯', 0.3:'O',1: '①', 2: '②', 3: '③', 4: '④', 5: '⑤', 6: '⑥', 7: '⑦', 8: '⑧', 9: '⑨', 10: '⑩', 11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮', 16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳', 21: '㉑', 22: '㉒', 23: '㉓', 24: '㉔', 25: '㉕', 26: '㉖', 27: '㉗', 28: '㉘', 29: '㉙', 30: '㉚', 31: '㉛', 32: '㉜', 33: '㉝', 34: '㉞', 35: '㉟', 36: '㊱', 37: '㊲', 38: '㊳', 39: '㊴', 40: '㊵', 41: '㊶', 42: '㊷', 43: '㊸', 44: '㊹', 45: '㊺', 46: '㊻', 47: '㊼', 48: '㊽', 49: '㊾', 50: '㊿' }
    //var digit = i < 0 ? 0 : this.mantisa[this.mantisa.length - 1 - i]; // R2L  2015.7
    if (typeof (digit) == 'string') return digit;
    var rounddigit = Math.round(digit * 1000) / 1000;
    if (isNaN(digit)) return '%';
    if (digit == -1 / 0) return NEGBEG + '∞' + NEGEND;
    if (num[-digit]) return NEGBEG + num[-digit] + NEGEND;
    if (digit < -9 && isFinite(digit)) return '(' + rounddigit + ')';
    if (-1 < digit && digit < 0) {
        if (frac[-rounddigit]) return NEGBEG + frac[-rounddigit] + NEGEND;
        var flip = -1 / digit;
        if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return NEGBEG + (num[flip] ? num[flip] : Math.abs(flip)) + NEGEND + INVERSE;
        if (cons[rounddigit]) return cons[rounddigit];
    }
    if (-9 <= digit && digit < 0) return (digit == Math.round(digit)) ? NEGBEG + Math.abs(digit).toString() + NEGEND : '(' + rounddigit + ')';
    if (digit == 0) return '0';
    if (0 < digit && digit < 1) {
        if (frac[rounddigit]) return frac[rounddigit];
        if (cons[rounddigit]) return cons[rounddigit];	// cons b4 flip prevents .159=6^-1	2015.8
        if (0 < digit && digit < .5) {                  // prevents 1/1.1                       2015.9
            var flip = Math.round(1 / digit);		// round prevents 1/24.99999		2015.8
            if (flip < 100 && Math.abs(Math.abs(flip) - Math.round(Math.abs(flip))) < .1) return (num[flip] ? num[flip] : Math.abs(flip)) + INVERSE;
        }
    }
    if (cons[rounddigit]) return cons[rounddigit];
    if (num[digit]) return num[digit]
    if (0 < digit && digit <= 9) return (digit == Math.round(digit)) ? digit : num[Math.round(rounddigit)];
    if (num[digit]) return num[digit]
    if (9 < digit && isFinite(digit)) return '(' + rounddigit + ')';
    if (digit == 1 / 0) return '∞';
    return 'x';
}

wholeplacevaluecomplex2.add = function (x, y) { return { 'r': x.r + y.r, 'i': x.i + y.i }; }
wholeplacevaluecomplex2.sub = function (x, y) { return { 'r': x.r - y.r, 'i': x.i - y.i }; }
wholeplacevaluecomplex2.mul = function (x, y) { return x.i == 0 ? y.i == 0 ? { 'r': x.r * y.r, 'i': 0 } : { 'r': x.r * y.r, 'i': x.r * y.i } : x.r == 0 ? { 'r': -x.i * y.i, 'i': x.i * y.r } : { 'r': x.r * y.r - x.i * y.i, 'i': x.r * y.i + x.i * y.r }; }
wholeplacevaluecomplex2.div = function (x, y) { return y.i == 0 ? x.i == 0 ? { 'r': x.r / y.r, 'i': 0 } : x.r == 0 ? { 'r': 0, 'i': x.i / y.r } : { 'r': x.r / y.r, 'i': x.i / y.r } : { 'r': (x.r * y.r + x.i * y.i) / (y.r * y.r + y.i * y.i), 'i': (x.i * y.r - x.r * y.i) / (y.r * y.r + y.i * y.i) }; }
wholeplacevaluecomplex2.exp = function (x) { return { 'r': Math.exp(x.r) * Math.cos(x.i), 'i': Math.exp(x.r) * Math.sin(x.i) }; }
wholeplacevaluecomplex2.ln = function (x) { return { 'r': Math.log(Math.sqrt(x.r * x.r + x.i * x.i)), 'i': Math.atan2(x.i, x.r) }; }
wholeplacevaluecomplex2.nor = function (x) { return { 'r': x.r * x.r + x.i * x.i, 'i': 0 } }
wholeplacevaluecomplex2.norm = function (x) { return Math.sqrt(x.r * x.r + x.i * x.i) }
wholeplacevaluecomplex2.lnn = function (x) { return wholeplacevaluecomplex2.ln(wholeplacevaluecomplex2.nor(x)) }
wholeplacevaluecomplex2.arg = function (x) { return Math.atan2(x.i, x.r) }
wholeplacevaluecomplex2.pow = function (x, y) { var c = wholeplacevaluecomplex2; var p = c.norm(x) == 0 ? { 'r': Math.pow(0, c.norm(y)), 'i': 0 } : c.mul({ 'r': Math.pow(c.norm(x), y.r) * Math.exp(-y.i * c.arg(x)), 'i': 0 }, c.exp({ 'r': 0, 'i': y.r * c.arg(x) + .5 * y.i * c.lnn(x).r })); return c.roun(p) }
wholeplacevaluecomplex2.roun = function (x) { return { 'r': Math.round(1000 * x.r) / 1000, 'i': Math.round(1000 * x.i) / 1000 } }
//alert(JSON.stringify(wholeplacevaluecomplex2.pow({ 'r': 2, 'i': 0 }, { 'r': 3, 'i': 0 })))
wholeplacevaluecomplex2.prototype.add = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex2.add(x, y) }, other); }
wholeplacevaluecomplex2.prototype.sub = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex2.sub(x, y) }, other); } // 1-1.1≠-.100009 2015.9
wholeplacevaluecomplex2.prototype.pointadd = function (other) { return this.f2(function (x, y) { return wholeplacevaluecomplex2.add(x, y) }, other); }
wholeplacevaluecomplex2.prototype.pointsub = function (other) { return this.f2(function (x, y) { return wholeplacevaluecomplex2.sub(x, y) }, other); }
wholeplacevaluecomplex2.prototype.pointtimes = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex2.mul(x, y) }, other); }
wholeplacevaluecomplex2.prototype.pointdivide = function (other) { return this.f(function (x, y) { return wholeplacevaluecomplex2.div(x, y) }, other); }
wholeplacevaluecomplex2.prototype.pointpow = function (other) { return this.f2(function (x, y) { return wholeplacevaluecomplex2.pow(x, y) }, other); }
wholeplacevaluecomplex2.prototype.clone = function () { return this.f(function (x) { return x }, this); }
wholeplacevaluecomplex2.prototype.round = function () { return this.f(function (x) { return [x.r * Math.round(x.r * 1000) / 1000, x.i * Math.round(x.i * 1000) / 1000] }, this); }   // for sub 2015.9

wholeplacevaluecomplex2.prototype.f = function (f, other, trace) {
    //alert('wholeplacevaluecomplex2.prototype.f: ' + JSON.stringify(this) + JSON.stringify(other));
    if (this.mantisa.length == 0) this.mantisa = [[0]];
    if (!Array.isArray(this.mantisa[0])) this.mantisa = [this.mantisa];
    console.log(trace + JSON.stringify(other));
    var h = Math.max(this.mantisa.length, other.mantisa.length);
    var w = Math.max(this.mantisa[0].length, other.mantisa[0].length);
    var ret = [];
    for (var r = 0; r < h; r++) {
        var row = [];
        for (var c = 0; c < w; c++) {
            //var z = f(this.get(r, c), other.get(r, c));
            //alert(JSON.stringify(z));
            row.push(f(this.get(r, c), other.get(r, c)));       // apply f to this & other
        }
        ret.push(row)
    }
    //alert(JSON.stringify(ret));
    return new wholeplacevaluecomplex2(ret, trace);
}

wholeplacevaluecomplex2.prototype.f2 = function (f, other, trace) {
    if (this.mantisa.length == 0) this.mantisa = [[0]];
    if (!Array.isArray(this.mantisa[0])) this.mantisa = [this.mantisa];
    console.log(trace + JSON.stringify(other));
    var h = Math.max(this.mantisa.length, other.mantisa.length);
    var w = Math.max(this.mantisa[0].length, other.mantisa[0].length);
    var ret = [];
    for (var r = 0; r < h; r++) {
        var row = [];
        for (var c = 0; c < w; c++) {
            row.push(f(this.get(r, c), other.get(0, 0)));       // apply f to this & other
        }
        ret.push(row)
    }
    return new wholeplacevaluecomplex2(ret, trace);
}

wholeplacevaluecomplex2.prototype.pow = function (power) { // 2015.7
    var c = wholeplacevaluecomplex2;
    if (!(power instanceof wholeplacevaluecomplex2)) power = new wholeplacevaluecomplex2([[power]], 'wholeplacevaluecomplex2.prototype.pow1 >');
    if (power.mantisa.length > 1) { alert('WPV2 >Bad Exponent = ' + power.tohtml()); return new wholeplacevaluecomplex2([['%']], 'wholeplacevaluecomplex2.prototype.pow2 >') }
    if (this.mantisa.length == 1 && this.mantisa[0].length == 1) {  // check mantisa[0]     2015.7
        //if (this.get(0, 0).r == 0 && this.get(0, 0).i == 0 && power.get(0, 0).r == 0 && power.get(0, 0).i == 0) return new wholeplacevaluecomplex2('%', 'wholeplacevaluecomplex2.prototype.pow3 >');
        //else
        return new c([[c.pow(this.get(0, 0), power.get(0, 0))]], 'wholeplacevaluecomplex2.prototype.pow4 >');
        //else return new c([[c.mul({ 'r': Math.pow(c.norm(this.get(0)), power.getreal(0)) * Math.exp(-power.getimag(0) * c.arg(this.get(0))), 'i': 0 }, c.exp({ 'r': 0, 'i': power.getreal(0) * c.arg(this.get(0)) + .5 * power.getimag(0) * c.lnn(this.get(0)).r }))]], 'wholeplacevaluecomplex2.prototype.pow4 >');
    }
    if (power.mantisa != Math.round(power.mantisa)) { alert('WPV2 .Bad Exponent = ' + power.tohtml()); return new wholeplacevaluecomplex2([['%']], 'wholeplacevaluecomplex2.prototype.pow5 >') }
    if (power.mantisa < 0) return new wholeplacevaluecomplex2([[0]], 'wholeplacevaluecomplex2.prototype.pow6 >');
    if (power.mantisa == 0) return new wholeplacevaluecomplex2([[1]], 'wholeplacevaluecomplex2.prototype.pow7 >');
    return this.times(this.pow(power.get(0, 0).r - 1));
}

wholeplacevaluecomplex2.prototype.times10 = function() { this.mantisa.map(function(x) { return x.unshift(0) }) }           // Caller can pad w/o know L2R or R2L  2015.7 // 2D 2015.10
wholeplacevaluecomplex2.prototype.times01 = function() { this.mantisa.unshift(new Array(this.mantisa[0].length).fill(0)) } // Caller can pad w/o know L2R or R2L  2015.7 // 2D 2015.10

wholeplacevaluecomplex2.prototype.times = function (other) {
    var h = this.mantisa.length;
    var w = this.mantisa[0].length;
    var ret = new wholeplacevaluecomplex2([[0]], 'wholeplacevaluecomplex2.prototype.times >');
    for (var r = 0; r < h; r++)
        for (var c = 0; c < w; c++) {
            ret = ret.add(unshift(other.scale(this.get(r, c)), r, c), 'wholeplacevaluecomplex2.prototype.times >');
        }
    return ret;
    function unshift(me, up, left) {
        var ret = new wholeplacevaluecomplex2([[0]], 'wholeplacevaluecomplex2.prototype.add >').add(me, 'wholeplacevaluecomplex2.prototype.unshift >');
        for (var r = 0; r < ret.mantisa.length; r++) {
            for (var i = 0; i < left; i++) ret.mantisa[r].unshift(0);
        }
        for (var r = 0; r < up; r++) {
            ret.mantisa.unshift(math.zeros(ret.mantisa[0].length)._data);
        }
        return ret;
    }
}

wholeplacevaluecomplex2.prototype.scale = function (scalar, trace) {
    var ret = this.clone(trace + ' wholeplacevaluecomplex2.prototype.scale >');
    //alert(JSON.stringify([this, this.clone()]));
    for (var r = 0; r < ret.mantisa.length; r++)
        for (var c = 0; c < ret.mantisa[0].length; c++) {
            ret.mantisa[r][c] = wholeplacevaluecomplex2.mul(scalar, ret.get(r, c));
        }
            //ret.mantisa[r][c] *= scalar;
    //alert(JSON.stringify([this.get(0, 0), scalar, ret, wholeplacevaluecomplex2.mul({ 'r': 2, 'i': 0 }, { 'r': 3, 'i': 0 }), wholeplacevaluecomplex2.mul(scalar, { 'r': 3, 'i': 0 }), wholeplacevaluecomplex2.mul(scalar, this.get(0, 0)), wholeplacevaluecomplex2.mul(this.get(0, 0), scalar)]));
    return ret;
}

wholeplacevaluecomplex2.getDegree = function (wpvc) {
    var h = wpvc.mantisa.length;
    var w = wpvc.mantisa[0].length;
    for (var col = w - 1; col >= 0; col--) {
        for (var row = h - 1; row >= 0; row--) {
            if (wpvc.get(row, col).r != 0 || wpvc.get(row, col).i != 0) return { 'row': row, 'col': col, 'val': wpvc.get(row, col) };
        }
    }
    return { 'row': 0, 'col': 0, 'val': wpvc.get(0, 0) };
}

wholeplacevaluecomplex2.prototype.divide = function (den) {
    var num = this;
    var iter = num.mantisa.length + num.mantisa[0].length;
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new wholeplacevaluecomplex2([[0]], 'wholeplacevaluecomplex2.prototype.divide >');
        var d = wholeplacevaluecomplex2.getDegree(den);
        //alert(JSON.stringify(shift(num, d.row, d.col)))
        //alert(JSON.stringify(wholeplacevaluecomplex2.div({ 'r': 1, 'i': 0 }, d.val)))
        //alert(JSON.stringify(shift(num, d.row, d.col).scale(wholeplacevaluecomplex2.div({ 'r': 1, 'i': 0 }, d.val))))
        var quotient = shift(num, d.row, d.col).scale(wholeplacevaluecomplex2.div({ 'r': 1, 'i': 0 }, d.val), 'wholeplacevaluecomplex2.prototype.divide >');
        if (d.val.r == 0 && d.val.i == 0) return quotient;
        var remainder = num.sub(quotient.times(den), 'wholeplacevaluecomplex2.prototype.divide >')
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
        function shift(me, up, left) {
            var ret = new wholeplacevaluecomplex2([[0]], 'wholeplacevaluecomplex2.prototype.add >').add(me, 'wholeplacevaluecomplex2.prototype.shift >');
            for (var r = 0; r < ret.mantisa.length; r++) {
                for (var i = 0; i < left; i++) ret.mantisa[r].shift();
            }
            for (var r = 0; r < up; r++) ret.mantisa.shift();
            return ret;
        }
    }
}

wholeplacevaluecomplex2.prototype.eval = function (base) {	// 2015.8
    var c = wholeplacevaluecomplex2;
    var ret = [];
    for (var col = 0; col < this.mantisa[0].length; col++) {
        var sum = { 'r': 0, 'i': 0 };
        for (var row = 0; row < this.mantisa.length; row++) {
	        sum = c.add(sum, c.mul(this.get(row, col), base.pow(row).get(0, 0)));
	        //sum = c.add(sum, c.mul(this.get(row, col), c.pow(base.get(0, 0), { 'r': row, 'i': 0 })));
	        //alert(JSON.stringify([this.get(row, col), base,row, base.pow(row), sum]));
        }
        ret.push(sum);
    }
    //alert(ret);
    return new wholeplacevaluecomplex2([ret]);
}
