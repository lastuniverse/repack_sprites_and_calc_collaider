// подключаем дополнительный модуль работающий с путями
const path = require('path');
// работа с файловой системой
const fs = require('fs');
// редактор изображений
const { createCanvas, loadImage } = require('canvas')
// утилита преобразвания координат
const spriteUtils = require('./utils/sprite.coordinates.js')
// конфиги спратлистов
const unitsConfig = require('./source.units/humans.unit.js');


const spitesheetDir = './source.units';
const resultDir = './result.units';

unitsConfig.forEach(config => processConfigs(config));

function processConfigs(configs) {
    if (typeof configs !== 'object') return;

    if (Array.isArray(configs)) {
        configs.forEach(config => processConfig(config));
    } else {
        processConfig(configs)
    }

}

function processConfig(config) {
    loadImage(path.join(spitesheetDir, config.spitesheet))
        .then(image => {
            config.spitesheetImage = image;
            createOutputs(config);
        });
}


function createOutputs(config) {

    config.outputs.forEach(outputConfig => {
        outputConfig.maxSpriteWidth = 0;
        outputConfig.maxSpriteHeight = 0;

        outputConfig.framelist = spriteUtils
            .parseFrames(outputConfig.frames, outputConfig.collederOffsets)
            .reduce((acc, frameNumber, frameIndex) => {
                const frameMetaData = spriteUtils.getFrameCoordinates(config, frameNumber);
                // const dstframeName = ('000' + index).substr(-3);

                // создаем массив с данными кадров

                const srcX = frameMetaData.x;
                const srcY = frameMetaData.y;

                const spriteWidth = frameMetaData.w;
                const spriteHeight = frameMetaData.h;


                if (outputConfig.maxSpriteWidth < spriteWidth) outputConfig.maxSpriteWidth = spriteWidth;
                if (outputConfig.maxSpriteHeight < spriteHeight) outputConfig.maxSpriteHeight = spriteHeight;

                const dstIndex = acc.count;

                const dstAmountWidth = outputConfig.amount.w;
                const dstAmountHeight = outputConfig.amount.h;

                const dstAmountX = dstIndex % dstAmountWidth;
                const dstAmountY = Math.floor(dstIndex / dstAmountWidth);



                acc.list.push({
                    name: ('000' + acc.count).substr(-3),
                    spitesheetImage: config.spitesheetImage,
                    opacityColors: null, //data.opacityColors,
                    pivot: outputConfig.pivot ?? { x: 0.5, y: 0.5 },
                    frameNumber,

                    config,

                    srcX, srcY,
                    spriteWidth, spriteHeight,

                    dstIndex,
                    dstAmountWidth, dstAmountHeight,
                    dstAmountX, dstAmountY,
                    // dstWidth, dstHeight,
                    // dstX, dstY,
                });
                acc.count++;

                return acc;
            }, { list: [], count: 0 }).list;


        const dstWidth = outputConfig.maxSpriteWidth * outputConfig.amount.w;
        const dstHeight = outputConfig.maxSpriteHeight * outputConfig.amount.h;
        const dstCanvas = outputConfig.dstCanvas = createCanvas(dstWidth, dstHeight);
        const dstCtx = outputConfig.dstCtx = dstCanvas.getContext('2d');



        outputConfig.framelist.forEach(frameData => {
            frameData.collederOffsets = outputConfig.collederOffsets
            frameData.maxSpriteWidth = outputConfig.maxSpriteWidth;
            frameData.maxSpriteHeight = outputConfig.maxSpriteHeight;
            frameData.dstX = outputConfig.maxSpriteWidth * frameData.dstAmountX;
            frameData.dstY = outputConfig.maxSpriteHeight * frameData.dstAmountY;
            frameData.dstWidth = dstWidth;
            frameData.dstHeight = dstHeight;
            frameData.dstCanvas = dstCanvas;
            frameData.dstCtx = dstCtx;
            createOutputSprite(frameData);

            const imageData = frameData.ctx.getImageData(0, 0, frameData.spriteWidth, frameData.spriteHeight);

            dstCtx.putImageData(imageData, frameData.dstX, frameData.dstY);

            delete frameData.imageData;
            delete frameData.ctx;
            delete frameData.canvas;

        });

        save(config.name, outputConfig);

        // const dstX = x * spriteWidth;
        // const dstY = y * spriteHeight;               


    });
}

