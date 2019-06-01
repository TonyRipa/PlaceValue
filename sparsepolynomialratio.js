
// Author:  Anthony John Ripa
// Date:    5/31/2019
// SparsePolynomialRatio : a datatype for representing rational expressions; an application of the SparsePlaceValueRatio datatype

//function sparsepolynomialratio(arg, pv) {												//	2019.5	Removed
class sparsepolynomialratio extends abstractpolynomial {									//	2019.5	Added

	constructor(arg) {
		var base, pv;																		//	2019.5	Added
		if (arguments.length == 0) throw new Error('notype');								//	2019.5	Added
		//if (arguments.length == 0)[base, pv] = [[], new sparseplacevalueratio(rational)];	//	2019.5	AddedRemoved
		if (arguments.length == 1) {														//	2019.5	Added
			if (arg === rational || arg === rationalcomplex)[base, pv] = [[], new sparseplacevalueratio(arg)];
			else throw new Error('notype');													//	2019.5	Added
			//else[base, pv] = [arg, new sparseplacevalueratio(rational)];					//	2019.5	Removed
		}
		if (arguments.length == 2)[base, pv] = arguments;									//	2019.5	Added
		//if (arguments.length < 2) pv = new sparseplacevalueratio(); //  2017.9			//	2019.5	Removed
		console.log('sparsepolynomialratio : arguments.length=' + arguments.length);
		if (!Array.isArray(base)) { var s = 'sparsepolynomialratio expects argument 1 (base) to be an array but found ' + typeof base; alert(s); throw new Error(s); }	//	2019.5	Added
		if (!(pv instanceof sparseplacevalueratio)){var s='sparsepolynomialratio wants arg 2 to be SparsePVratio not '+typeof pv+" : "+JSON.stringify(pv);alert(s);throw new Error(s);}	//	2019.5	Added
		//this.base = arg;																	//	2019.5	Removed
		super();																			//	2019.5	Added
		this.base = base;																	//	2019.5	Added
		this.pv = pv;																		//	2019.5	Added
		console.log(JSON.stringify(this))													//	2019.5	Added
		//if (pv instanceof sparseplacevalueratio)  // 2017.6								//	2019.5	Removed
		//	this.pv = pv;
		//else if (typeof pv == 'number') {
		//	console.log("sparsepolynomialratio: typeof pv == 'number'");
		//	this.pv = new wholeplacevalue([pv])
		//	console.log(this.pv.toString());
		//}
		//else
		//	{ var s = "sparsepolynomialratio expects argument 2 (pv) to be a sparseplacevalueratio not " + typeof pv; alert(s); throw new Error(s); }
	}

