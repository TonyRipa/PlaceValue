
// Author:  Anthony John Ripa
// Date:    4/30/2017
// SparsePlaceValueComplex : a datatype for representing base agnostic arithmetic via sparse numbers whose digits are complex

function sparseplacevaluecomplex(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevaluecomplex expects argument to be 2D array but found " + typeof points + points); }
    if (points.length > 0 && !Array.isArray(points[0])) alert("sparseplacevaluecomplex expects argument to be 2D array but found 1D array of " + typeof points[0]);
    if (points.length > 0 && !points[0][0] instanceof complex) alert("sparseplacevaluecomplex expects coefficients are complex but found " + typeof points[0][0]);    //  2017.4
    if (points.length > 0 && !points[0][1].every(x => x instanceof complex)) { var s = 'SparsePlaceValueComplex bad arg ' + JSON.stringify(points); alert(s); throw new Error(s); }  //  2017.4
    points = normal(points);
    points = trim(points);
    try { points = points.map(function (x) { if (x[1][0] === 0) throw new Error('l'); return [x[0].round(), x[1].map(function (y) { return y.round() })] }); } catch (e) { alert(e); console.trace() }
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
                    if (a[1][i].above(b[1][i])) return 1;
                    if (a[1][i].below(b[1][i])) return -1;
                }
                for (i = a[1].length; i < b[1].length ; i++) {
                    if (b[1][i].below0()) return 1;
                    if (b[1][i].above0()) return -1;
                }
                return 0;
            }
        }
        function combineliketerms(list) {
            var i = list.length - 1;
            while (i > 0)
                if (arrayequal(list[i][1], list[i - 1][1])) {
                    list[i][0] = list[i][0].add(list[i - 1][0]);
                    list.splice(i - 1, 1);
                    i--;
                } else i--;
            function arrayequal(a1, a2) {
                if (a1.length > a2.length) return arrayequal(a2, a1);
                for (var i = 0; i < a1.length; i++)
                    if (!a1[i].equals(a2[i])) return false;
                for (var i = a1.length; i < a2.length; i++)
                    if (!a2[i].is0()) return false;
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
        if (points.length == 0) points = [[complex.zero, []]];
        return points;
    }
}

sparseplacevaluecomplex.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { return new sparseplacevaluecomplex(JSON.parse(arg).points.map(function (point) { return [complex.parse(JSON.stringify(point[0])), point[1].map(function (c) { return complex.parse(JSON.stringify(c)) })] })); }
    if (typeof arg == "number") return new sparseplacevaluecomplex([[complex.parse(arg), []]]);    //  2d array    2016.10
    if (arg instanceof Number) return new sparseplacevaluecomplex([[complex.parse(arg), []]]);
    var terms = arg.split('+');
    terms = terms.map(parseterm);
    return new sparseplacevaluecomplex(terms);
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        if (term.toUpperCase() == 'INFINITY') return [complex.parse('∞'), []]; //  2017.3  [0]->[]
        if (term.toUpperCase() == '-INFINITY') return [complex.parse('-∞'), []];
        var coefpow = term.split(/e|E/)
        var coef = coefpow[0];
        var pow = coefpow[1] || '' //'0';
        var pows = split(pow);//alert(JSON.stringify(pows))
        return [complex.parse(coef), pows.length == 0 ? [] : pows.map(complex.parse)];
        function split(csv) {   //  2017.3
            if (csv == '') return [];
            var ret = [];
            var paren = 0;
            var word = '';
            for (var i = 0; i < csv.length; i++) {
                var c = csv[i];
                if (c == ',' && paren == 0) { ret.push(word); word = ''; continue; }
                if (c == '(') paren++;
                if (c == ')') paren--;
                word += c;
            }
            ret.push(word);
            return ret;
        }
    }
}

sparseplacevaluecomplex.prototype.tohtml = function () {   // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return me.points.reverse().map(function (d) { return '[' + d[0] + ',[' + d[1] + ']]' }).join(' , ');
}

sparseplacevaluecomplex.prototype.toString = function (long) {  //  2017.4  long
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i, long);   //  Plus-delimited  2016.10
    return ret.substr(1);
}

sparseplacevaluecomplex.prototype.digit = function (i, long) {          //  2017.4  long
    var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i];    //  R2L  2015.7
    var a = digit[0].toString(false, long);
    var b = digit[1];
    if (b.every(function (x) { return x == 0 })) return a;              //  Every 2017.1
    return a + 'E' + b.map(x=> x.toString(false, long));                //  E-notation  2016.10
}

