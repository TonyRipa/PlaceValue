
// Author:	Anthony John Ripa
// Date:	1/31/2025
// Polynomial1: a 1-D datatype for representing polynomials; an application of the WholePlaceValue datatype

class polynomial1 extends abstractpolynomial {  //  2018.5  Rename polynomial

	constructor(arg) {
		var base, pv;
		if (arguments.length == 0)[base, pv] = [1, new wholeplacevalue(rational)];      //  2018.1
		if (arguments.length == 1) {                                                    //  2018.1
			if (arg === rational || arg === complex || arg === rationalcomplex)[base, pv] = [1, new wholeplacevalue(arg)];    //  2017.11 rationalcomplex
			else[base, pv] = [arg, new wholeplacevalue(rational)];
		}
		if (arguments.length == 2)[base, pv] = arguments;
		if (Array.isArray(base)) alert('polynomial1 expects argument 1 (base) to be a string but found array: ' + typeof base);
		if (!(pv instanceof wholeplacevalue)) { var s = 'Polynomial1 expects arg 2 to be WholePlaceValue not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
		super();
		this.base = base;
		this.pv = pv;
	}

	parse(strornode) { //  2017.9
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new polynomial1(a.base, this.pv.parse(JSON.stringify(a.pv))) } //  2017.10
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)')) : strornode; //  2018.4
		console.log('<node>')
		console.log(node)
		console.log('</node>')
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode')
			if (node.name.match(this.pv.datatype.regexfull())) {    //  2018.1
				var base = 1;
				var pv = this.pv.parse(node.name);
			} else {
				var base = node.name;
				var pv = this.pv.parse('10');
			}
			return new polynomial1(base, pv);
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args;
			var a = this.parse(kids[0]);        // 2018.1   this.parse
			if (node.fn == 'unaryMinus') {
				var c = new polynomial1(1, this.pv.parse(0)).sub(a); //  2018.1  this.pv
			} else if (node.fn == 'unaryPlus') {
				var c = new polynomial1(1, this.pv.parse(0)).add(a); //  2018.1  this.pv
			} else {
				var b = this.parse(kids[1]);    //  2018.1  this.parse
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode: ' + node.value)
			return new polynomial1(1, this.pv.parse('(' + Number(node.value) + ')'));    //  2018.1 this.pv
		} else if (node.type == 'ParenthesisNode') {	//	+2022.7
			return this.parse(node.content);
		} else {										//	+2022.7
			alert('othertype')
		}
	}

	align(other) {			//	Consolidate alignment	2015.9
		this.check(other);	//	2019.2	Added Check
		if (this.pv.mantisa.length == 1) this.base = other.base;
		if (other.pv.mantisa.length == 1) other.base = this.base;
		//if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomial1(1, new wholeplacevalue(['%'])) }	//	2019.2	Removed
		if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new polynomial1(1, this.pv.parse('%')) }			//	2019.2	this.pv
	}

	toString() {
		var pv = this.pv;
		var base = this.base;
		console.log('polynomial1: pv = ' + pv);
		var x = pv.mantisa;
		console.log('polynomial1.toStringXbase: x=' + x);
		if (x[x.length - 1] == 0 && x.length > 1) {		//	Replace 0 w x.length-1 because L2R 2015.7
			x.pop();									//	Replace shift with pop because L2R 2015.7
			return polynomial1.toStringXbase(new wholeplacevalue(x), base);	//	added namespace  2015.7
		}
		var ret = '';
		//var str = x//.toString().replace('.', '');	//	-2021.7
		var maxbase = x.length - 1
		for (var power = maxbase; power >= 0; power--) {					//	power is index because whole is L2R	2015.7
			//var digit = str[power].toString(false, true);		//	-2020.5
			//var digit = str[power].toString(false,'medium');	//	+2020.5	//	-2021.7
			var digit = x[power].toString(false,'medium');					//	+2021.7
			if (digit != 0) {
				ret += '+';
				if (power == 0)
					ret += digit;
				//else if (power == 1)									//	-2021.9
				//	ret += coefficient(digit) + base;					//	-2021.9
				else
					ret += coefficient(digit) + base + sup(power);		//	+2021.9
					//ret += coefficient(digit) + base + '^' + power;	//	-2021.9
			}
			console.log('polynomial1.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
		}
		ret = ret.replace(/\+\-/g, '-');
		//if (ret[0] == '+') ret = ret.substring(1);		//	-2021.7
		if (ret.startsWith('+')) ret = ret.substring(1);	//	+2021.7
		if (ret == '') ret = '0';
		return ret;
		//function coefficient(digit) { return (digit == 1 ? '' : digit == -1 ? '-' : digit).toString() + (isFinite(digit) ? '' : '*') }	//	-2021.9
		function coefficient(digit) { return digit == 1 ? '' : digit == -1 ? '-' : digit }													//	+2021.9
		function sup(x) {												//	+2021.9
			if (x == 1) return '';
			return '^' + x;
		}
	}

	tosvg() {

		let length = 30
		let l = length
		let marginx = l / 2
		let mx = marginx
		let my = marginx
		let x = mx
		let content = ''
		content += do_n(cube,this.pv.get(3),l,my)
		content += do_n(box,this.pv.get(2),l,my)
		content += do_n(stick,this.pv.get(1),l,my)
		content += do_n(dot,this.pv.get(0),l,my)
		let width = x + mx
		let height = my + l + my
		let ret = `<svg width='${width}' height='${height}'><g stroke='black'>` + content + `</g></svg>`
		return ret

		function cube(l,my,last) {
			let ret =	`<line x1='${1+x		}' x2='${1+x		}' y1='${my		+my/2}' y2='${my+l	+my/2}' />` +
						`<line x1='${1+x		}' x2='${1+x+l		}' y1='${my		+my/2}' y2='${my	+my/2}' />` +
						`<line x1='${1+x		}' x2='${1+x+l		}' y1='${my+l	+my/2}' y2='${my+l	+my/2}' />` +
						`<line x1='${1+x		}' x2='${1+x+my		}' y1='${my		+my/2}' y2='${1		+my/2}' />` +
						`<line x1='${1+x+my		}' x2='${1+x+l+my	}' y1='${1		+my/2}' y2='${1		+my/2}' />`
			if (last) {
				ret +=	`<line x1='${1+x+l+my	}' x2='${1+x+l		}' y1='${1		+my/2}' y2='${my	+my/2}' />` +
						`<line x1='${1+x+l+my	}' x2='${1+x+l+my	}' y1='${1		+my/2}' y2='${l		+my/2}' />` +
						`<line x1='${1+x+l		}' x2='${1+x+l		}' y1='${my		+my/2}' y2='${my+l	+my/2}' />` +
						`<line x1='${1+x+l+my	}' x2='${1+x+l		}' y1='${l		+my/2}' y2='${my+l	+my/2}' />`
				x += l
			}
			x += l
			return ret
		}

		function box(l,my,last) {
			let ret =	`<line x1='${x+1	}' x2='${x+1	}' y1='${my		}' y2='${my+l	}' />` +
						`<line x1='${x+1	}' x2='${x+l+1	}' y1='${my		}' y2='${my		}' />` +
						`<line x1='${x+1	}' x2='${x+l+1	}' y1='${my+l	}' y2='${my+l	}' />`
			if (last) {
				ret +=	`<line x1='${x+l+1	}' x2='${x+l+1	}' y1='${my		}' y2='${my+l	}' />`
				x += mx
			}
			x += l
			return ret
		}

		function stick(l,my) {
			let ret = `<line x1='${x+1}' x2='${x+1}' y1='${my}' y2='${my+l}' />`
			x += l/2
			return ret
		}

		function dot(l,my) {
			let ret = `<circle r='1' cx='${x+1}' cy='${my+l/2}' />`
			x += l/2
			return ret
		}

		function do_n(f,n,l,my) {
			let ret = ''
			for (let i = 0 ; i < n ; i++) {
				ret += f(l,my,i==n-1)
			}
			return ret
		}

	}

}
