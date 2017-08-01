
// Author:  Anthony John Ripa
// Date:    7/31/2017
// SparsePlaceValueRational: a datatype for representing base agnostic arithmetic via sparse numbers whose digits are rational

function sparseplacevaluerational(points) {
    if (!Array.isArray(points)) { console.trace(); alert("sparseplacevaluerational expects argument to be 2D array but found " + typeof points + points); }
    if (points.length > 0 && !Array.isArray(points[0])) alert("sparseplacevaluerational expects argument to be 2D array but found 1D array of " + typeof points[0]);
    if (points.length > 0 && !(points[0][1] instanceof wholeplacevalue))
        { var s = "SparsePVRational expects exponent to be wholeplacevalue not " + typeof points[0][1] + " " + JSON.stringify(points[0][1]); alert(s); throw new Error(s); } //  2017.7
    points = normal(points);
    points = trim(points);
    //points = points.map(function (x) { return [x[0], x[1].map(function (y) { return Math.round(y * 1000) / 1000 })] });
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
                //if (a[1].length > b[1].length) ret = -compare(b, a);
                //if (JSON.stringify(a[1]) == JSON.stringify(b[1])) ret = a[0].sub(b[0]).toreal();
                for (var i = 0; i < a[1].mantisa.length + b[1].mantisa.length ; i++) {
                    if (a[1].get(i).above(b[1].get(i))) return 1;
                    if (a[1].get(i).below(b[1].get(i))) return -1;
                }
                //for (i = a[1].mantisa.length; i < b[1].mantisa.length ; i++) {
                //    if (b[1].get(i).isneg()) ret = 1;
                //    if (b[1].get(i).ispos()) ret = -1;
                //}
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
            function arrayequal(a1, a2) {return a1.equals(a2);
                //if (a1.length > a2.length) return arrayequal(a2, a1);
                //for (var i = 0; i < a1.length; i++)
                //    if (!a1[i].equals(a2[i])) return false;
                //    //if (a1[i] != a2[i]) return false;
                //for (var i = a1.length; i < a2.length; i++)
                //    if (!a2[i].is0()) return false;
                //    //if (a2[i] != 0) return false;
                //return true;
            }
        }
    }
    function trim(points) {     //  2016.10
        for (var i = 0; i < points.length; i++) {
            if (points[i][0].is0()) points.splice(i--, 1);   //  2017.2  Add -- so i iterates right despite array modification
            else                //  2017.1
                while (points[i][1].length > 1 && points[i][1].slice(-1)[0].is0()) {
                    points[i][1].pop();
                }
        }
        if (points.length == 0) points = [[rational.parse(0), wholeplacevalue.parse(0)]];
        points = points.map(function (point) { return [point[0], point[1].length == 0 ? [rational.parse(0)] : point[1]] });
        return points;
    }
}

sparseplacevaluerational.parse = function (arg) {
    if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { var points = JSON.parse(arg).points; points = points.map(point => { var n = point[0]; var e = point[1]; return [rational.parse(JSON.stringify(n)), wholeplacevalue.parse(JSON.stringify(e))] }); return new sparseplacevaluerational(points); }   //  2017.7
    if (typeof arg == "number") return new sparseplacevaluerational([[rational.parse(arg), wholeplacevalue.parse(0)]]);
    if (arg instanceof Number) return new sparseplacevaluerational([[rational.parse(arg), [rational.parse(0)]]]);
    //var terms = arg.split('+');
    var terms = split(arg);
    terms = terms.map(parseterm);
    return new sparseplacevaluerational(terms);
    function split(terms) {         //  2017.1
        var ret = [];
        terms = terms.toUpperCase().replace(/\s*/g, '');
        if (terms.length == 0) return ret;
        //if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
        var num = rational.regex(); //  2017.6
        //var reg = new RegExp('[\+\-]' + num + '(E[\+\-]?' + num + ')?', 'g');
        var reg = new RegExp(num + '(E' + num + '(,' + num + ')*' + ')?', 'g');   //  2017.7
        var term;
        while (term = reg.exec(terms))
            ret.push(term[0]);
        return ret;
    }
    function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
        term = term.toUpperCase();
        if (term == 'INFINITY') return [rational.parse('1/0'), [rational.parse(0)]]; //  2017.2  0->[0]
        if (term == '-INFINITY') return [rational.parse('-1/0'), [rational.parse(0)]];
        var coefpow = term.split('E')
        var coef = coefpow[0];
        var pow = coefpow[1] || '0';
        var pows = pow.split(',')
        //if (!pows.length) pows = [0, 0];
        return [rational.parse(coef), new wholeplacevalue(pows.map(rational.parse))];   //  2017.7
    }
}

sparseplacevaluerational.prototype.get = function (i) { //  2017.7
    if (i instanceof Number || typeof (i) == 'number') i = wholeplacevalue.parse('(' + i + ')');
    for (var j = 0; j < this.points.length; j++)
        if (equalvectors(this.points[j][1], i)) return this.points[j][0];
    return rational.parse(0);
    function equalvectors(a, b) {return a.equals(b);
        //if (a.length != b.length) return false;
        //for (var i = 0; i < a.length; i++)
        //    if (!a[i].equals(b[i])) return false;
        //return true;
    }
}

