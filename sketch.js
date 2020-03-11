const canvasWidth = 400;
const canvasHeight = 400;
var mapWidth = 50;
var mapHeight = 50;

var sliderExponent;
var sliderScale;

var exponent;
var gradientPlain;

var mapLoaded = new Map(mapWidth,mapHeight);

var waterDeep;
var water;
var waterShallow;
var sand;
var grassLight;
var grassMedium;
var grassHeavy;
var mountain;
var mountainSnow;

function preload()
{
    waterDeep = loadImage('images/water-deep.png');
    water = loadImage('images/water.png');
    waterShallow = loadImage('images/water-shallow.png');
    sand = loadImage('images/sand.png');
    grassLight = loadImage('images/grass-light.png');
    grassMedium = loadImage('images/grass-medium.png');
    grassHeavy = loadImage('images/grass-heavy.png');
    mountain = loadImage('images/mountain.png');
    mountainSnow = loadImage('images/mountain-snow.png');
}

function setup() 
{    
    var canvas = createCanvas(canvasWidth,canvasHeight);
    canvas.parent('sketch-holder');

    sliderExponent = createSlider(0,10,2.2,.1);
    sliderExponent.parent('slider-exponent');

    sliderScale = createSlider(0,.5,.05,.01);
    sliderScale.parent('slider-scale');
    
    scale = sliderScale.value();
    exponent = sliderExponent.value();

    mapLoaded.expMap();
    Navigator.initialize();
}

let noInput = false;

function draw()
{
    let prevExponent = exponent;
    let prevScale = scale;
    exponent = sliderExponent.value();
    scale = sliderScale.value();

    if (prevExponent != exponent || prevScale != scale)
    {
        mapLoaded.expMap();
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
        
                let numb = mapLoaded.grid[x][y];
                let img;

                if (numb < 0)
                {
                    img = waterDeep;
                }
                else if (numb >= 0 && numb < .1)
                {
                    img = water;
                }
                else if (numb >= .1 && numb < .2)
                {
                    img = waterShallow;
                }
                else if (numb >= .2 && numb < .3)
                {
                    img = sand;
                }
                else if (numb >= .3 && numb < .4)
                {
                    img = grassLight;
                }
                else if (numb >= .4 && numb < .5)
                {   
                    img = grassMedium;
                }
                else if (numb >= .5 && numb < .6)
                {
                    img = grassHeavy;
                }
                else if (numb >= .6 && numb < .75)
                {
                    img = mountain;
                }
                else if (numb >= .75)
                {
                    img = mountainSnow;
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