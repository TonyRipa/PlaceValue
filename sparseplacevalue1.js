
// Author : Anthony John Ripa
// Date : 1/31/2017
// SparsePlaceValue1 : a datatype for representing base agnostic arithmetic via sparse numbers whose digits are real

function sparseplacevalue1(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue1 expects argument to be 2D array but found " + typeof points + points); }
    if (points.length > 0 && !Array.isArray(points[0])) alert("sparseplacevalue1 expects argument to be 2D array but found 1D array of " + typeof points[0]);
    points = normal(points);
    points = trim(points);
    points = points.map(function (x) { return [x[0], Math.round(x[1] * 1000) / 1000] });
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

sparseplacevalue1.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevalue1(JSON.parse(arg).points); }
    if (typeof arg == "number") return new sparseplacevalue1([[arg, 0]]);    //  2d array    2016.10
    if (arg instanceof Number) return new sparseplacevalue1(arg, 0);
    var terms = split(arg);
    terms = terms.map(parseterm);
    return new sparseplacevalue1(terms);
    function split(terms) {         //  2017.1
        var ret = [];
        terms = terms.toUpperCase().replace(/\s*/g, '');
        if (terms.length == 0) return ret;
        if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
        var num = '(\\d+\\.\\d*|\\d*\\.\\d+|\\d+)';
        var reg = new RegExp('[\+\-]' + num + '(E[\+\-]?' + num + ')?', 'g');
        var term;
        while (term = reg.exec(terms))
            ret.push(term[0]);
        return ret;
    }
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        if (term == 'INFINITY') return [Infinity, 0];
        if (term == '-INFINITY') return [-Infinity, 0];
        var coefpow = term.split('E')
        var coef = coefpow[0];
        var pow = coefpow[1];
        if (isNaN(pow)) pow = 0;
        return [Number(coef), Number(pow)];
    }
}

sparseplacevalue1.prototype.tohtml = function () {  // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return JSON.stringify(me.points.reverse());
}

sparseplacevalue1.prototype.toString = function (sTag) {                                 //  sTag    2015.11
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i, sTag);     //  Plus-delimited  2016.10
    return ret.substr(1).replace(/\+\-/g, '-');                                         //  +- becomes -    2017.1
}

sparseplacevalue1.prototype.digit = function (i, sTag, long) {                           //  sTag    2015.11
    if (sTag) return this.digitpair(i, '<s>', '</s>', true, long);
    return this.digitpair(i, '', String.fromCharCode(822), false, long);
}

sparseplacevalue1.prototype.digitpair = function (i, NEGBEG, NEGEND, fraction, long) {  // 2015.12
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

sparseplacevalue1.prototype.add = function (other) { return new sparseplacevalue1(this.points.concat(other.points)); }
sparseplacevalue1.prototype.sub = function (other) { return new sparseplacevalue1(this.points.concat(other.points.map(function (x) { return [-x[0], x[1]] }))); }
sparseplacevalue1.prototype.pointtimes = function (other) { return this; }
sparseplacevalue1.prototype.pointdivide = function (other) { return this; }
sparseplacevalue1.prototype.pointsub = function (subtrahend) { return this; }
sparseplacevalue1.prototype.pointadd = function (addend) { return this; }
sparseplacevalue1.prototype.pointpow = function (power) { return this; }
sparseplacevalue1.prototype.clone = function () { return new sparseplacevalue1(this.points.slice(0)); }

sparseplacevalue1.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            points.push([this.points[i][0] * top.points[j][0], this.points[i][1] + top.points[j][1]]);
    return new sparseplacevalue1(points);
}

sparseplacevalue1.prototype.divide = function (den) {       //  2016.10
    var num = this;
    var iter = math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevalue1.parse(0);
        var n = num.points.slice(-1)[0];
        var d = den.points.slice(-1)[0];
        var quotient = new sparseplacevalue1([[n[0] / d[0], n[1] - d[1]]]);     //  Works even for non-truncating division  2016.10
        //if (d.val == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
}

sparseplacevalue1.prototype.divideleft = function (den) {   //  2017.1
    var num = this;
    var iter = math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevalue1.parse(0);
        var n = num.points[0];
        var d = den.points[0];
        var quotient = new sparseplacevalue1([[n[0] / d[0], n[1] - d[1]]]);     //  Works even for non-truncating division  2016.10
        //if (d.val == 0) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
}

sparseplacevalue1.prototype.dividemiddle = sparseplacevalue1.prototype.divide

sparseplacevalue1.prototype.pow = function (power) {     //  2016.10
    if (power.points.length == 1 & power.points[0][1] == 0) {
        if (this.points.length == 1) return new sparseplacevalue1([[Math.pow(this.points[0][0], power.points[0][0]), this.points[0][1] * power.points[0][0]]]);
        if (power.points[0][0] == 0) return sparseplacevalue1.parse(1);
        if (power.points[0][0] < 0) return sparseplacevalue1.parse(1).divide(this.pow(new sparseplacevalue1([[-power.points[0][0], 0]])));
        if (power.points[0][0] == Math.round(power.points[0][0])) return this.times(this.pow(power.sub(sparseplacevalue1.parse(1))));
    }
    return sparseplacevalue1.parse(0 / 0);
}

sparseplacevalue1.prototype.eval = function (base) {
    var sum = 0;
    for (var i = 0; i < this.points.length; i++) {
        sum += this.points[i][0] * Math.pow(base.points[0][0], this.points[i][1]);  //  base.points[0][0]   2016.10
    }
    return new sparseplacevalue1([[sum, 0]]);
}
