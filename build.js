

function drawRect({ x, y, width, height, corners = 0, stroke = "black", strokeWidth = 2, color = "transparent", id }) {
    // Create an SVG shape element, e.g., a rectangle
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", id);
    rect.setAttribute("fill", color);
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("rx", corners);
    rect.setAttribute("ry", corners);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", strokeWidth); // Border thickness in µm
    return rect;
}
function drawLine({ x1, y1, x2, y2, id }) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // newLine.setAttribute('id', 'line2');
    newLine.setAttribute('id', id);

    newLine.setAttribute('x1', x1);

    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", "black")
    return newLine;
}
function drawText({ x, y, fontSize = 50, text }) {
    var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newText.setAttributeNS(null, "x", x);
    newText.setAttributeNS(null, "y", y);
    newText.setAttributeNS(null, "font-size", fontSize);
    newText.innerHTML = text;
    return newText;
}
function drawRuler({ x, y, lenght, oneCMLenght = 100 }) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("x", 0);
    group.setAttribute("y", 0);

    const line = drawRect({ x: x, y: y, width: lenght * oneCMLenght, height: 2 });
    group.appendChild(line);



    for (let i = 0; i < lenght; i++) {
        const xR = x + (i * oneCMLenght)


        //    var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //    newText.setAttributeNS(null, "x", );
        //    newText.setAttributeNS(null, "y",);
        //    newText.setAttributeNS(null, "font-size", "50");
        //    newText.innerHTML = i;
        group.appendChild(drawText({ x: xR - 10, y: y + 100, text: i }));

        for (let j = 0; j <= oneCMLenght; j += oneCMLenght / 10) {

            const tick = drawRect({
                x: xR + j,
                y: y,
                width: 1,
                height:
                    j % 100 == 0 ? 40 :
                        j % 50 == 0 ? 20 :
                            10
            })
            group.appendChild(tick);
        }
    }
    return group;
}
const build = function (selectedBead = null) {

    // Create the SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgW = dosemapper.paperWidth / 10;
    const svgH = dosemapper.paperHeight / 10;

    svg.setAttribute("width", `${svgW}mm`);
    svg.setAttribute("height", `${svgH}mm`);
    svg.setAttribute("viewBox", `0 0 ${dosemapper.paperWidth} ${dosemapper.paperHeight}`); // Define viewBox for scalable units

    const canvasRect = drawRect({ x: 0, y: 0, width: dosemapper.paperWidth, height: dosemapper.paperHeight, color: "transparent" });
    svg.appendChild(canvasRect);

    const container = drawRect({ x: dosemapper.drawingRect.x, y: dosemapper.drawingRect.y, width: dosemapper.drawingRect.width, height: dosemapper.drawingRect.height, color: "transparent" });
    svg.appendChild(container);

    var x0 = dosemapper.drawingRect.x + dosemapper.padding;
    var y0 = dosemapper.drawingRect.y + dosemapper.padding;
    // rectMain = drawRect({ x: x0, y: y0, width: dosemapper.width, height: dosemapper.height, corners: 0, stroke: "#aaaaaa" });
    // svg.appendChild(rectMain);

    const ruler = drawRuler({ x: dosemapper.paperWidth - 500, y: dosemapper.paperHeight - 200, lenght: 2, oneCMLenght: 100 })
    svg.appendChild(ruler);

    const beadW = dosemapper.beadWidth;
    const beadH = dosemapper.beadHeight;
    let beads = [];

    for (let i = 0; i <= dosemapper.width; i += 50) {
        beads.push(
            new Bead(
                x = x0 + i - (beadW / 2),
                y = y0 + dosemapper.height / 2 - (beadH / 2),
                isHighResolution = true,
            )
        )
    }
    for (let i = 0; i <= dosemapper.height; i += 50) {
        beads.push(
            new Bead(
                x = x0 + dosemapper.width / 2 - (beadW / 2),
                y = y0 + i - (beadH / 2),
                isHighResolution = true,
            )
        );
    }
    for (let i = 0; i <= dosemapper.width; i += 100) {
        for (let j = 0; j <= dosemapper.height; j += 100) {
            const bead = new Bead(
                x = x0 + i - (beadW / 2),
                y = y0 + j - (beadH / 2),
                isHighResolution = false,
            )
            if (!beads.find((b) => b.x == bead.x && b.y == bead.y)) beads.push(bead);
        }
    }

    beads.forEach((b, index) => {
        const color = "blue";
        var bead = drawRect({
            x: b.x, y: b.y, width: beadW, height: beadH, corners: 5,
            stroke: color,
            color: color,
            id: index
        });

        bead.addEventListener("click", () => onclickBead(b))

        svg.appendChild(bead);
        // svg.appendChild(drawText({x:b.x ,y:b.y,text:index,fontSize:25}));

    })

    const temp = selectedBead ? beads.find(e => e.x == selectedBead.x && e.y == selectedBead.y) : beads.pop();
    beads = beads.filter((b) => b != temp);
    console.info(selectedBead);
    console.info(temp);

    drawPath(beads, temp).forEach((p) => {
        svg.appendChild(p);
    });

    //draw code rectangle
    svg.appendChild(
        drawRect({
            width: beadW,
            height: 12 * beadH,
            y: y0 + dosemapper.height - 12 * beadH,
            x: x0 + dosemapper.width + dosemapper.padding / 2
        })
    );
    // rectMain = drawRect({ x: x0, y: y0, width: dosemapper.width, height: dosemapper.height, corners: 0, stroke: "#aaaaaa" });
    // svg.appendChild(rectMain);
    // svg.appendChild(rect);

    const svgContainer = document.getElementById("svgContainer");
    svgContainer.innerHTML = "";

    // Append the SVG element to the document body
    svgContainer.appendChild(svg);






    //Download link
    downloadSvg(svg);
    svg2Png(svg);
    // console.info(beads)//prints all attributes of object
}
const downloadSvg = svg => {
    const svgString = new XMLSerializer().serializeToString(svg);
    var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.getElementById('downloadSVG')

    downloadLink.href = svgUrl
    downloadLink.download = 'DOSEmapper-x-y.svg';

}
const svg2Png = async $svg => {

    // const $svg = document.getElementById('svg-container').querySelector('svg')
    const $holder = document.getElementById('downloadING')


    const svgData = encodeAsUTF8(serializeAsXML($svg))

    const img = await loadImage(svgData)

    const $canvas = document.createElement('canvas')
    $canvas.width = $svg.clientWidth
    $canvas.height = $svg.clientHeight
    $canvas.getContext('2d').drawImage(img, 0, 0, $svg.clientWidth, $svg.clientHeight)

    const dataURL = await $canvas.toDataURL(`image/png`, 1.0)
    // console.log(dataURL)

    // const $img = document.createElement('img')
    // $img.src = dataURL
    $holder.download = "dosemapper.png";
    $holder.href = dataURL;

}
const loadImage = async url => {
    const $img = document.createElement('img')
    $img.src = url
    return new Promise((resolve, reject) => {
        $img.onload = () => resolve($img)
        $img.onerror = reject
    })
}

