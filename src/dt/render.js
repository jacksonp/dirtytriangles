export function drawPoly(ctx, coords, colour, scale = 1) {

    const numCoords = coords.length; // number of x, y pairs = (numCoords / 2)

    ctx.fillStyle = "rgba(" + colour.r + "," + colour.g + "," + colour.b + "," + colour.a + ")";
    ctx.beginPath();
    ctx.moveTo(coords[0] * scale, coords[1] * scale);
    for (let i = 2; i < numCoords - 1; i += 2) {
        ctx.lineTo(coords[i] * scale, coords[i + 1] * scale);
    }
    ctx.closePath();
    ctx.fill();

}

export function drawPolySet(ctx, polySet, imgWidth, imgHeight, scale = 1) {

    // this causes there to be no improvements when run in firefox?
    //ctx.clearRect(0, 0, imgWidth, imgHeight);

    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, imgWidth * scale, imgHeight * scale);

    polySet.forEach(function (poly) {
        if (poly !== null) { // there may be null entries e.g. if we're checking fitness by removing a polygon from polySet.
            drawPoly(ctx, poly.coords, poly.colour, scale);
        }
    });

}


