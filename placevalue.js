// Author : Anthony John Ripa
// Date : 2/24/2015
// PlaceValue : a datatype for representing base agnostic arithmetic via numbers whose digits are real

function placevalue(man, exp) {
    if (arguments.length < 2) exp = 0;
    if (Array.isArray(man)) {
        this.mantisa = man;
        this.exp = exp;
        //console.log('placevalue(array)');
    } else if (typeof man == 'string') {
        if (man.indexOf('mantisa') != -1) {     // if arg1 is json of placevalue-object
            var ans = JSON.parse(man)
            console.log('ans=' + JSON.stringify(ans));
            this.mantisa = ans.mantisa
            this.exp = ans.exp
        } else {
            //console.log('else');
            this.exp = getexp(man) + exp;
            this.mantisa = num2array(man);
        }
    }
    console.log('man = ' + this.mantisa + ', exp = ' + this.exp + ', arguments.length = ' + arguments.length);
    function getexp(x) {
        //var exp;
        //var pos = x.indexOf('.');
        //if (pos === -1) pos = 0;
        //if (pos === -1) pos = 0;
        return x.indexOf('.') == -1 ? 0 : x.indexOf('.') - x.replace(new RegExp(String.fromCharCode(822), 'g'), '').length + 1;
    }
    function int2array(n) {
        var arr = n.toString().split('');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == String.fromCharCode(822)) {
                arr[i - 1] *= -1;
                arr.splice(i, 1);
            }
        }
        console.log('int2aray: arr=' + arr);
        return arr;
    }
    function num2array(x) {
        return int2array(x.toString().replace('.', ''));
    }
}

placevalue.prototype.toString = function () {
    // 185  189  822 8315   9321
    // ^1   1/2  -   ^-     10
    var ret = "";
    for (var i = 0; i < this.mantisa.length; i++) {
        if (i == this.mantisa.length + this.exp) ret += '.';
        if (isNaN(this.mantisa[i])) ret += '%';
        if (this.mantisa[i] < -9) ret += '(' + Math.abs(this.mantisa[i]).toString().split('').join(String.fromCharCode(822)) + String.fromCharCode(822) + ')';
        if (-9 <= this.mantisa[i] && this.mantisa[i] <= -1) ret += Math.abs(this.mantisa[i]).toString().split('').join(String.fromCharCode(822)) + String.fromCharCode(822);
        if (-1 < this.mantisa[i] && this.mantisa[i] < 0) {
            //ret += '(1' + String.fromCharCode(822) + '/' + (1 / Math.abs(this.mantisa[i])) + ')';
            ret += Math.abs(1 / this.mantisa[i]).toString().split('').join(String.fromCharCode(822)) + String.fromCharCode(822) + String.fromCharCode(8315) + String.fromCharCode(185);
        }
        if (this.mantisa[i] == 0) ret += 0;
        if (0 < this.mantisa[i] && this.mantisa[i] < 1) {
            if (false && this.mantisa[i] == .5)
                ret += String.fromCharCode(189)
            else {
                //ret += '(1/' + (1 / this.mantisa[i]) + ')';
                ret += Math.abs(1 / this.mantisa[i]) + String.fromCharCode(8315) + String.fromCharCode(185);
            }
        }
        if (1 <= this.mantisa[i] && this.mantisa[i] <= 9) ret += this.mantisa[i];
        if (9 < this.mantisa[i] && isFinite(this.mantisa[i])) ret += '(' + this.mantisa[i] + ')';
        if (1 / this.mantisa[i] == 0) ret += '∞';
    }
    //ret += 'E';
    //ret += this.exp;
    //console.log(ret);
    return ret;
}

placevalue.prototype.tohtml = function () {
    var ret = "";
    for (var i = 0; i < this.mantisa.length; i++) {
        if (this.mantisa[i] >= 0)
            ret += this.mantisa[i]
        else
            ret += '<s>' + Math.abs(this.mantisa[i]) + '</s>';
    }
    console.log(ret);
    return ret;
}

function pad(a, b) {
    while (a.exp > b.exp) {
        a.exp--;
        a.mantisa.push(0);
    }
    while (b.exp > a.exp) {
        b.exp--;
        b.mantisa.push(0);
    }
    while (a.mantisa.length > b.mantisa.length)
        b.mantisa.unshift(0);
    while (b.mantisa.length > a.mantisa.length)
        a.mantisa.unshift(0);
}

