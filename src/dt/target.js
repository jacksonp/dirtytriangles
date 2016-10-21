/*
 * We do not need to worry about the transparency when looking at the fitness: the white solid background means that we have
 * 100% opacity on all pixels in the working/best canvas. Otherwise see:
 * http://stackoverflow.com/questions/746899/how-to-calculate-an-rgb-colour-by-specifying-an-alpha-blending-amount
 */
class Target {

    constructor(width, height, margin) {
        this.imgWidth = width;
        this.imgHeight = height;
        this.margin = margin;
    }

}

// http://zschuessler.github.io/DeltaE/learn/
export class DeltaE76Target extends Target {


    constructor(width, height, margin, ctx) {
        super(width, height, margin);

        this.targetData = ctx.getImageData(margin, margin, width, height).data;
        this.numPixelComponents = width * height * 4;  // red, green, blue, alpha

        var i;
        for (i = 0; i < this.numPixelComponents - 3; i += 4) {
            const lab = DeltaE76Target.rgb2lab([this.targetData[i], this.targetData[i + 1], this.targetData[i + 2]]);
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
            const lab = DeltaE76Target.rgb2lab([workingData[i], workingData[i + 1], workingData[i + 2]]);
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

                const lab1 = DeltaE76Target.rgb2lab([workingData1[i], workingData1[i + 1], workingData1[i + 2]]);
                const lab2 = DeltaE76Target.rgb2lab([workingData2[i], workingData2[i + 1], workingData2[i + 2]]);

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


    // https://github.com/Qix-/color-convert/blob/master/conversions.js
    static rgb2xyz(rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;

        // assume sRGB
        r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
        g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
        b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

        var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
        var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
        var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

        return [x * 100, y * 100, z * 100];
    }

    static rgb2lab(rgb) {
        var xyz = DeltaE76Target.rgb2xyz(rgb);
        var x = xyz[0];
        var y = xyz[1];
        var z = xyz[2];
        var l;
        var a;
        var b;

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);

        return [l, a, b];
    }

}

export class SumSquaresTarget extends Target {

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

export class GreyscaleTarget extends Target {

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
