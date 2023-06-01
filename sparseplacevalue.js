
// Author:  Anthony John Ripa
// Date:    5/31/2023
// SparsePlaceValue: a datatype for representing base-agnostic arithmetic via sparse numbers

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
		var terms = split(arg);
		terms = terms.map(parseterm);
		if (terms.length === 0) return new this.constructor(this.datatype); //  2019.4	Added
		return new sparseplacevalue(terms);
		function split(terms) {         //  2017.1
			var ret = [];
			//terms = terms.toUpperCase().replace(/\s*/g, '');	//	-2020.5
			terms = terms.replace(/\s*/g, '');					//	+2020.5
			if (terms.length == 0) return ret;
			if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;							//	2020.1	Added
			var num = datatype.regex(); //  2017.6
			//var reg = new RegExp(num + '(E' + num + '(,' + num + ')*' + ')?', 'g');	//	2017.7	//	2020.1	Removed
			var reg = new RegExp('[\+\-]' + num + '(E' + num + '(,' + num + ')*' + ')?', 'g');		//	2020.1	Added
			var term;
			while (term = reg.exec(terms))
				ret.push(term[0]);
			return ret;
		}
		function parseterm(term) {      //  Parse a scientific notation (E-notation) expression   2016.10
			if (term == '+e') return [new datatype().parse('e'), new wholeplacevalue(datatype)];		//	+2020.5
			term = term.toUpperCase();
			if (term == 'INFINITY') return [new datatype().parse('1/0'), [new datatype().parse(0)]]; //  2017.2  0->[0]
			if (term == '-INFINITY') return [new datatype().parse('-1/0'), [new datatype().parse(0)]];
			var coefpow = term.split('E')
			var coef = coefpow[0];
			var pow = coefpow[1] || '0';
			var pows = splitbyunparenthesizedcomma(pow);	//	2018.11	Added
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

	len() {		//	+2021.5
		this.check();
		return this.points.length;
	}

	map(f) {	//	+2021.5
		this.check();
		return this.points.map(f);
	}

	point() {	//	+2021.5
		this.check();
		if (this.len() != 1)
			{ var s = "SparsePlaceValue.point() : len!=1 : " + JSON.stringify(points); alert(s); throw new Error(s); }
		return this.points[0];
	}

	get(i) { //  2017.7
		this.check();
		if (i instanceof Number || typeof (i) == 'number') i = new wholeplacevalue(this.datatype).parse('(' + i + ')');
		if (Array.isArray(i)) i = new wholeplacevalue(i);   //  2017.9
		for (var j = 0; j < this.points.length; j++)
			if (equalvectors(this.points[j][1], i)) return this.points[j][0];
		return new this.datatype().parse(0);
		function equalvectors(a, b) {return a.equals(b);
		}
	}

	tohtml() {   // Replaces toStringInternal 2015.7
		this.check();
		var me = this.clone();                          // Reverse will mutate  2015.9
		//return me.points.reverse().map(x => '[' + x[0].toString(true, true) + ', ' + x[1].toString() + ']').join();	//	-2020.5
		return me.points.reverse().map(x => '[' + x[0].toString(true) + ', ' + x[1].toString() + ']').join();			//	+2020.5
	}

	toString() {                             //  2016.12
		this.check();
		var ret = "";
		for (var i = 0 ; i < this.points.length; i++) ret += '+' + this.digit(i);   //  Plus-delimited  2016.10
		return ret.substr(1).replace(/\+\-/g, '-');                                         //  +- becomes -    2017.1
	}

	tosvg(dim) {							//	+2020.8
		if (dim==1) return tosvg1.bind(this)();
		if (dim==2) return tosvg2.bind(this)();
		if (this.points.some(coefpow=>coefpow[1].mantisa.length>1)) return tosvg2.bind(this)();
		return tosvg1.bind(this)();
		function tosvg1() {
			var ret = '';
			for (var [coef,power] of this.points) {
				var color = 200;
				var x = power.get(0).toreal();
			if (coef.toreal() >= 0)						//	+2021.10
				for (let i = 0; i<coef.toreal(); i++) {
					var h = (i+1>coef.toreal()) ? coef.toreal()-i : 1;
					ret += `<rect width="50" height="${50*h}" x="${50*x}" y="${50*i}" fill='rgb(${color},${color},${color})'/>`;
				}
			else
				for (let i = 0; i<-coef.toreal(); i++) {
					var h = (i+1>-coef.toreal()) ? -coef.toreal()-i : 1;
					ret += `<rect width="50" height="${50*h}" x="${50*x}" y="${-50*(i+1)}" fill='rgb(${color},${color},${color})'/>`;
				}
			}
			//var w = (1+math.max(this.points.map(point=>point[1].get(0).toreal())))*50;	//	-2021.10
			//var h = (math.max(1,this.points.map(point=>point[0].toreal())))*50;			//	-2021.10
			//var x1 = (math.min(0,this.points.map(point=>point[1].get(0).toreal())))*50;	//	+2021.10	//	-2022.8
			//var x2 = (math.max(0,this.points.map(point=>point[1].get(0).toreal()+1)))*50;	//	+2021.10	//	-2022.8
			//var y1 = (math.min(0,this.points.map(point=>point[0].toreal()))) * 50;		//	+2021.10	//	-2022.8
			//var y2 = (math.max(0,this.points.map(point=>point[0].toreal()))) * 50;		//	+2021.10	//	-2022.8
			var x1 = (math.min(0,...this.points.map(point=>point[1].get(0).toreal())))*50;					//	+2022.8
			var x2 = (math.max(0,...this.points.map(point=>point[1].get(0).toreal()+1)))*50;				//	+2022.8
			var y1 = (math.min(0,...this.points.map(point=>point[0].toreal()))) * 50;						//	+2022.8
			var y2 = (math.max(0,...this.points.map(point=>point[0].toreal()))) * 50;						//	+2022.8
			ret += `<line x1="${x1}" x2="${x2}" y1="0" y2="0" stroke='black' />`;			//	+2021.10
			ret += `<line y1="${y1}" y2="${y2}" x1="0" x2="0" stroke='black' />`;			//	+2021.10
			//return `<svg style='border:thin solid black' transform="scale(1,-1)" height='100px' viewbox='0 0 ${w} ${h}'><g stroke='#789'>${ret}</g></sgv>`	//	-2021.10
			return `<svg transform="scale(1,-1)" height='100px' viewbox='${x1} ${y1} ${x2-x1} ${y2-y1}'><g stroke='#789'>${ret}</g></sgv>`;						//	+2021.10
		}
		//function tosvg2() {							//	+2020.6	//	-2022.10
		//	var ret = '';
		//	for (var [coef,power] of this.points) {
		//		var color = 256*(1-coef.toreal());
		//		var x = power.get(0);
		//		var y = power.get(1);
		//		ret += `<rect width="50" height="50" x="${50*x}" y="${50*y}" fill='rgb(${color},${color},${color})'/>`;
		//	}
		//	return `<svg width='${(1+math.max(this.points.map(point=>point[1].get(0).toreal())))*50}' height='${(1+math.max(this.points.map(point=>point[1].get(1).toreal())))*50}'><g stroke='#789'>${ret}</g></sgv>`
		//}
		function tosvg2() {											//	+2022.10
			var ret = '';
			for (var [coef,power] of this.points) {
				var color = 256*(1-coef.toreal());
				var x = power.get(0).toreal();
				var y = power.get(1).toreal();
				ret += `<rect width="50" height="50" x="${50*x}" y="${50*y}" fill='rgb(${color},${color},${color})'/>`;
			}
			let maxx = math.max(this.points.map(point=>point[1].get(0).toreal()));
			let minx = math.min(this.points.map(point=>point[1].get(0).toreal()));
			let maxy = math.max(this.points.map(point=>point[1].get(1).toreal()));
			let miny = math.min(this.points.map(point=>point[1].get(1).toreal()));
			let width  = 1+maxx-minx;
			let height = 1+maxy-miny;
			return `<svg width='${width*50}' height='${height*50}' viewbox='${minx*50} ${miny*50} ${width*50} ${height*50}'><g stroke='#789'>${ret}</g></sgv>`
		}
	}

	digit(i) {                       //  2017.2
		this.check();
		var digit = i < 0 ? new this.datatype.parse(0) : this.points[this.points.length - 1 - i];    //  R2L  2015.7
		//var a = digit[0].toString(false, true);	//	-2020.5
		var a = digit[0].toString(false);			//	+2020.5
		var b = digit[1];
		if (b.is0()) return a;             //  Every 2017.1
		return a + 'E' + b.mantisa.map(x=>x.toString(false,true));                 //  2017.7  map
	}

	is1term() { return this.len() == 1; }																				//	+2021.5
	isunit() { return this.is1term() && this.point()[0].is1() && this.point()[1].is1hi(); }								//	+2021.5
	is0() { this.check(); return this.points.length == 0 || (this.points.length == 1 && this.points[0][0].is0()); }		//	2017.7
	is1() { this.check(); return this.points.length == 1 && this.points[0][0].is1() && this.points[0][1].is0(); }		//	2017.7
	equals(other) { return this.sub(other).is0(); }																		//	2019.6
	equal = function (other) { return this.parse(this.equals(other) ? 1 : 0); }											//	+2020.10

	isneg() { return this.points.slice(-1)[0][0].isneg() }	//	+2023.5

	add(other) { this.check(other); return new sparseplacevalue(this.points.concat(other.points)); }
	sub(other) { this.check(other); return this.add(other.negate()); }
	pointtimes(other) { this.check(other); return this.f(this.datatype.prototype.times, other); }
	pointdivide(other) { this.check(other); return this.f(this.datatype.prototype.divide, other); }
	pointsub(other) { this.check(other); return this.pointadd(other.negate()); }
	pointpow(other) { this.check(other); return this.f0(this.datatype.prototype.pow, other); }   //  2017.7
	//clone() { this.check(); return new sparseplacevalue(this.points.length>0 ? this.points.slice(0) : this.datatype); }		//	2019.7		//	-2021.5
	clone() { this.check(); return new this.constructor(this.len()>0 ? this.map(p=>[p[0].clone(),p[1].clone()]) : this.datatype); }				//	+2021.5
	negate() { this.check(); return new sparseplacevalue(this.points.length>0 ? this.points.map(x=>[x[0].negate(),x[1]]) : this.datatype); }	//	2019.7
	transpose() { this.check(); return new sparseplacevalue(this.points.map(function (x) { return [x[0], [x[1][1], x[1][0]]] })); }
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
		var digit = addend.get(0);  //  2017.7
		for (var i = 0; i < ret.length; i++) ret[i][0] = ret[i][0].add(digit);
		return new sparseplacevalue(ret);
	}

	times(top) {
		this.check(top);
		var points = [];
		for (var i = 0; i < this.points.length; i++)
			for (var j = 0; j < top.points.length; j++)
				points.push([this.points[i][0].times(top.points[j][0]), addvectors(this.points[i][1], top.points[j][1])]);	//	Added	2019.7
				//if (!this.points[i][0].is0() && !top.points[j][0].is0()) points.push([this.points[i][0].times(top.points[j][0]), addvectors(this.points[i][1], top.points[j][1])]); // 2017.2 0*∞=0 for easy division	// 2019.7 Corrected Division & Removed Hack
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
		return ret;
	}

	reverse() {	//	+2021.6
		var ret = this.clone();
		var len = length(ret);
		pad(ret, len);
		rev(ret)
		return new sparseplacevalue(ret.points);
		function rev(spv) {
			for (let i = 0; i<spv.points.length; i++)
				spv.points[i][1] = new wholeplacevalue(spv.points[i][1].mantisa.reverse());
		}
		function pad(spv, len) {
			for (let i = 0; i<spv.points.length; i++)
				while (spv.points[i][1].len() < len)
					spv.points[i][1].push(new spv.datatype())
		}
		function length(spv) {
			var ret = 0;
			for (let i = 0; i<spv.points.length; i++)
				ret = math.max(ret,spv.points[i][1].len())
			return ret;
		}
	}

	pop0() {	//	+2021.6
		return new this.constructor([this.points.shift()]);
	}

	//sqrt() {	//	+2021.6		//	-2021.9
	//	var rad = this.clone().at(this.parse('1E1'));
	//	var iter = 4;
	//	var popped = rad.pop0();
	//	var root = sqrth(rad, popped.pow(.5).points, iter);
	//	return root.at(this.parse('1E1'));
	//	function sqrth(rad, root, c) {
	//		if (c == 0) return new sparseplacevalue(root);
	//		var rootdigit = new sparseplacevalue([rad.points[0]]).divide(new sparseplacevalue([root[0]]));
	//		var remainder = rad.sub(new sparseplacevalue([...root,rootdigit.unscale(4).points[0]]).times(rootdigit));
	//		root.push(rootdigit.unscale(2).points[0]);
	//		return sqrth(remainder, root, c - 1);
	//	}
	//}

	root(n, answer = null) {	//	+2021.9
		if (answer == null) {
			var rad = this.clone().at(this.parse('1E1'));
			var popped = rad.pop0();
			return rad.root(n, popped.pow(this.datatype.parse(1).unscale(n)).points).at(this.parse('1E1'));
		}
		if (answer.length == 5) return new this.constructor(answer);
		var den = new this.constructor([answer[0]]).pow(n-1).scale(n);
		var digit = new this.constructor([this.points[0]]).divide(den);
		var gain = new this.constructor([...answer,digit.points[0]]).pow(n).sub(new this.constructor(answer).pow(n));
		answer.push(digit.points[0]);
		return this.sub(gain).root(n, answer);
	}

	withoutmsb() {	//	2019.7
		var me = this.clone();
		me.points.pop();
		return me;
	}

	divide(den) {    //  2016.10
		this.check(den);
		var num = this;
		//var iter = 5//math.max(num.points.length, den.points.length);	//	-2020.6
		//var iter = math.max(5, num.points.length, den.points.length);	//	+2020.6	//	-2021.6
		var size = x => { var n = 4; return (x==1)?n**0:(x==2)?n:n*(n+1)/2; }		//	+2021.6
		var iter = math.max(num.points.length, size(den.points.length));			//	+2021.6
		var quotient = divideh(num, den, iter);
		return quotient;
		function divideh(num, den, c) {
			num.check(den);
			if (c == 0) return new sparseplacevalue(num.datatype).parse(0);	//	2018.12	num.datatype
			var n = num.points.slice(-1)[0];
			var d = den.points.slice(-1)[0];
			var quotient = new sparseplacevalue([[n[0].divide(d[0]), n[1].sub(d[1])]]);		//	2018.12	sub
			if (d[0].is0()) return quotient;
			//var remainder = num.sub(quotient.times(den))	//	2019.7	Removed
			var remainder = num.withoutmsb().sub(quotient.times(den).withoutmsb());	//	2019.7	Added
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
		}
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
			//var quotient = new sparseplacevalue([[n[0].divide(d[0]), subvectors(n[1], d[1])]]);	//	Works even for non-truncating division	2016.10	//	-2021.6
			var quotient = new sparseplacevalue([[n[0].divide(d[0]), n[1].sub(d[1])]]);																	//	+2021.6
			if (d[0].is0()) return quotient;
			var remainder = num.sub(quotient.times(den))
			var q2 = divideh(remainder, den, c - 1);
			quotient = quotient.add(q2);
			return quotient;
		}
		//function subvectors(a, b) { return a.sub(b);//  2017.1	//	-2021.6
		//}
	}

	dividemiddle(den) { return this.divide(den); }

	pow(power) {		//  2016.11
		if (power instanceof this.datatype) power = new sparseplacevalue([[power, new wholeplacevalue(this.datatype).parse(0)]]);   //  2017.7
		if (!(power instanceof sparseplacevalue)) power = new sparseplacevalue(this.datatype).parse('' + power);       //  2017.7
		this.check(power);
		if (power.points.length == 1 & power.points[0][1].is0()) {//alert(power.points[0][1])
			var base = this.points[0];
			if (this.points.length == 1) return new sparseplacevalue([[base[0].pow(power.points[0][0]), base[1].scale(power.points[0][0])]]);
			if (power.points[0][0].is0()) return new sparseplacevalue(this.datatype).parse(1);
			if (power.points[0][0].isneg()) return new sparseplacevalue(this.datatype).parse(1).divide(this.pow(new sparseplacevalue([[power.points[0][0].negate(), new wholeplacevalue(this.datatype)]])));
			if (power.points[0][0].isint()) return this.times(this.pow(power.sub(new sparseplacevalue(this.datatype).parse(1))));
			if (!power.get(0).isint()) {	//	+2021.6
				//if (power.get(0).toreal() == .5) return this.sqrt();	//	-2021.9
				power = rational.parse(power.get(0).toString());		//	+2021.9
				return this.pow(power.n).root(power.d);								//	+2021.11
				//if (power.n == 1) return this.root(power.d);			//	+2021.9	//	-2021.11
				//alert('SPV .Bad Exponent = ' + power.tohtml());					//	-2021.11
				//return this.parse('%');											//	-2021.11
			}
		}
		if (this.points.length == 1) {  //  2017.9
			var powe = power.clone();
			var ret = [];																							//	+2020.5
			for (var i = 0; i < powe.points.length; i++) {
				//var term = powe.points[i]																			//	-2020.5
				//var coef = term[0];																				//	-2020.5
				//if (term[1].is0()) { term[0] = new this.datatype().parse(2.718).pow(term[0]); continue; }			//	-2020.5
				if (power.points[i][1].is0()) { ret.push(this.parse(this.get(0).pow(power.get(0)).toString())); continue; }	//	+2020.5
				//term[1] = term[1].map(x => x.times(coef))
				//term[1] = term[1].scale(coef);																	//	-2020.5
				//term[0] = new this.datatype().parse(1);															//	-2020.5
				var taylor = new sparseplacevalue(this.datatype);													//	+2020.5
				for (var t = 0 ; t < 4 ; t++) {																		//	+2020.5
					taylor = taylor.add(new sparseplacevalue([[this.get(0).log().pow(t).scale(1/math.factorial(t)),power.points[i][1].scale(t)]]));
				}
				//ret.push(taylor.pow(power.get(1)));																//	+2020.5	//	-2020.7
				ret.push(taylor.pow(power.points[i][0]));																		//	+2020.7
			}
			//alert(JSON.stringify(powe))
			//var ret = powe.points.reduce((acc, cur) => acc.times(new sparseplacevalue([cur])), this.parse(1));	//	2018.11 this.parse	//	-2020.5
			ret = ret.reduce((acc, cur) => acc.times(cur), this.parse(1));											//	+2020.5
			return ret;
		}
		return this.parse(0 / 0);	//	2018.11	this.parse
	}

	exponential() {			//  +2020.5
		var powe = this.clone();
		for (var i = 0; i < powe.points.length; i++) {
			var term = powe.points[i]
			var coef = term[0];
			if (term[1].is0()) { term[0] = term[0].exp(); continue; }
			term[1] = term[1].scale(coef);
			term[0] = new this.datatype().parse(1);
		}
		var ret = powe.points.reduce((acc, cur) => acc.times(new sparseplacevalue([cur])), this.parse(1));
		return ret;
	}

	gcd(arg) {			//	2019.5
		if (arguments.length == 0) return this.gcd0();
		if (arguments.length == 1) return this.gcd1(arg);
		alert('GCD Error : Too many args');
	}

	gcd0() {			//	2016.5
		this.check();
		var list = [];
		for (var i = 0; i < this.points.length; i++)
			list.push(this.points[i][0]);
		if (list.length == 0) return new this.datatype().parse('1');
		if (list.length == 1 && list[0].pow(-1).is0()) return new this.datatype().parse('1');	//	Disallow ∞ to be a GCD for expediency.	+2020.11
		if (list.length == 1) return list[0].is0() ? new this.datatype().parse('1') : list[0];	//	Disallow 0 to be a GCD for expediency.	2016.5
		return list.reduce(function (x, y) { return x.gcd(y) }, new this.datatype().parse('0'));
	}

	gcd1(b, count) {	//	2019.5	Added
		var a = this;
		a.check();													//	2019.4	Added
		b.check();													//	2019.4	Added
		if (arguments.length < 2) count = 0;
		count++;
		if (count == 10) return a.parse(1);
		if (a.points[0][0].isneg() && b.points[0][0].ispos()) { "alert(1)"; return a.negate().gcd1(b, count); }
		if (a.is0()) { "alert(2 + ': ' + a + ' , ' + b)"; return b; }
		if (b.is0()) { "alert(3)"; return a; }
		if (a.points.length > b.points.length) { "alert(4 + ': ' + a + ' , ' + b)"; return a.remainder(b).gcd1(b, count); }
		if (a.points[a.points.length - 1][1].comparelittle(b.points[b.points.length - 1][1])==1) { "alert(5 + ': ' + a + ' , ' + b)"; return a.remainder(b).gcd1(b, count); }	//	2019.5	Added
		if (a.points.length==1 && b.points.length==1) { "alert(6 + ': ' + a + ' , ' + b)"; return new sparseplacevalue([[a.points[0][0].gcd(b.points[0][0]),a.points[0][1].pointmin(b.points[0][1])]]); }	//	2019.5	Added
		"alert(7 + ': ' + a + ' , ' + b)"; return b.remainder(a).gcd1(a, count);
	}

	at(base) {	//	+2021.5
		if (!base.isunit()) return this.parse(0/0);
		var pos = base.point()[1].len() - 1;
		var ret = this.clone();
		var maxlen = math.max(ret.map(point=>point[1].len()));
		for (let p of ret.points)
			if (p[1].len() > pos) {
				while (p[1].len() < maxlen) p[1].push(new this.datatype());
				p[1].push(...p[1].splice(pos,1));
			}
		return ret.clone();
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
				if (pows.mantisa.length == 0) return point;		//	+2020.7
				var pow = pows.mantisa.slice(-1);
				pows = pows.mantisa.slice(0, -1);	//	2018.12
				if (pows.length == 0) return [point[0].times(base.pow(pow[0])), new wholeplacevalue(mytype)];  //  2018.12
				return [point[0].times(base.pow(pow[0])), new wholeplacevalue(pows)];  //  2017.12
			}
		}
	}

}
