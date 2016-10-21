import Target from './target'
import convert from 'color-convert';

// http://zschuessler.github.io/DeltaE/learn/
export default class DeltaE76Target extends Target {


    constructor(width, height, margin, ctx) {
        super(width, height, margin);

        this.targetData = ctx.getImageData(margin, margin, width, height).data;
        this.numPixelComponents = width * height * 4;  // red, green, blue, alpha

        var i;
        for (i = 0; i < this.numPixelComponents - 3; i += 4) {
            const lab = convert.rgb.lab([this.targetData[i], this.targetData[i + 1], this.targetData[i + 2]]);
            this.targetData[i] = lab[0];
            this.targetData[i + 1] = lab[1];
            this.targetData[i + 2] = lab[2];
        }
    }

    getFitness(ctx) {
        var
            i,
            fitness = 0;
        const workingData = ctx.getImageData(this.margin, this.margin, this.imgWidth, this.imgHeight).data;

        for (i = 0; i < this.numPixelComponents - 3; i += 4) {
            const lab = convert.rgb.lab([workingData[i], workingData[i + 1], workingData[i + 2]]);
            fitness += Math.sqrt(
                Math.pow(this.targetData[i] - lab[0], 2) +
                Math.pow(this.targetData[i + 1] - lab[1], 2) +
                Math.pow(this.targetData[i + 2] - lab[2], 2)
            );
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

                const lab1 = convert.rgb.lab([workingData1[i], workingData1[i + 1], workingData1[i + 2]]);
                const lab2 = convert.rgb.lab([workingData2[i], workingData2[i + 1], workingData2[i + 2]]);

                diff1 = Math.pow(this.targetData[i] - lab1[0], 2) +
                    Math.pow(this.targetData[i + 1] - lab1[1], 2) +
                    Math.pow(this.targetData[i + 2] - lab1[2], 2);

                diff2 = Math.pow(this.targetData[i] - lab2[0], 2) +
                    Math.pow(this.targetData[i + 1] - lab2[1], 2) +
                    Math.pow(this.targetData[i + 2] - lab2[2], 2);

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
        return this.imgWidth * this.imgHeight * 100;
    }

}