function createOutputSprite(frameData) {
    frameData.canvas = createCanvas(frameData.spriteWidth, frameData.spriteHeight);
    frameData.ctx = frameData.canvas.getContext('2d');
    frameData.ctx.drawImage(
        frameData.spitesheetImage,
        frameData.srcX, frameData.srcY,
        frameData.spriteWidth, frameData.spriteHeight,
        0, 0,
        frameData.spriteWidth, frameData.spriteHeight
    );



    // setOpacity(frameData);

    calcColliders(frameData, true);


    frameData.json = {
        frame: {
            x: frameData.dstX,
            y: frameData.dstY,
            w: frameData.spriteWidth,
            h: frameData.spriteHeight,
        },
        rotated: false,
        trimmed: true,
        spriteSourceSize: {
            x: 0,
            y: 0,
            w: frameData.spriteWidth,
            h: frameData.spriteHeight,
        },
        sourceSize: {
            w: frameData.spriteWidth,
            h: frameData.spriteHeight,
        },
        pivot: frameData.pivot ?? {
            x: 0.5,
            y: 0.5,
        },
        hitColliders: frameData.colliders.hitColliders,
        visibleCollider: [frameData.colliders.visibleCollider],
    };

}


function calcColliders(frameData, isSowColliders = false) {
    // console.log(frameData.frameNumber)

    const imageData = frameData.ctx.getImageData(0, 0, frameData.spriteWidth, frameData.spriteHeight);

    const w = imageData.width;
    const h = imageData.height;

    const cx = w * frameData.pivot.x;
    const cy = h * frameData.pivot.y;
    
    const offsets = frameData.offsets = getOffsets(imageData);
    
    const ow = w - offsets.left - offsets.right;
    const oh = h - offsets.top - offsets.bottom;    
    
    const radius = Math.hypot(ow, oh) / 2;
    // const radius = 1.1 * Math.max(
    //     cx - offsets.left,
    //     w - offsets.right - cx,
    //     cy - offsets.top,
    //     h - offsets.bottom - cy,
    // );

    hitColliders = parseFrame(imageData, frameData);
    visibleCollider = { x: hitColliders[0].x, y: hitColliders[0].y, r: radius };


    hitColliders.forEach((collider, index) => {
        const dx = collider.x;
        const dy = collider.y;


        if (isSowColliders) {
            frameData.ctx.strokeStyle = collider.c;
            frameData.ctx.beginPath();
            frameData.ctx.arc(
                cx + dx,
                cy + dy,
                collider.r,
                0, Math.PI * 2, true
            );
            frameData.ctx.stroke();

        }

        const r = Math.hypot(dx, dy) + collider.r;
        if (visibleCollider.r < 1.1 * r) {
            visibleCollider.r = 1.1 * r;
        }


        return true;
    });

    if (isSowColliders) {

        frameData.ctx.strokeStyle = 'green';
        frameData.ctx.beginPath();
        frameData.ctx.arc(
            visibleCollider.x + cx,
            visibleCollider.y + cy,
            visibleCollider.r,
            0, Math.PI * 2, true
        );
        frameData.ctx.stroke();
    }
    frameData.colliders = {
        hitColliders,
        visibleCollider,
    };


}





function setOpacity(frameData) {
    const imageData = frameData.ctx.getImageData(0, 0, frameData.spriteWidth, frameData.spriteHeight);
    const data = imageData.data;

    const pixels = frameData.spriteWidth * frameData.spriteHeight;
    for (let i = 0; i < pixels; i++) {
        const offset = i * 4;
        const color = RGBToHex(data[offset], data[offset + 1], data[offset + 2]);
        if (frameData.opacityColors.includes(color)) {
            data[offset] = 0;
            data[offset + 1] = 0;
            data[offset + 2] = 0;
            data[offset + 3] = 0;
        } else {
            // data[offset] = 255;
            // data[offset + 1] = 255;
            // data[offset + 2] = 255;
            // data[offset + 3] = 255;
        }

    }
    frameData.ctx.putImageData(imageData, 0, 0);
    // frameData.ctx.clearRect(0, 0, frameData.spriteWidth, frameData.spriteHeight);
}

