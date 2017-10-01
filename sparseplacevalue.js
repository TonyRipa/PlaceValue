
// Author : Anthony John Ripa
// Date : 9/30/2017
// SparsePlaceValue : a datatype for representing base agnostic arithmetic via sparse numbers whose digits are real

function sparseplacevalue(points) {
    if (arguments.length < 1) points = [];  //  2017.9
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue expects argument to be 2D array but found " + typeof points + points); }
    if (points.length > 0 && !Array.isArray(points[0])) alert("sparseplacevalue expects argument to be 2D array but found 1D array of " + typeof points[0]);
    points = normal(points);
    points = trim(points);
    points = points.map(function (x) { return [x[0], x[1].map(function (y) { return Math.round(y * 1000) / 1000 })] });
    this.points = points;
    function normal(points) {
        var list = points.map(function (x) { return x.slice(0) });
        sort(list);
        combineliketerms(list);
        return list;
        function sort(list) {
            for (var i = 0; i < list.length; i++)
                for (var j = 0; j < list.length; j++)
                    if ((i < j) && compare(list[i], list[j]) > 0) {
                        var temp = list[i];     //  Swap list[i] with list[j]. Not list[i][1] with list[j][1].  2016.10
                        list[i] = list[j];
                        list[j] = temp;
                    }
            function compare(a, b) {
                if (a[1].length > b[1].length) return -compare(b, a);
                if (JSON.stringify(a[1]) == JSON.stringify(b[1])) return a[0] - b[0];
                for (var i = 0; i < a[1].length ; i++) {
                    if (a[1][i] > b[1][i]) return 1;
                    if (a[1][i] < b[1][i]) return -1;
                }
                for (i = a[1].length; i < b[1].length ; i++) {
                    if (0 > b[1][i]) return 1;
                    if (0 < b[1][i]) return -1;
                }
                return 0;
            }
        }
        function combineliketerms(list) {
            var i = list.length - 1;
            while (i > 0)
                if (arrayequal(list[i][1], list[i - 1][1])) {
                    list[i][0] += list[i - 1][0];
                    list.splice(i - 1, 1);
                    i--;
                } else i--;
            function arrayequal(a1, a2) {
                if (a1.length > a2.length) return arrayequal(a2, a1);
                for (var i = 0; i < a1.length; i++)
                    if (a1[i] != a2[i]) return false;
                for (var i = a1.length; i < a2.length; i++)
                    if (a2[i] != 0) return false;
                return true;
            }
        }
    }
    function trim(points) {     //  2016.10
        for (var i = 0; i < points.length; i++) {
            if (points[i][0] == 0) points.splice(i--, 1);   //  2017.2  Add -- so i iterates right despite array modification
            else                //  2017.1
                while (points[i][1].length > 1 && points[i][1].slice(-1)[0] == 0) {
                    points[i][1].pop();
                }
        }
        if (points.length == 0) points = [[0, [0]]];
        points = points.map(function (point) { return [point[0], point[1].length == 0 ? [0] : point[1]] });
        return points;
    }
}

sparseplacevalue.prototype.parse = function (arg) { //  2017.9
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevalue(JSON.parse(arg).points); }
    if (typeof arg == "number") return new sparseplacevalue([[arg, [0, 0]]]);    //  2d array    2016.10
    if (arg instanceof Number) return new sparseplacevalue(arg, [0, 0]);
    var terms = arg.split('+');
    terms = terms.map(parseterm);
    return new sparseplacevalue(terms);
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        term = term.toUpperCase();
        if (term == 'INFINITY') return [Infinity, [0]]; //  2017.2  0->[0]
        if (term == '-INFINITY') return [-Infinity, [0]];
        var coefpow = term.split('E')
        var coef = coefpow[0];
        var pow = coefpow[1] || '0';
        var pows = pow.split(',')
        //if (!pows.length) pows = [0, 0];
        return [Number(coef), pows.map(Number)];
    }
}

sparseplacevalue.prototype.tohtml = function () {   // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return me.points.reverse().map(JSON.stringify).join();
}

sparseplacevalue.prototype.toString = function () {                             //  2016.12
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i);   //  Plus-delimited  2016.10
    return ret.substr(1);
}