sparseplacevaluerational.prototype.tohtml = function () {   // Replaces toStringInternal 2015.7
    var me = this.clone();                          // Reverse will mutate  2015.9
    return me.points.reverse().map(x => '[' + x[0].toString(true, true) + ', ' + x[1].toString() + ']').join();
}

sparseplacevaluerational.prototype.toString = function () {                             //  2016.12
    var ret = "";
    for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i);   //  Plus-delimited  2016.10
    return ret.substr(1).replace(/\+\-/g, '-');                                         //  +- becomes -    2017.1
}

sparseplacevaluerational.prototype.digit = function (i) {                       //  2017.2
    var digit = i < 0 ? rational.parse(0) : this.points[this.points.length - 1 - i];    //  R2L  2015.7
    var a = digit[0].toString(false, true);
    var b = digit[1];
    if (b.is0()) return a;             //  Every 2017.1
    return a + 'E' + b.mantisa.map(x=>x.toString(false,true));                 //  2017.7  map
}

sparseplacevaluerational.prototype.is0 = function () { return this.points.length == 0 || (this.points.length == 1 && this.points[0][0].is0()); }    //  2017.7
sparseplacevaluerational.prototype.is1 = function () { return this.points.length == 1 && this.points[0][0].is1() && this.points[0][1].is0(); }      //  2017.7

