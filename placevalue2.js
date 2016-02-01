
// Author : Anthony John Ripa
// Date : 1/23/2016
// PlaceValue2 : a 2d datatype for representing base agnostic arithmetic via numbers whose digits are real

function placevalue2(whole, exp) {
    if (arguments.length < 2) alert('placevalue2 expects 2 arguments');
    if (!(whole instanceof wholeplacevalue2)) alert('placevalue2 expects argument 1 (whole) to be a wholeplacevalue2 but found ' + typeof whole);
    if (!Array.isArray(exp)) alert('placevalue2 expects argument 2 (base) to be an array but found ' + typeof base);
    this.whole = whole;
    this.exp = exp
    console.log('this.whole = ' + this.whole + ', this.exp = ' + this.exp + ', exp = ' + exp + ', arguments.length = ' + arguments.length + ", Array.isArray(whole)=" + Array.isArray(whole));
}

//placevalue2.parse = function (man, exp) {
//    if (arguments.length < 2) exp = [0, 0]; // exp is 2D    // 2015.10
//    if (typeof (man) == "string" && man.indexOf('whole') != -1) {
//        console.log("new placevalue2 : arg is stringified placevalue2");
//        var ans = JSON.parse(man);
//        man = ans.whole;
//        exp = ans.exp;
//        return new placevalue2(man, exp);
//    } else if (man instanceof Object && JSON.stringify(man).indexOf('whole') != -1) {   // 2015.8
//        console.log("new placevalue2 : arg is placevalue2");
//        exp = man.exp;      // get exp from man before
//        man = man.whole;    // man overwrites self 2015.8
//        return new placevalue2(man, exp);
//    }
//    var whole = wholeplacevalue2.parse((typeof man == 'string') ? man.replace(/\.(?![^\(]*\))/g, '') : man);
//    return new placevalue2(whole, exp);
//}

placevalue2.prototype.tohtml = function () {     // Replaces toStringInternal 2015.7
    return this.whole.tohtml() + 'E' + (this.exp[1] == 0 ? this.exp[0] : this.exp); // exp is 2D    // 2015.10
}

placevalue2.prototype.toString = function () {return JSON.stringify([this.whole,this.exp])//return this.tohtml()
    var ret = "";
    for (var i = Math.min(0, this.exp) ; i < this.whole.mantisa.length; i++) {
        if (i == this.whole.mantisa.length + this.exp) ret += '.';
        ret += this.whole.digit(i);
    }
    for (var i = 0; i<this.exp; i++) ret += '0';
    if (ret.indexOf('.') != -1) while (ret[ret.length - 1] == 0) ret = ret.substring(0, ret.length - 1);    // If decimal, Remove trailing zeros
    if (ret[ret.length - 1] == '.') ret = ret.substring(0, ret.length - 1);                                 // Remove trailing decimal
    while (ret[0] == 0) ret = ret.substring(1);                                                             // Remove leading zeros
    if (ret[0] == '.') ret = '0' + ret;                                                                     // '.x' -> '0.x'
    if (ret == '') ret = '0';                                                                               // ''   -> '0'
    return ret;
}

placevalue2.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    placevalue2.align(me, other);
    var whole = me.whole.add(other.whole);
    return new placevalue2(whole, me.exp);
}

placevalue2.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    placevalue2.align(me, other);
    var whole = me.whole.sub(other.whole);
    return new placevalue2(whole, me.exp);
}

placevalue2.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new placevalue2(whole, this.exp);
}

placevalue2.prototype.pointadd = function (addend) {
    var whole = this.whole.pointadd(addend.whole);
    return new placevalue2(whole, this.exp);
}

placevalue2.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    placevalue2.align(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new placevalue2(whole, me.exp);
}

placevalue2.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    placevalue2.align(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new placevalue2(whole, me.exp);
}

placevalue2.prototype.pow = function (power) {	// 2015.8
    if (power instanceof placevalue2) power = power.whole;   // laurent calls wpv    2015.8
    if (power.get(0,0)<0) return (new placevalue2(1)).divide(this.pow(new placevalue2(-power.get(0,0)))); // 2015.8
    var whole = this.whole.pow(power);
    var exp = [this.exp[0] * power.get(0, 0), this.exp[1] * power.get(0, 0)];    // exp*pow not exp^pow  2015.9 // exp is 2D    2015.10
    return new placevalue2(whole, exp);
}

placevalue2.align = function (a, b) {    // rename pad align 2015.9
    //if (arguments.length < 3) offset = 0;
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

placevalue2.prototype.times = function (top) {
    var whole = this.whole.times(top.whole);
    return new placevalue2(whole, [this.exp[0] + top.exp[0], this.exp[1] + top.exp[1]]);    // exp is 2D    2015.10
}

placevalue2.prototype.divide = function (denominator) {
    var me = this.clone();
    var pads = 0;						// 2015.11
    pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : padup(me, denominator, 4);   // 2016.1
    if (denominator.whole.mantisa[0].length != 1 || me.whole.mantisa[0].length < denominator.whole.mantisa[0].length) pad(me, denominator, 4);  // 2015.9 // [0] 2015.10
    //if (denominator.whole.mantisa.length != 1 || me.whole.mantisa.length < denominator.whole.mantisa.length) padup(me, denominator, 4);  // 2015.9 // [0] 2015.10
    var whole = me.whole.divide(denominator.whole);
    console.log('placevalue2.prototype.divide : return new placevalue2(whole, ' + me.exp + '-' + denominator.exp +')')
    var ret = new placevalue2(whole, [me.exp[0] - denominator.exp[0], me.exp[1] - denominator.exp[1]]);
    unpad(ret, pads);					// 2015.11
    depad(ret);                         // 2015.11
    return ret;
    function pad(n, d, sigfig) {
        var i = 0;						// 2015.11
        while (n.whole.mantisa[0].length < sigfig + d.whole.mantisa[0].length) {    // [0] 2015.10
            i++;						// 2015.11
            console.log('placevalue2.prototype.divide.padback : ' + n.whole.mantisa[0].length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp[0]--; // exp is 2D    2015.10
            n.whole.times10();      // Delegate Shift to Whole  2015.7
        }
        return i;						// 2015.11
    }
    function padup(n, d, sigfig) {
        var i = 0;						// 2015.11
        while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
            i++;						// 2015.11
            console.log('placevalue2.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
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
        while (pv.exp[1] < 0 && pv.whole.mantisa[0].length && pv.whole.mantisa[0].reduce(function (x, y) { return x && y == 0 }, true)) {   //  LengthCheck 2015.12
            pv.whole.mantisa.shift()
            pv.exp[1]++
        }
    }
}

placevalue2.prototype.clone = function () {
    return new placevalue2(this.whole.clone(), this.exp.slice(0));  // exp is 2D    2015.10
}

placevalue2.prototype.eval = function (base) {	// 2015.8
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
    return new placevalue2(new wholeplacevalue2([ret]), [this.exp[0], 0]);    // exp[0]   2015.12
}