	parse(strornode) { //  2017.9
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialratio(a.base, new sparseplacevalueratio().parse(JSON.stringify(a.pv))) }   //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode')
			//var base = node.name;																//	2019.5	Removed
			//var pv = '1e1'//10;																//	2019.5	Removed
			if (node.name.match(this.pv.num.datatype.regexfull())) {    						//  2019.5	Added
				var base = [];
				var pv = this.pv.parse(node.name);
			} else {
				var base = [node.name];
				var pv = this.pv.parse('1e1');
			}
			//return new sparsepolynomialratio([base], new sparseplacevalueratio().parse(pv));	//	2019.5	Removed
			return new sparsepolynomialratio(base, pv);											//	2019.5	Added
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);        // sparsepolynomialratio handles unpreprocessed kid    2015.11
			if (node.fn == 'unaryMinus') {
				//var c = new sparsepolynomialratio(1, sparseplacevalueratio.parse(0)).sub(a);	//	2019.5	Removed
				var c = new sparsepolynomialratio([], this.pv.parse(0)).sub(a);					//	2019.5	Added
			} else if (node.fn == 'unaryPlus') {
				//var c = new sparsepolynomialratio(1, sparseplacevalueratio.parse(0)).add(a);	//	2019.5	Removed
				var c = new sparsepolynomialratio([], this.pv.parse(0)).add(a);					//	2019.5	Added
			} else {
				var b = this.parse(kids[1]);    // sparsepolynomialratio handles unpreprocessed kid    2015.11
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode : ->' + node.value + '<-');									//	2019.5	Added
			//return new sparsepolynomialratio([], new sparseplacevalueratio().parse(node.value));	//	2019.5	Removed
			return new sparsepolynomialratio([], this.pv.parse(node.value));						//	2019.5	Added
		}
	}

	//tohtml() { // Replacement for toStringInternal 2015.7		//	2019.5	Removed
	//	return this.pv.toString() + ' base ' + this.base;
	//}

	toString() {
		var num = sparsepolynomialratio.toStringXbase(this.pv.num, this.base);
		if (this.pv.den.is1()) return num;
		num = (count(this.pv.num.points) < 2) ? num : '(' + num + ')';
		var den = sparsepolynomialratio.toStringXbase(this.pv.den, this.base);
		den = (count(this.pv.den.points) < 2) ? den : '(' + den + ')';
		return num + '/' + den;
		function count(array) {
			return array.length;
		}
	}

	//add(other) {								//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.add(other.pv));
	//}

	//sub(other) {								//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.sub(other.pv));
	//}

	//times(other) {							//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.times(other.pv));
	//}

	//divide(other) {							//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.divide(other.pv));
	//}

	//divideleft(other) {   //  2016.8			//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.divideleft(other.pv));
	//}

	//dividemiddle(other) {   //  2017.7		//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.dividemiddle(other.pv));
	//}

	//remainder(other) {	//	2019.4	Added	//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.remainder(other.pv));
	//}

	//pointadd(other) {							//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.pointadd(other.pv));
	//}

	//pointsub(other) {							//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.pointsub(other.pv));
	//}

	//pointtimes(other) {						//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.pointtimes(other.pv));
	//}

	//pointdivide(other) {						//	2019.5	Removed
	//	this.align(other);
	//	return new sparsepolynomialratio(this.base, this.pv.pointdivide(other.pv));
	//}

	align(other) {     //  2017.7
		//alert('b4: this = ' + this.toString() + ' , other = ' + other.toString());
		//alert('b4: this = ' + this.pv.toString() + ' base ' + this.base.toString() + ' , other = ' + other.pv.toString() + ' base ' + other.base.toString());
		var base1 = this.base.slice();
		var base2 = other.base.slice();
		var base = [...new Set([...base1, ...base2])];
		//base.sort().reverse();
		//if (base[0] == 1) base.shift();
		alignmulti2base(this, base);
		alignmulti2base(other, base);
		//this.pv = new sparseplacevaluerational(this.pv.points);     //  2017.2  Clean this's zeros
		function alignmulti2base(multi, basenew) {
			for (var i = 0; i < multi.pv.num.points.length; i++)
				multi.pv.num.points[i][1] = aligndigit2base(multi.pv.num.points[i], multi.base, basenew)
			for (var i = 0; i < multi.pv.den.points.length; i++)
				multi.pv.den.points[i][1] = aligndigit2base(multi.pv.den.points[i], multi.base, basenew)
			multi.base = basenew;
			function aligndigit2base(digitold, baseold, basenew) {
				var digitpowernew = [];
				//var baseold = multi.base;
				//var digitold = multi.pv.points[index]
				var digitpowerold = digitold[1];
				for (var i = 0; i < basenew.length; i++) {
					var letter = basenew[i];
					var posinold = baseold.indexOf(letter);
					//if (posinold == -1) { digitpowernew.push(new rational().parse(0)); }		//	2019.5	Removed
					if (posinold == -1) { digitpowernew.push(new multi.pv.num.datatype()); }	//	2019.5	multi.pv.num.datatype
					else {  //  2017.4  manually check if defined
						//if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new rational().parse(0));		//  2017.12 new	//	2019.5	Removed
						if (typeof digitpowerold.mantisa[posinold] === 'undefined') digitpowernew.push(new multi.pv.num.datatype());	//	2019.5	multi.pv.num.datatype
						else digitpowernew.push(digitpowerold.mantisa[posinold]);
					}
				}
				if (digitpowernew.length != basenew.length) { alert('SparseMultinomial: alignment error'); throw new Error('SparseMultinomial: alignment error'); }
				//return new wholeplacevalue(digitpowernew);									//	2019.5	Removed
				if (digitpowernew.length==0) return new wholeplacevalue(multi.pv.num.datatype);	//	2019.5	Check empty to preserve datatype
				else						 return new wholeplacevalue(digitpowernew);			//	2019.5	Check empty to preserve datatype
			}
		}
	}

	//pow(other) { // 2015.6					//	2019.5	Removed
	//	return new sparsepolynomialratio(this.base, this.pv.pow(other.pv));
	//}

	static toStringXbase(pv, base) {                        // added namespace  2015.7
		//alert(JSON.stringify(pv))
		//if (!pv instanceof sparseplacevaluerational) { var s = "sparsepolynomialratio.toStringXbase expects argument 1 (pv) to be a sparseplacevaluerational not " + typeof pv + JSON.stringify(pv); alert(s); throw new Error(s); }	//	2018.8	Removed
		//pv = new sparseplacevalue(rational).parse(pv.toString());   //  2018.4  Translation needed since sparsemultinomial is now based on sparseplacevalue, but sparseplacevalueratio is still based on sparseplacevaluerational		//	2018.8	Removed
		return new sparsepolynomial(base, pv).toString();	//	2018.10	rename sparsemulti -> sparsepoly
	}

	//eval(other) {								//	2019.5	Removed
	//	return new sparsepolynomialratio(this.base.slice(0, -1), this.pv.eval(other.pv));  //  2017.12
	//	//var sum = 0;
	//	//for (var i = 0; i < this.pv.mantisa.length; i++) {
	//	//    sum += this.pv.get(i) * Math.pow(base, i);
	//	//}
	//	//return new sparsepolynomialratio(1, new wholeplacevalue([sum]));
	//}

}
