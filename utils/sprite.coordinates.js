module.exports = {
    getFrameIndex,
    getFramePosition,
    getFrameCoordinates,
    parseFrames
};

function getFrameIndex(data, x, y) {
    let xx = x, yy = y, index = 0;
    const direction = data.frameDirectionType.split('.');

    if (direction.includes('up')) yy = (data.sprites.h - y - 1);
    if (direction.includes('left')) xx = (data.sprites.w - x - 1);

    if (['down', 'up'].includes(direction[0])) index = xx * data.sprites.h + yy;
    if (['left', 'right'].includes(direction[0])) index = yy * data.sprites.w + xx;

    return index;
}

function getFramePosition(data, index) {
    let x = 0, y = 0;

    const direction = data.frameDirectionType.split('.');

    if (['right', 'left'].includes(direction[0])) {
        x = index % data.sprites.w;
        y = Math.floor(index / data.sprites.w);
    } else {
        x = Math.floor(index / data.sprites.h);
        y = index % data.sprites.h;
    }


    if (direction.includes('up')) y = (data.sprites.h - y - 1);
    if (direction.includes('left')) x = (data.sprites.w - x - 1);

    return { x, y };
}

function getFrameCoordinates(data, argument) {

    let pos, index;
    if (typeof argument === 'number') {
        index = argument;
        pos = getFramePosition(data, index);
    } else if (typeof argument === 'object') {
        pos = argument;
        index = getFrameIndex(data, pos.x, pos.y);
    }
    const w = data.size.w / data.sprites.w;
    const h = data.size.h / data.sprites.h;

    return {
        index,
        fx: pos.x,
        fy: pos.y,
        w, h,
        x: pos.x * w,
        y: pos.y * h,
    };
}

/**
 * парсит данные о наборах спрайтов
 * @param {Array<Object>} frames 
 * @returns {Array} массив с индексами фрэймов
 */
function parseFrames(frames) {
    const list = [];
    if (Array.isArray(frames)) {
        frames.forEach(item => list.push(...parseFrames(item)))
    } else if (typeof frames === 'string') {
        frames.split(/[,;]/).forEach(text => {
            const arr = text.split(/[-:]/).map(v => +v);
            if (arr.length > 1) {
                for (let i = arr[0]; i <= arr[1]; i++) {
                    list.push(i);
                }
            } else {
                list.push(arr[0]);
            }
        });
    }
    return list;
}




// const testData = [
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'down.right',
//         indexes: [
//             [0, 3],
//             [1, 4],
//             [2, 5],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'up.right',
//         indexes: [
//             [2, 5],
//             [1, 4],
//             [0, 3],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'down.left',
//         indexes: [
//             [3, 0],
//             [4, 1],
//             [5, 2],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'up.left',
//         indexes: [
//             [5, 2],
//             [4, 1],
//             [3, 0],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'right.down',
//         indexes: [
//             [0, 1],
//             [2, 3],
//             [4, 5],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'right.up',
//         indexes: [
//             [4, 5],
//             [2, 3],
//             [0, 1],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'left.down',
//         indexes: [
//             [1, 0],
//             [3, 2],
//             [5, 4],
//         ]
//     },
//     {
//         sprites: { w: 2, h: 3 },
//         frameDirectionType: 'left.up',
//         indexes: [
//             [5, 4],
//             [3, 2],
//             [1, 0],
//         ]
//     },
// ]

// function test(data) {
//     console.log("\ntesting", data.frameDirectionType);
//     for (let x = 0; x < data.sprites.w; x++) {
//         for (let y = 0; y < data.sprites.h; y++) {
//             const index = frameIndex(data, x, y);
//             const pos = framePosition(data, index);
//             // console.log(x, y, index, data.indexes[y][x] === index);
//             console.log(`[${x},${y}] [${pos.x},${pos.y}]`, index, x === pos.x && y === pos.y);
//         }
//     }
// }

// testData.forEach(data => test(data));