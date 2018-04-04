let options = {
    sides: 7,
    period: 20,
    skip: 3,
    pointNumber: 12,
    fr: 60,
    addLineFolder() {
        const newFolder = gui.addFolder(
            "Line "
            + (parseInt((lineFolders[lineFolders.length - 1] || {name: "0"}).name.replace(/[^\d]/g, '')) + 1)
        );
        const newFolderOptions = {
            destroy() {
                newFolder.getRoot().removeFolder(newFolder);
                lineFolders.splice(lineFolders.indexOf(newFolder), 1);
            },
            offset: 0
        }
        newFolder.add(newFolderOptions, "destroy");
        newFolder.add(newFolderOptions, "offset", 0).step(1);
        newFolder.options = newFolderOptions;
        lineFolders.push(newFolder);
    }
}

let gui;

const lineFolders = []

function setup() {
    createCanvas(500, 500);
    frameRate(options.fr);
    gui = new dat.GUI();
    gui.add(options, "sides", 0, 25).step(1);
    gui.add(options, "period", 0);
    gui.add(options, "skip", 0).step(1);
    gui.add(options, "pointNumber", 0, 50).step(1);
    gui.add(options, "addLineFolder");
}

function draw() {
    const time = frameCount / options.fr / options.period;
    clear();

    let points = [];

    for (let i = 0; i < options.pointNumber; i++) {
        const pathLocation = path(time + (i/options.pointNumber));
        points.push(pathLocation);
    }

    for (const point of points) {
        const scaledPoint = scalePoint(point);
        for (const lineFolder of lineFolders) {
            const folderPoint = scalePoint(points[(points.indexOf(point) + lineFolder.options.offset) % points.length]);
            line(scaledPoint.x, scaledPoint.y, folderPoint.x, folderPoint.y);
        }
        ellipse(scaledPoint.x, scaledPoint.y, 5, 5);
    }
}

function path(location) {
    const index = Math.floor(location * options.sides);
    const nearestLoc = index * options.skip / options.sides;
    const skipLoc = (index * options.skip + options.skip) / options.sides;
    const nearestRadians = TAU * nearestLoc;
    const skipRadians = TAU * skipLoc;

    const point1 = {
        x: Math.cos(nearestRadians),
        y: Math.sin(nearestRadians)
    };

    const point2 = {
        x: Math.cos(skipRadians),
        y: Math.sin(skipRadians)
    }

    const travel = cosstep((location * options.sides) % 1);

    return {
        x: lerp(point1.x, point2.x, travel),
        y: lerp(point1.y, point2.y, travel)
    };
}

function cosstep(x) {
    return (-Math.cos(x * PI)+1)/2
}

function scalePoint(point) {
    return {
        x: point.x * width / 2 + width / 2,
        y: point.y * height / 2 + height / 2
    }
}