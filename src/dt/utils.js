export function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    if (val > max) {
        return max;
    }
    return val;
}

// get time-stamp in milliseconds
export function getTimeStamp() {
    return (new Date()).getTime();
}