sparseplacevaluerational.prototype.add = function (other) { return new sparseplacevaluerational(this.points.concat(other.points)); }
sparseplacevaluerational.prototype.sub = function (other) { return this.add(other.negate()); }
sparseplacevaluerational.prototype.pointtimes = function (other) { return this.f(rational.prototype.times, other); }
sparseplacevaluerational.prototype.pointdivide = function (other) { return this.f(rational.prototype.divide, other); }
sparseplacevaluerational.prototype.pointsub = function (other) { return this.pointadd(other.negate()); }
sparseplacevaluerational.prototype.pointpow = function (other) { return this.f0(rational.prototype.pow, other); }   //  2017.7
sparseplacevaluerational.prototype.clone = function () { return new sparseplacevaluerational(this.points.slice(0)); }
sparseplacevaluerational.prototype.negate = function () { return new sparseplacevaluerational(this.points.map(function (x) { return [x[0].negate(), x[1]] })); }    //  2017.7
sparseplacevaluerational.prototype.transpose = function () { return new sparseplacevaluerational(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }
sparseplacevaluerational.prototype.round = function () { return new sparseplacevaluerational(this.points.filter(function (x) { return !x[1].isneg(); })) }  //  2017.6

sparseplacevaluerational.prototype.f = function (f, other) {    //  2017.7
    var ret = this.clone();
    for (var i = 0; i < ret.points.length; i++)
        ret.points[i][0] = f.call(ret.points[i][0], other.get(ret.points[i][1]));
    return ret.clone();
}

sparseplacevaluerational.prototype.f0 = function (f, other) {   //  2017.7
    var ret = this.clone();
    for (var i = 0; i < ret.points.length; i++)
        ret.points[i][0] = f.call(ret.points[i][0], other.get(0));
    return ret.clone();
}

sparseplacevaluerational.prototype.pointadd = function (addend) {
    var ret = this.clone().points;
    //var digit = rational.parse(0);
    //for (var i = 0; i < addend.points.length; i++) if (addend.points[i][1][0].is0() && addend.points[i][1][1].is0()) digit = addend.points[i][0];
    var digit = addend.get(0);  //  2017.7
    for (var i = 0; i < ret.length; i++) ret[i][0] = ret[i][0].add(digit);
    return new sparseplacevaluerational(ret);
}

sparseplacevaluerational.prototype.times = function (top) {
    var points = []
    for (var i = 0; i < this.points.length; i++)
        for (var j = 0; j < top.points.length; j++)
            if (!this.points[i][0].is0() && !top.points[j][0].is0()) points.push([this.points[i][0].times(top.points[j][0]), addvectors(this.points[i][1], top.points[j][1])]); // 2017.2 0*∞=0 for easy division
    return new sparseplacevaluerational(points);
    function addvectors(a, b) { return a.add(b); //  2017.1
        if (a.length > b.length) return addvectors(b, a);
        //var ret = []
        //for (var i = 0; i < a.length; i++)
        //    ret.push(a[i].add(b[i]));
        //for (i = a.length; i < b.length; i++)
        //    ret.push(b[i]);
        //return ret;
    }
}

sparseplacevaluerational.prototype.scale = function (scalar) {
    if (!(scalar instanceof rational)) scalar = rational.parse(scalar);
    var ret = this.clone();
    ret.points = ret.points.map(function (x) { return [x[0].times(scalar), x[1]]; });
    return ret;
}

sparseplacevaluerational.prototype.unscale = function (scalar) {  //  2016.5
    if (!(scalar instanceof rational)) scalar = rational.parse(scalar);
    var ret = this.clone();
    ret.points = ret.points.map(function (x) { return [x[0].divide(scalar), x[1]]; });
    //for (var r = 0; r < ret.mantisa.length; r++)
    //    ret.mantisa[r] = ret.mantisa[r].divide(scalar);
    return ret;
}

sparseplacevaluerational.prototype.divide = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevaluerational.parse(0);
        var n = num.points.slice(-1)[0];
        var d = den.points.slice(-1)[0];
        var quotient = new sparseplacevaluerational([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
        if (d[0].is0()) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { return a.sub(b);//  2017.1
        //if (a.length > b.length) return subvectors(b, a).map(function (x) { return x.negate(); });
        ////return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), math.multiply(b, -1));
        //var ret = []
        //for (var i = 0; i < a.length; i++)
        //    ret.push(a[i].sub(b[i]));
        //for (i = a.length; i < b.length; i++)
        //    ret.push(b[i].negate());
        //return ret;
    }
}

sparseplacevaluerational.prototype.remainder = function (den) {  //  2016.5
    return this.sub(this.divide(den).round().times(den));   //  2017.6  round
}

sparseplacevaluerational.prototype.divideleft = function (den) {    //  2016.10
    var num = this;
    var iter = 5//math.max(num.points.length, den.points.length);
    var quotient = divideh(num, den, iter);
    return quotient;
    function divideh(num, den, c) {
        if (c == 0) return sparseplacevaluerational.parse(0);
        var n = num.points[0];
        var d = den.points[0];
        var quotient = new sparseplacevaluerational([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
        if (d[0].is0()) return quotient;
        var remainder = num.sub(quotient.times(den))
        var q2 = divideh(remainder, den, c - 1);
        quotient = quotient.add(q2);
        return quotient;
    }
    function subvectors(a, b) { return a.sub(b);//  2017.1
        //if (a.length > b.length) return subvectors(b, a).map(function (x) { return x.negate(); });
        ////return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), math.multiply(b, -1));
        //var ret = []
        //for (var i = 0; i < a.length; i++)
        //    ret.push(a[i].sub(b[i]));
        //for (i = a.length; i < b.length; i++)
        //    ret.push(b[i].negate());
        //return ret;
    }
}

sparseplacevaluerational.prototype.dividemiddle = sparseplacevaluerational.prototype.divide

sparseplacevaluerational.prototype.pow = function (power) {        //  2016.11
    if (power instanceof rational) power = new sparseplacevaluerational([[power, wholeplacevalue.parse(0)]]);   //  2017.7
    if (!(power instanceof sparseplacevaluerational)) power = sparseplacevaluerational.parse('' + power);       //  2017.7
    if (power.points.length == 1 & power.points[0][1].is0()) {//alert(JSON.stringify(power.points[0][0] instanceof rational))
        var base = this.points[0];
        //if (this.points.length == 1) return new sparseplacevaluerational([[base[0].pow(power.points[0][0]), base[1].map(x=>x.times(power.points[0][0]))]]);
        //if (this.points.length == 1) return new sparseplacevaluerational([[base[0].pow(power.points[0][0]), new wholeplacevalue(base[1].mantisa.map(x=>x.times(power.points[0][0])))]]);
        if (this.points.length == 1) return new sparseplacevaluerational([[base[0].pow(power.points[0][0]), base[1].scale(power.points[0][0])]]);
        if (power.points[0][0].is0()) return sparseplacevaluerational.parse(1);
        if (power.points[0][0].isneg()) return sparseplacevaluerational.parse(1).divide(this.pow(new sparseplacevaluerational([[power.points[0][0].negate(), [rational.parse(0)]]])));
        if (power.points[0][0].isint()) return this.times(this.pow(power.sub(sparseplacevaluerational.parse(1))));
    }
    return sparseplacevaluerational.parse(0 / 0);
}

sparseplacevaluerational.prototype.gcd = function () {   // 2016.5
    var list = [];
    for (var i = 0; i < this.points.length; i++)
        list.push(this.points[i][0]);
    if (list.length == 0) return new rational(1);
    if (list.length == 1) return list[0].is0() ? new rational(1) : list[0];    //  Disallow 0 to be a GCD for expediency.  2016.5
    return list.reduce(function (x, y) { return x.gcd(y) }, new rational(0));
}

sparseplacevaluerational.prototype.eval = function (base) {
    if (base instanceof sparseplacevaluerational) base = base.points[0][0];
    return new sparseplacevaluerational(eval(this.points, base));
    function eval(points, base) {
        var maxlen = points.reduce(function (agr, cur) { return Math.max(agr, cur[1].mantisa.length) }, 0);
        return points.map(function (point) { return eval1(point, base, maxlen) });
        function eval1(point, base, maxlen) {
            var man = point[0];
            var pows = point[1];
            if (pows.mantisa.length < maxlen) return point;
            var pow = pows.mantisa.slice(-1);
            return [point[0].times(base.pow(new wholeplacevalue(pow))), new wholeplacevalue(pows.mantisa.slice(0, -1))];  //  2017.7
        }
    }
}
