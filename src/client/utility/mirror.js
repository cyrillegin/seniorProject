function mirrorX(start) {
    console.log(start);
    const end = {
        start: [-start.start[0], start.start[1], start.start[2]],
        end: [-start.end[0], start.end[1], start.end[2]],
        startControl: [-start.startControl[0], start.startControl[1], start.startControl[2]],
        endControl: [-start.endControl[0], start.endControl[1], start.endControl[2]],
    };
    return end;
}

export default mirrorX;
