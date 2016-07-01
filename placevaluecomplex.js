
// Author:  Anthony John Ripa
// Date:    6/29/2016
// PlaceValueComplex : a datatype for representing base agnostic arithmetic via numbers whose digits are complex

function placevaluecomplex(whole, exp) {
    if (arguments.length < 2) alert('placevaluecomplex expects 2 arguments');
    if (!(whole instanceof wholeplacevaluecomplex)) { console.trace(); alert('placevaluecomplex expects argument 1 (whole) to be a wholeplacevaluecomplex but found ' + typeof whole + JSON.stringify(whole)); }
    if (!(exp instanceof Number) && !(typeof exp == 'number')) alert('placevaluecomplex expects argument 2 (exp) to be a number but found ' + typeof exp);
    this.whole = whole
    this.exp = whole.is0() ? 0 : exp;   // 0 has no exp 2016.6
    console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(whole)=" + Array.isArray(whole));
}

placevaluecomplex.parse = function (man, exp) { // 2016.1
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('whole') != -1) { var a = JSON.parse(man); return new placevaluecomplex(new wholeplacevaluecomplex(a.whole.mantisa.map(function (x) { return new complex(x.r, x.i) })), a.exp) }
    if (arguments.length < 2) exp = 0;
    if (typeof (man) == "number") man = man.toString();     // 2015.11
    if (typeof (man) == "string" && man.indexOf('whole') != -1) {
        console.log("new placevaluecomplex : arg is stringified placevaluecomplex");
        var ans = JSON.parse(man);
        man = ans.whole;
        exp = ans.exp;
    } else if (man instanceof Object && JSON.stringify(man).indexOf('whole') != -1) {   // 2015.8
        console.log("new placevaluecomplex : arg is placevaluecomplex");
        exp = man.exp;      // get exp from man before
        man = man.whole;    // man overwrites self 2015.8
    }
    var whole = wholeplacevaluecomplex.parse((typeof man == 'string') ? man.replace(/\.(?![^\(]*\))/g, '') : man);
    return new placevaluecomplex(whole, exp + getexp(man));
    //this.exp = exp + getexp(man);
    console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
    function getexp(x) {
        if (Array.isArray(x)) return 0;     // If man is Array, man has no exp contribution 2015.8 
        if (x.mantisa) return 0;  // To check for wholeplacevaluecomplex-like objects, replace (x instanceof wholeplacevaluecomplex) with (x.mantisa)    2015.9
        if (x.toString().toUpperCase().indexOf('E') != -1) {    // Recognize 2e3    2015.9
            x = x.toString().toUpperCase();
            return Number(x.substr(1 + x.indexOf('E'))) + getexp(x.substr(0, x.indexOf('E')))
        }
        var NEGATIVE = String.fromCharCode(822); var MINUS = String.fromCharCode(8315); var ONE = String.fromCharCode(185);
        x = x.toString().replace(new RegExp(NEGATIVE, 'g'), '').replace(new RegExp(MINUS, 'g'), '').replace(new RegExp(ONE, 'g'), '').replace(/\([^\(]*\)/g, 'm');
        return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.length + 1;
    }
}

placevaluecomplex.prototype.get = function (i) { return this.whole.get(i - this.exp) }
placevaluecomplex.prototype.getreal = function (i) { return this.whole.getreal(i - this.exp) }
placevaluecomplex.prototype.getimag = function (i) { return this.whole.getimag(i - this.exp) }

placevaluecomplex.prototype.tohtml = function (short) {        // Long and Short HTML  2015.11
    if (short) return this.toString(true);
    return this.whole.toString(true) + 'E' + this.exp;  // Replaces toStringInternal 2015.7
}

placevaluecomplex.prototype.toString = function (sTag, long) {                          //  2016.6
    var ret = "";
    for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
        if (i == this.whole.mantisa.length + this.exp) ret += '@';                      //  Need '@' to see our '.' among digit's '.'   2015.11
        ret += this.whole.get(this.whole.mantisa.length - 1 - i).toString(sTag, long);  //  get(...).digit  2016.6
    }
    for (var i = 0; i < this.exp; i++) ret += '0';                                      //  Add trailing zeros if big
    if (ret.indexOf('@') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
    if (ret[ret.length - 1] == '@') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
    while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
    if (ret[0] == '@') ret = '0' + ret;                                                                     // '.x' -> '0.x'
    if (ret == '') ret = '0';                                                                               // ''   -> '0'
    ret = ret.replace('@', '.');                                                        // '@' -> '.'   2015.11
    return ret;
}

placevaluecomplex.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    placevaluecomplex.align(me, other);
    var whole = me.whole.add(other.whole);
    return new placevaluecomplex(whole, me.exp);
}

placevaluecomplex.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    placevaluecomplex.align(me, other);
    var whole = me.whole.sub(other.whole);
    return new placevaluecomplex(whole, me.exp);
}

placevaluecomplex.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new placevaluecomplex(whole, this.exp);
}

placevaluecomplex.prototype.pointadd = function (addend) {
    var whole = this.whole.pointadd(addend.whole);
    return new placevaluecomplex(whole, this.exp);
}

placevaluecomplex.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    placevaluecomplex.align(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new placevaluecomplex(whole, me.exp);
}

placevaluecomplex.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    placevaluecomplex.align(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new placevaluecomplex(whole, me.exp);
}

