
// Author:	Anthony John Ripa
// Date:	5/30/2025
// OmegaRepeatingBasedMarkedPlaceValue: a datatype for representing base-gnostic arithmetic; an application of the BasedMarkedPlaceValue datatype

class omegarepeatingbasedmarkedplacevalue extends basedmarkedplacevalue {

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