placevalue.prototype.add = function (addend) {
    var man = [];
    console.log('placevalue.prototype.add: this=' + this + ', addend=' + addend);
    pad(this, addend);
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) + Number(addend.mantisa[i]));
    }
    return new placevalue(man, this.exp);
}

placevalue.prototype.sub = function (addend) {
    var man = [];
    pad(this, addend);
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) - Number(addend.mantisa[i]));
    }
    return new placevalue(man, this.exp);
}

placevalue.prototype.pointsub = function (subtrahend) {
    var man = [];
    //console.log('subtrahend=' + subtrahend.toString());
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) - Number(subtrahend.mantisa[0]));
    }
    return new placevalue(man, this.exp);
}

placevalue.prototype.pointtimes = function (multiplier) {
    var man = [];
    pad(this, multiplier);
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) * Number(multiplier.mantisa[i]));
    }
    return new placevalue(man, this.exp);
}

placevalue.prototype.pointdivide = function (divisor) {
    var man = [];
    pad(this, divisor);
    for (var i = 0; i < this.mantisa.length; i++) {
        man.push(Number(this.mantisa[i]) / Number(divisor.mantisa[i]));
    }
    return new placevalue(man, this.exp);
}

placevalue.prototype.times = function (top) {
    var prod = new placevalue([]);
    var exp = this.exp + top.exp;
    for (var b = 0; b < this.mantisa.length; b++) {
        var sum = [];
        for (var t = 0; t < top.mantisa.length; t++) {
            sum.unshift(this.mantisa[this.mantisa.length - b - 1] * top.mantisa[top.mantisa.length - t - 1]);
            console.log('this.mantisa=' + this.mantisa + ' , top.mantisa=' + top.mantisa + ' , this.mantisa[b] = ' + this.mantisa[this.mantisa.length - b - 1] + ' , top.mantisa[t] = ' + top.mantisa[top.mantisa.length - t - 1] + ' , sum = ' + sum);
        }
        for (var i = 0; i < b; i++) sum.push(0);
        prod = prod.add(new placevalue(sum));
    }
    prod.exp = exp;
    return prod;
}

placevalue.prototype.divide = function (denominator) {
    var sigfig = 5;
    while (denominator.mantisa[0] === 0) {
        denominator.mantisa.shift();
        //denominator.exp--;
        console.log(denominator);
    }
    var mandif = this.mantisa.length - denominator.mantisa.length;
    if (mandif < 0) mandif = 0;
    var expdif = this.exp - denominator.exp;
    var dif = mandif + expdif;
    //console.log('mandif = ' + mandif + ', expdif = ' + expdif + ', dif = ' + dif);
    return new placevalue(divide(this.mantisa, denominator.mantisa, sigfig), dif - (sigfig - 1));
    function divide(num, den, count) {              // 1 Call by divideprimative
        //console.log('num=' + num + '; den=' + den + '; count=' + count);
        if (count == 0) return [];
        count--;
        var ret = [];   // need var here otherwise ret is global
        while (num.length < den.length)
            num.unshift(0);     // add (leading=indexZero) zero
        while (num.length > den.length)
            den.push(0);        // add trailing zero
        if (num.length == den.length) {
            var ratio = num[0] / den[0];
            ret.push(num[0] / den[0]);
            var newnum = sub(num, arrXd(den, ratio));
            newnum.shift();   // remove (leading=indexZero) zero
            newnum.push(0);   // add trailing zero
            var q = divide(newnum, den, count);
            ret = ret.concat(q);
        }
        //console.log('returning ' + ret);
        return ret;
        function sub(first, second) {                       // 1 Call by divide
            //alert(first + " : " + second);
            if (first.length != second.length) alert("sub error: can't subtract different size numbers");
            var ret = [];           // need var here otherwise ret is global
            for (var i = 0; i < first.length; i++)
                ret.push(first[i] - second[i]);
            return ret;
        }
        function arrXd(arr, d) {                       // 1 Call by divide
            if (!arr.length || d.length) alert("times error: must be array times digit");
            var ret = [];           // need var here otherwise ret is global
            for (var i = 0; i < arr.length; i++)
                ret.push(arr[i] * d);
            return ret;
        }
    }
}