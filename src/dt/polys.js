import * as rng from './rng'
import {clamp} from './utils'

export class Poly {

    static makeRandom(imgWidth, imgHeight, iniVertices, maxDim, colourFn, palette) {
        let minX, minY, maxX, maxY;
        const coords = [];

        for (let i = 0; i < iniVertices; i += 1) {
            let x, y;
            if (i === 0) {
                x = rng.getInt(imgWidth);
                y = rng.getInt(imgHeight);
                minX = maxX = x;
                minY = maxY = y;
            } else {
                x = (maxX - maxDim) + rng.getInt((minX + maxDim) - (maxX - maxDim));
                y = (maxY - maxDim) + rng.getInt((minY + maxDim) - (maxY - maxDim));
                x = clamp(x, 0, imgWidth);
                y = clamp(y, 0, imgHeight);
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
            }
            coords.push(x, y);
        }

        return {
            colour: this[colourFn](palette),
            coords: coords
        };
    }

    static makeDimension(minSizePercentage, maxSizePercentage, width, height) {
        const maxSizePerc = minSizePercentage + rng.getInt(maxSizePercentage - minSizePercentage);
        if (width > height) {
            return Math.round(maxSizePerc * width / 100);
        } else {
            return Math.round(maxSizePerc * height / 100);
        }
    }

    static colourIni() {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 0.001
        };
    }

    static colourRandom(palette) {
        if (palette === 'greyscale') {
            const c = rng.getInt(255);
            return {
                r: c,
                g: c,
                b: c,
                a: rng.getFloat(1.0)
            };
        } else {
            return {
                r: rng.getInt(255),
                g: rng.getInt(255),
                b: rng.getInt(255),
                a: rng.getFloat(1.0)
            };
        }
    }

    static cloneColour(colour) {
        return Object.assign({}, colour);
    }

    static clone(poly) {
        return {
            coords: poly.coords.slice(0),
            colour: Poly.cloneColour(poly.colour)
        };
    }

    static scale(poly, scale) {
        for (let i = 0; i < poly.coords.length; i += 1) {
            poly.coords[i] = Math.round(poly.coords[i] * scale);
        }
    }

    static getIntersection(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {

        const
            ua_t = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x),
            ub_t = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);

        let u_b = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);

        if (u_b !== 0) {

            let
                ua = ua_t / u_b,
                ub = ub_t / u_b;

            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                return {
                    x: Math.round(a1x + ua * (a2x - a1x)),
                    y: Math.round(a1y + ua * (a2y - a1y))
                };
            } else {
                // no intersection
                return false;
            }
        } else {
            if (ua_t === 0 || ub_t === 0) {
                // coincident
                return false;
            } else {
                // parallel
                return false;
            }
        }
    }

    static getLinePolyIntersections(a1x, a1y, a2x, a2y, coords) {

        const
            numCoords = coords.length,
            intersections = [];

        for (let i = 0; i < numCoords - 1; i += 2) {
            let intersection = Poly.getIntersection(a1x, a1y, a2x, a2y, coords[i], coords[i + 1], coords[(i + 2) % numCoords], coords[(i + 3) % numCoords]);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        return intersections;

    }

    // if this poly has 2 lines that cross, we might want to break it into 2 polys
    static canBreakUpPoly(poly) {
        const
            coords = poly.coords,
            numCoords = coords.length;

        if (numCoords < 8) {
            return false; // minimum is hourglass shape, with 4 vertices.
        }

        for (let i = 0; i < numCoords - 2; i += 2) { // iterate over each vertex but last (we don't need to check if the last line intersects if we've already checked all the others).

            for (let k = i + 4; k < numCoords; k += 2) { // iterate over each remaining vertex after vertexI (could add a check here for the special case of not having to compare the first vertex to the last
                // line1 is from i,i+1 to i+2,i+3
                // line2 is from k,k+1 to k+2,k+3

                const intersection = Poly.getIntersection(
                    coords[i], coords[i + 1], //line1A.
                    coords[i + 2], coords[i + 3], //line1B. ok: last line1 visited is numCoords-4,numCoords-3 to numCoords-2,numCoords-1
                    coords[k], coords[k + 1], //line2A.
                    coords[k + 2], coords[k + 3]); //line2B.

                if (intersection !== false) {
                    // there is an intersection.

                    let
                        poly1Coords = [],
                        poly2Coords = [];

                    for (let j = i + 2; j <= k; j += 2) {
                        poly1Coords.push(coords[j], coords[j + 1]);
                    }

                    for (let j = 0; j < numCoords - poly1Coords.length; j += 2) {
                        poly2Coords.push(coords[(k + 2 + j) % numCoords], coords[(k + 3 + j) % numCoords]);
                    }

                    poly1Coords.push(intersection.x, intersection.y);
                    poly2Coords.push(intersection.x, intersection.y);

                    return {
                        polyA: {
                            coords: poly1Coords,
                            colour: Poly.cloneColour(poly.colour)
                        },
                        polyB: {
                            coords: poly2Coords,
                            colour: Poly.cloneColour(poly.colour)
                        }
                    };

                }
            }
        }

        return false;
    }

    static getBoundingBox(imgWidth, imgHeight, maxDim, poly, excludeCoords = []) {
        const
            coords = poly.coords,
            numVertices = coords.length;
        let
            minX = coords[0],
            minY = coords[1],
            maxX = minX,
            maxY = minY;


        for (let i = 2; i < numVertices; i += 2) {
            if (excludeCoords.indexOf(i) === -1) {
                let x = coords[i];
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
            }
            if (excludeCoords.indexOf(i + 1) === -1) {
                let y = coords[i + 1];
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
            }
        }

        // the poly's current bounding box:
        // poly: {
        //   minX: minX,
        //   minY: minY,
        //   maxX: maxX,
        //   maxY: maxY
        // }

        // acceptable range for new coordinates:
        return {
            minX: clamp(maxX - maxDim, 0, imgWidth),
            minY: clamp(maxY - maxDim, 0, imgHeight),
            maxX: clamp(minX + maxDim, 0, imgWidth),
            maxY: clamp(minY + maxDim, 0, imgHeight)
        };

    }

}

export class PolySet {

    static create(iniPolygons, imgWidth, imgHeight, iniVertices, maxDim, colourFn, palette) {
        const polySet = [];
        for (let i = 0; i < iniPolygons; i += 1) {
            polySet.push(
                Poly.makeRandom(imgWidth, imgHeight, iniVertices, maxDim, colourFn, palette)
            );
        }
        return polySet;
    }

    static clone(polySet) {
        return polySet.map(Poly.clone);
    }

    static scale(polySet, scale) {
        polySet.forEach(function (poly) {
            Poly.scale(poly, scale);
        });
    }

}