sparseplacevaluecomplex.prototype.add = function (other) { return new sparseplacevaluecomplex(this.points.concat(other.points)); }
sparseplacevaluecomplex.prototype.sub = function (other) { return this.add(other.negate()); }
sparseplacevaluecomplex.prototype.pointtimes = function (other) { return this; }
sparseplacevaluecomplex.prototype.pointdivide = function (other) { return this; }
sparseplacevaluecomplex.prototype.pointsub = function (other) { return this.pointadd(other.negate()); }
sparseplacevaluecomplex.prototype.pointpow = function (power) { return this; }
sparseplacevaluecomplex.prototype.clone = function () { return new sparseplacevaluecomplex(this.points.slice(0)); }
sparseplacevaluecomplex.prototype.negate = function () { return new sparseplacevaluecomplex(this.points.map(function (x) { return [x[0].negate(), x[1]] })); }
sparseplacevaluecomplex.prototype.transpose = function () { return new sparseplacevaluecomplex(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }

sparseplacevaluecomplex.prototype.pointadd = function (addend) {
    var ret = this.clone().points;
    var digit = 0;
    for (var i = 0; i < addend.points.length; i++) if (addend.points[i][1][0] == 0 && addend.points[i][1][1] == 0) digit = addend.points[i][0];
    for (var i = 0; i < ret.length; i++) ret[i][0] += digit;
    return new sparseplacevaluecomplex(ret);
}

sparseplacevaluecomplex.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            points.push([this.points[i][0].times(top.points[j][0]), addvectors(this.points[i][1], top.points[j][1])]);
    return new sparseplacevaluecomplex(points);
    function addvectors(a, b) { //  2017.3
        var ret = [];
        var l = Math.max(a.length, b.length);
        var sum;
        for (var i = 0; i < l; i++) {
            if (i < a.length && i < b.length) sum = a[i].add(b[i]);
            else if (i < a.length) sum = a[i];
            else sum = b[i];
            ret.push(sum);
        }
        return ret;
    }
}

sparseplacevaluecomplex.prototype.withoutmsb = function () {
    var me = this.clone();
    me.points.pop();
    return me;
}

sparseplacevaluecomplex.prototype.divide = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevaluecomplex.parse(0);
        var n = num.points.slice(-1)[0];
        var d = den.points.slice(-1)[0];
        var quotient = new sparseplacevaluecomplex([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
        if (d[0].is0()) return quotient;
        var remainder = num.withoutmsb().sub(quotient.times(den).withoutmsb());     // 2017.4   msb removed so 1/∞=0
        //if (!(remainder.points.length < num.points.length)) { remainder.points.shift(); remainder = new sparseplacevaluecomplex(remainder.points); }    // 2017.4   assert(msb removed) so 1/∞=0
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { //  2017.3
        var ret = [];
        var l = Math.max(a.length, b.length);
        var sum;
        for (var i = 0; i < l; i++) {
            if (i < a.length && i < b.length) sum = a[i].sub(b[i]);
            else if (i < a.length) sum = a[i];
            else sum = b[i].negate();
            ret.push(sum);
        }
        return ret;
    }
}

sparseplacevaluecomplex.prototype.divideleft = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevaluecomplex.parse(0);
        var n = num.points[0];
        var d = den.points[0];
        var quotient = new sparseplacevaluecomplex([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
        if (d[0].is0()) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { //  2017.3
        var ret = [];
        var l = Math.max(a.length, b.length);
        var sum;
        for (var i = 0; i < l; i++) {
            if (i < a.length && i < b.length) sum = a[i].sub(b[i]);
            else if (i < a.length) sum = a[i];
            else sum = b[i].negate();
            ret.push(sum);
        }
        return ret;
    }
}

sparseplacevaluecomplex.prototype.dividemiddle = sparseplacevaluecomplex.prototype.divide

sparseplacevaluecomplex.prototype.pow = function (power) {        //  2017.3
    if (power.points.length == 1 & power.points[0][1].every(function (x) { return x.is0() })) {
        var base = this.points[0];
        if (this.points.length == 1) return new sparseplacevaluecomplex([[base[0].pow(power.points[0][0]), base[1].map(function (x) { return x.times(power.points[0][0]) })]]);
        if (power.points[0][0].is0()) return sparseplacevaluecomplex.parse(1);
        if (power.points[0][0].below0()) return sparseplacevaluecomplex.parse(1).divide(this.pow(new sparseplacevaluecomplex([[power.points[0][0].negate(), []]])));
        if (power.points[0][0].equals(power.points[0][0].round())) return this.times(this.pow(power.sub(sparseplacevaluecomplex.parse(1))));
    }
    return sparseplacevaluecomplex.parse('%');
}

sparseplacevaluecomplex.prototype.eval = function (base) {
    if (base instanceof sparseplacevaluecomplex) base = base.points[0][0];
    return new sparseplacevaluecomplex(eval(this.points, base));
    function eval(points, base) {
        var maxlen = points.reduce(function (agr, cur) { return Math.max(agr, cur[1].length) }, 0);
        return points.map(function (point) { return eval1(point, base, maxlen) });
        function eval1(point, base, maxlen) {
            var man = point[0];
            var pows = point[1];
            if (pows.length == 0 || pows.length < maxlen) return point;    //  2017.3 ==0
            var pow = pows.slice(-1)[0];    //  2017.3  [0]
            return [point[0].times(base.pow(pow)), pows.slice(0, -1)];
        }
    }
}
