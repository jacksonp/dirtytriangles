import Target from './target'

export default class GreyscaleTarget extends Target {

    constructor(width, height, margin, ctx) {
        super(width, height, margin);

        const imageData = ctx.getImageData(margin, margin, width, height).data;
        this.numPixelComponents = width * height;
        this.targetData = [];

        //Y=0.3RED+0.59GREEN+0.11Blue
        for (let i = 0; i < this.numPixelComponents; i += 1) {
            // use Luminosity = 0.21 × R + 0.72 × G + 0.07 × B as per gimp
            this.targetData.push(
                parseInt(imageData[i * 4] * 0.21 + imageData[i * 4 + 1] * 0.72 + imageData[i * 4 + 2] * 0.07)
            );
        }
    }

    getFitness(ctx) {
        var
            i,
            fitness = 0;
        const workingData = ctx.getImageData(this.margin, this.margin, this.imgWidth, this.imgHeight).data;

        for (i = 0; i < this.numPixelComponents; i += 1) {
            fitness += Math.pow(this.targetData[i] - workingData[i * 4], 2); // r, g & b are the same, just diff one.
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

        for (i = 0; i < this.numPixelComponents; i += 1) {
            if (workingData1[i * 4] !== workingData2[i * 4]) {
                pixDiff += 1;
                diff1 = Math.pow(this.targetData[i] - workingData1[i * 4], 2);
                diff2 = Math.pow(this.targetData[i] - workingData2[i * 4], 2);
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
        return this.imgWidth * this.imgHeight * 255 * 255;
    }

}
