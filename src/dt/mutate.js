import * as rng from './rng'
import {clamp} from './utils'
import {Poly} from './polys'

/*
 * Mutate functions modify the objects in place, and return the index of the polygon that was modified.
 *
 */

export default class Mutate {

    constructor(stats, imgWidthNoMargin, imgHeightNoMargin, margin, maxDim, iniVertices, maxVertices, palette, breakUpPolys, removeAUselessVertex, stepsBeforeHeuristics) {
        this.stats = stats;
        this.imgWidthNoMargin = imgWidthNoMargin;
        this.imgHeightNoMargin = imgHeightNoMargin;
        this.width = imgWidthNoMargin + margin + margin;
        this.height = imgHeightNoMargin + margin + margin;
        this.margin = margin;
        this.maxDim = maxDim;
        this.iniVertices = iniVertices;
        this.maxVertices = maxVertices;
        this.palette = palette;
        this.breakUpPolys = breakUpPolys;
        this.removeAUselessVertex = removeAUselessVertex;
        this.stepsBeforeHeuristics = stepsBeforeHeuristics;
    }

    static _getDeltaInt(max) { //min assumed 0

        max = Math.round(max); // may not be an int, but we want to return an int.
        let delta = rng.getInt((max * 2) - 1) + 1; // delta = number in this interval [1 ... max * 2], we do not want delta = 0;
        if (delta > max) {
            delta = max - delta;
        }
        return delta;

    }

    _isAddVertexPossible() {
        return this.breakUpPolys || this.removeAUselessVertex || this.iniVertices !== this.maxVertices;
    }