const dataHeader = 'data:image/svg+xml;charset=utf-8'

const serializeAsXML = $e => (new XMLSerializer()).serializeToString($e)
const encodeAsUTF8 = s => `${dataHeader},${encodeURIComponent(s)}`
const encodeAsB64 = s => `${dataHeader};base64,${btoa(s)}`
const convertSVGtoImg = async e => {
    const $btn = e.target
    const format = $btn.dataset.format ?? 'png'
    $label.textContent = format

    destroyChildren($holder)

}

const onclickBead = (bead) => {
    console.info(bead);
    build(bead)
}

function drawPath(beads, current = null) {
    // debugger;
    var paths = [];
    if (current == null) {
        current = beads.shift();
    }
    var dir = Directions.UP;
    while (current) {
        // debugger
        var next = current.nearestInDirection(dir, beads);
        if (next == null) {
            dir = dir == Directions.DOWN ? Directions.UP : Directions.DOWN;
            next = current.nearestInDirection(Directions.LEFT, beads);
            if (next == null) {
                next = current.nearestInDirection(Directions.RIGHT, beads);
                if (next == null) {
                    next = current.nearestInDirection(null, beads)
                    if (next == null) {
                        return paths;
                    }
                }
            }
        }
        //draw line to next;
        const beadW = dosemapper.beadWidth;
        const beadH = dosemapper.beadHeight;

        const path = drawLine({
            id: 'path',
            x1: current.x + (beadW / 2), y1: current.y + (beadH / 2),
            x2: next.x + (beadW / 2), y2: next.y + (beadH / 2),
        });
        paths.push(path);
        beads = beads.filter((b) => b != next);
        current = next;


    }
    return paths;
}

function nextDir(current) {
    switch (current) {
        case Directions.UP: return Directions.RIGHT;
        case Directions.RIGHT: return Directions.DOWN;
        case Directions.DOWN: return Directions.RIGHT;
        case Directions.UP: return Directions.RIGHT;

            break;

        default:
            break;
    }
}