placevaluecomplex.prototype.pointpow = function (power) {	// 2015.12
    if (power instanceof placevaluecomplex) power = power.whole;   // laurent calls wpv    2015.8
    return new placevaluecomplex(this.whole.pointpow(power), this.exp);
    //if (!(power instanceof wholeplacevaluecomplex)) power = new wholeplacevaluecomplex([power]);  // 2015.11
    //if (power.getreal(0) < 0) return (new placevaluecomplex(new wholeplacevaluecomplex([1]), 0)).pointdivide(this.pointpow(new placevaluecomplex(new wholeplacevaluecomplex(-power.getreal(0)), 0))); // 2015.8   getreal 2015.12
    //if (power.getreal(0) == 1) return this.clone();
    //return this.pointtimes(this.pointpow(power.getreal(0) - 1));
}

placevaluecomplex.prototype.pow = function (power) {	// 2015.8
    if (power instanceof placevaluecomplex) power = power.whole;   // laurent calls wpv    2015.8
    //if (!(power instanceof wholeplacevaluecomplex)) power = wholeplacevaluecomplex.parse(power);  // 2016.6
    if (!(power instanceof wholeplacevaluecomplex)) power = new wholeplacevaluecomplex([new complex(power)]);  // fourier calls w/ - (parse would fail) 2016.6
    if (power.getreal(0) < 0) return (new placevaluecomplex(new wholeplacevaluecomplex([new complex(1)]), 0)).divide(this.pow(new placevaluecomplex(new wholeplacevaluecomplex([new complex(-power.getreal(0))]), 0))); // 2015.8   getreal 2015.12
    var whole = this.whole.pow(power);
    var exp = this.exp * power.getreal(0);    // exp*pow not exp^pow  2015.9    getreal 2015.12
    return new placevaluecomplex(whole, exp);
}

placevaluecomplex.align = function (a, b) {    // rename pad align 2015.9
    if (arguments.length < 3) offset = 0;
    while (a.exp > b.exp) {
        a.exp--;
        a.whole = a.whole.times(10);    // Delegate Shift to Whole  2015.7
    }
    while (b.exp > a.exp) {
        b.exp--;
        b.whole = b.whole.times(10);    // Delegate Shift to Whole  2015.7
    }
}

placevaluecomplex.prototype.times = function (top) {
    if (!(top instanceof Object && JSON.stringify(top).indexOf('whole') != -1)) top = new placevaluecomplex(new wholeplacevaluecomplex([top]), 0);  // 2015.11
    var whole = this.whole.times(top.whole);
    return new placevaluecomplex(whole, this.exp + top.exp);
}

placevaluecomplex.prototype.scale = function (scalar) {   // 2015.11
    var whole = this.whole.scale(scalar);
    return new placevaluecomplex(whole, this.exp);
}

placevaluecomplex.prototype.inverse = function () { // 2016.1
    return new placevaluecomplex(new wholeplacevaluecomplex([1]), 0).divide(this);
}

placevaluecomplex.prototype.divide = function (denominator) {
    var me = this.clone();
    if (!(denominator instanceof Object && JSON.stringify(denominator).indexOf('whole') != -1)) denominator = new placevaluecomplex(new wholeplacevaluecomplex([denominator]), 0);  // 2015.11
    var pads = 0;						// 2015.11
    pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : pad(me, denominator, 6);		// 2015.12
    var whole = me.whole.divide(denominator.whole);
    console.log('placevaluecomplex.prototype.divide : return new placevaluecomplex(whole, ' + me.exp + '-' + denominator.exp +')')
    var ret = new placevaluecomplex(whole, me.exp - denominator.exp);
	unpad(ret,pads);					// 2015.11
	return ret;
    function pad(n, d, sigfig) {
		var i = 0;						// 2015.11
        while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
			i++;						// 2015.11
            console.log('placevaluecomplex.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp--;
            n.whole.times10();      // Delegate Shift to Whole  2015.7
        }
		return i;						// 2015.11
    }
	function unpad(pv, pads) {			// 2015.11
        while (pads>0) {
            if (pv.whole.getreal(0) == 0 && pv.whole.getimag(0) == 0) {     //  2015.12
				pv.whole.mantisa.shift()
				pv.exp++
			}
			pads--;
        }		
	}
}

placevaluecomplex.prototype.divideleft = placevaluecomplex.prototype.divide;
placevaluecomplex.prototype.dividemiddle = placevaluecomplex.prototype.divide;

placevaluecomplex.prototype.clone = function () {
    return new placevaluecomplex(this.whole.clone(), this.exp);
}

placevaluecomplex.prototype.eval = function (base) {
    //alert(JSON.stringify([this, '|', base]));
    var c = wholeplacevaluecomplex;
    var sum = new complex(0);
    for (var i = 0; i < this.whole.mantisa.length; i++) {
        //alert(JSON.stringify([this, i, this.whole.get(i), '*', base, '^', i + this.exp, '=', base.pow(i + this.exp).get(0)]));
        if (this.whole.get(i).r != 0 || this.whole.get(i).i != 0) // Only add non-zero digits; Prevents 0*∞=%.    2016.1
            sum = sum.add(this.whole.get(i).times(base.pow(i + this.exp).get(0)));  // this.get->this.whole.get, i->i+this.exp  2016.1
    }
    return new placevaluecomplex(new wholeplacevaluecomplex([sum]), 0);
}