    gaussian(polySet) {

        const
            bellDistribs = [],
            bellOffsets = [],

            computeBell = function (range, spread, resolution) {

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
                bellOffsets[range] = off;
                bellDistribs[range] = dist;

                return dist;
            },

            bellRandom = function (range, center) {

                let
                    off,
                    dist = bellDistribs[range];

                center = Math.round(center);

                if (!dist) {
                    dist = computeBell(range, range / 6, 40);
                }
                off = bellOffsets[range];

                return Math.round(center + dist[off[-center] + rng.getInt(off[range - center + 1] - off[-center])]);
            },

            randPolyId = rng.getInt(polySet.length - 1),
            roulette = rng.getFloat(2.0); // equally likely to change colour/alpha as shape

        // mutate colour
        if (roulette < 1) {

            if (this.palette === 'greyscale') {

                const newC = bellRandom(255, polySet[randPolyId].colour.r);
                polySet[randPolyId].colour.r = newC;
                polySet[randPolyId].colour.g = newC;
                polySet[randPolyId].colour.b = newC;
                if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = Math.round(3.9 * bellRandom(255, Math.floor(polySet[randPolyId].colour.a * 255))) / 1000;
                }

            } else {

                if (roulette < 0.25) { // red
                    polySet[randPolyId].colour.r = bellRandom(255, polySet[randPolyId].colour.r);
                } else if (roulette < 0.5) { // green
                    polySet[randPolyId].colour.g = bellRandom(255, polySet[randPolyId].colour.g);
                } else if (roulette < 0.75) { // blue
                    polySet[randPolyId].colour.b = bellRandom(255, polySet[randPolyId].colour.b);
                } else if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = Math.round(3.9 * bellRandom(255, Math.floor(polySet[randPolyId].colour.a * 255))) / 1000;
                }

            }

        } else {   // mutate coords

            const
                randPolyCoord = rng.getInt(polySet[randPolyId].coords.length - 1), //could be x or y.
                boundingBox = Poly.getBoundingBox(this.width, this.height, this.maxDim, polySet[randPolyId], [randPolyCoord]);

            let newVal = polySet[randPolyId].coords[randPolyCoord] + Math.round(this.maxDim / 2) - bellRandom(this.maxDim, this.maxDim / 2);

            if (randPolyCoord % 2 === 0) { // even, so x-coordinate
                newVal = clamp(newVal, boundingBox.minX, boundingBox.maxX);
            } else { // y-coordinate
                newVal = clamp(newVal, boundingBox.minY, boundingBox.maxY);
            }
            if (newVal === polySet[randPolyId].coords[randPolyCoord]) {
                // nothing has changed, go to next evolutionary step.
                return {
                    type: 'gaussian',
                    poly: null
                };
            } else {
                polySet[randPolyId].coords[randPolyCoord] = newVal;
            }

        }

        return {
            type: 'gaussian',
            poly: randPolyId
        };

    }

    randomOne(polySet) {
        var
            randPolyId = rng.getInt(polySet.length - 1),
            roulette = rng.getFloat(2.0), // equally likely to change colour/alpha as shape
            randPolyCoord,
            newVal;

        if (roulette < 1) { // mutate colour

            if (this.palette === 'greyscale') { // greyscale

                var newC = rng.getInt(255);
                polySet[randPolyId].colour.r = newC;
                polySet[randPolyId].colour.g = newC;
                polySet[randPolyId].colour.b = newC;
                if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = rng.getInt(1000) / 1000;
                }

            } else {

                if (roulette < 0.25) { // red
                    polySet[randPolyId].colour.r = rng.getInt(255);
                } else if (roulette < 0.5) { // green
                    polySet[randPolyId].colour.g = rng.getInt(255);
                } else if (roulette < 0.75) { // blue
                    polySet[randPolyId].colour.b = rng.getInt(255);
                } else if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = rng.getInt(1000) / 1000;
                }

            }

        } else { // mutate coords
            randPolyCoord = rng.getInt(polySet[randPolyId].coords.length - 1); //could be x or y.
            const boundingBox = Poly.getBoundingBox(this.width, this.height, this.maxDim, polySet[randPolyId], [randPolyCoord]);
            if (randPolyCoord % 2 === 0) { // even, so x-coordinate
                newVal = boundingBox.minX + rng.getInt(this.maxDim);
            } else { // y-coordinate
                newVal = boundingBox.minY + rng.getInt(this.maxDim);
            }
            if (newVal === polySet[randPolyId].coords[randPolyCoord]) {
                randPolyId = null; // nothing has changed, go to next evolutionary step.
            } else {
                polySet[randPolyId].coords[randPolyCoord] = newVal;
            }
        }

        return {
            type: 'randomOne',
            poly: randPolyId
        };

    }

    randomAll(polySet) {
        var
            randPolyId = rng.getInt(polySet.length - 1),
            randPolyCoord = rng.getInt(polySet[randPolyId].coords.length - 1);

        if (this.palette === 'greyscale') { // greyscale

            var newC = rng.getInt(255);
            polySet[randPolyId].colour.r = newC;
            polySet[randPolyId].colour.g = newC;
            polySet[randPolyId].colour.b = newC;
            polySet[randPolyId].colour.a = rng.getInt(1000) / 1000;

        } else {

            polySet[randPolyId].colour.r = rng.getInt(255);
            polySet[randPolyId].colour.g = rng.getInt(255);
            polySet[randPolyId].colour.b = rng.getInt(255);
            polySet[randPolyId].colour.a = rng.getInt(1000) / 1000;
        }


        if (randPolyCoord % 2 === 0) { // even, so randPolyCoord is x-coordinate
            const boundingBox = Poly.getBoundingBox(this.width, this.height, this.maxDim, polySet[randPolyId], [randPolyCoord, randPolyCoord + 1]);
            polySet[randPolyId].coords[randPolyCoord] = boundingBox.minX + rng.getInt(this.maxDim);
            polySet[randPolyId].coords[randPolyCoord + 1] = boundingBox.minY + rng.getInt(this.maxDim);
        } else { // randPolyCoord is y-coordinate
            const boundingBox = Poly.getBoundingBox(this.width, this.height, this.maxDim, polySet[randPolyId], [randPolyCoord - 1, randPolyCoord]);
            polySet[randPolyId].coords[randPolyCoord - 1] = boundingBox.minX + rng.getInt(this.maxDim);
            polySet[randPolyId].coords[randPolyCoord] = boundingBox.minY + rng.getInt(this.maxDim);
        }

        return {
            type: 'randomAll',
            poly: randPolyId
        };

    }

    // TODO: check why this is sometimes called with empty array.
    delta(polySet) {

        if (polySet.length === 0) {
            return;
        }

        var
            randPolyId = rng.getInt(polySet.length - 1),
            roulette = rng.getFloat(2.0),
            d = Mutate._getDeltaInt(1),
            randPolyCoord, coordVal;

        if (roulette < 1.0) { // mutate colour

            if (this.palette === 'greyscale') { // greyscale


                if (roulette < 0.75) {
                    var newC = clamp(polySet[randPolyId].colour.r + d, 0, 255);
                    polySet[randPolyId].colour.r = newC;
                    polySet[randPolyId].colour.g = newC;
                    polySet[randPolyId].colour.b = newC;
                } else if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = clamp(polySet[randPolyId].colour.a + 0.1 * d, 0.0, 1.0);
                }

            } else {

                if (roulette < 0.25) { // red
                    polySet[randPolyId].colour.r = clamp(polySet[randPolyId].colour.r + d, 0, 255);
                } else if (roulette < 0.5) { // green
                    polySet[randPolyId].colour.g = clamp(polySet[randPolyId].colour.g + d, 0, 255);
                } else if (roulette < 0.75) { // blue
                    polySet[randPolyId].colour.b = clamp(polySet[randPolyId].colour.b + d, 0, 255);
                } else if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = clamp(polySet[randPolyId].colour.a + 0.1 * d, 0.0, 1.0);
                }

            }

        } else { // mutate coords
            randPolyCoord = rng.getInt(polySet[randPolyId].coords.length - 1); //could be x or y.
            coordVal = polySet[randPolyId].coords[randPolyCoord];

            // fromOneTriangle
            if (randPolyCoord % 2 === 0) { // even, so x-coordinate
                if (coordVal === this.width) {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal - 1;
                } else if (coordVal === 0) {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal + 1;
                } else {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal + d;
                }
            } else { // y-coordinate
                if (coordVal === this.height) {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal - 1;
                } else if (coordVal === 0) {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal + 1;
                } else {
                    polySet[randPolyId].coords[randPolyCoord] = coordVal + d;
                }
            }

        }

        return {
            type: 'delta',
            poly: randPolyId
        };

    }

    // Note this function should not be used as the only mutation option: it does not change the colour.
    // So e.g. you might just get a canvas that stays blank if all the initial polygons are fully transparent.
    addVertex(polySet) {

        var
            maxCoords = this.maxVertices * 2,
            getRandPolyId = function () {
                var
                    i,
                    r = rng.getInt(polySet.length - 1); // start search at a random point
                for (i = 0; i < polySet.length; i += 1) {
                    if (polySet[r].coords.length < maxCoords) {
                        return r;
                    }
                    r = (r + 1) % polySet.length;
                }
                return null;
            },
            roulette = rng.getFloat(1.0),
            poly,
            numCoords,
            randCoordIx,
            randCoordJx,
            midX,
            midY,
            randPolyId = getRandPolyId();

        if (randPolyId === null) {
            return {
                type: 'addVertex',
                poly: null // all polys already have maxVertices
            };
        }

        poly = polySet[randPolyId];
        numCoords = poly.coords.length;
        randCoordIx = rng.getInt(numCoords - 1);

        if (randCoordIx % 2 === 1) { //odd, so y, switch
            randCoordIx -= 1;
        }

        randCoordJx = (randCoordIx + 2) % numCoords;

        // if both points are outwith the actual image, in the same margin, don't bother.
        if ((poly.coords[randCoordIx] <= this.margin && poly.coords[randCoordJx] <= this.margin) || // xs in left margin
            (poly.coords[randCoordIx + 1] <= this.margin && poly.coords[randCoordJx + 1] <= this.margin) || // ys in top margin
            (poly.coords[randCoordIx] > this.imgWidthNoMargin + this.margin && poly.coords[randCoordJx] > this.imgWidthNoMargin + this.margin) || // xs in right margin
            (poly.coords[randCoordIx + 1] > this.imgHeightNoMargin + this.margin && poly.coords[randCoordJx + 1] > this.imgHeightNoMargin + this.margin) // ys in bottom margin
        ) {
            return {
                type: 'addVertex',
                poly: null
            };
        }

        midX = Math.round((poly.coords[randCoordIx] + poly.coords[randCoordJx]) / 2);
        midY = Math.round((poly.coords[randCoordIx + 1] + poly.coords[randCoordJx + 1]) / 2);

        const boundingBox = Poly.getBoundingBox(this.imgWidth, this.imgHeight, this.maxDim, polySet[randPolyId]);

        if (roulette < 0.5) {
            poly.coords.splice(randCoordJx, 0, clamp(midX + Mutate._getDeltaInt(this.maxDim), boundingBox.minX, boundingBox.maxX), midY);
        } else {
            poly.coords.splice(randCoordJx, 0, midX, clamp(midY + Mutate._getDeltaInt(this.maxDim), boundingBox.minY, boundingBox.maxY));
        }

        return {
            type: 'addVertex',
            poly: randPolyId
        };

    }

    rotateFns(polySet) {
        const
            fns = ['randomOne', 'gaussian', 'delta', 'addVertex', 'randomAll'], // in rotation order
            fn = fns[Math.floor(this.stats.numSteps / 128) % fns.length];
        return this[fn](polySet);
    }

    randomFn(polySet) {
        const fns = ['gaussian', 'randomOne', 'randomAll', 'delta'];
        if (this._isAddVertexPossible()) {
            fns.push('addVertex');
        }
        const selectedFn = rng.el(fns);
        return this[selectedFn](polySet);
    }

    weighted(polySet) {
        var
            f, r, rand,
            ratios = {},
            total = 0;

        if (this.stats.numSteps < 2 * this.stepsBeforeHeuristics) { // some relevant ops don't take place before stepsBeforeHeuristics, we need to let them happen first.
            return this.randomFn(polySet);
        }

        for (f in this.stats.mutationFns.improvements) { // this only looks at fns where there have been improvements, but you'd think after so many steps...
            if (this.stats.mutationFns.improvements.hasOwnProperty(f)) {
                r = this.stats.mutationFns.improvements[f] / this.stats.mutationFns.calls[f];
                ratios[f] = r;
                total += r;
            }
        }

        rand = rng.getFloat(total);
        total = 0;

        for (f in ratios) {
            if (ratios.hasOwnProperty(f)) {
                if (total + ratios[f] > rand) {
                    return this[f](polySet);
                } else {
                    total += ratios[f];
                }
            }
        }

        // failsafe: should never get here
        return this.randomFn(polySet);

    }

}
