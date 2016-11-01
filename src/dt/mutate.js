import * as rng from './rng'
import {clamp, calcMaxDim} from './utils'
import {Poly} from './polys'

export const MUTATION = Object.freeze({
    'Delta': 'delta',
    'Gaussian': 'gaussian',
    'Random Value - One Attribute': 'randomOne',
    'Random Value - All Attributes': 'randomAll',
    'Add Vertex': 'addVertex',
    'Random Mutation - Each Step': 'randomFn',
    // 'Rotate Mutations': 'rotateFns',
    'Random Mutation - Weighted': 'weighted'
});

/*
 * Mutate functions modify the objects in place, and return the index of the polygon that was modified.
 *
 */

export default class Mutate {

    constructor(stats, imgWidthNoMargin, imgHeightNoMargin, margin, palette, breakUpPolys, removeAUselessVertex, stepsBeforeHeuristics) {
        this.stats = stats;
        this.imgWidthNoMargin = imgWidthNoMargin;
        this.imgHeightNoMargin = imgHeightNoMargin;
        this.width = imgWidthNoMargin + margin + margin;
        this.height = imgHeightNoMargin + margin + margin;
        this.margin = margin;
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

    gaussian(polySet, state) {

        const

            randPolyId = rng.getInt(polySet.length - 1),
            roulette = rng.getFloat(2.0); // equally likely to change colour/alpha as shape

        // mutate colour
        if (roulette < 1) {

            if (this.palette === 'greyscale') {

                const newC = rng.bell(255, polySet[randPolyId].colour.r);
                polySet[randPolyId].colour.r = newC;
                polySet[randPolyId].colour.g = newC;
                polySet[randPolyId].colour.b = newC;
                if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = Math.round(3.9 * rng.bell(255, Math.floor(polySet[randPolyId].colour.a * 255))) / 1000;
                }

            } else {

                if (roulette < 0.25) { // red
                    polySet[randPolyId].colour.r = rng.bell(255, polySet[randPolyId].colour.r);
                } else if (roulette < 0.5) { // green
                    polySet[randPolyId].colour.g = rng.bell(255, polySet[randPolyId].colour.g);
                } else if (roulette < 0.75) { // blue
                    polySet[randPolyId].colour.b = rng.bell(255, polySet[randPolyId].colour.b);
                } else if (roulette < 1.0) { // alpha
                    polySet[randPolyId].colour.a = Math.round(3.9 * rng.bell(255, Math.floor(polySet[randPolyId].colour.a * 255))) / 1000;
                }

            }

        } else {   // mutate coords

            const
                maxDim = Poly.makeDimension(state.minPolygonSize, state.maxPolygonSize, this.width, this.height),
                randPolyCoord = rng.getInt(polySet[randPolyId].coords.length - 1), //could be x or y.
                boundingBox = Poly.getBoundingBox(this.width, this.height, maxDim, polySet[randPolyId], [randPolyCoord]);

            let newVal = polySet[randPolyId].coords[randPolyCoord] + Math.round(maxDim / 2) - rng.bell(maxDim, maxDim / 2);

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

    randomOne(polySet, state) {
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
            const
                maxDim = Poly.makeDimension(state.minPolygonSize, state.maxPolygonSize, this.width, this.height),
                boundingBox = Poly.getBoundingBox(this.width, this.height, maxDim, polySet[randPolyId], [randPolyCoord]);
            if (randPolyCoord % 2 === 0) { // even, so x-coordinate
                newVal = boundingBox.minX + rng.getInt(maxDim);
            } else { // y-coordinate
                newVal = boundingBox.minY + rng.getInt(maxDim);
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

    randomAll(polySet, state) {
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

        const maxDim = Poly.makeDimension(state.minPolygonSize, state.maxPolygonSize, this.width, this.height);

        if (randPolyCoord % 2 === 0) { // even, so randPolyCoord is x-coordinate
            const boundingBox = Poly.getBoundingBox(this.width, this.height, maxDim, polySet[randPolyId], [randPolyCoord, randPolyCoord + 1]);
            polySet[randPolyId].coords[randPolyCoord] = boundingBox.minX + rng.getInt(maxDim);
            polySet[randPolyId].coords[randPolyCoord + 1] = boundingBox.minY + rng.getInt(maxDim);
        } else { // randPolyCoord is y-coordinate
            const boundingBox = Poly.getBoundingBox(this.width, this.height, maxDim, polySet[randPolyId], [randPolyCoord - 1, randPolyCoord]);
            polySet[randPolyId].coords[randPolyCoord - 1] = boundingBox.minX + rng.getInt(maxDim);
            polySet[randPolyId].coords[randPolyCoord] = boundingBox.minY + rng.getInt(maxDim);
        }

        return {
            type: 'randomAll',
            poly: randPolyId
        };

    }

    // TODO: check why this is sometimes called with empty array.
    delta(polySet, state) {

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
    addVertex(polySet, state) {

        var
            maxCoords = state.maxVertices * 2,
            getRandPolyId = function () {
                let r = rng.getInt(polySet.length - 1); // start search at a random point
                for (let i = 0; i < polySet.length; i += 1) {
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

        const
            maxDim = Poly.makeDimension(state.minPolygonSize, state.maxPolygonSize, this.width, this.height),
            boundingBox = Poly.getBoundingBox(this.imgWidth, this.imgHeight, maxDim, polySet[randPolyId]);

        if (roulette < 0.5) {
            poly.coords.splice(randCoordJx, 0, clamp(midX + Mutate._getDeltaInt(maxDim), boundingBox.minX, boundingBox.maxX), midY);
        } else {
            poly.coords.splice(randCoordJx, 0, midX, clamp(midY + Mutate._getDeltaInt(maxDim), boundingBox.minY, boundingBox.maxY));
        }

        return {
            type: 'addVertex',
            poly: randPolyId
        };

    }

    rotateFns(polySet, state) {
        const
            fns = ['randomOne', 'gaussian', 'delta', 'addVertex', 'randomAll'], // in rotation order
            fn = fns[Math.floor(this.stats.numSteps / 128) % fns.length];
        return this[fn](polySet, state);
    }

    randomFn(polySet, state) {
        const fns = ['gaussian', 'randomOne', 'randomAll', 'delta', 'addVertex'];
        const selectedFn = rng.el(fns);
        return this[selectedFn](polySet, state);
    }

    weighted(polySet, state) {
        var
            f, r, rand,
            ratios = {},
            total = 0;

        if (this.stats.numSteps < 2 * this.stepsBeforeHeuristics) { // some relevant ops don't take place before stepsBeforeHeuristics, we need to let them happen first.
            return this.randomFn(polySet, state);
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
                    return this[f](polySet, state);
                } else {
                    total += ratios[f];
                }
            }
        }

        // failsafe: should never get here
        return this.randomFn(polySet, state);

    }

    applyMutation(name, polySet, state) {
        return this[name](polySet, state);
    }

}
