const canvasWidth = 400;
const canvasHeight = 400;
var mapWidth = 50;
var mapHeight = 50;

var slidersHeightRange = [];

var sliderHeightRangeZero;
var sliderHeightRangeOne;
var sliderHeightRangeThree;
var sliderHeightRangeFour;
var sliderHeightRangeFive;
var sliderHeightRangeSix;
var sliderHeightRangeSeven;

var sliderExponent;
var slidersScale = [];
var buttonNewMap;
var redraw = false;

var exponent;
var scales = [];
var gradient;

var mapLoaded;

sprites = [];

function preload()
{
    sprites[0] = loadImage('images/water.png');
    sprites[1] = loadImage('images/water-shallow.png');
    sprites[2] = loadImage('images/sand.png');
    sprites[3] = loadImage('images/grass-light.png');
    sprites[4] = loadImage('images/grass-medium.png');
    sprites[5] = loadImage('images/grass-heavy.png');
    sprites[6] = loadImage('images/mountain.png');
    sprites[7] = loadImage('images/mountain-snow.png');
}

function setup() 
{
    var canvas = createCanvas(canvasWidth,canvasHeight);
    canvas.parent('sketch-holder');
    
    noiseSeed(Math.floor(Math.random()*1000));

    sliderExponent = new Slider(0,5,.5,.1,'slider-exponent');
    sliderExponent.slider.parent(sliderExponent.name);
    exponent = sliderExponent.slider.value();

    for(i = 0; i < 3; i++)
    {
        slidersScale[i] = new Slider(0,.5,.25,0.05,'slider-scale-'+String(i));
        slidersScale[i].slider.parent(slidersScale[i].name);
        scales[i] = slidersScale[i].slider.value();
    }

    for(i = 0; i < 8; i++)
    {
        let min = 0;
        let max = 1 / sprites.length;

        console.log('min ' + min + ' max ' + max);

        slidersHeightRange[i] = new Slider(min,max,max,max/20,'slider-height-range-'+String(i));
        slidersHeightRange[i].slider.parent(slidersHeightRange[i].name);
        console.log(slidersHeightRange[i].slider.value());
    }

    checkBoxGradient = createCheckbox('',true);
    checkBoxGradient.parent('checkbox-gradient');
    gradient = checkBoxGradient.value();

    buttonNewMap = createButton('New Map');
    buttonNewMap.parent('button-new-map');

    mapLoaded = new Map(mapWidth,mapHeight);
    mapLoaded.update();
    Navigator.initialize();
}

let noInput = false;

function draw()
{
    let prevExponent = exponent;
    let prevScaleOne = scale[0];
    let prevScaleTwo = scales[1];
    let prevScaleThree = scales[2];
    let prevGradient = gradient;

    exponent = sliderExponent.slider.value();

    for(i = 0; i < 3; i++)
    {
        scales[i] = slidersScale[i].slider.value();
    }

    gradient = checkBoxGradient.checked();

    if (buttonNewMap.mousePressed(newMap));

    if (prevExponent != exponent || prevScaleOne != scales[0] || prevScaleTwo != scales[1] || prevScaleThree != scales[2] || prevGradient != gradient || redraw != false)
    {
        mapLoaded.update();
        redraw = false;
        noInput = false;
    }
    //change(testF,sliderExponent);
    if (!noInput)
    {
        background(51);

        //Draw Map
        for(let y = Navigator.minBoundsCurrent[1]; y < Navigator.maxBoundsCurrent[1]; y++)
        {
            for(let x = Navigator.minBoundsCurrent[0]; x < Navigator.maxBoundsCurrent[0]; x++)
            {
                let xDisplay = x - Navigator.minBoundsCurrent[0];
                let yDisplay = y - Navigator.minBoundsCurrent[1];
                
                let img = sprites[0];
                let elevation = mapLoaded.terrain[x][y];

                if (elevation < 0)
                {
                    elevation = 0;
                }
                
                for(i = 0; i < 8; i++)
                {
                    let min = slidersHeightRange[i].slider.value() * i;
                    let max = slidersHeightRange[i].slider.value() * i+1;

                    if (elevation >= min && elevation < max)
                    {
                        img = sprites[i];
                    }
                }

                
                image(img,xDisplay*8,yDisplay*8);
            }
        }
         //Draw Cursor
        stroke(255);
        noFill();
        square(Navigator.posCursor[0]*8,Navigator.posCursor[1]*8,8);
    }

    noInput = Navigator.handleInput();
    Navigator.navigate();
}

function newMap()
{
    noiseSeed(Math.floor(Math.random()*1000));
    mapLoaded = new Map(mapWidth,mapHeight);
    Navigator.initialize();
    redraw = true;
}