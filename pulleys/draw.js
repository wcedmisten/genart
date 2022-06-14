import { chainHull_2D, sortPointX, sortPointY } from './convexHull.js'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.lineWidth = 10;
const RADIUS = 40
const rows = 4;
const cols = 6;

const OFFSET_X = 100;
const OFFSET_Y = 100;

const DISTANCE_X = 150;
const DISTANCE_Y = 150;

const min_circles = 4;
const max_circles = 10;

const color_map = {
    "W": "#FFFFFF",
    "B": "#0000FF",
    "Y": "#e3d919",
    "R": "#FF0000"
}

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

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2, true); // Outer

    ctx.fillStyle = color_map[color];

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

function drawPulleys(circles1) {
    circles1.forEach(circle => {
        const x = OFFSET_X + circle.col * DISTANCE_X;
        const y = OFFSET_Y + circle.row * DISTANCE_Y;
        drawCircle(x, y, circle.color)
    })

    const circles = circles1.map((circle) => {
        return {
            x: OFFSET_X + circle.col * DISTANCE_X,
            y: OFFSET_Y + circle.row * DISTANCE_Y,
        }
    })

    circles.sort(sortPointY);
    circles.sort(sortPointX);

    var convexHull = []
    chainHull_2D(circles, circles.length, convexHull)

    const n = convexHull.length;

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

const colors = ["Y", "B", "R"]

function generateCircles() {
    for (var i = 0; i < rows * cols; i++) {
        let color = "W"

        if (Math.random() > .8) {
            color = colors[Math.floor(Math.random() * 3)]
        }
        circles.push({
            col: (i % cols),
            row: Math.floor(i / cols),
            color: color
        })
    }

    shuffleArray(circles)

    var copy1 = JSON.parse(JSON.stringify(circles))

    const num_circles = Math.floor(
        Math.random() * (max_circles - min_circles) + min_circles
    )

    return copy1.slice(0, num_circles)
}

// console.log(JSON.stringify(copy1))
// console.log(encoded)

if ('URLSearchParams' in window) {
    const searchParams = new URLSearchParams(window.location.search);
    let data = searchParams.get("circles")
    var circles;
    if (data) {
        circles = JSON.parse(atob(data))
    } else {
        circles = generateCircles();
    }

    // save a share link
    const encoded = btoa(JSON.stringify(circles))
    document.getElementById("share").href = `/genart/pulleys/?circles=${encoded}`;

    drawPulleys(circles);
}

// ctx.strokeStyle = "#db5d32"

// var copy2 = JSON.parse(JSON.stringify(circles))
// copy2 = copy2.slice(6, 11)
// drawPulleys(copy2)
