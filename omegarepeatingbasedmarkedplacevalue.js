
// Author:	Anthony John Ripa
// Date:	9/27/2025
// OmegaRepeatingBasedMarkedPlaceValue: a datatype for representing base-gnostic arithmetic; an application of the BasedMarkedPlaceValue datatype

class omegarepeatingbasedmarkedplacevalue extends basedmarkedplacevalue {

	parse(str) {	//	+2025.9
		if (!str.includes('[')) return super.parse(str)
		str = str.toString();
		if (str instanceof String || typeof (str) == 'string') if (str.includes('mantisa')) {
			var a = JSON.parse(str);
			return new this.constructor(a.base, this.pv.parse(JSON.stringify(a.pv)));
		}
		let base, pv;
		if (str.toUpperCase().includes('BASE')) {
			let i = str.toUpperCase().indexOf('BASE');
			let left = str.slice(0, i).trim();
			let right = str.slice(i + 4).trim();
			pv = this.pv.parse(left);
			base = Number(right);
		} else {
			base = 10;
			pv = split(str,this.pv,base)
		}
		return new this.constructor(base, pv);			
		function split(str,pv,base) {
			if (!str.includes('[')) alert('Split expects [')
			let [prefix,repetend] = str.split('[')
			repetend = repetend.split(']')[0]
			prefix = pv.parse(prefix)
			let exp = prefix.exp
			repetend = pv.parse(repetend).unscale(base**repetend.length-1)
			repetend.exp = exp
			let sum = prefix.add(repetend)
			return sum
		}
	}

	toString() {

		let base = this.base
		let mpv = this.pv
			let exp = mpv.exp
			let whole = mpv.whole
				let last = whole.get(0)
					let modquo = regroup(last)
					let seq = modquo2seq(modquo)
				let rest = whole.clone()
					rest.set(0,modquo.quos[0])
					let prefix = new markedplacevalue(rest,exp).toString()

		return prefix + (prefix.includes('.')?'':'.') + (seq.startsWith('[') ? seq : seq.slice(1)) + modquo.mods.slice(-1)[0].todigit() + ' Base ' + base

		function modquo2seq(modquo) {
			let {mods,quos} = modquo
			let len = quos.length
			let ret = ''
			for (let i = 0 ; i < len ; i++ ) {
				ret += quos[i].toString()
			}
			let start = mods.map(x=>x.toString()).indexOf(mods.slice(-1)[0].toString())
			ret = [...ret]
			ret.splice(start,0,'[')
			return ret.join('') + ']'
		}

		function regroup(mod) {
			let one = mod.parse(1)
			let mods = [mod]
			let quos = []
			let nextmod, quo
			do {
				let curmod = mods.slice(-1)[0]
				nextmod = curmod.remainder(one)
				quo = curmod.sub(nextmod)
				nextmod = nextmod.scale(base)
				quos.push(quo)
				mods.push(nextmod)
			} while (mods.map(x=>x.toString()).indexOf(nextmod.toString()) == mods.length-1)
			return {mods,quos}
		}

	}

}
