/*
 * We do not need to worry about the transparency when looking at the fitness: the white solid background means that we have
 * 100% opacity on all pixels in the working/best canvas. Otherwise see:
 * http://stackoverflow.com/questions/746899/how-to-calculate-an-rgb-colour-by-specifying-an-alpha-blending-amount
 */
export default class Target {

    constructor(width, height, margin) {
        this.imgWidth = width;
        this.imgHeight = height;
        this.margin = margin;
    }

}
