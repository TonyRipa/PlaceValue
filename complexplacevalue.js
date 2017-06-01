
// Author:  Anthony John Ripa
// Date:    5/31/2017
// ComplexPlaceValue : a datatype for representing base agnostic arithmetic via complex numbers whose digits are complex

function complexplacevalue(whole, exp) {
    if (arguments.length < 2) { var s = 'complexplacevalue expects 2 arguments'; alert(s); throw new Error(s); }
    if (!(whole instanceof wholeplacevaluecomplex2)) { var s = 'complexplacevalue expects argument 1 (whole) to be a wpvcomplex2 not ' + typeof whole + ' ' + whole; alert(s); throw new Error(s); }
    if (!(Array.isArray(exp))) { var s = 'complexplacevalue expects argument 2 (exp) to be an array but found ' + typeof exp + ' ' + exp; alert(s); throw new Error(s); }
    if (exp[1] == null) { var s = 'complexplacevalue expects argument 2 (exp) to be an array of numbers but found ' + typeof exp + ' ' + exp; alert(s); throw new Error(s); }
    this.whole = whole
    this.exp = exp
}

complexplacevalue[0] = new complexplacevalue(wholeplacevaluecomplex2[0], [0, 0]);
complexplacevalue[1] = new complexplacevalue(wholeplacevaluecomplex2[1], [0, 0]);
complexplacevalue.i = new complexplacevalue(wholeplacevaluecomplex2.i, [0, 0]);

complexplacevalue.prototype.is0 = function () { return this.exp[0] == 0 && this.exp[1] == 0 && this.whole.is0(); }  //  2017.5
complexplacevalue.prototype.is1 = function () { return this.exp[0] == 0 && this.exp[1] == 0 && this.whole.is1(); }  //  2017.5

complexplacevalue.prototype.get = function (r, c) {       // 2016.1
    if (!isFinite(r)) { var s = 'complexplacevalue.get expects argument 1 (r) to be finite'; alert(s); throw new Error(s); }
    if (!isFinite(c)) { var s = 'complexplacevalue.get expects argument 2 (c) to be finite'; alert(s); throw new Error(s); }
    //alert(JSON.stringify(['complexplacevalue.prototype.get', 'r', r, 'c', c, 'this.exp[0]', this.exp[0], 'this.exp[1]', this.exp[1]]))
    return this.whole.get(r - this.exp[1], c - this.exp[0]);
}

complexplacevalue.prototype.tohtml = function () {     // Replaces toStringInternal 2015.7
    return  this.whole.tohtml("complexplacevalue.prototype.tohtml2", this.exp)// + 'E' + (this.exp[1] == 90 ? this.exp[0] : this.exp); // exp is 2D    // 2015.10
}

