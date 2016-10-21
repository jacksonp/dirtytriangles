import Target from './target'

export default class SumSquaresTarget extends Target {

    constructor(width, height, margin, ctx) {
        super(width, height, margin);

        this.targetData = ctx.getImageData(margin, margin, width, height).data;
        this.numPixelComponents = width * height * 4;  // red, green, blue, alpha
    }

    // could also calculate the fitness for the bounding box surrounding the poly before and after the change and compare them...

    getFitness(ctx) {
        // 2016-11-10: using "let" here instead of var makes the process about 4x slower.
        var
            i,
            fitness = 0;
        const workingData = ctx.getImageData(this.margin, this.margin, this.imgWidth, this.imgHeight).data;

        for (i = 0; i < this.numPixelComponents - 3; i += 4) {
            fitness += Math.pow(this.targetData[i] - workingData[i], 2) +
                Math.pow(this.targetData[i + 1] - workingData[i + 1], 2) +
                Math.pow(this.targetData[i + 2] - workingData[i + 2], 2);
            // ignore i + 3: the alpha channel
        }

        return fitness;
    }

    getDiffStats(ctx1, ctx2) {
        var
            i,
            pixDiff = 0, pixBetter1 = 0,
            diff1, diff2,
            workingData1 = ctx1.getImageData(this.margin, this.margin, this.imgWidth, this.imgHeight).data,
            workingData2 = ctx2.getImageData(this.margin, this.margin, this.imgWidth, this.imgHeight).data;

        for (i = 0; i < this.numPixelComponents - 3; i += 4) {
            if (workingData1[i] !== workingData2[i]
                || workingData1[i + 1] !== workingData2[i + 1]
                || workingData1[i + 2] !== workingData2[i + 2]) {

                pixDiff += 1;

                diff1 = Math.pow(this.targetData[i] - workingData1[i], 2) +
                    Math.pow(this.targetData[i + 1] - workingData1[i + 1], 2) +
                    Math.pow(this.targetData[i + 2] - workingData1[i + 2], 2);

                diff2 = Math.pow(this.targetData[i] - workingData2[i], 2) +
                    Math.pow(this.targetData[i + 1] - workingData2[i + 1], 2) +
                    Math.pow(this.targetData[i + 2] - workingData2[i + 2], 2);

                if (diff1 < diff2) {
                    pixBetter1 += 1;
                }

            }

        }

        return {
            pixDiff: pixDiff,
            pixBetter1: pixBetter1
        };

    }

    getMinFitness() {
        return this.imgWidth * this.imgHeight * 3 * 255 * 255;
    }

}
