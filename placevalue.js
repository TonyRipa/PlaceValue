
// Author:  Anthony John Ripa
// Date:    5/31/2018
// PlaceValue: a datatype for representing base-agnostic arithmetic

function placevalue(arg) {
    var man, exp;
    //if (arguments.length < 1) man = new wholeplacevalue();  //  2017.9
    if (arguments.length == 0)[man, exp] = [new wholeplacevalue(rational), 0];                                          //  2017.12
    if (arguments.length == 1) {
        if (arg === rational || arg === complex || arg === rationalcomplex)[man, exp] = [new wholeplacevalue(arg), 0];  //  2017.12
        else[man, exp] = [arg, 0];
    }
    if (arguments.length == 2)[man, exp] = arguments;                                                                   //  2017.12
    if (!(man instanceof wholeplacevalue)) { var s = 'placevalue expects argument 1 to be a wholeplacevalue but found ' + typeof man; alert(s); throw new Error(s); }   //  2018.5  added throw
    if (!(exp instanceof Number) && !(typeof exp == 'number')) { var s = 'placevalue expects argument 2 to be a number but found ' + typeof exp; alert(s); throw new Error(s); }
    this.whole = man;
    //  this.exp = exp;                     //  2018.5  Removed
    this.exp = this.whole.is0() ? 0 : exp;  //  2018.5  0 man has no exp
    console.log('this.whole = ' + this.whole + ' = ' + JSON.stringify(this.whole) + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
}

placevalue.prototype.parse = function (man) {    // 2017.9
    if (man instanceof String || typeof (man) == 'string') if (man.indexOf('whole') != -1) { var a = JSON.parse(man); return new placevalue(new wholeplacevalue().parse(JSON.stringify(a.whole)), a.exp) }
    var exp = 0;
    if (typeof (man) == "number") man = man.toString();     // 2015.11
    if (typeof (man) == "string" && man.indexOf('whole') != -1) {
        console.log("new placevalue : arg is stringified placevalue");
        var ans = JSON.parse(man);
        man = ans.whole;
        exp = ans.exp;
    } else if (man instanceof Object && JSON.stringify(man).indexOf('whole') != -1) {   // 2015.8
        console.log("new placevalue : arg is placevalue");
        exp = man.exp;      // get exp from man before
        man = man.whole;    // man overwrites self 2015.8
    }
    return new placevalue(new wholeplacevalue(this.whole.datatype).parse((typeof man == 'string') ? man.replace(/\.(?![^\(]*\))/g, '') : man), exp + getexp(man));
    //console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(man)=" + Array.isArray(man));
    function getexp(x) {
        if (Array.isArray(x)) return 0;     // If man is Array, man has no exp contribution 2015.8 
        if (x.mantisa) return 0;  // To check for wholeplacevalue-like objects, replace (x instanceof wholeplacevalue) with (x.mantisa)    2015.9
        if (x.toString().toUpperCase().indexOf('E') != -1) {    // Recognize 2e3    2015.9
            x = x.toString().toUpperCase();
            return Number(x.substr(1 + x.indexOf('E'))) + getexp(x.substr(0, x.indexOf('E')))
        }
        var NEGATIVE = String.fromCharCode(822); var MINUS = String.fromCharCode(8315); var ONE = String.fromCharCode(185);
        x = x.toString().replace(new RegExp(NEGATIVE, 'g'), '').replace(new RegExp(MINUS, 'g'), '').replace(new RegExp(ONE, 'g'), '').replace(/\([^\(]*\)/g, 'm');
        return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.length + 1;
    }
}

placevalue.prototype.get = function (i) {       // 2015.11
    return this.whole.get(i - this.exp);
}

placevalue.prototype.tohtml = function (short) {        // Long and Short HTML  2015.11
    if (short) return this.toString(true);
    return this.whole.tohtml(true) + 'E' + this.exp;  // Replaces toStringInternal 2015.7
}

placevalue.prototype.toString = function (sTag) {       //  sTag    2015.11
    var ret = "";
    for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
        if (i == this.whole.mantisa.length + this.exp) ret += '@';                  // Need '@' to see our '.' among digit's '.'    2015.11
        if (sTag)
            ret += this.whole.get(this.whole.mantisa.length - i - 1).tohtml(true);    //  .get(...).toString(sTag)    2016.7
        else
            ret += this.whole.get(this.whole.mantisa.length - i - 1).toString(sTag);    //  .get(...).toString(sTag)    2016.7
    }
    for (var i = 0; i < this.exp; i++) ret += '0';
    if (ret.indexOf('@') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
    if (ret[ret.length - 1] == '@') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
    while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
    if (ret[0] == '@') ret = '0' + ret;                                                                     // '.x' -> '0.x'
    if (ret == '') ret = '0';                                                                               // ''   -> '0'
    ret = ret.replace('@', '.');                                                // '@' -> '.'   2015.11
    return ret;
}

placevalue.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    placevalue.align(me, other);
    var whole = me.whole.add(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    placevalue.align(me, other);
    var whole = me.whole.sub(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.pointadd = function (addend) {
    var whole = this.whole.pointadd(addend.whole);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    placevalue.align(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    placevalue.align(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new placevalue(whole, me.exp);
}

placevalue.prototype.pointpow = function (power) {	// 2015.12
    if (power instanceof placevalue) power = power.whole;   // laurent calls wpv    2015.8
    if (!(power instanceof wholeplacevalue)) power = new wholeplacevalue([power]);  // 2015.11
    var man = this.whole.mantisa.map(function (x) { return x.pow(power.get(0)) });
    var ret = new placevalue(new wholeplacevalue(man), this.exp);
    return ret;
}

placevalue.prototype.pow = function (power) {	// 2015.8
    if (typeof power == 'number') power = new this.whole.datatype().parse(power);     //  2017.5  exponential calls with number
    if (power instanceof this.whole.datatype) power = new wholeplacevalue([power]);   //  2017.5
    if (power instanceof wholeplacevalue) power = new placevalue(power, 0);         //  2017.5  laurent calls wpv
    //if (power instanceof placevalue) power = power.whole;   // laurent calls wpv    2015.8
    //if (power.get(0).toreal() < 0) return (new placevalue(wholeplacevalue.parse(1), 0)).divide(this.pow(new placevalue(new wholeplacevalue([power.get(0).negate()]), 0))); // 2015.8 //  Add '(' for 2 digit power   2015.12
    //alert(JSON.stringify([this,power]))
    if (power.exp == 0) {   //  2017.5
        if (power.get(0).toreal() < 0) return (new placevalue(this.whole.parse(1), 0)).divide(this.pow(power.negate()));    //  2018.5  this.whole
        var whole = this.whole.pow(power.whole);
        var exp = this.exp * power.get(0).toreal();    // exp*pow not exp^pow  2015.9
    } else if (power.exp == 1) {    //  2017.5
        if (this.exp != 0) { alert('PV >Bad Exponent = ' + power.toString() + ' Base = ' + base.toString()); return placevalue.parse('%') }
        var whole = new wholeplacevalue().parse(1);   //  2017.5
        var exp = power.get(1).toreal();        //  2017.5  2^(3E1)=1E3
    } else { alert('PV >Bad Exponent = ' + power.toString()); return placevalue.parse('%') }
    return new placevalue(whole, exp);
}

placevalue.align = function (a, b) {    // rename pad align 2015.9
    if (a.whole.is0()) a.exp = b.exp;   //  2017.6
    while (a.exp > b.exp) {
        a.exp--;
        a.whole.times10();              // Delegate Shift to Whole  2015.7
    }
    while (b.exp > a.exp) {
        b.exp--;
        b.whole.times10();              // Delegate Shift to Whole  2015.7
    }
}

placevalue.prototype.times = function (top) {
    if (!(top instanceof Object && JSON.stringify(top).indexOf('whole') != -1)) top = new placevalue(top);  // 2015.11
    var whole = this.whole.times(top.whole);
    return new placevalue(whole, this.exp + top.exp);
}

placevalue.prototype.negate = function () {         //  2017.5
    return new placevalue(this.whole.negate(), this.exp);
}

placevalue.prototype.scale = function (scalar) {   // 2015.11
    var whole = this.whole.scale(scalar);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.unscale = function (scalar) {   // 2016.7
    var whole = this.whole.unscale(scalar);
    return new placevalue(whole, this.exp);
}

placevalue.prototype.divide = function (denominator) {
    var me = this.clone();
    if (!(denominator instanceof Object && JSON.stringify(denominator).indexOf('whole') != -1)) denominator = placevalue.parse(denominator);  // 2015.11
    var pads = 0;						// 2015.11
    pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : pad(me, denominator, 4);		// 2016.1
    var whole = me.whole.divide(denominator.whole);
    console.log('placevalue.prototype.divide : return new placevalue(whole, ' + me.exp + '-' + denominator.exp +')')
    var ret = new placevalue(whole, me.exp - denominator.exp);
	unpad(ret,pads);					// 2015.11
	return ret;
    function pad(n, d, sigfig) {
		var i = 0;						// 2015.11
        while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
			i++;						// 2015.11
            console.log('placevalue.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp--;
            n.whole.times10();      // Delegate Shift to Whole  2015.7
        }
		return i;						// 2015.11
    }
	function unpad(pv, pads) {			// 2015.11
        while (pads>0) {
			if (pv.whole.get(0)==0) {
				pv.whole.mantisa.shift()
				pv.exp++
			}
			pads--;
        }		
	}
}

placevalue.prototype.dividemiddle = function (den) {    // 2016.3
    return new placevalue(this.whole.dividemiddle(den.whole), this.exp - den.exp - 1);  // The offset 1 is because whole.dividemiddle is always off by a factor of 10.
}

placevalue.prototype.divideleft = function (den) {      // 2016.3
    return new placevalue(this.whole.divideleft(den.whole), this.exp - den.exp);
}

placevalue.prototype.clone = function () {
    return new placevalue(this.whole.clone(), this.exp);
}

placevalue.prototype.eval = function (base) {
    var b = base.get(0);    // 2016.1
    var sum = new this.whole.datatype();
    for (var i = 0; i < this.whole.mantisa.length; i++) {
        sum = sum.add(this.whole.get(i).times(b.pow(i)));
    }
    var scale = b.pow(this.exp)
    sum = sum.times(scale);
    return new placevalue(new wholeplacevalue([sum]), 0);
}
