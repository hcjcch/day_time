const canvas = document.getElementById('flagCanvas');
const ctx = canvas.getContext('2d');
const body = document.getElementById('body');

function drawFlag() {
    const canvas = document.getElementById('flagCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 15;

    // Calculate the number of minutes in 24 hours
    const minutesInDay = 24 * 20;

    // Define the number of rows
    const rows = 8;

    // Calculate the number of columns
    const cols = Math.ceil(minutesInDay / rows);

    // Calculate the height of each grid cell
    const cellHeight = 18;

    // Calculate the width of each grid cell
    const cellWidth = 18;

    console.log('Rows:', rows);
    console.log('Cols:', cols);
    console.log('Cell Height:', cellHeight);
    console.log('Cell Width:', cellWidth);
    let width = cols * 18 + (cols - 1) * 4;
    let height = rows * 18 + (rows - 1) * 4;
    const now = new Date();
    const currentIntervals = Math.floor((now.getHours() * 60 + now.getMinutes()) / 3);
    const getOffWorkIndex = Math.floor(19 * 60 / 3);
    window.electronAPI.updateSize({ rows, cols, cellHeight, cellWidth, width, height });

    // Draw the grid
    // ctx.fillStyle = '#FFFFFF50'; // Yellow color for the grid cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * (cellWidth + 4);
            const y = i * (cellHeight + 4);
            const cellIndex = i * cols + j;
            if (cellIndex < currentIntervals) {
                ctx.fillStyle = '#24C78950';
            } else {
                ctx.fillStyle = '#FFFFFF30';
            }
            if (cellIndex === getOffWorkIndex) {
                ctx.fillStyle = '#FF2181';
            }
            ctx.fillRect(x, y, cellWidth, cellHeight);
        }
    }
    // body.style.backgroundColor = getBlueGradientColor(now);
}

window.onload = () => {
    drawFlag();
    // Redraw on window resize
    window.addEventListener('resize', drawFlag);
}

setInterval(drawFlag, 60 * 1000);


function getBlueGradientColor(date) {
    // 获取当前时间的小时和分钟
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes; // 将时间转换为分钟数

    // 定义时间段的分钟数
    const sunriseStart = 360;  // 6:00
    const sunriseEnd = 720;    // 12:00
    const sunsetStart = 800;  // 18:00
    const sunsetEnd = 1440;    // 24:00

    let lightness;
    if (totalMinutes < sunriseStart) {
        // 夜晚，深蓝色
        lightness = 0.1; // 较暗
    } else if (totalMinutes < sunriseEnd) {
        // 日出到正午，亮度逐渐增加
        lightness = 0.1 + 0.4 * (totalMinutes - sunriseStart) / (sunriseEnd - sunriseStart);
    } else if (totalMinutes < sunsetStart) {
        // 正午到日落，亮度保持较高
        lightness = 0.5;
    } else {
        // 日落到夜晚，亮度逐渐降低
        lightness = 0.5 - 0.4 * (totalMinutes - sunsetStart) / (sunsetEnd - sunsetStart);
    }

    // 固定色相为蓝色（240度），饱和度为1
    const hue = 240 / 360; // HSL 中的色相范围是 0-1
    const saturation = 1;

    // 将 HSL 转换为 RGB
    const rgb = hslToRgb(hue, saturation, lightness);

    // 转换为 #RGBA 格式，透明度固定为 50%（0x80）
    const rgba = `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}80`;
    return rgba;
}

// 辅助函数：将 HSL 转换为 RGB
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // 灰色
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 辅助函数：将数字转换为两位十六进制
function toHex(value) {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

