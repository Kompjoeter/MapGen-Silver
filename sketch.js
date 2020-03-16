//Canvas and Map
const canvasWidth = 50*8;
const canvasHeight = 50*8;
var mapWidth = 50;
var mapHeight = 50;
var mapLoaded;

//Draw Elements
sprites = [];
colors = [];

//UI Elements
var slidersHeightRange = [];
var sliderFallOff;
var sliderNoiseScale;
var buttonNewMap;
var radioVisuals;
//-----UI Values
var fallOff;
var noiseScale;
var gradient;
var prevHeightRanges = [];
var heightRanges = [];
var visuals;
var outline;

//Toggles
var allowDraw = true;

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

    colors[0] = '#1a1016';
    colors[1] = '#271854';
    colors[2] = '#317c87';
    colors[3] = '#74c99e';
    colors[4] = '#5e2052';
    colors[5] = '#b13353';
    colors[6] = '#db604c';
    colors[7] = '#f6dbba';
}

function setup() 
{
    //Create Canvas and Link it to HTML Element
    var canvas = createCanvas(canvasWidth,canvasHeight);
    canvas.parent('sketch-holder');

    //Randomize Map Seed
    noiseSeed(Math.floor(Math.random()*1000));
    
    //Create UI (Sliders/Checkbox/Buttons)
    UI.initialize();

    //Generate New Map of standard Size
    mapLoaded = new Map(mapWidth,mapHeight);
    
    //Initialize Variables for Navigation and Display
    Navigator.initialize();
}

function draw()
{
    if (allowDraw) 
    {
        background('#233343');

        mapLoaded.update();
        //Draw Map
        for(let y = Navigator.minBoundsCurrent[1]; y < Navigator.maxBoundsCurrent[1]; y++)
        {
            for(let x = Navigator.minBoundsCurrent[0]; x < Navigator.maxBoundsCurrent[0]; x++)
            {
                //Set Drawing Coordinates
                let xDisplay = x - Navigator.minBoundsCurrent[0];
                let yDisplay = y - Navigator.minBoundsCurrent[1];
                
                UI.adjustSliders();
                
                let img = sprites[0];
                let color = colors[0];
                let strokeThickness = 1;

                //Get Value of Cell at XY Coordinate
                let elevation = mapLoaded.terrain[x][y];

                //Compare Height Ranges with Cell Value and pick appropriate Sprite or Color
                for(i = 0; i < 8; i++)
                {
                    let min = heightRanges[i] * i;
                    let max = heightRanges[i] * i+1;

                    if (elevation >= min && elevation < max)
                    {
                        if (visuals == 'Sprites')
                        {
                            img = sprites[i];
                        }
                        else
                        {
                            color = colors[i];
                        }
                    }
                }

                //If Drawing Method is 'Sprites', draw Sprite to Canvas
                if (visuals == 'Sprites')
                {
                    image(img,xDisplay*8,yDisplay*8);
                }
                else //If Visuals == 'Circles' or 'Squares' or 'Triangles'
                {
                    stroke(color);
                    fill(color);
                    if (outline)
                    {
                        noFill();
                    }
                    //Pick appropriate Drawing-Method and draw to Canvas
                    switch(visuals)
                    {
                        case "Circles":
                            circle(4+xDisplay*8,4+yDisplay*8,8 - strokeThickness*2);
                            break;
                        case "Squares":
                            square(strokeThickness+xDisplay*8,strokeThickness+yDisplay*8,8 - strokeThickness*2);
                            break;
                        case "Triangles":
                            triangle(strokeThickness+xDisplay*8,8-strokeThickness+yDisplay*8,(xDisplay*8)+(8-strokeThickness),8-strokeThickness+yDisplay*8,(xDisplay*8)+4,8+(strokeThickness)+(yDisplay*8)-8);
                            break;
                    }
                }
            }
        }
         //Draw Cursor/Cell-Selector
        stroke(255);
        strokeWeight(1);
        noFill();
        square(Navigator.posCursor[0]*8,Navigator.posCursor[1]*8,8);

        //Reset Draw-Map Toggle
        allowDraw = false;
    }

    //Check for Nagitation (WASD) Input
    let handlingInput = Navigator.handleInput();
    //Check for UI Manipulation
    let updatingUI = UI.update();
    //If Navigation Input or UI Manipulation is true, allow Redrawing of Map
    if (handlingInput || updatingUI)
    {
        allowDraw = true;
    }
}

function newMap()
{
    //Randomize Map Seed
    noiseSeed(Math.floor(Math.random()*1000));
    mapLoaded = new Map(mapWidth,mapHeight);
    Navigator.initialize();
    allowDraw = true;
}