const canvasWidth = 1024;
const canvasHeight = 640;
var mapLoaded = new Map(100,100);

function setup() 
{    
    createCanvas(canvasWidth,canvasHeight);
    mapLoaded.islandMap();
    Navigator.initialize();
}

let noInput = false;

function draw()
{
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
                noStroke();
                fill(mapLoaded.grid[x][y]);
                circle(4+(xDisplay*8),4+(yDisplay*8),8);
            }
        }
         //Draw Cursor
        stroke(255);
        noFill();
        circle(4+Navigator.posCursor[0]*8,4+Navigator.posCursor[1]*8,8);
    }

    noInput = Navigator.handleInput();
    Navigator.navigate();
}