sparseplacevalue.prototype.digit = function (i) {                       //  2017.2
    var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i];    //  R2L  2015.7
    var a = Math.round(digit[0] * 1000) / 1000
    var b = digit[1];
    if (b.every(function (x) { return x == 0 })) return a;              //  Every 2017.1
    return a + 'E' + b;                                                 //  E-notation  2016.10
}

sparseplacevalue.prototype.add = function (other) { return new sparseplacevalue(this.points.concat(other.points)); }
sparseplacevalue.prototype.sub = function (other) { return this.add(other.negate()); }
sparseplacevalue.prototype.pointtimes = function (other) { return this; }
sparseplacevalue.prototype.pointdivide = function (other) { return this; }
sparseplacevalue.prototype.pointsub = function (other) { return this.pointadd(other.negate()); }
sparseplacevalue.prototype.pointpow = function (power) { return this; }
sparseplacevalue.prototype.clone = function () { return new sparseplacevalue(this.points.slice(0)); }
sparseplacevalue.prototype.negate = function () { return new sparseplacevalue(this.points.map(function (x) { return [-x[0], x[1]] })); }
sparseplacevalue.prototype.transpose = function () { return new sparseplacevalue(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }

sparseplacevalue.prototype.pointadd = function (addend) {
    var ret = this.clone().points;
    var digit = 0;
    for (var i = 0; i < addend.points.length; i++) if (addend.points[i][1][0] == 0 && addend.points[i][1][1] == 0) digit = addend.points[i][0];
    for (var i = 0; i < ret.length; i++) ret[i][0] += digit;
    return new sparseplacevalue(ret);
}

sparseplacevalue.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            if (this.points[i][0] != 0 && top.points[j][0]) points.push([this.points[i][0] * top.points[j][0], addvectors(this.points[i][1], top.points[j][1])]); // 2017.2 0*∞=0 for easy division
    return new sparseplacevalue(points);
    function addvectors(a, b) { //  2017.1
        if (a.length > b.length) return addvectors(b, a);
        return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), b);
    }
}

sparseplacevalue.prototype.divide = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new sparseplacevalue().parse(0);
        var n = num.points.slice(-1)[0];
        var d = den.points.slice(-1)[0]; 
        var quotient = new sparseplacevalue([[n[0] / d[0], subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
        if (d[0] == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { //  2017.1
        if (a.length > b.length) return subvectors(b, a).map(function (x) { return -x });
        return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), math.multiply(b, -1));
    }
}

sparseplacevalue.prototype.divideleft = function (den) {    //  2016.11
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return new sparseplacevalue().parse(0);
        var n = num.points[0];
        var d = den.points[0];
        var quotient = new sparseplacevalue([[n[0] / d[0], subvectors(n[1], d[1])]]);    //  Works even for non-truncating division  2016.10
        if (d[0] == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { //  2017.1
        if (a.length > b.length) return subvectors(b, a).map(function (x) { return -x });
        return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), math.multiply(b, -1));
    }
}

sparseplacevalue.prototype.dividemiddle = sparseplacevalue.prototype.divide

sparseplacevalue.prototype.pow = function (power) {        //  2016.11
    if (power.points.length == 1 & power.points[0][1].every(function (x) { return x == 0 })) {
        var base = this.points[0];
        if (this.points.length == 1) return new sparseplacevalue([[Math.pow(base[0], power.points[0][0]), math.multiply(base[1], power.points[0][0])]]);
        if (power.points[0][0] == 0) return sparseplacevalue.parse(1);
        if (power.points[0][0] < 0) return sparseplacevalue.parse(1).divide(this.pow(new sparseplacevalue([[-power.points[0][0], [0]]])));
        if (power.points[0][0] == Math.round(power.points[0][0])) return this.times(this.pow(power.sub(sparseplacevalue.parse(1))));
    }
    return sparseplacevalue.parse(0 / 0);
}

sparseplacevalue.prototype.eval = function (base) {
    if (base instanceof sparseplacevalue) base = base.points[0][0];
    return new sparseplacevalue(eval(this.points, base));
    function eval(points, base) {
        var maxlen = points.reduce(function (agr, cur) { return Math.max(agr, cur[1].length) }, 0);
        return points.map(function (point) { return eval1(point, base, maxlen) });
        function eval1(point, base, maxlen) {
            var man = point[0];
            var pows = point[1];
            if (pows.length < maxlen) return point;
            var pow = pows.slice(-1);
            return [point[0] * Math.pow(base, pow), pows.slice(0, -1)];
        }
    }
}
