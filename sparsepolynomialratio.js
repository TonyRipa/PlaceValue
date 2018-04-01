
// Author:  Anthony John Ripa
// Date:    3/31/2018
// SparsePolynomialRatio : a datatype for representing rational expressions; an application of the SparsePlaceValueRatio1 datatype

function sparsepolynomialratio(arg, pv) {
    var base, pv;                                                                                           //  2018.3
    if (arguments.length == 0)[base, pv] = [1, new sparseplacevalueratio1(rational)];                       //  2018.3
    if (arguments.length == 1) {                                                                            //  2018.3
        if (arg === rational || arg === rationalcomplex)[base, pv] = [1, new sparseplacevalueratio1(arg)];  //  2018.3 rationalcomplex
        else[base, pv] = [arg, new sparseplacevalueratio1(rational)];
    }
    if (arguments.length == 2)[base, pv] = arguments;                                                       //  2018.3
    //if (arguments.length < 1) base = 1;                                                 //  2017.9
    //if (arguments.length < 2) pv = new sparseplacevalueratio1();                        //  2017.12
    console.log('sparsepolynomialratio : arguments.length=' + arguments.length);
    //this.base = arg;
    this.base = base;                                                                                       //  2018.3
    if (pv instanceof sparseplacevalueratio1)  // 2017.6
        this.pv = pv;
    else if (typeof pv == 'number') {
        console.log("sparsepolynomialratio: typeof pv == 'number'");
        this.pv = new wholeplacevalue([pv])
        console.log(this.pv.toString());
    }
    else
        { var s = 'SparsePolynomialRatio expects arg 2 to be sparseplacevalueratio1 not ' + typeof pv + " : " + JSON.stringify(pv); alert(s); throw new Error(s); }
        //alert('sparsepolynomialratio: bad arg2 = ' + JSON.stringify(pv) + ', typeof(arg2)=' + typeof (pv));
}

sparsepolynomialratio.prototype.parse = function (strornode) {  //  2017.9
    console.log('<strornode>')
    console.log(strornode)
    console.log('</strornode>')
    if (strornode instanceof String || typeof (strornode) == 'string') if (strornode.indexOf('base') != -1) { var a = JSON.parse(strornode); return new sparsepolynomialratio(a.base, new this.pv.parse(JSON.stringify(a.pv))) }    //  2018.3
    var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode.replace('NaN', '(0/0)')) : strornode;
    if (node.type == 'SymbolNode') {
        console.log('SymbolNode')
        //var base = node.name;
        //var pv = '1e1'//10;
        if (node.name.match(this.pv.num.datatype.regexfull())) {    //  2018.3
            var base = 1;
            var pv = this.pv.parse(node.name);
        } else {
            var base = node.name;
            var pv = this.pv.parse('1e1');
        }
        //return new sparsepolynomialratio(base, new sparseplacevalueratio1().parse(pv));
        return new sparsepolynomialratio(base, pv);                 //  2018.3
    } else if (node.type == 'OperatorNode') {
        console.log('OperatorNode')
        var kids = node.args;
        var a = this.parse(kids[0]);        //  2017.12 this
        if (node.fn == 'unaryMinus') {
            var c = new sparsepolynomialratio(1, this.pv.parse(0)).sub(a);  //  2018.3
        } else if (node.fn == 'unaryPlus') {
            var c = new sparsepolynomialratio(1, this.pv.parse(0)).add(a);  //  2018.3
        } else {
            var b = this.parse(kids[1]);    //  2017.12 this
            var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
        }
        return c
    } else if (node.type == 'ConstantNode') {
        return new sparsepolynomialratio(1, this.pv.parse(node.value));     //  2018.3
    }
}

sparsepolynomialratio.prototype.tohtml = function () { // Replacement for toStringInternal 2015.7
    return this.pv.toString() + ' base ' + this.base;
}

sparsepolynomialratio.prototype.toString = function () {
    var num = sparsepolynomialratio.toStringXbase(this.pv.num, this.base);
    if (this.pv.den.is1()) return num;
    num = (count(this.pv.num.points) < 2) ? num : '(' + num + ')';
    var den = sparsepolynomialratio.toStringXbase(this.pv.den, this.base);
    den = (count(this.pv.den.points) < 2) ? den : '(' + den + ')';
    return num + '/' + den;
    function count(array) {
        return array.length;
        //return array.reduce(function (prev, curr) { return prev + Math.abs(Math.sign(curr)) }, 0);
    }
}

sparsepolynomialratio.prototype.add = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.add(other.pv));
}

sparsepolynomialratio.prototype.sub = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.sub(other.pv));
}

sparsepolynomialratio.prototype.times = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.times(other.pv));
}

sparsepolynomialratio.prototype.divide = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.divide(other.pv));
}

sparsepolynomialratio.prototype.divideleft = function (other) {   //  2016.8
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.divideleft(other.pv));
}

sparsepolynomialratio.prototype.pointadd = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointadd(other.pv));
}

sparsepolynomialratio.prototype.pointsub = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointsub(other.pv));
}

sparsepolynomialratio.prototype.pointtimes = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointtimes(other.pv));
}

sparsepolynomialratio.prototype.pointdivide = function (other) {
    this.align(other);
    return new sparsepolynomialratio(this.base, this.pv.pointdivide(other.pv));
}

sparsepolynomialratio.prototype.align = function (other) {    // Consolidate alignment    2015.9
    if (this.pv.num.points.length == 1 && this.pv.num.points[0][1].is0()) this.base = other.base;
    if (other.pv.num.points.length == 1 && other.pv.num.points[0][1].is0()) other.base = this.base;
    if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new sparsepolynomialratio(1, this.pv.parse('%')) }  //  2018.3  this.pv
}

sparsepolynomialratio.prototype.pow = function (other) { // 2015.6
    return new sparsepolynomialratio(this.base, this.pv.pow(other.pv));
}

sparsepolynomialratio.toStringXbase = function (pv, base) {                        // added namespace  2015.7
    //alert(JSON.stringify([pv, base]));
    console.log('sparsepolynomialratio: pv = ' + pv);
    var x = pv.points;
    console.log('sparsepolynomialratio.toStringXbase: x=' + x);
    if (x[x.length - 1] == 0 && x.length > 1) {     // Replace 0 w x.length-1 because L2R 2015.7
        x.pop();                                    // Replace shift with pop because L2R 2015.7
        return sparsepolynomialratio.toStringXbase(new wholeplacevalue(x), base);  // added namespace  2015.7
    }
    var ret = '';
    var str = x//.toString().replace('.', '');
    var maxbase = x.length - 1// + exp;
    for (var i = maxbase; i >= 0; i--) {
        var digit = str[i][0];
        var power = str[i][1];
        if (!digit.is0()) {
            ret += '+';
            if (power.is0())
                ret += digit;
            else if (power.is1())
                ret += coefficient(digit) + base;
            else
                ret += coefficient(digit) + base + '^' + power;
        }
        console.log('sparsepolynomialratio.toStringXbase: power=' + power + ', digit=' + digit + ', ret=' + ret);
    }
    ret = ret.replace(/\+\-/g, '-');
    if (ret[0] == '+') ret = ret.substring(1);
    if (ret == '') ret = '0';
    return ret;
    function coefficient(digit) { return (digit.is1() ? '' : digit.negate().is1() ? '-' : digit).toString(false, true) + (isFinite(digit.toreal()) ? '' : '*') }    //  2017.8
}

sparsepolynomialratio.prototype.eval = function (other) {
    return new sparsepolynomialratio(1, this.pv.eval(other.pv));    //  2017.10
}
