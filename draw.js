var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let width = 1600
let height = 1000

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance_squared(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}

function drawSky() {
    ctx.fillStyle = "#c3d2e0";
    ctx.fillRect(0, 0, width, height);
}

function drawHill(startHeight, hillColor) {
    x = 0;
    y = startHeight

    let region = new Path2D();

    region.moveTo(x, y);

    prev_delta_y = -2

    while (x < width - 1) {
        delta_x = randInt(5, 20);
        
        // bias to continue positive or negative delta_y
        if (prev_delta_y < 0) {
            delta_y = randInt(-10, 1);
        } else {
            delta_y = randInt(-1, 10);
        }

        if (y < height / 4) {
            delta_y = randInt(1, 10);
        }

        prev_delta_y = delta_y
        
        x += delta_x
        y += delta_y

        if (x > width - 1) {
            x = width
        }
        region.lineTo(x, y);
    }

    region.lineTo(width, height);
    region.lineTo(0, height);
    region.closePath();

    ctx.fillStyle = hillColor;
    ctx.fill(region, 'evenodd');
}

function getColorsFromGradient(startColor, endColor, num_colors) {
    colors = []

    for (let i = 0; i < num_colors; i++) {
        var diffRed = endColor.red - startColor.red;
        var diffGreen = endColor.green - startColor.green;
        var diffBlue = endColor.blue - startColor.blue;


        let randomDiff = (Math.random() / 20 - .025)
        let percentFade = (i / num_colors) +  randomDiff;

        diffRed = Math.floor(diffRed * percentFade) + startColor.red;
        diffGreen = Math.floor(diffGreen * percentFade) + startColor.green;
        diffBlue = Math.floor(diffBlue * percentFade) + startColor.blue;
        colors.push("rgba(" + [diffRed, diffGreen, diffBlue, 1].join(",") + ")")
    }

    return colors    
}


function drawHills(num_hills) {
    let drawHeights = []

    for (let i = 0; i < num_hills; i++) {
        drawHeights.push(Math.floor(height / 2) + randInt(-200, 200))
    }

    drawHeights.sort();
    console.log(drawHeights)

    startColor = {
        red: 101,
        green: 117,
        blue: 156
    }

    endColor = {
        red: 4,
        green: 36,
        blue: 69
    }

    colors = getColorsFromGradient(startColor, endColor, num_hills)
    console.log(colors);

    for (let i = 0; i < num_hills; i++) {
        drawHill(drawHeights[i], colors[i]);
    } 
}

function drawSun() {
    x = randInt(width / 4, 3 * width / 4)
    y = randInt(height / 8, height / 3)

    num_colors = 10
    startColor = {
        red: 255,
        green: 215,
        blue: 150
    }

    endColor = {
        red: 255,
        green: 115,
        blue: 143
    }
    colors = getColorsFromGradient(startColor, endColor, num_colors)

    for (let i = num_colors - 1; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(x, y, 50 + i**2 * 15, 0, Math.PI * 2, true); // Outer circle
        ctx.fillStyle = colors[i]
        ctx.fill();
    }
}


drawSky()
drawSun()
drawHills(num_hills=10)
