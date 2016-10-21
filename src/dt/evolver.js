import * as rng from './rng'
import {Poly, PolySet} from './polys'
import {drawPolySet} from './render'
import GreyscaleTarget from './target/greyscale'
import SumSquaresTarget from './target/sumSquares'
// import DeltaE76Target from './target/deltaE76'
import Mutate from './mutate'

export default class Evolver {

    constructor(inputImage, imgWidthNoMargin, imgHeightNoMargin, margin,
                maxSizePerc,
                palette, breakUpPolys, removeAUselessVertex, removeAUselessPoly,
                stepsBeforeHeuristics, scale, ctxDisplay) {


        this.stats = {
            numSteps: 0,
            numImprovements: 0,
            mutationFns: {
                calls: {
                    gaussian: 0,
                    randomOne: 0,
                    randomAll: 0,
                    delta: 0,
                    addVertex: 0
                },
                improvements: {
                    gaussian: 0,
                    randomOne: 0,
                    randomAll: 0,
                    delta: 0,
                    addVertex: 0
                }
            }
        };

        this.imgWidthNoMargin = imgWidthNoMargin;
        this.imgHeightNoMargin = imgHeightNoMargin;
        this.margin = margin;
        this.palette = palette;
        this.breakUpPolys = breakUpPolys;
        this.removeAUselessVertex = removeAUselessVertex;
        this.removeAUselessPoly = removeAUselessPoly;
        this.ctxDisplay = ctxDisplay;
        this.scale = scale;

        this.imgWidth = this.imgWidthNoMargin + this.margin + this.margin;
        this.imgHeight = this.imgHeightNoMargin + this.margin + this.margin;

        this.canvasWorking = document.createElement('canvas');
        this.canvasWorking.setAttribute('width', this.imgWidth);
        this.canvasWorking.setAttribute('height', this.imgHeight);
        this.ctxWorking = this.canvasWorking.getContext('2d', {alpha: false});

        const canvasWorking2 = document.createElement('canvas');
        canvasWorking2.setAttribute('width', this.imgWidth);
        canvasWorking2.setAttribute('height', this.imgHeight);
        this.ctxWorking2 = canvasWorking2.getContext('2d', {alpha: false});

        // this.canvasWorking is not visible, use it temporarily to establish our this.target:
        // draw the image onto the canvas:
        this.ctxWorking.drawImage(inputImage, this.margin, this.margin, this.imgWidthNoMargin, this.imgHeightNoMargin);
        // set-up the fitness object for this this.target:
        if (palette === 'greyscale') {
            this.target = new GreyscaleTarget(this.imgWidthNoMargin, this.imgHeightNoMargin, this.margin, this.ctxWorking);
        } else {
            this.target = new SumSquaresTarget(this.imgWidthNoMargin, this.imgHeightNoMargin, this.margin, this.ctxWorking);
        }

        this.polySetWorking = [];
        this.polySetBest = [];

        // set both to min fitness initially:
        this.fitnessBest = this.fitnessWorking = this.target.getMinFitness();

        this.mutator = new Mutate(this.stats, this.imgWidthNoMargin, this.imgHeightNoMargin, this.margin, palette, breakUpPolys, removeAUselessVertex, stepsBeforeHeuristics);

        // start with a random poly/vertex, not always the first
        this.uselessPolyIndex = rng.getUInt32();
        this.uselessVertexPolyIndex = rng.getUInt32();
        this.uselessVertexVertexIndex = rng.getUInt32();
        this.breakUpPolyIndex = rng.getUInt32();

    }

    calcFitness(ctx, polySet) {
        drawPolySet(ctx, polySet, this.imgWidth, this.imgHeight);
        return this.target.getFitness(ctx);
    }

    _removeAUselessVertex() {

        this.uselessVertexPolyIndex = this.uselessVertexPolyIndex % this.polySetWorking.length;

        if (this.uselessVertexVertexIndex >= this.polySetWorking[this.uselessVertexPolyIndex].coords.length) {
            // if we've tried all the vertices in poly
            this.uselessVertexPolyIndex = (this.uselessVertexPolyIndex + 1) % this.polySetWorking.length;
            this.uselessVertexVertexIndex = 0;
        }

        // if this.polySetWorking[this.uselessVertexPolyIndex] is a triangle, don't touch it.
        if (this.polySetWorking[this.uselessVertexPolyIndex].coords.length <= 6) {
            this.uselessVertexPolyIndex += 1;
            return;
        }

        const
            delCoords = this.polySetWorking[this.uselessVertexPolyIndex].coords.splice(this.uselessVertexVertexIndex, 2), //2: remove both x and y
            newFitness = this.calcFitness(this.ctxWorking, this.polySetWorking);

        if (newFitness <= this.fitnessBest) {
            this.fitnessBest = newFitness;
            this.polySetBest[this.uselessVertexPolyIndex].coords.splice(this.uselessVertexVertexIndex, 2); //2: remove both x and y
            // TODO: see about adding to render queue here?
            this.uselessVertexVertexIndex = 0;
            this.uselessVertexPolyIndex += 1;
        } else {
            // put delCoords back in this.polySetWorking[this.uselessVertexPolyIndex]
            this.polySetWorking[this.uselessVertexPolyIndex].coords.splice(this.uselessVertexVertexIndex, 0, delCoords[0], delCoords[1]);
            this.uselessVertexVertexIndex += 2;
        }

    }