complexplacevalue.prototype.toString = function () {
    //return JSON.stringify([this.whole, this.exp])//return this.tohtml()
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

complexplacevalue.prototype.add = function (addend) {
    var me = this.clone();
    var other = addend.clone();
    complexplacevalue.align(me, other);
    var whole = me.whole.add(other.whole);
    return new complexplacevalue(whole, me.exp);
}

complexplacevalue.prototype.sub = function (subtrahend) {
    var me = this.clone();
    var other = subtrahend.clone();
    complexplacevalue.align(me, other);
    var whole = me.whole.sub(other.whole);
    return new complexplacevalue(whole, me.exp);
}

complexplacevalue.prototype.pointsub = function (subtrahend) {
    var whole = this.whole.pointsub(subtrahend.whole);
    return new complexplacevalue(whole, this.exp);
}

complexplacevalue.prototype.pointadd = function (addend) {
    //alert(JSON.stringify(['pointadd', this, addend]));
    var whole = this.whole.pointadd(addend.whole);
    //alert(JSON.stringify(['pointadd', this, addend, whole]));
    var ret = new complexplacevalue(whole, this.exp);
    //alert(JSON.stringify(['pointadd', this, addend, whole, ret]));
    return ret;
}

complexplacevalue.prototype.pointtimes = function (multiplier) {
    var me = this.clone();
    var other = multiplier.clone();
    complexplacevalue.align(me, other);
    var whole = me.whole.pointtimes(other.whole);
    return new complexplacevalue(whole, me.exp);
}

complexplacevalue.prototype.pointdivide = function (divisor) {
    var me = this.clone();
    var other = divisor.clone();
    complexplacevalue.align(me, other);
    var whole = me.whole.pointdivide(other.whole);
    return new complexplacevalue(whole, me.exp);
}

complexplacevalue.prototype.pointpow = function (power) { // 2016.1
    if (power instanceof complexplacevalue) power = power.whole;
    if (!(power instanceof wholeplacevaluecomplex2)) power = new wholeplacevaluecomplex2([[power]]);  // 2016.1
    var me = this.clone();
    //alert(JSON.stringify([me.whole, power]));
    var whole = me.whole.pointpow(power);
    return new complexplacevalue(whole, me.exp);
}

complexplacevalue.prototype.pow = function (power) {	// 2015.8
    //alert(power);
    //alert(JSON.stringify(power));
    if (typeof power == 'number') power = new wholeplacevaluecomplex2([[power]], 'complexplacevalue.prototype.pow1 >');
    if (power instanceof wholeplacevaluecomplex2) power = new complexplacevalue(power, [0, 0]);  //  2017.5
    power = power.clone();
    //if (power.is1()) { return this.clone(); }   //  2017.5
    //if (power instanceof complexplacevalue) power = power.whole;   // laurent calls wpv    2015.8
    //if (power.get(0, 0) < 0) return (new complexplacevalue(1)).divide(this.pow(new complexplacevalue(-power.get(0, 0)))); // 2015.8
    //if (power.getimag(0, 0) == 1) return this.powi();
    //var whole = this.whole.pow(power);
    //var exp = [this.exp[0] * power.getreal(0, 0), this.exp[1] * power.getreal(0, 0)];    // exp*pow not exp^pow  2015.9 // exp is 2D    2015.10
    if (JSON.stringify(power.exp) == JSON.stringify([0, 0])) {
        var a = power.whole.getreal(0, 0);
        var b = power.whole.getimag(0, 0);
        //alert('1 ' + JSON.stringify([this, power, a, b]));
        //alert(JSON.stringify(new complexplacevalue(power.whole.negate(), power.exp)));
        if (a < 0 && b == 0) return (complexplacevalue[1]).divide(this.pow(power.negate()));   //  2017.5
        //if (b == 1) return this.pow(power.sub(complexplacevalue.i)).times(this.powi()); //  2017.5
        if (a == 0 && b != 0 && power.whole.mantisa[0].length == 1) return this.pow(new complexplacevalue(new wholeplacevaluecomplex2([[{ r: b, i: 0 }]]), [0, 0])).powi(); //  2017.5
        if (a != 0 && b != 0) return this.pow(new complexplacevalue(new wholeplacevaluecomplex2([[{ r: b, i: 0 }]]), [0, 0])).powi().times(this.pow(new complexplacevalue(new wholeplacevaluecomplex2([[{ r: a, i: 0 }]]), [0, 0]))); //  2017.5
        var exp = [this.exp[0] * power.whole.getreal(0, 0), this.exp[1] * power.whole.getreal(0, 0)];    // exp*pow not exp^pow  2015.9 // exp is 2D    2015.10
        //alert(JSON.stringify([power.whole.get(1, 0), power.whole.get(0, 1)]));
        for (var i = power.whole.getreal(1, 0) ; i < 0; i++) { power.whole = power.whole.add(new wholeplacevaluecomplex2([[], [1]])); exp[1]-- }
        for (var i = power.whole.getreal(0, 1) ; i < 0; i++) { power.whole = power.whole.add(new wholeplacevaluecomplex2([[0, 1]])); exp[0]-- }
        for (var i = power.whole.getimag(0, 1) ; i < 0; i++) { power.whole = power.whole.add(new wholeplacevaluecomplex2([[0, { r: 0, i: 1 }]])); exp[1]-- }
        var whole = this.whole.pow(power.whole);
    } else if (JSON.stringify(power.exp) == JSON.stringify([1, 0])) {
        //alert(2)
        if (JSON.stringify(this.exp) != JSON.stringify([0, 0])) { alert('CPV >Bad Exponent = ' + power.toString() + ' Base = ' + base.toString()); return complexplacevalue.parse('%') }
        var whole = new wholeplacevaluecomplex2([[1]]); //  2017.5
        //alert(JSON.stringify([power, power.whole, power.get(0, 1)]));
        var exp = [power.get(0, 1).r, power.get(0, 1).i];               //  2017.5  (row,col)=(0,1)
    } else { alert('CPV >Bad Exponent = ' + power.toString()); return new complexplacevalue(new wholeplacevalue2([[NaN]]), [0, 0]) }
    return new complexplacevalue(whole, exp);
}

complexplacevalue.prototype.powi = function () {//alert('i')
    //return new complexplacevalue(new wholeplacevaluecomplex2([[0]]), [0, 0]);
    var me = this.clone();
    while (me.exp[0] > 0) { me.exp[0]--; me.whole.times10() }
    while (me.exp[1] > 0) { me.exp[1]--; me.whole.times01() }
    var oldh = me.whole.mantisa.length;
    var oldw = me.whole.mantisa[0].length;
    var oldr = me.exp[0];
    var oldi = me.exp[1];
    var newh = oldw;
    var neww = oldh;//alert(oldh)
    var newr = -oldi-(oldh - 1); //alert(newr)
    var newi = oldr;
    //alert(JSON.stringify([oldh, oldw, newh, neww, this, whole, oldr, oldi]));
    var man = []
    //alert([newh, neww]);
    for (var r = 0; r < newh; r++) {
        var row = [];
        for (var c = 0; c < neww; c++) {
            row.unshift(wholeplacevaluecomplex2.pow(me.whole.get(c, r), { 'r': 0, 'i': 1 }));
        }
        man.push(row)
        //alert(JSON.stringify(man));
    }
    //alert(JSON.stringify([newr, newi]));
    return new complexplacevalue(new wholeplacevaluecomplex2(man), [newr, newi]);
}

complexplacevalue.align = function (a, b) {    // rename pad align 2015.9
    //if (arguments.length < 3) offset = 0;
    alignhelper(a, b);
    alignhelper(b, a);
    function alignhelper(a, b) {
        if (b.is0()) { b.exp[0] = a.exp[0]; b.exp[1] = a.exp[1]; return; }
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

complexplacevalue.prototype.negate = function () {
    return new complexplacevalue(this.whole.negate(), this.exp.slice())
}

complexplacevalue.prototype.times = function (top) {
    var whole = this.whole.times(top.whole);
    return new complexplacevalue(whole, [this.exp[0] + top.exp[0], this.exp[1] + top.exp[1]]);    // exp is 2D    2015.10
}

complexplacevalue.prototype.scale = function (scalar) {   // 2016.1
    //alert(JSON.stringify(['complexplacevalue.prototype.scale', scalar]))
    var whole = this.whole.scale(scalar);
    //alert(JSON.stringify(['whole', whole]))
    return new complexplacevalue(whole, this.exp);
}

complexplacevalue.prototype.divide = function (denominator) {
    var me = this.clone();
    var pads = 0;						// 2015.11
    pads = me.whole.mantisa.length == 1 && denominator.whole.mantisa.length == 1 ? 0 : padup(me, denominator, 4);   // 2016.1
    if (denominator.whole.mantisa[0].length != 1 || me.whole.mantisa[0].length < denominator.whole.mantisa[0].length) pad(me, denominator, 4);  // 2015.9 // [0] 2015.10
    //if (denominator.whole.mantisa.length != 1 || me.whole.mantisa.length < denominator.whole.mantisa.length) padup(me, denominator, 4);  // 2015.9 // [0] 2015.10
    var whole = me.whole.divide(denominator.whole);
    console.log('complexplacevalue.prototype.divide : return new complexplacevalue(whole, ' + me.exp + '-' + denominator.exp +')')
    var ret = new complexplacevalue(whole, [me.exp[0] - denominator.exp[0], me.exp[1] - denominator.exp[1]]);
    unpad(ret, pads);					// 2015.11
    depad(ret);                         // 2015.11
    return ret;
    function pad(n, d, sigfig) {
        var i = 0;						// 2015.11
        while (n.whole.mantisa[0].length < sigfig + d.whole.mantisa[0].length) {    // [0] 2015.10
            i++;						// 2015.11
            console.log('complexplacevalue.prototype.divide.padback : ' + n.whole.mantisa[0].length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp[0]--; // exp is 2D    2015.10
            n.whole.times10();      // Delegate Shift to Whole  2015.7
        }
        return i;						// 2015.11
    }
    function padup(n, d, sigfig) {
        var i = 0;						// 2015.11
        while (n.whole.mantisa.length < sigfig + d.whole.mantisa.length) {
            i++;						// 2015.11
            console.log('complexplacevalue.prototype.divide.padback : ' + n.whole.mantisa.length + ' < ' + sigfig + ' + ' + d.whole.mantisa.length);
            n.exp[1]--; // exp is 2D    2015.10
            n.whole.times01();      // Delegate Shift to Whole  2015.7
        }
        return i;						// 2015.11
    }
    function unpad(pv, pads) {			// 2015.11
        while (pads > 0) {
            if (pv.whole.mantisa[0].reduce(function (t, e) { return t && (e == 0 || (e.r == 0 && e.i == 0)) }, true)) {     // Check z==0   1/2016
                pv.whole.mantisa.shift(); if (pv.whole.mantisa.length == 0) pv.whole.mantisa = [[]];    // LengthCheck  2015.12
                pv.exp[1]++
            }
            pads--;
        }
    }
    function depad(pv) {			// 2015.11
        while (pv.exp[1] < 0 && pv.whole.mantisa[0].length && pv.whole.mantisa[0].reduce(function (t, e) { return t && (e == 0 || (e.r == 0 && e.i == 0)) }, true)) {   // Check z  1/2016
            pv.whole.mantisa.shift()
            pv.exp[1]++
        }
    }
}

complexplacevalue.prototype.clone = function () {
    return new complexplacevalue(this.whole.clone(), this.exp.slice(0));  // exp is 2D    2015.10
}

complexplacevalue.prototype.eval = function (base) {	// 2015.8
    var c = wholeplacevaluecomplex2;
    var ret = [];
    for (var col = 0; col < this.whole.mantisa[0].length; col++) {
        //var sum = 0;
        var sum = { 'r': 0, 'i': 0 };
        for (var row = 0; row < this.whole.mantisa.length; row++) {
            if (this.whole.get(row, col).r != 0 || this.whole.get(row, col).i != 0) // Only add non-zero digits; Prevents 0*∞=%.    2016.1
                sum = c.add(sum, c.mul(this.whole.get(row, col), base.whole.pow(row + this.exp[1]).get(0, 0))); // Offset pow by exp    2015.11 // UnOffset get 2015.12
        }
        ret.push(sum);
    }
    return new complexplacevalue(new wholeplacevaluecomplex2([ret]), [this.exp[0], 0]);    // exp[0]   2015.12
}