function RGBToHex(r, g, b) {
    return ('000000' + ((r << 16) + (g << 8) + b).toString(16)).substr(-6);
}

function save(name, outputConfig) {
    const outFileName = `${name}.${outputConfig.name}`;
    const outPngFileName = path.join(resultDir, `${outFileName}.png`);
    if (fs.existsSync(outPngFileName)) fs.unlinkSync(outPngFileName);
    const out = fs.createWriteStream(outPngFileName);

    // out.on('finish', () => console.log('The PNG file was created.'));

    const stream = outputConfig.dstCanvas.createPNGStream();
    stream.pipe(out);

    const atlas = {
        frames: outputConfig.framelist.reduce((acc, frameData, index) => {
            // return frameData.json;
            const num = ('000' + index).substr(-3);
            acc[num] = frameData.json;
            return acc;
        }, {}),
        meta: {
            image: `${outFileName}.png`,
            format: 'RGBA8888',
            // size: data.size,
            scale: 1,
        }
    };

    const outJsonFileName = path.join(resultDir, `${outFileName}.json`);
    if (fs.existsSync(outJsonFileName)) fs.unlinkSync(outJsonFileName);
    fs.writeFileSync(outJsonFileName, JSON.stringify(atlas, null, '\t'));

}







function parseFrame(imageData, frameData) {
    const step = 1;

    const offsets = frameData.offsets;
    // const offsets = {
    //     right: 16,
    //     left: 16,
    //     top: 16,
    //     bottom: 16,
    // };

    const w = imageData.width;
    const h = imageData.height;

    const cx = w * frameData.pivot.x;
    const cy = h * frameData.pivot.y;

    const ow = w - offsets.left - offsets.right;
    const oh = h - offsets.top - offsets.bottom;

    const pow = ow / 2;//*2/5;
    const poh = oh / 2;//*2/5;



    const colliderTemplate = {
        mx: 0,
        my: 0,
        total: 0,
        count: 0,
    };

    const x1 = offsets.left + ow / 3;
    const x2 = w - offsets.right - ow / 3;
    const y1 = offsets.top + oh / 3;
    const y2 = h - offsets.bottom - oh / 3;

    const temp = new Array(9).fill(null).map(() => {
        return { ...colliderTemplate };
    });

    // const radius = Math.hypot(ow, oh) / 2;
    temp[0].radius = Math.hypot(ow, oh) / 2;
    temp[1].radius = temp[2].radius = temp[3].radius = temp[4].radius = Math.hypot(pow, poh) / 2;
    temp[5].radius = temp[6].radius = Math.hypot(pow, oh) / 2;
    temp[7].radius = temp[8].radius = Math.hypot(ow, poh) / 2;

    for (let y = offsets.top; y <= h - offsets.bottom; y += step) {
        for (let x = offsets.left; x <= w - offsets.right; x += step) {
            let m = getPixel(imageData, x, y).a;


            temp[0].mx += x * m;
            temp[0].my += y * m;
            temp[0].total += m;
            temp[0].count++;

            if (x <= x1 && y <= y1) {
                temp[1].mx += x * m;
                temp[1].my += y * m;
                temp[1].total += m;
                temp[1].count++;
            } else if (x <= x1 && y >= y2) {
                temp[2].mx += x * m;
                temp[2].my += y * m;
                temp[2].total += m;
                temp[2].count++;
            } else if (x >= x2 && y <= y1) {
                temp[3].mx += x * m;
                temp[3].my += y * m;
                temp[3].total += m;
                temp[3].count++;
            } else if (x >= x2 && y >= y2) {
                temp[4].mx += x * m;
                temp[4].my += y * m;
                temp[4].total += m;
                temp[4].count++;
            }

            if (x <= x1) {
                temp[5].mx += x * m;
                temp[5].my += y * m;
                temp[5].total += m;
                temp[5].count++;
            } else if (x >= x2) {
                temp[6].mx += x * m;
                temp[6].my += y * m;
                temp[6].total += m;
                temp[6].count++;
            }

            if (y <= y1) {
                temp[7].mx += x * m;
                temp[7].my += y * m;
                temp[7].total += m;
                temp[7].count++;

            } else if (y >= y2) {
                temp[8].mx += x * m;
                temp[8].my += y * m;
                temp[8].total += m;
                temp[8].count++;
            }

        }
    }



    // temp.shift();

    let colliders = temp
        .map((collider, index) => {
            const multiplier = 1.2;//index > 4 ? 1 : index > 0 ? 1.3 : 1;

            return {
                x: collider.mx / collider.total - cx,
                y: collider.my / collider.total - cy,
                r: multiplier * collider.radius * collider.total / collider.count,
                c: ['#ff0000', '#ffff00', '#ffff00', '#ffff00', '#ffff00', '#0000ff', '#0000ff', '#0000ff', '#0000ff'][index]
            };
        })
        .filter((collider, index) => {
            if (index === 0) return true;
            if (isNaN(collider.x)) return false;
            const test = getPixelsInCircle(imageData, collider.x + cx, collider.y + cy, collider.r)
            return test.percent < 0.15 ? false : true;
            // return true;
        });


    return colliders
        .filter((collider, index) => {
            if (index === 0) return true;
            return colliders.every(compare => {
                if (collider === compare) return true;

                const dx = collider.x - compare.x;
                const dy = collider.y - compare.y;
                const dr = Math.hypot(dx, dy);
                if (dr >= compare.r) return true;

                const r = dr + collider.r;
                if (r >= compare.r) return true;

                return false;
            })

        });
}

