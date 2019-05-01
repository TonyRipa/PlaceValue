
// Author:  Anthony John Ripa
// Date:    4/30/2019
// SparsePlaceValue: a datatype for representing base agnostic arithmetic via sparse numbers

//function sparseplacevalue(arg) {	//	2019.4	Removed
class sparseplacevalue {			//	2019.4	Added

	constructor(arg) {
		var points, datatype;
		if (arguments.length < 1)[points, datatype] = [[], rational];                                       //  2017.12
		if (arg === rational || arg === complex || arg === rationalcomplex)[points, datatype] = [[], arg];  //  2017.12
		if (Array.isArray(arg)) {                                                                           //  2017.12
			points = arg;
			if (points.length==0) throw new Error('notype');	//	2019.4	Added
			if (!Array.isArray(points)) { var s = 'sparseplacevalue expects argument to be 2D array but found ' + typeof points + " : " + JSON.stringify(points); alert(s); throw new Error(s); }
			if (points.length > 0 && !Array.isArray(points[0])) { var s = "sparseplacevalue expects arg to be 2D array not 1D array of " + typeof points[0]; alert(s); throw new Error(s); }    //  2017.12
			if (points.length > 0 && !(points[0][1] instanceof wholeplacevalue))
				{ var s = "sparseplacevalue expects exponent to be wholeplacevalue not " + typeof points[0][1] + " " + JSON.stringify(points[0][1]); alert(s); throw new Error(s); } //  2017.7
			datatype = (points.length > 0) ? points[0][0].constructor : rational;
		}
		this.datatype = datatype;
		points = normal(points);
		points = trim(this, points);
		this.points = points;
		this.check();
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
					return a[1].comparelittle(b[1]);											//	2019.4	Added
					//if (a[1].length > b[1].length) ret = -compare(b, a);
					//if (JSON.stringify(a[1]) == JSON.stringify(b[1])) ret = a[0].sub(b[0]).toreal();
					//for (var i = 0; i < a[1].mantisa.length + b[1].mantisa.length ; i++) {	//	2019.4	Removed
					//	if (a[1].get(i).above(b[1].get(i))) return 1;
					//	if (a[1].get(i).below(b[1].get(i))) return -1;
					//}
					//for (i = a[1].mantisa.length; i < b[1].mantisa.length ; i++) {
					//    if (b[1].get(i).isneg()) ret = 1;
					//    if (b[1].get(i).ispos()) ret = -1;
					//}
					//return 0;																	//	2019.4	Removed
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
				}
			}
		}
		function trim(me, points) {     //  2016.10
			for (var i = 0; i < points.length; i++) {
				if (points[i][0].is0()) points.splice(i--, 1);   //  2017.2  Add -- so i iterates right despite array modification
				else                //  2017.1
					while (points[i][1].length > 1 && points[i][1].slice(-1)[0].is0()) {
						points[i][1].pop();
					}
			}
			if (points.length == 0) points = [[new me.datatype(), new wholeplacevalue(me.datatype)]];
			points = points.map(function (point) { return [point[0], point[1].length == 0 ? [new me.datatype()] : point[1]] });
			return points;
		}
	}

	parse(arg) { //  2017.9
		this.check();
		var datatype = this.datatype;
		if (arg instanceof String || typeof (arg) == 'string') if (arg.indexOf('points') != -1) { var points = JSON.parse(arg).points; points = points.map(point => { var n = point[0]; var e = point[1]; return [new datatype().parse(JSON.stringify(n)), new wholeplacevalue(datatype).parse(JSON.stringify(e))] }); return new sparseplacevalue(points); }   //  2017.7
		if (typeof arg == "number") return new sparseplacevalue([[new datatype().parse(arg), new wholeplacevalue(datatype).parse(0)]]);	//	2018.11	WholePV(Datatype)
		if (arg instanceof Number) return new sparseplacevalue([[new datatype().parse(arg), [new datatype.parse(0)]]]);
		//var terms = arg.split('+');
		var terms = split(arg);
		terms = terms.map(parseterm);
		if (terms.length === 0) return new this.constructor(this.datatype); //  2019.4	Added
		return new sparseplacevalue(terms);
		function split(terms) {         //  2017.1
			var ret = [];
			terms = terms.toUpperCase().replace(/\s*/g, '');
			if (terms.length == 0) return ret;
			//if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
			var num = datatype.regex(); //  2017.6
			//var reg = new RegExp('[\+\-]' + num + '(E[\+\-]?' + num + ')?', 'g');
			var reg = new RegExp(num + '(E' + num + '(,' + num + ')*' + ')?', 'g');   //  2017.7
			var term;
			while (term = reg.exec(terms))
				ret.push(term[0]);
			return ret;
		}
		function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
			term = term.toUpperCase();
			if (term == 'INFINITY') return [new datatype().parse('1/0'), [new datatype().parse(0)]]; //  2017.2  0->[0]
			if (term == '-INFINITY') return [new datatype().parse('-1/0'), [new datatype().parse(0)]];
			var coefpow = term.split('E')
			var coef = coefpow[0];
			var pow = coefpow[1] || '0';
			//var pows = pow.split(',')						//	2018.11	Removed
			var pows = splitbyunparenthesizedcomma(pow);	//	2018.11	Added
			//if (!pows.length) pows = [0, 0];
			pows = pows.map(x=>new datatype().parse(x));
			return [new datatype().parse(coef), new wholeplacevalue(pows)];   //  2017.7
			function splitbyunparenthesizedcomma(csv) {		//	2018.11	Added
				var arr = csv.split(',');
				merge(arr);
				return arr;
				function merge(arr) {
					for(let i = 1; i<arr.length; i++) {
						if(arr[i-1].includes('(') && arr[i].includes(')')) {
							arr[i-1] = arr[i-1] + ',' + arr[i];
							arr.splice(i,1)
						}
					}
				}
			}
		}
	}

	check(other) {	//	2018.12	Added Type-Checker
		if (!(this instanceof sparseplacevalue)) throw new Error("Sparseplacevalue.prototype.Check 1 Fail : This isn't SparsePlaceValue");
		var translate = x => x == rational ? 'rational' : x == complex ? 'complex' : x == rationalcomplex ? 'rationalcomplex' : 'other';
		if (arguments.length === 0) {
			var datatype = this.datatype;
			if (!(this.points.every(x=>{var c=x[0];return c instanceof datatype})))
				throw new Error('Sparseplacevalue.prototype.Check 1 Fail : Not all coefs in ' + JSON.stringify(this.points) + ' are of type ' + translate(datatype));
			if (!(this.points.every(x=>{var w=x[1];return w.check()==datatype})))
				throw new Error('Sparseplacevalue.prototype.Check 1 Fail : Not all power in ' + JSON.stringify(this.points) + ' are of type ' + translate(datatype));
			return datatype;
		}
		if (!(other instanceof sparseplacevalue)) throw new Error("Sparseplacevalue.prototype.Check 2 Fail : Other isn't SparsePlaceValue");
		var othertype = other.check();
		var mytype = this.check();
		if (mytype != othertype) {
			throw new Error('Sparseplacevalue.prototype.Check 2 Fail : Othertype is of type ' + translate(othertype) + ', but ThisType is ' + translate(mytype));
		}
		return mytype;
	}

	get(i) { //  2017.7
		this.check();
		if (i instanceof Number || typeof (i) == 'number') i = new wholeplacevalue(this.datatype).parse('(' + i + ')');
		if (Array.isArray(i)) i = new wholeplacevalue(i);   //  2017.9
		for (var j = 0; j < this.points.length; j++)
			if (equalvectors(this.points[j][1], i)) return this.points[j][0];
		return new this.datatype().parse(0);
		function equalvectors(a, b) {return a.equals(b);
			//if (a.length != b.length) return false;
			//for (var i = 0; i < a.length; i++)
			//    if (!a[i].equals(b[i])) return false;
			//return true;
		}
	}

	tohtml() {   // Replaces toStringInternal 2015.7
		this.check();
		var me = this.clone();                          // Reverse will mutate  2015.9
		return me.points.reverse().map(x => '[' + x[0].toString(true, true) + ', ' + x[1].toString() + ']').join();
	}

	toString() {                             //  2016.12
		this.check();
		var ret = "";
		for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i);   //  Plus-delimited  2016.10
		return ret.substr(1).replace(/\+\-/g, '-');                                         //  +- becomes -    2017.1
	}

	digit(i) {                       //  2017.2
		this.check();
		var digit = i < 0 ? new this.datatype.parse(0) : this.points[this.points.length - 1 - i];    //  R2L  2015.7
		var a = digit[0].toString(false, true);
		var b = digit[1];
		if (b.is0()) return a;             //  Every 2017.1
		return a + 'E' + b.mantisa.map(x=>x.toString(false,true));                 //  2017.7  map
	}

	is0() { this.check(); return this.points.length == 0 || (this.points.length == 1 && this.points[0][0].is0()); }    //  2017.7
	is1() { this.check(); return this.points.length == 1 && this.points[0][0].is1() && this.points[0][1].is0(); }      //  2017.7

	add(other) { this.check(other); return new sparseplacevalue(this.points.concat(other.points)); }
	sub(other) { this.check(other); return this.add(other.negate()); }
	pointtimes(other) { this.check(other); return this.f(this.datatype.prototype.times, other); }
	pointdivide(other) { this.check(other); return this.f(this.datatype.prototype.divide, other); }
	pointsub(other) { this.check(other); return this.pointadd(other.negate()); }
	pointpow(other) { this.check(other); return this.f0(this.datatype.prototype.pow, other); }   //  2017.7
	clone() { this.check(); return new sparseplacevalue(this.points.slice(0)); }
	negate() { this.check(); return new sparseplacevalue(this.points.map(function (x) { return [x[0].negate(), x[1]] })); }    //  2017.7
	transpose() { this.check(); return new sparseplacevalue(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }
	//round() { this.check(); return new sparseplacevalue(this.points.filter(function (x) { return !x[1].isneg(); })) }  //  2017.6		//	2019.4	Removed
	round() { this.check(); var a = this.points.filter(x=>!x[1].isneg()); return new sparseplacevalue(a.length ? a : this.datatype) }	//	2019.4	Added

	f(f, other) {    //  2017.7
		this.check(other);
		var ret = this.clone();
		for (var i = 0; i < ret.points.length; i++)
			ret.points[i][0] = f.call(ret.points[i][0], other.get(ret.points[i][1]));
		return ret.clone();
	}

	f0(f, other) {   //  2017.7
		this.check(other);
		var ret = this.clone();
		for (var i = 0; i < ret.points.length; i++)
			ret.points[i][0] = f.call(ret.points[i][0], other.get(0));
		return ret.clone();
	}

	pointadd(addend) {
		this.check(addend);
		var ret = this.clone().points;
		//var digit = rational.parse(0);
		//for (var i = 0; i < addend.points.length; i++) if (addend.points[i][1][0].is0() && addend.points[i][1][1].is0()) digit = addend.points[i][0];
		var digit = addend.get(0);  //  2017.7
		for (var i = 0; i < ret.length; i++) ret[i][0] = ret[i][0].add(digit);
		return new sparseplacevalue(ret);
	}

	times(top) {
		this.check(top);
		var points = [];
		for (var i = 0; i < this.points.length; i++)
			for (var j = 0; j < top.points.length; j++)
				if (!this.points[i][0].is0() && !top.points[j][0].is0()) points.push([this.points[i][0].times(top.points[j][0]), addvectors(this.points[i][1], top.points[j][1])]); // 2017.2 0*∞=0 for easy division
		if (points.length == 0) return new sparseplacevalue(this.datatype);	//	2018.12
		return new sparseplacevalue(points);
		function addvectors(a, b) { return a.add(b); //  2017.1
		}
	}

	scale(scalar) {//alert(JSON.stringify(['scale',scalar]))
		this.check();
		if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);//alert(JSON.stringify(['scale',scalar]))
		var ret = this.clone();
		ret.points = ret.points.map(function (x) { return [x[0].times(scalar), x[1]]; });
		return ret;
	}

	unscale(scalar) {  //  2016.5
		this.check();
		if (!(scalar instanceof this.datatype)) scalar = new this.datatype().parse(scalar);	//	2019.2	datatype()
		var ret = this.clone();
		ret.points = ret.points.map(function (x) { return [x[0].divide(scalar), x[1]]; });
		//for (var r = 0; r < ret.mantisa.length; r++)
		//    ret.mantisa[r] = ret.mantisa[r].divide(scalar);
		return ret;
	}

	divide(den) {    //  2016.10
		this.check(den);
		var num = this;
		var iter = 5//math.max(num.points.length, den.points.length);
		var quotient = divideh(num, den, iter);
		return quotient;
		function divideh(num, den, c) {
			num.check(den);
			if (c == 0) return new sparseplacevalue(num.datatype).parse(0);	//	2018.12	num.datatype
			var n = num.points.slice(-1)[0];
			var d = den.points.slice(-1)[0];
			var quotient = new sparseplacevalue([[n[0].divide(d[0]), n[1].sub(d[1])]]);		//	2018.12	sub
			if (d[0].is0()) return quotient;
			var remainder = num.sub(quotient.times(den))
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
		}
		//function subvectors(a, b) { return a.sub(b);//  2017.1	//	2018.12	Removed
		//	//if (a.length > b.length) return subvectors(b, a).map(function (x) { return x.negate(); });
		//	////return math.add(a.concat(math.zeros(b.length - a.length).valueOf()), math.multiply(b, -1));
		//	//var ret = []
		//	//for (var i = 0; i < a.length; i++)
		//	//    ret.push(a[i].sub(b[i]));
		//	//for (i = a.length; i < b.length; i++)
		//	//    ret.push(b[i].negate());
		//	//return ret;
		//}
	}

	remainder(den) {	//	2016.5
		this.check(den);
		return this.sub(this.divide(den).round().times(den));	//	2017.6	round
	}

	divideleft(den) {    //  2016.10
		this.check(den);
		var num = this;
		var iter = 5//math.max(num.points.length, den.points.length);
		var quotient = divideh(num, den, iter);
		return quotient;
		function divideh(num, den, c) {
			num.check(den);
			if (c == 0) return new sparseplacevalue(num.datatype).parse(0);	//	2018.12	num.datatype
			var n = num.points[0];
			var d = den.points[0];
			var quotient = new sparseplacevalue([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);     //  Works even for non-truncating division  2016.10
			if (d[0].is0()) return quotient;
			var remainder = num.sub(quotient.times(den))
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
		}
		function subvectors(a, b) { return a.sub(b);//  2017.1
		}
	}

	dividemiddle(den) { return this.divide(den); }

	pow(power) {        //  2016.11
		if (power instanceof this.datatype) power = new sparseplacevalue([[power, new wholeplacevalue(this.datatype).parse(0)]]);   //  2017.7
		if (!(power instanceof sparseplacevalue)) power = new sparseplacevalue(this.datatype).parse('' + power);       //  2017.7
		this.check(power);
		if (power.points.length == 1 & power.points[0][1].is0()) {//alert(JSON.stringify(power.points[0][0] instanceof rational))
			var base = this.points[0];
			//if (this.points.length == 1) return new sparseplacevalue([[base[0].pow(power.points[0][0]), base[1].map(x=>x.times(power.points[0][0]))]]);
			//if (this.points.length == 1) return new sparseplacevalue([[base[0].pow(power.points[0][0]), new wholeplacevalue(base[1].mantisa.map(x=>x.times(power.points[0][0])))]]);
			if (this.points.length == 1) return new sparseplacevalue([[base[0].pow(power.points[0][0]), base[1].scale(power.points[0][0])]]);
			if (power.points[0][0].is0()) return new sparseplacevalue(this.datatype).parse(1);
			if (power.points[0][0].isneg()) return new sparseplacevalue(this.datatype).parse(1).divide(this.pow(new sparseplacevalue([[power.points[0][0].negate(), new wholeplacevalue(this.datatype)]])));
			if (power.points[0][0].isint()) return this.times(this.pow(power.sub(new sparseplacevalue(this.datatype).parse(1))));
		}
		if (this.points.length == 1) {  //  2017.9
			var powe = power.clone();
			for (var i = 0; i < powe.points.length; i++) {
				var term = powe.points[i]
				var coef = term[0];
				//if (term[1].length == 0 || JSON.stringify(term[1]) == '[{"r":0,"i":0}]') { term[0] = complex.parse(2.718).pow(term[0]); continue; }
				if (term[1].is0()) { term[0] = new this.datatype().parse(2.718).pow(term[0]); continue; }
				//term[1] = term[1].map(x => x.times(coef))
				term[1] = term[1].scale(coef);
				term[0] = new this.datatype().parse(1);
			}
			//alert(JSON.stringify(powe))
			var ret = powe.points.reduce((acc, cur) => acc.times(new sparseplacevalue([cur])), this.parse(1));	//	2018.11 this.parse
			return ret;
		}
		return this.parse(0 / 0);	//	2018.11	this.parse
	}

	gcd() {   // 2016.5
		this.check();
		var list = [];
		for (var i = 0; i < this.points.length; i++)
			list.push(this.points[i][0]);
		if (list.length == 0) return new this.datatype().parse('1');
		if (list.length == 1) return list[0].is0() ? new this.datatype().parse('1') : list[0];    //  Disallow 0 to be a GCD for expediency.  2016.5
		return list.reduce(function (x, y) { return x.gcd(y) }, new this.datatype().parse('0'));
	}

	eval(base) {
		var mytype = this.check();	//	2018.12
		if (base instanceof sparseplacevalue) base = base.points[0][0];
		return new sparseplacevalue(eva(this.points, base));	//	2019.4	eva
		function eva(points, base) {							//	2019.4	Renamed because 'eval' can't be defined or assigned to in strict mode code
			var maxlen = points.reduce(function (agr, cur) { return Math.max(agr, cur[1].mantisa.length) }, 0);
			return points.map(function (point) { return eval1(point, base, maxlen) });
			function eval1(point, base, maxlen) {
				var man = point[0];
				var pows = point[1];
				if (pows.mantisa.length < maxlen) return point;
				var pow = pows.mantisa.slice(-1);
				//return [point[0].times(base.pow(new wholeplacevalue(pow))), new wholeplacevalue(pows.mantisa.slice(0, -1))];  //  2017.7
				pows = pows.mantisa.slice(0, -1);	//	2018.12
				if (pows.length == 0) return [point[0].times(base.pow(pow[0])), new wholeplacevalue(mytype)];  //  2018.12
				return [point[0].times(base.pow(pow[0])), new wholeplacevalue(pows)];  //  2017.12
			}
		}
	}

}
