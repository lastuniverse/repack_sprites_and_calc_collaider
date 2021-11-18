// import * as spriteUtils from '../utils/sprite.coordinates.js'

const units = [];
module.exports = units;


// человек, работник
units.push({
    name: 'human.peasant',
    spitesheet: 'human.peasant.png',
    size: { w: 360, h: 936 },
    sprites: { w: 5, h: 13 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 3 },
            frames: ['50-64']
        }
    ]
});


// человек, лесоруб 
units.push({
    name: 'human.lumberjack',
    spitesheet: 'human.peasant_with_wood.png',
    size: { w: 360, h: 936 },
    sprites: { w: 5, h: 13 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 3 },
            frames: ['50-64']
        }
    ]
});



// человек, золотоискатель 
units.push({
    name: 'human.golddigger',
    spitesheet: 'human.peasant_with_gold.png',
    size: { w: 360, h: 936 },
    sprites: { w: 5, h: 13 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 3 },
            frames: ['50-64']
        }
    ]
});



// человек, маг
units.push({
    name: 'human.mage',
    spitesheet: 'human.mage.png',
    size: { w: 360, h: 1152 },
    sprites: { w: 5, h: 16 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 7 },
            frames: ['45-79']
        }
    ]
});



// человек, рыцарь на коне
units.push({
    name: 'human.knight',
    spitesheet: 'human.knight.png',
    size: { w: 360, h: 1008 },
    sprites: { w: 5, h: 14 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 5 },
            frames: ['50-74']
        }
    ]
});


// человек, рыцарь на грифоне
units.push({
    name: 'human.gryphon',
    spitesheet: 'human.gryphon.png',
    size: { w: 400, h: 1040 },
    sprites: { w: 5, h: 13 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 4 },
            frames: ['0-19']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 6 },
            frames: ['35-64']
        }
    ]
});

// человек, рыцарь
units.push({
    name: 'human.footman',
    spitesheet: 'human.footman.png',
    size: { w: 350, h: 864 },
    sprites: { w: 5, h: 12 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 3 },
            frames: ['45-59']
        }
    ]
});


// эльф, лучник
units.push({
    name: 'elven.archer',
    spitesheet: 'elven.archer.png',
    size: { w: 360, h: 720 },
    sprites: { w: 5, h: 10 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: ['0-24']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 3 },
            frames: ['35-49']
        }
    ]
});


// гном, сквад
units.push({
    name: 'dwarf.squad',
    spitesheet: 'dwarf.squad.png',
    size: { w: 280, h: 728 },
    sprites: { w: 5, h: 13 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 5 },
            frames: [
                '0-4',
                '10-14',
                '25-29',
                '40-44',
                '55-59',
            ]
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 5 },
            frames: [
                '5-9',
                '20-24',
                '35-39',
                '50-54',
                '60-64',
            ]
        }
    ]
});



// гном, летун
units.push({
    name: 'dwarf.aeroplane',
    spitesheet: 'dwarf.aeroplane.png',
    size: { w: 400, h: 320 },
    sprites: { w: 5, h: 4 },
    angles: 5,
    frameDirectionType: 'right.down',
    outputs: [
        {
            name: 'movie',
            amount: { w: 5, h: 2 },
            frames: ['0-9']
        },
        {
            name: 'fulldeath',
            amount: { w: 5, h: 2 },
            frames: ['10-19']
        }
    ]
});