    _removeAUselessPoly(threshold) {

        this.uselessPolyIndex = this.uselessPolyIndex % this.polySetWorking.length;

        drawPolySet(this.ctxWorking, this.polySetWorking, this.imgWidth, this.imgHeight);

        const removedPoly = this.polySetWorking[this.uselessPolyIndex];

        this.polySetWorking[this.uselessPolyIndex] = null;
        drawPolySet(this.ctxWorking2, this.polySetWorking, this.imgWidth, this.imgHeight);

        const {pixDiff, pixBetter1} = this.target.getDiffStats(this.ctxWorking, this.ctxWorking2);

        if (pixDiff === 0 || pixBetter1 / pixDiff < threshold) {
            this.polySetWorking.splice(this.uselessPolyIndex, 1);
            this.polySetBest.splice(this.uselessPolyIndex, 1);
            this.fitnessBest = this.calcFitness(this.ctxWorking, this.polySetBest);
        } else {
            this.polySetWorking[this.uselessPolyIndex] = removedPoly;
            this.uselessPolyIndex += 1;
        }

    }

    _breakUpPoly() {

        this.breakUpPolyIndex = this.breakUpPolyIndex % this.polySetWorking.length;

        const canBreak = Poly.canBreakUpPoly(this.polySetWorking[this.breakUpPolyIndex]);

        if (canBreak !== false) {
            this.polySetWorking.splice(this.breakUpPolyIndex, 1, canBreak.polyA, canBreak.polyB);
            this.polySetBest.splice(this.breakUpPolyIndex, 1, Poly.clone(canBreak.polyA), Poly.clone(canBreak.polyB));

            // it's possible that the fitness has changed because of this breakUpPoly.
            // we need to reset fitness best to not get stuck trying to beat a better this.fitnessBest from before the break.
            this.fitnessBest = this.calcFitness(this.ctxWorking, this.polySetWorking);

            // Skip the one we just spliced in next time around:
            this.breakUpPolyIndex += 1;
        }

        this.breakUpPolyIndex += 1;

    }

    addAPoly(minPolygonSize, maxPolygonSize, numVertices) {

        const
            maxDim = Poly.makeDimension(minPolygonSize, maxPolygonSize, this.imgWidth, this.imgHeight),
            poly = Poly.makeRandom(this.imgWidth, this.imgHeight, numVertices, maxDim, 'colourRandom', this.palette);

        this.polySetWorking.push(poly);
        const newFitness = this.calcFitness(this.ctxWorking, this.polySetWorking);
        if (newFitness < this.fitnessBest) {
            this.polySetBest.push(Poly.clone(poly));
            this.fitnessBest = newFitness;
        } else {
            this.polySetWorking.pop();
        }
    }

    /**
     * Returns the fitness at the end of the step, or null if no mutation took place.
     *
     */
    step(state) {

        this.stats.numSteps += 1;

        var
            mutateRes,
            numSteps = this.stats.numSteps;

        if (this.polySetWorking.length === 0 || (this.polySetWorking.length < state.maxPolygons && numSteps % 199 === 0)) { // 199 is prime
            this.addAPoly(state.minPolygonSize, state.maxPolygonSize, state.minVertices);
        }

        //if (numSteps > this.stepsBeforeHeuristics) {

        if (this.removeAUselessVertex && numSteps % 89 === 0) { //89 is prime
            this._removeAUselessVertex();
        }

        if (this.removeAUselessPoly && this.polySetWorking.length > 1 && numSteps % 97 === 0) { //97 is prime
            this._removeAUselessPoly(this.removeAUselessPoly);
        }

        if (this.breakUpPolys && numSteps % 131 === 0) { // 131 is prime
            this._breakUpPoly();
        }

        //}

        // returns the index of the mutated poly if mutation tool place, null if no mutation took place:
        mutateRes = this.mutator[state.mutateFn](this.polySetWorking, state);

        this.stats.mutationFns.calls[mutateRes.type] += 1;

        if (mutateRes.poly === null) {
            // mutation did not take place for whatever reason.
            return null;
        }

        this.fitnessWorking = this.calcFitness(this.ctxWorking, this.polySetWorking);

        if (this.fitnessWorking < this.fitnessBest) { // do not favour change over constancy: we don't want endless changes in the margins.

            this.stats.numImprovements += 1;
            this.stats.mutationFns.improvements[mutateRes.type] += 1; // maybe include break up polys + remove poly + remove vertex?

            // need to update this.fitnessBest regardless, possible it got worse
            this.fitnessBest = this.fitnessWorking;

            // this.polySetBest = PolySet.clone(this.polySetWorking);
            this.polySetBest[mutateRes.poly] = Poly.clone(this.polySetWorking[mutateRes.poly]);

            // PolySet.scale(this.polySetBest, this.scale);
            //polySetRenderQueue.push(PolySet.clone(this.polySetBest))wdrawPolySet(this.ctxBest, set, w, h);


            drawPolySet(this.ctxDisplay, this.polySetBest, this.imgWidth, this.imgHeight, this.scale);
            // this.ctxDisplay.drawImage(this.canvasWorking, 0, 0, this.imgWidth * this.scale, this.imgHeight * this.scale);

        } else {
            this.polySetWorking[mutateRes.poly] = Poly.clone(this.polySetBest[mutateRes.poly]);
        }

        return this.fitnessBest;

    }

    set polySet(polySet) {
        this.polySetBest = PolySet.clone(polySet);
        this.polySetWorking = PolySet.clone(polySet);
        const newFitness = this.calcFitness(this.ctxWorking, this.polySetWorking);
        this.fitnessBest = newFitness;
        this.fitnessWorking = newFitness;
    }

}
