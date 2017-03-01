
// Author : Anthony John Ripa
// Date : 2/28/2017
// SparsePlaceValue2 : a 2d datatype for representing base agnostic arithmetic via sparse numbers whose digits are real

function sparseplacevalue2(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue2 expects argument to be 2D array but found " + typeof points + points); }
    if (!Array.isArray(points[0])) alert("sparseplacevalue2 expects argument to be 2D array but found 1D array of " + typeof points[0]);
    points = normal(points);
    points = trim(points);
    points = points.map(function (x) { return [x[0], [Math.round(x[1][0] * 1000) / 1000, Math.round(x[1][1] * 1000) / 1000]] });
    this.points = points;
    function normal(points) {
        var list = points.map(function (x) { return x.slice(0) });
        sort(list);
        combineliketerms(list);
        return list;
        function sort(list) {
            for (var i = 0; i < list.length; i++)
                for (var j = 0; j < list.length; j++)
                    if ((list[i][1][0] < list[j][1][0]) || ((list[i][1][0] == list[j][1][0]) && (list[i][1][1] > list[j][1][1]))) {
                        var temp = list[i];     //  Swap list[i] with list[j]. Not list[i][1] with list[j][1].  2016.10
                        list[i] = list[j];
                        list[j] = temp;
                    }
        }
        function combineliketerms(list) {
            var i = list.length - 1;
            while (i > 0)
                if (list[i][1][0] == list[i - 1][1][0] && list[i][1][1] == list[i - 1][1][1]) {
                    list[i][0] += list[i - 1][0];
                    list.splice(i - 1, 1);
                    i--;
                } else i--;
        }
    }
    function trim(points) {     //  2016.10
        for (var i = 0; i < points.length; i++)
            if (points[i][0] == 0) points.splice(i, 1);
        if (points.length == 0) points = [[0, [0, 0]]];
        return points;
    }
}

sparseplacevalue2.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevalue2(JSON.parse(arg).points); }
    if (typeof arg == "number") return new sparseplacevalue2([[arg, [0, 0]]]);    //  2d array    2016.10
    if (arg instanceof Number) return new sparseplacevalue2(arg, [0, 0]);
    var terms = arg.split('+');
    terms = terms.map(parseterm);
    return new sparseplacevalue2(terms);
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        term = term.toUpperCase();
        if (term == 'INFINITY') return [Infinity, [0, 0]];  //  2017.2  0->[0,0]
        if (term == '-INFINITY') return [-Infinity, [0, 0]];
        var coefpow = term.split('E')
        var coef = coefpow[0];
        var pow = coefpow[1] || '0,0';
        var pows = pow.split(',')
        //if (!pows.length) pows = [0, 0];
        if (pows.length == 1) pows.push(0); //  Ensures pow is 2D
        return [Number(coef), pows.map(Number)];
    }
}

sparseplacevalue2.prototype.tohtml = function () {  // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return me.points.reverse().map(JSON.stringify).join();
}

sparseplacevalue2.prototype.toString = function () {                            //  2016.12
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i);   //  Plus-delimited  2016.10
    return ret.substr(1);
}

sparseplacevalue2.prototype.digit = function (i) {                      // 2016.12
    var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i];    // R2L  2015.7
    var a = Math.round(digit[0] * 1000) / 1000
    var b = digit[1];
    if (b[0] == 0 && b[1] == 0) return a;
    if (b[1] == 0) return a + 'E' + b[0];
    return a + 'E' + b;                                                 //  E-notation  2016.10
}

sparseplacevalue2.prototype.add = function (other) { return new sparseplacevalue2(this.points.concat(other.points)); }
sparseplacevalue2.prototype.sub = function (other) { return this.add(other.negate()); }
sparseplacevalue2.prototype.pointtimes = function (other) { return this; }
sparseplacevalue2.prototype.pointdivide = function (other) { return this; }
sparseplacevalue2.prototype.pointsub = function (other) { return this.pointadd(other.negate()); }
sparseplacevalue2.prototype.pointpow = function (power) { return this; }
sparseplacevalue2.prototype.clone = function () { return new sparseplacevalue2(this.points.slice(0)); }
sparseplacevalue2.prototype.negate = function () { return new sparseplacevalue2(this.points.map(function (x) { return [-x[0], x[1]] })); }
sparseplacevalue2.prototype.transpose = function () { return new sparseplacevalue2(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }

sparseplacevalue2.prototype.pointadd = function (addend) {
    var ret = this.clone().points;
    var digit = 0;
    for (var i = 0; i < addend.points.length; i++) if (addend.points[i][1][0] == 0 && addend.points[i][1][1] == 0) digit = addend.points[i][0];
    for (var i = 0; i < ret.length; i++) ret[i][0] += digit;
    return new sparseplacevalue2(ret);
}

sparseplacevalue2.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            points.push([this.points[i][0] * top.points[j][0], [this.points[i][1][0] + top.points[j][1][0], this.points[i][1][1] + top.points[j][1][1]]]);
    return new sparseplacevalue2(points);
}

sparseplacevalue2.prototype.divide = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevalue2.parse(0);
        var n = num.points.slice(-1)[0];
        var d = den.points.slice(-1)[0];
        var quotient = new sparseplacevalue2([[n[0] / d[0], [n[1][0] - d[1][0], n[1][1] - d[1][1]]]]);     //  Works even for non-truncating division  2016.10
        if (d[0] == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
}

sparseplacevalue2.prototype.divideleft = function (den) {    //  2016.11
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevalue2.parse(0);
        var n = num.points[0];
        var d = den.points[0];
        var quotient = new sparseplacevalue2([[n[0] / d[0], [n[1][0] - d[1][0], n[1][1] - d[1][1]]]]);     //  Works even for non-truncating division  2016.10
        if (d[0] == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
}

sparseplacevalue2.prototype.dividemiddle = sparseplacevalue2.prototype.divide

sparseplacevalue2.prototype.pow = function (power) {        //  2016.11
    if (power.points.length == 1 & power.points[0][1][0] == 0 & power.points[0][1][1] == 0) {
        var base = this.points[0];
        if (this.points.length == 1) return new sparseplacevalue2([[Math.pow(base[0], power.points[0][0]), [base[1][0] * power.points[0][0], base[1][1] * power.points[0][0]]]]);
        if (power.points[0][0] == 0) return sparseplacevalue2.parse(1);
        if (power.points[0][0] < 0) return sparseplacevalue2.parse(1).divide(this.pow(new sparseplacevalue2([[-power.points[0][0], [0, 0]]])));
        if (power.points[0][0] == Math.round(power.points[0][0])) return this.times(this.pow(power.sub(sparseplacevalue2.parse(1))));
    }
    return sparseplacevalue2.parse(0 / 0);
}

sparseplacevalue2.prototype.eval = function (base) {
    if (this.points.reduce(function (sum, cur) { return sum && cur[1][1] == 0 }, true)) {   // if 1d
        var sum = 0;
        for (var i = 0; i < this.points.length; i++) {
            sum += this.points[i][0] * Math.pow(base.points[0][0], this.points[i][1][0]);
        }
        return new sparseplacevalue2([[sum, [0, 0]]]);
    } else {
        var sum = sparseplacevalue2.parse(0);
        for (var i = 0; i < this.points.length; i++) {
            var addend;
            addend = new sparseplacevalue2([[this.points[i][0] * Math.pow(base.points[0][0], this.points[i][1][1]), [this.points[i][1][0], 0]]]);
            sum = sum.add(addend);
        }
        return sum;
    }
}
