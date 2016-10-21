// From http://baagoe.com/en/RandomMusings/javascript/
function Mash() {
    var n = 0xefc8249d;
    return function (data) {
        var h;
        data = data.toString();
        for (let i = 0; i < data.length; i += 1) {
            n += data.charCodeAt(i);
            h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
}

function Alea() {
    return (function (args) {
        var
            s0 = 0,
            s1 = 0,
            s2 = 0,
            c = 1,
            calls = 0;

        if (args.length === 0) {
            args = [+new Date];
        }
        var mash = Mash();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');

        for (let i = 0; i < args.length; i += 1) {
            s0 -= mash(args[i]);
            if (s0 < 0) {
                s0 += 1;
            }
            s1 -= mash(args[i]);
            if (s1 < 0) {
                s1 += 1;
            }
            s2 -= mash(args[i]);
            if (s2 < 0) {
                s2 += 1;
            }
        }
        mash = null;

        var random = function () {
            calls += 1;
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
        };
        random.uint32 = function () {
            return random() * 0x100000000; // 2^32
        };
        random.fract53 = function () {
            return random() +
                (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        };
        random.calls = function () {
            return calls;
        };
        random.args = args;
        return random;

    }(Array.prototype.slice.call(arguments)));
}

var random = new Alea(+new Date);

export function setSeed(seed) {
    random = new Alea(seed);
}

export function getFloat(max) {
    return max * random();
}

export function getBool() {
    return random() < 0.5;
}

export function getUInt32() {
    return random.uint32();
}

// Inclusive of max!
export function getInt(max) {
    return random.uint32() % (max + 1);
}

export function el(a) {
    return a[random.uint32() % (a.length)];
}

function _getBell(range, spread, resolution) {

    let
        accumulator,
        step = 1 / resolution,
        dist = [],
        off = [],
        index = 0;

    for (let x = -range - 1; x <= range + 1; x += 1) {
        off[x] = index;
        accumulator = step + Math.exp(-x * x / 2 / spread / spread);
        while (accumulator >= step) {
            if (x !== 0) {
                dist[index] = x;
                index += 1;
            }
            accumulator -= step;
        }
    }

    return [dist, off];
}

export const bell = (function(range, center) {

    const
        bellDistributions = [],
        bellOffsets = [];

    return function () {

        let
            off,
            dist = bellDistributions[range];

        center = Math.round(center);

        if (!dist) {
            [dist, off] = _getBell(range, range / 6, 40);
            bellOffsets[range] = off;
            bellDistributions[range] = dist;
        }
        off = bellOffsets[range];

        return Math.round(center + dist[off[-center] + getInt(off[range - center + 1] - off[-center])]);

    }

}());

export function calls() {
    return random.calls();
}
