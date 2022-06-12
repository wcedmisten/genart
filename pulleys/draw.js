import { chainHull_2D, sortPointX, sortPointY } from './convexHull.js'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.lineWidth = 10;
const RADIUS = 40

// https://stackoverflow.com/a/12646864
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const colors = ["#0000FF", "#e3d919", "#FF0000"]

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2, true); // Outer
    if (Math.random() > .8) {
        ctx.fillStyle = colors[Math.floor(Math.random() * 3)]
    } else {
        ctx.fillStyle = "#FFFFFF"
    }

    ctx.fill();
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(
        x1,
        y1)
    ctx.lineTo(
        x2,
        y2)
    ctx.stroke()
}

function drawOffsetPulleyLine(x, y, x2, y2) {
    var atan = - Math.atan2(x2 - x, y2 - y)

    drawLine(
        x + (RADIUS * Math.cos(atan)),
        y + (RADIUS * Math.sin(atan)),
        x2 + (RADIUS * Math.cos(atan)),
        y2 + (RADIUS * Math.sin(atan))
    )
}

function drawPulleys(circles) {
    circles.forEach(circle => {
        drawCircle(circle.x, circle.y)
    })

    circles.sort(sortPointY);
    circles.sort(sortPointX);

    var convexHull = []
    chainHull_2D(circles, circles.length, convexHull)

    const n = convexHull.length

    var x = convexHull[n - 1].x;
    var y = convexHull[n - 1].y;

    var x2 = convexHull[0].x;
    var y2 = convexHull[0].y;

    drawOffsetPulleyLine(x, y, x2, y2)

    convexHull.forEach((point, idx) => {
        var x2 = convexHull[idx].x;
        var y2 = convexHull[idx].y;

        drawOffsetPulleyLine(x, y, x2, y2)

        x = x2
        y = y2
    })
}


var circles = []

const rows = 4;
const cols = 6;

var items = [];

for (var i = 0; i < rows * cols; i++) {
    circles.push({
        x: 100 + (i % cols) * 150,
        y: 100 + Math.floor(i / cols) * 150
    })
}

shuffleArray(circles)

ctx.strokeStyle = "#000000"

var copy1 = JSON.parse(JSON.stringify(circles))
copy1 = copy1.slice(0, 6)

drawPulleys(copy1)

// ctx.strokeStyle = "#db5d32"

// var copy2 = JSON.parse(JSON.stringify(circles))
// copy2 = copy2.slice(6, 11)
// drawPulleys(copy2)
