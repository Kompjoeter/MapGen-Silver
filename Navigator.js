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

    keyUp: 0,
    keyRight: 0,
    keyDown: 0,
    keyLeft: 0,

    move: [0,0],

    initialize: function()
    {
        this.minBoundsCurrent[0] = 0;
        this.minBoundsCurrent[1] = 0;
        this.maxBoundsCurrent[0] = 50;
        this.maxBoundsCurrent[1] = 50;

        this.minBoundsDisplay[0] = 0;
        this.minBoundsDisplay[1] = 0;
        this.maxBoundsDisplay[0] = 50;
        this.maxBoundsDisplay[1] = 50;

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
        let noInput = true;

        if (keyIsDown(87))
        {
            this.keyUp = 1;
            noInput = false;
        }  
        else if (keyIsDown(68))
        { 
            this.keyRight = 1;
            noInput = false;
        }
        else if (keyIsDown(83))
        { 
            this.keyDown = 1;
            noInput = false;
        }
        else if (keyIsDown(65))
        {
            this.keyLeft = 1;
            noInput = false;
        }

        return noInput;
    },
    
    navigate: function()
    {
        this.move[0] = this.keyRight - this.keyLeft;
        this.move[1] = this.keyDown - this.keyUp;

        let newPosCell = [this.posCell[0] + this.move[0],this.posCell[1] + this.move[1]];
        let newPosCursor = [this.posCursor[0] + this.move[0],this.posCursor[1] + this.move[1]];

        for (let i = 0; i < 2; i++)
        { 
            // If new cursor position is within drawing-bounds.
            if (newPosCursor[i] >= this.minBoundsDisplay[i] && newPosCursor[i] < this.maxBoundsDisplay[i])
            {
                this.posCell[i] += this.move[i];
                this.posCursor[i] += this.move[i];
            }
            // If new cursor position is higher than drawing-bounds.
            else if (newPosCursor[i] > this.maxBoundsDisplay[i] - 1)
            {
                if (newPosCursor[i] > this.posCursor[i])
                {
                    // If new cursor position is lower than map-bounds.
                    if (newPosCell[i] < this.maxBoundsMap[i])
                    {
                        this.minBoundsCurrent[i] += this.move[i];
                        this.maxBoundsCurrent[i] += this.move[i];
                        this.posCell[i] += this.move[i];
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
                        this.minBoundsCurrent[i] += this.move[i];
                        this.maxBoundsCurrent[i] += this.move[i];
                        this.posCell[i] += this.move[i];
                    }
                }
            }
        }

        this.keyUp = 0;
        this.keyRight = 0;
        this.keyDown = 0;
        this.keyLeft = 0;

        this.move[0] = 0;
        this.move[1] = 0;
    }

}