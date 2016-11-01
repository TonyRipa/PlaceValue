
// Author : Anthony John Ripa
// Date : 10/31/2016
// SparsePlaceValue : a datatype for representing base agnostic arithmetic via sparse numbers whose digits are real

function sparseplacevalue(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue expects argument to be 2D array but found " + typeof points + points); }
    if (!Array.isArray(points[0])) alert("sparseplacevalue expects argument to be 2D array but found 1D array of " + typeof points[0]);
    points = normal(points);
    points = trim(points);
    this.points = points;
    function normal(points) {
        var list = points.map(function (x) { return x.slice(0) });
        sort(list);
        combineliketerms(list);
        return list;
        function sort(list) {
            for (var i = 0; i < list.length; i++)
                for (var j = 0; j < list.length; j++)
                    if (list[i][1] < list[j][1]) {
                        var temp = list[i];     //  Swap list[i] with list[j]. Not list[i][1] with list[j][1].  2016.10
                        list[i] = list[j];
                        list[j] = temp;
                    }
        }
        function combineliketerms(list) {
            var i = list.length - 1;
            while (i > 0)
                if (list[i][1] == list[i - 1][1]) {
                    list[i][0] += list[i - 1][0];
                    list.splice(i - 1, 1);
                    i--;
                } else i--;
        }
    }
    function trim(points) {     //  2016.10
        for (var i = 0; i < points.length; i++)
            if (points[i][0] == 0) points.splice(i, 1);
        if (points.length == 0) points = [[0, 0]];
        return points;
    }
}

sparseplacevalue.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevalue(JSON.parse(arg).points); }
    if (typeof arg == "number") return new sparseplacevalue([[arg, 0]]);    //  2d array    2016.10
    if (arg instanceof Number) return new sparseplacevalue(arg, 0);
    var terms = arg.split('+');
    terms = terms.map(parseterm);
    return new sparseplacevalue(terms);
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        term = term.toUpperCase();
        if (term == 'INFINITY') return [Infinity, 0];
        if (term == '-INFINITY') return [-Infinity, 0];
        var coefpow = term.split('E')
        var coef = coefpow[0];
        var pow = coefpow[1];
        if (isNaN(pow)) pow = 0;
        return [Number(coef), Number(pow)];
    }
}

sparseplacevalue.prototype.tohtml = function () {    // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return JSON.stringify(me.points.reverse());
}

sparseplacevalue.prototype.toString = function (sTag) {                                 //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i, sTag);     //  Plus-delimited  2016.10
    return ret.substr(1);
}

sparseplacevalue.prototype.digit = function (i, sTag, long) {                           //  sTag    2015.11
    if (sTag) return this.digitpair(i, '<s>', '</s>', true, long);
    return this.digitpair(i, '', String.fromCharCode(822), false, long);
}

sparseplacevalue.prototype.digitpair = function (i, NEGBEG, NEGEND, fraction, long) {  // 2015.12
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i]; // R2L  2015.7
    var coef = digit[0];
    var pow = digit[1];
    var a = Math.round(coef * 1000) / 1000
    var b = Math.round(pow * 1000) / 1000
    if (-.01 < pow && pow < .01) return a
    return a + 'E' + b;     //  E-notation  2016.10
}

sparseplacevalue.prototype.add = function (other) { return new sparseplacevalue(this.points.concat(other.points)); }
sparseplacevalue.prototype.sub = function (other) { return new sparseplacevalue(this.points.concat(other.points.map(function (x) { return [-x[0], x[1]] }))); }
sparseplacevalue.prototype.pointtimes = function (other) { return this; }
sparseplacevalue.prototype.pointdivide = function (other) { return this; }
sparseplacevalue.prototype.pointsub = function (subtrahend) { return this; }
sparseplacevalue.prototype.pointadd = function (addend) { return this; }
sparseplacevalue.prototype.pointpow = function (power) { return this; }
sparseplacevalue.prototype.clone = function () { return new sparseplacevalue(this.points.slice(0)); }

sparseplacevalue.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            points.push([this.points[i][0] * top.points[j][0], this.points[i][1] + top.points[j][1]]);
    return new sparseplacevalue(points);
}

sparseplacevalue.getDegree = function (points) {
    for (var i = points.length - 1; i >= 0; i--)
        if (points[i][0] != 0) return { 'deg': points[i][1], 'val': points[i][0] };
    return { 'deg': 0, 'val': 0 };
}

sparseplacevalue.prototype.divide = function (den) {    //  2016.10
    var num = this;
    var iter = math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevalue.parse(0);
        var d = sparseplacevalue.getDegree(den.points);
        var n = sparseplacevalue.getDegree(num.points);
        var quotient = new sparseplacevalue([[n.val / d.val, n.deg - d.deg]]);     //  Works even for non-truncating division  2016.10
        if (d.val == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
}

sparseplacevalue.prototype.divideleft = sparseplacevalue.prototype.divide
sparseplacevalue.prototype.dividemiddle = sparseplacevalue.prototype.divide

sparseplacevalue.prototype.pow = function (power) {     //  2016.10
    if (power.points.length == 1 & power.points[0][1] == 0) {
        if (this.points.length == 1) return new sparseplacevalue([[Math.pow(this.points[0][0], power.points[0][0]), this.points[0][1] * power.points[0][0]]]);
        if (power.points[0][0] == 0) return sparseplacevalue.parse(1);
        if (power.points[0][0] < 0) return sparseplacevalue.parse(1).divide(this.pow(new sparseplacevalue([[-power.points[0][0], 0]])));
        if (power.points[0][0] == Math.round(power.points[0][0])) return this.times(this.pow(power.sub(sparseplacevalue.parse(1))));
    }
    return sparseplacevalue.parse(0 / 0);
}

sparseplacevalue.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.points.length; i++) {
        sum += this.points[i][0] * Math.pow(base.points[0][0], this.points[i][1]);  //  base.points[0][0]   2016.10
    }
    return new sparseplacevalue([[sum, 0]]);
}
