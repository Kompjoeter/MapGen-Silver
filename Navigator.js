var Navigator =
{
    minBoundsCurrent: new Array(2),
    maxBoundsCurrent: new Array(2),

    minBoundsDisplay: new Array(2),
    maxBoundsDisplay: new Array(2),

    minBoundsMap: new Array(2),
    maxBoundsMap: new Array(2),

    posCell: new Array(2),
    posCursor: new Array(2),

    initialize: function()
    {
        this.minBoundsCurrent[0] = 0;
        this.minBoundsCurrent[1] = 0;
        this.maxBoundsCurrent[0] = mapWidth;
        this.maxBoundsCurrent[1] = mapHeight;

        this.minBoundsDisplay[0] = 0;
        this.minBoundsDisplay[1] = 0;
        this.maxBoundsDisplay[0] = canvasWidth/cellSize;
        this.maxBoundsDisplay[1] = canvasHeight/cellSize;

        this.minBoundsMap[0] = 0;
        this.minBoundsMap[1] = 0;
        this.maxBoundsMap[0] = mapLoaded.width;
        this.maxBoundsMap[1] = mapLoaded.height;

        this.posCell[0] = 0;
        this.posCell[1] = 0;

        this.posCursor[0] = 0;
        this.posCursor[1] = 0;
    },

    handleInput: function()
    {
        let keyUp = 0;
        let keyRight = 0;
        let keyDown = 0;
        let keyLeft = 0;

        let handlingInput = true;

        if (keyIsDown('W'.charCodeAt(0)))
        {
            keyUp = 1;
        }  
        else if (keyIsDown('D'.charCodeAt(0)))
        { 
            keyRight = 1;
        }
        else if (keyIsDown('S'.charCodeAt(0)))
        { 
            keyDown = 1;
        }
        else if (keyIsDown('A'.charCodeAt(0)))
        {
            keyLeft = 1;
        }
        else
        {
            handlingInput = false;
        }

        let move = [keyRight - keyLeft, keyDown - keyUp];

        if (handlingInput)
        {
            let timeDiff = new Date() - storedTime;
            if (timeDiff >= 240)
            {
                storedTime = new Date();
                console.log(move[0]);
                this.navigate(move);
            }
            else
            {
                handlingInput = false;
            }
        }
        return handlingInput;
    },
    
    navigate: function(moveXY)
    {
        let move = moveXY;

        let newPosCell = [this.posCell[0] + move[0],this.posCell[1] + move[1]];
        let newPosCursor = [this.posCursor[0] + move[0],this.posCursor[1] + move[1]];

        for (let i = 0; i < 2; i++)
        { 
            // If new cursor position is within drawing-bounds.
            if (newPosCursor[i] >= this.minBoundsDisplay[i] && newPosCursor[i] < this.maxBoundsDisplay[i])
            {
                this.posCell[i] += move[i];
                this.posCursor[i] += move[i];
            }
            // If new cursor position is higher than drawing-bounds.
            else if (newPosCursor[i] > this.maxBoundsDisplay[i] - 1)
            {
                if (newPosCursor[i] > this.posCursor[i])
                {
                    // If new cursor position is lower than map-bounds.
                    if (newPosCell[i] < this.maxBoundsMap[i])
                    {
                        this.minBoundsCurrent[i] += move[i];
                        this.maxBoundsCurrent[i] += move[i];
                        this.posCell[i] += move[i];
                    }
                }
            }
            // If new cursor position is lower than drawing-bounds
            else if (newPosCursor[i] < this.minBoundsDisplay[i])
            {
                if (newPosCursor[i] < this.posCursor[i])
                {
                    // If new cursor position is higher or equal to map-bounds.
                    if (newPosCell[i] >= this.minBoundsMap[i])
                    {
                        this.minBoundsCurrent[i] += move[i];
                        this.maxBoundsCurrent[i] += move[i];
                        this.posCell[i] += move[i];
                    }
                }
            }
        }
    }
}