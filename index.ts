// 0x20 - 0x7f
const FULL_ALPHA_CHARS = "\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x5b\x5c\x5d\x5e\x5f\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e"

// reserved filename chars on windows
// 0x00-0x1F 0x7F " (0x22) * (0x2a) / (0x2f) : (0x3a) < (0x3c) > (0x3e) ? (0x3f) \ (0x5c) | (0x7c)
const FILENAME_CHARS = "\x20\x21\x23\x24\x25\x26\x27\x28\x29\x2b\x2c\x2d\x2e\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3b\x3d\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x5b\x5d\x5e\x5f\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7d\x7e"

function hex(a: number) {
    return '0x' + a.toString(16)
}

function and(a: number, b: number) {
    return a & b
}

function sub(a: number, b: number) {
    return Uint32Array.from([a - b])[0]
}

function getSingleZeroAndEax2(allowedChars: string): [number, number] {
    const allowedCharsArray = allowedChars.split('')
    for (let i = 0; i < allowedCharsArray.length; i++) {
        for (let j = 0; j < allowedCharsArray.length; j++) {
            if (and(allowedCharsArray[i].charCodeAt(0), allowedCharsArray[j].charCodeAt(0)) === 0x0) {
                return [allowedCharsArray[i].charCodeAt(0), allowedCharsArray[j].charCodeAt(0)]
            }
        }
    }

    throw new Error('getSingleZeroAndEax2: combination not found')
}

function getZeroAndEax2(allowedChars: string, length = 4): [number, number] {
    const [a, b] = getSingleZeroAndEax2(allowedChars)
    let c = a, d = b
    for (let i = 0; i < length; i++) {
        c = (c << 8) | a
        d = (d << 8) | b
    }

    return [c, d]
}

function getSingleSubEncode(value: number, allowedChars: string): [number, number, number, number] {
    const allowedCharsArray = allowedChars.split('')
    for (let i = 0; i < allowedCharsArray.length; i++) {
        for (let j = 0; j < allowedCharsArray.length; j++) {
            for (let k = 0; k < allowedCharsArray.length; k++) {
                let a = allowedCharsArray[i].charCodeAt(0),
                    b = allowedCharsArray[j].charCodeAt(0),
                    c = allowedCharsArray[k].charCodeAt(0)
                
                let res = sub(sub(sub(0, a), b), c)

                if (and(res, 0xff) === value) {
                    return [a, b, c, 0xff - and(res, 0xff00) >> 8]
                }
            }
        }
    }

    throw new Error('getSingleSubEncode: combination not found')
}

function getSubEncode(value: number, allowedChars: string, length = 4): [number, number, number] {
    let remaining = value,
        remainder = 0,
        a = 0,
        b = 0,
        c = 0

    for (let i = 0; i < length; i++) {
        const current = and(remaining + remainder, 0x00000000000000ff)
        const [d, e, f, r] = getSingleSubEncode(current, allowedChars)
        a = (d << (8 * i)) | a
        b = (e << (8 * i)) | b
        c = (f << (8 * i)) | c

        remaining = remaining >> 8
        remainder = r
    }

    return [a, b, c]
}


const value = process.argv[2] ? parseInt(process.argv[2], 16) : 0xdeadbeef
console.log(`encoding ${hex(value)}\n`)
const [a, b] = getZeroAndEax2(FILENAME_CHARS)
const [c, d, e] = getSubEncode(value, FILENAME_CHARS)
console.log(`and eax, ${hex(a)}`)
console.log(`and eax, ${hex(b)} ; eax = ${hex(and(a, b))}`)
console.log(`sub eax, ${hex(c)}`)
console.log(`sub eax, ${hex(d)}`)
console.log(`sub eax, ${hex(e)} ; eax = ${hex(sub(sub(sub(0, c), d), e))}`)
