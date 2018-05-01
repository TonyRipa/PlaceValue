
// Author:  Anthony John Ripa
// Date:    4/30/2018
// SparsePlaceValue1: a 1-D datatype for representing base-agnostic arithmetic via sparse numbers

class sparseplacevalue1 {

    constructor(arg) {
        var points, datatype;
        if (arguments.length == 0)[points, datatype] = [[], rational];                                          //  2017.10
        if (arguments.length == 1) {                                                                            //  2018.4
            if (arg === rational || arg === complex || arg === rationalcomplex)[points, datatype] = [[], arg];  //  2017.10
            if (Array.isArray(arg)) {                                                                           //  2017.10
                points = arg;
                if (!Array.isArray(points)) { console.trace(); alert("sparseplacevalue1 expects argument to be 2D array but found " + typeof points + points); }
                if (points.length > 0 && !Array.isArray(points[0])) alert("sparseplacevalue1 expects argument to be 2D array but found 1D array of " + typeof points[0]);
                datatype = (points.length > 0) ? points[0][0].constructor : rational;
            }
        }
        if (arguments.length == 2)[points, datatype] = arguments;                                               //  2018.4
        this.datatype = datatype;
        points = normal(points);
        points = trim(this, points);
        this.points = points;
        function normal(points) {//alert(JSON.stringify(points))
            var list = points.map(function (x) { return x.slice(0) });
            sort(list);
            combineliketerms(list);
            return list;
            function sort(list) {
                for (var i = 0; i < list.length; i++)
                    for (var j = 0; j < list.length; j++)
                        if (list[i][1].below(list[j][1])) {
                            var temp = list[i];     //  Swap list[i] with list[j]. Not list[i][1] with list[j][1].  2016.10
                            list[i] = list[j];
                            list[j] = temp;
                        }
            }
            function combineliketerms(list) {
                var i = list.length - 1;
                while (i > 0)
                    if (list[i][1].equals(list[i - 1][1])) {
                        list[i][0] = list[i][0].add(list[i - 1][0]);
                        list.splice(i - 1, 1);
                        i--;
                    } else i--;
            }
        }
        function trim(me, points) {     //  2016.10
            for (var i = points.length - 1; i >= 0; i--)    //  2017.6  countdown because modifying array thats being iterated over
                if (points[i][0].is0()) points.splice(i, 1);
            if (points.length == 0) points = [[new me.datatype(), new me.datatype()]];  //  2017.11 rid .parse(0)
            return points;
        }
    }