/**
 * фанка считает оффсеты от краев до первых значимых пикселей
 * @param {*} imageData - попиксельные данные изображения (кадра/спрайта)
 * @param {number} opacityLevel - уровень прозрачности, ниже которого считаем пиксели непрозрачными (число от 0 до 1)
 * @param {number} shrink  - насколько будут умешьшены отступы (число от 0 до 1)
 * @returns 
 */
function getOffsets(imageData, opacityLevel = 0.4, shrink = 0.23) {
    const step = 1;
    const offsets = {
        left: 9999,
        right: 9999,
        top: 9999,
        bottom: 9999
    };

    const w = imageData.width;
    const h = imageData.height;

    for (let y = 0; y <= h; y += step) {
        for (let x = 0; x <= w; x += step) {
            let alpha = getPixel(imageData, x, y).a;
            if (alpha < opacityLevel) continue;
            if (offsets.left > x) offsets.left = x;
            if (offsets.right > (w - x - 1)) offsets.right = (w - x - 1);
            if (offsets.top > y) offsets.top = y;
            if (offsets.bottom > (h - y - 1)) offsets.bottom = (h - y - 1);
        }
    }

    Object.keys(offsets).forEach(key => {
        offsets[key] = Math.round(offsets[key] * (1 - shrink));
    });

    return offsets;
}


/**
 * вычисляет количество значимых (непрозрачных) пикселей в круге
 * @param {object} объект imageData 
 * @param {number} cx координата x центра круга
 * @param {number} cy координата y центра круга
 * @param {number} r радиус круга
 * @returns {object} данные о значимых пикселях  вида `{empty: 0, fill: 0, total: 0, percent: 0}`
 */
function getPixelsInCircle(imageData, cx, cy, r) {
    const data = {
        cx, cy, r,
        empty: 0,
        fill: 0,
        total: 0,
        percent: 0,
    };
    for (let y = -r; y <= r; y += 2) {
        for (let x = -r; x <= r; x += 2) {
            const d = Math.hypot(x, y);
            if (d > r) continue;
            data.total++;
            const p = getPixel(imageData, cx + x, cy + y);
            if (p.a < 0.8) {
                data.empty++
            } else {
                data.fill++;
            }
        }
    }

    if (data.total > 0 && r > 2)
        data.percent = data.fill / data.total;

    // console.log(data)
    return data;
}


// пустой пиксель
const emptyPixel = { r: 0, g: 0, b: 0, a: 0 };

/**
 * получить пиксель по координатам
 * @param {object} объект imageData 
 * @param {number} x координата x
 * @param {number} y координата y
 * @returns {object} данные о запрошеной точке  вида `{r:0, g:0, b:0, a:0}`
 */
function getPixel(imageData, x, y) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= imageData.width) return emptyPixel;
    if (y < 0 || y >= imageData.height) return emptyPixel;
    const data = imageData.data;
    const offset = y * 4 * imageData.width + x * 4;
    return {
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2],
        a: data[offset + 3] / 255,
        aa: data[offset + 3]
    }
}