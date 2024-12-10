

function drawRect({ x, y, width, height, corners = 0, stroke = "black", strokeWidth = 2, color = "transparent" }) {
    // Create an SVG shape element, e.g., a rectangle
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("rx", corners);
    rect.setAttribute("ry", corners);
    rect.setAttribute("fill", color);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", strokeWidth); // Border thickness in µm
    return rect;
}

function drawRuler({ x, y, lenght, oneCMLenght = 100 }) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("x", 0);
    group.setAttribute("y", 0);

    const line = drawRect({ x: x, y: y, width: lenght * oneCMLenght, height: 2 });
    group.appendChild(line);



    for (let i = 0; i < lenght; i++) {
        const xR = x + (i * oneCMLenght)

        var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        newText.setAttributeNS(null, "x", xR - 10);
        newText.setAttributeNS(null, "y", y + 100);
        newText.setAttributeNS(null, "font-size", "50");
        newText.innerHTML = i;
        group.appendChild(newText);

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
const build = function (updateVariables) {

    updateVariables();

    // Create the SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgW = dosemapper.a4Width / 10;
    const svgH = dosemapper.a4Height / 10;

    svg.setAttribute("width", `${svgW}mm`);
    svg.setAttribute("height", `${svgH}mm`);
    svg.setAttribute("viewBox", `0 0 ${dosemapper.a4Width} ${dosemapper.a4Height}`); // Define viewBox for scalable units
    const canvasRect = drawRect({ x: 0, y: 0, width: dosemapper.a4Width, height: dosemapper.a4Height, color: "transparent" });
    svg.appendChild(canvasRect);
    const container = drawRect({ x: dosemapper.drawingRect.x, y: dosemapper.drawingRect.y, width: dosemapper.drawingRect.width, height: dosemapper.drawingRect.height, color: "transparent" });
    var x0 = dosemapper.drawingRect.x + dosemapper.padding;
    var y0 = dosemapper.drawingRect.y + dosemapper.padding;
    rectMain = drawRect({ x: x0, y: y0, width: dosemapper.width, height: dosemapper.height, corners: 0, stroke: "#aaaaaa" });
    const beadW = 10;
    const beadH = 10;
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

    beads.forEach((b) => {
        var bead = drawRect({ x: b.x, y: b.y, width: beadW, height: beadH, corners: 5, stroke: b.isHighResolution ? "black" : "red" });
        svg.appendChild(bead);
    })
    const ruler = drawRuler(
        {
            x: dosemapper.a4Width - 500,
            y: dosemapper.a4Height - 200,
            lenght: 2,
            oneCMLenght: 100
        }
    )

    svg.appendChild(ruler);

    // Add the shape to the SVG element
    svg.appendChild(container);
    svg.appendChild(rectMain);
    // svg.appendChild(rect);

    const svgContainer = document.getElementById("svgContainer");
    svgContainer.innerHTML = "";

    // Append the SVG element to the document body
    svgContainer.appendChild(svg);


    //Download link
    downloadSvg(svg);
    svg2Png(svg);
    console.info(beads)//prints all attributes of object
}
const downloadSvg= svg=>
{
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
    console.log(dataURL)

    // const $img = document.createElement('img')
    // $img.src = dataURL
    $holder.download="dosemapper.png";
    $holder.href=dataURL;

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
