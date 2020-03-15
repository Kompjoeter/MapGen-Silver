//Canvas and Map
const canvasWidth = 50*8;
const canvasHeight = 50*8;
var mapWidth = 75;
var mapHeight = 75;
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
    //-----Slider to alter Map Shape (FallOff) - Link to HTML - and set Variables
    sliderFallOff = new Slider(0.05,1,.5,.05,'slider-fallOff');
    sliderFallOff.slider.parent(sliderFallOff.name);
    fallOff = sliderFallOff.slider.value();
    
    //-----Slider to alter Map Shape (Scale) - Link to HTML - and set Variables
    sliderNoiseScale = new Slider(0,.5,.22,0.01,'slider-scale');
    sliderNoiseScale.slider.parent(sliderNoiseScale.name);
    noiseScale = sliderNoiseScale.slider.value();
    
    //-----Create 7 Sliders for Height Distribution - Link to HTML - and set Variables
    for(i = 1; i < 8; i++)
    {
        let max = 1 / sprites.length;

        slidersHeightRange[i] = new Slider(0,max,max,max/20,'slider-height-range-'+String(i));
        slidersHeightRange[i].slider.parent(slidersHeightRange[i].name);
        heightRanges[i] = slidersHeightRange[i].slider.value();
    }

    //-----Checkbox to Substract Gradient from Map - Link to HTML - and set Variables
    checkBoxGradient = createCheckbox('Island',true);
    checkBoxGradient.parent('checkbox-gradient');
    gradient = checkBoxGradient.value();

    //-----Button for New Map Generation - Link to HTML - and set Variables
    buttonNewMap = createButton('New Map');
    buttonNewMap.parent('button-new-map');

    radioVisuals = createRadio();
    radioVisuals.option('Sprites');
    radioVisuals.option('Circles');
    radioVisuals.option('Squares');
    radioVisuals.option('Triangles');
    radioVisuals.parent('radio-visuals');
    radioVisuals.value('Circles');

    checkBoxOutline = createCheckbox('No Fill',true);
    checkBoxOutline.parent('checkbox-outline');
    outline = checkBoxOutline.value();

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
                
                adjustSliders();
                
                let img = sprites[0];
                let color = colors[0];
                let strokeThickness = 1;

                //Get Value of Cell at XY Coordinate
                let elevation = mapLoaded.terrain[x][y];

                //Floor Value
                if (elevation < 0)
                {
                    elevation = 0;
                }
                      
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


                if (visuals != 'Sprites')
                {
                    stroke(color);
                    fill(color);
                    if (outline)
                    {
                        noFill();
                    }
                }

                switch(visuals)
                {
                    case "Sprites":
                        image(img,xDisplay*8,yDisplay*8);
                        break;
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
    let updatingUI = updateUI();
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

function updateUI()
{ 
    let updated = true;

    //Store Latest UI Values
    let prevFallOff = fallOff;
    let prevNoiseScale = noiseScale;
    let prevGradient = gradient;
    let prevVisuals = visuals;
    let prevOutline = outline;

   //Update Current UI Values
    fallOff = sliderFallOff.slider.value();
    noiseScale = sliderNoiseScale.slider.value();
    gradient = checkBoxGradient.checked();
    visuals = radioVisuals.value();
    outline = checkBoxOutline.checked();
    buttonNewMap.mousePressed(newMap);

    //Compare UI Values for Changes
    if (prevFallOff != fallOff || prevNoiseScale != noiseScale || prevGradient != gradient || prevVisuals != visuals || prevOutline != outline)
    {
        updated = true;
    }
   
    //Store Latest and Update Current UI Values for Height Distribution - and compare for Changes
    for(i = 1; i < sprites.length; i++)
    {
        prevHeightRanges[i] = heightRanges[i];
        heightRanges[i] = slidersHeightRange[i].slider.value();
        if (prevHeightRanges[i] != heightRanges[i])
        {
            updated = true;
        }
    }

    return updated;
}

function adjustSliders()
{
    //Compare Height Distribution Sliders and Adjust According to Neighbours Value if nessecary.    
    for(i = 8; i > 1; i--)
    {
        if (heightRanges[i] < heightRanges[i-1])
        {
            if (prevHeightRanges[i] > heightRanges[i])
            {
                heightRanges[i-1] -= slidersHeightRange[i-1].step;
                slidersHeightRange[i-1].slider.value(heightRanges[i-1]);
            }
            else if (prevHeightRanges[i-1] < heightRanges[i-1])
            {
                if (heightRanges[i-1] > heightRanges[i])
                {
                heightRanges[i] += slidersHeightRange[i].step;
                slidersHeightRange[i].slider.value(heightRanges[i]);
                }
            }
        }
    }
}