    parse(arg) {    //  2017.9
        var me = this;
        if (arg === '') return new this.constructor(this.datatype);                                                                 //  2017.10
        if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1)
            return new this.constructor(JSON.parse(arg).points.map(x => x.map(JSON.stringify).map(new this.datatype().parse)));     //  2017.10
        if (typeof arg == "number") return new this.constructor([[new this.datatype().parse(arg), new this.datatype()]]);           //  2d array    2016.10
        if (arg instanceof Number) return new this.constructor(arg, 0);
        //alert('b4split ' + arg)
        var terms = split(arg);
        terms = terms.map(parseterm);
        //alert('terms.length = ' + terms.length)
        if (terms.length === 0) return new this.constructor(this.datatype); //  2017.11
        return new this.constructor(terms);
        function split(terms) {         //  2017.1
            var ret = [];
            terms = terms.toUpperCase().replace(/\s*/g, '');
            if (terms.length == 0) return ret;
            if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
            var num = me.datatype.regex(); //  2017.6
            var reg = new RegExp('[\+\-]' + num + '(E[\+\-]?' + num + ')?', 'g');
            //var reg = new RegExp(num + 'E' + num, 'g');
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
            if (pow === undefined) pow = 0;
            return [new me.datatype().parse(coef), pow ? new me.datatype().parse(pow) : new me.datatype()];
        }
    }

    get(i) { //  2017.6
        if (i instanceof Number || typeof (i) == 'number') i = new this.datatype().parse(i);
        for (var j = 0; j < this.points.length; j++)
            if (this.points[j][1].equals(i)) return this.points[j][0];
        return new this.datatype();
    }

    tohtml() {  // Replaces toStringInternal 2015.7
        var me = this.clone();                          // Reverse will mutate  2015.9
        //return JSON.stringify(me.points.reverse());
        return me.points.reverse().map(x=>'[' + x + ']').join(',');
    }

    toString(sTag) {                                 //  sTag    2015.11
        var ret = "";
        for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i, sTag);     //  Plus-delimited  2016.10
        return ret.substr(1).replace(/\+\-/g, '-');                                         //  +- becomes -    2017.1
    }

    digit(i, sTag, long) {                           //  sTag    2015.11
        if (sTag) return this.digitpair(i, '<s>', '</s>', true, long);
        return this.digitpair(i, '', String.fromCharCode(822), false, long);
    }

    digitpair(i, NEGBEG, NEGEND, fraction, long) {  // 2015.12
        // 185  189  822 8315   9321
        // ^1   1/2  -   ^-     10
        var digit = i < 0 ? 0 : this.points[this.points.length - 1 - i]; // R2L  2015.7
        var coef = digit[0];
        var pow = digit[1];
        var a = coef.toString(false, true); //  2017.6  long
        var b = pow.toString(false, true);  //  2017.6  long
        if (-.01 < pow && pow < .01) return a
        return a + 'E' + b;     //  E-notation  2016.10
    }

    isconst() { return this.points.length == 0 || (this.points.length == 1 && this.points[0][1].is0()); }   //  2017.6
    is1term() { return this.points.length == 1; }                                                           //  2017.6
    is0() { return this.points.length == 0 || this.points[0][0].is0(); }                                    //  2017.6
    is1() { return this.is1term() && this.isconst() && this.points[0][0].is1(); }                           //  2017.6
    isNaN() { return this.is1term() && this.isconst() && this.points[0][0].isNaN(); }                       //  2018.3
    equals(other) { return this.sub(other).is0(); }                                                         //  2017.8

    add(other) { return new this.constructor(this.points.concat(other.points)); }
    sub(other) { return new this.constructor(this.points.concat(other.points.map(function (x) { return [x[0].negate(), x[1]] }))); }
    pointadd(other) { return this.f0(this.datatype.prototype.add, other); }       //  2017.6
    pointsub(other) { return this.f0(this.datatype.prototype.sub, other); }       //  2017.6
    pointtimes(other) { return this.f(this.datatype.prototype.times, other); }    //  2017.6
    pointdivide(other) { return this.f(this.datatype.prototype.divide, other); }  //  2017.6
    pointpow(other) { return this.f0(this.datatype.prototype.pow, other); }       //  2017.6
    clone() { return new this.constructor(this.points.slice()) }
    negate() { return this.parse(0).sub(this); }                                    //  2017.10
    round() { return new this.constructor(this.points.filter(function (x) { return !x[1].isneg(); }), this.datatype) }  //  2018.4

    f(f, other) {  //  2017.6
        var ret = this.clone();
        for (var i = 0; i < ret.points.length; i++)
            ret.points[i][0] = f.call(ret.points[i][0], other.get(ret.points[i][1]));
        return ret.clone();
    }

    f0(f, other) {  //  2017.6
        var ret = this.clone();
        for (var i = 0; i < ret.points.length; i++)
            ret.points[i][0] = f.call(ret.points[i][0], other.get(0));
        return ret.clone();
    }

    times(top) {
        if (this.datatype != top.datatype) { var s = 'SparsePV1.times mixed digit types: ' + this.datatype.toString().slice(9, 20) + " & " + top.datatype.toString().slice(9, 20); alert(s); throw new Error(s); }  //  2018.4
        var points = []
        for (var i = 0; i < this.points.length; i++)
            for (var j = 0; j < top.points.length; j++)
                points.push([this.points[i][0].times(top.points[j][0]), this.points[i][1].add(top.points[j][1])]);
        return new this.constructor(points);
    }

    scale(scalar) {
        if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);
        var ret = this.clone();
        ret.points = ret.points.map(function (x) { return [x[0].times(scalar), x[1]]; });
        return ret;
    }

    unscale(scalar) {  //  2016.5
        if (!(scalar instanceof this.datatype)) scalar = (new this.datatype).parse(scalar);
        var ret = this.clone();
        ret.points = ret.points.map(function (x) { return [x[0].divide(scalar), x[1]]; });
        return ret;
    }

    divide(den) {       //  2016.10
        var num = this;
        var iter = 5//math.max(num.points.length, den.points.length);
        var quotient = divideh(num, den, iter);
        return quotient;
        function divideh(num, den, c) {
            //if (c == 0) return new num.constructor().parse(0);
            if (c == 0) return new num.constructor(num.datatype);  //  2017.10
            var n = num.points.slice(-1)[0];
            var d = den.points.slice(-1)[0];
            var quotient = new num.constructor([[n[0].divide(d[0]), n[1].sub(d[1])]]);     //  Works even for non-truncating division  2016.10
            //if (d.val == 0) return quotient;
            var remainder = num.sub(quotient.times(den))
            var q2 = divideh(remainder, den, c - 1);
            quotient = quotient.add(q2);
            return quotient;
        }
    }

    remainder(den) {  //  2016.5
        if (this.datatype != den.datatype) { var s = 'SparsePV1.remainder mixed digit types: ' + this.datatype.toString().slice(9, 20) + " & " + den.datatype.toString().slice(9, 20); alert(s); throw new Error(s); }  //  2018.4
        return this.sub(this.divide(den).round().times(den));   //  2017.6  round
    }

    divideleft(den) {   //  2017.1
        var num = this;
        var iter = math.max(num.points.length, den.points.length);
        var quotient = divideh(num, den, iter);
        return quotient;
        function divideh(num, den, c) {
            //if (c == 0) return new num.constructor().parse(0);
            if (c == 0) return new num.constructor(num.datatype);  //  2017.10
            var n = num.points[0];
            var d = den.points[0];
            var quotient = new num.constructor([[n[0].divide(d[0]), n[1].sub(d[1])]]);     //  Works even for non-truncating division  2016.10
            //if (d.val == 0) return quotient;
            var remainder = num.sub(quotient.times(den))
            var q2 = divideh(remainder, den, c - 1);
            quotient = quotient.add(q2);
            return quotient;
        }
    }

    dividemiddle(den) { return this.divide(den); }

    pow(power) {     //  2016.10
        if (typeof power === 'number') power = (new this.datatype).parse(power);    //  2017.10
        if (power instanceof this.datatype) power = new this.constructor([[power, (new this.datatype).parse(0)]]);
        if (!(power instanceof this.constructor)) power = this.parse('' + power);   // 2017.6
        //alert(JSON.stringify(power))
        if (power.points.length == 1 & power.points[0][1].is0()) {
            //alert(0)
            if (this.is1term()) return new this.constructor([[this.points[0][0].pow(power.points[0][0]), this.points[0][1].times(power.points[0][0])]]);
            if (power.is0()) return this.parse(1);
            if (power.points[0][0].isneg()) return this.parse(1).divide(this.pow(new this.constructor([[power.points[0][0].negate(), this.datatype.parse(0)]])));
            //if (power.points[0][0].equals(power.points[0][0].round())) return this.times(this.pow(power.sub(this.constructor.parse(1))));
            if (power.points[0][0].isint()) return this.times(this.pow(power.sub(this.parse(1))));
            //return this.times(this.pow(power.sub(this.constructor.parse(1))));
        } else if (this.points.length == 1) {
            //alert(1)
            if (!this.points[0][1].is0()) { alert('PV >Bad Exponent = ' + power.toString() + ' Base = ' + base.toString()); return this.parse('%') }
            var man = this.get(0).pow(power.get(0));   //  2017.8
            var exp = power.get(1);        //  2017.8  2^(3E1)=1E3
            return new this.constructor([[man, exp]]);
        }
        if (this.is0()) return this.parse(0);
        if (this.is1()) return this.parse(1);
        return this.parse(0 / 0);
    }

    gcd() {   // 2016.5
        var list = [];
        for (var i = 0; i < this.points.length; i++)
            list.push(this.points[i][0]);
        if (list.length == 0) return new this.datatype(1);
        if (list.length == 1) return list[0].is0() ? new this.datatype().parse(1) : list[0];    //  2017.12 parse   2016.5 Disallow 0 to be a GCD for expediency
        return list.reduce(function (x, y) { return x.gcd(y) }, new this.datatype());           //  2018.2 Removed 0
    }

    eval(base) {
        var sum = new this.datatype();
        for (var i = 0; i < this.points.length; i++) {
            sum = sum.add(this.points[i][0].times(base.points[0][0].pow(this.points[i][1])));  //  base.points[0][0]   2016.10
        }
        return new this.constructor([[sum, new this.datatype()]]);
    }

}

