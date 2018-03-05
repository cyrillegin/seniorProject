function mirrorX(start, width) {
    const end = {
        start: [-start.start[0] - width, start.start[1], start.start[2]],
        end: [-start.end[0] - width, start.end[1], start.end[2]],
        startControl: [-start.startControl[0] - width, start.startControl[1], start.startControl[2]],
        endControl: [-start.endControl[0] - width, start.endControl[1], start.endControl[2]],
    };
    return end;
}

export default mirrorX;
