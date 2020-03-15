class Map
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        this.terrain = this.generate(width, height);
    }

    update()
    {
        this.terrain = this.generate(this.width,this.height);
    }

    generate(width,height)
    {
        let noiseMap = new Array(width);
        for(let i = 0; i < width; i++)
        {
            noiseMap[i] = new Array(height)
        }

        if (gradient)
        {
            var squareGradientMap = this.squareGradient();
            var circleGradientMap = this.radialGradient();
        }

        let frequency = noiseScale;
        let octaves = Math.log(mapWidth) / Math.log(2);
        let value;
        
        noiseDetail(octaves,fallOff);
    
        for(let y = 0; y < mapHeight; y++)
        {
            for(let x = 0; x < mapWidth; x++)
            {    
                value = noise((x)*frequency, (y)*frequency);        
                if (value < .2)
                {
                    value = 0;
                }
                if (gradient)
                {
                    value = value - ((squareGradientMap[x][y] + circleGradientMap[x][y])/2);
                }
                
                noiseMap[x][y] = value;
            }
        }
        
        return noiseMap;
    }

    getNoise(noiseScale, x, y)
    {
        let noiseVal;
        
        noiseVal = noise((x) * noiseScale, (y) * noiseScale);

        return noiseVal;
    }

    squareGradient()
    {
        let width = this.width;
        let height = this.height;
        let halfWidth = width/2;
        let halfHeight = height /2;

        let grid = this.plainMap(0);

        for(let j = 0; j < height; j++)
        {
            for(let i = 0; i < width; i++)
            {
                let x = i;
                let y = j;

                let value;

                x = x > halfWidth ? width - x : x;
                y = y > halfHeight ? height - y : y;

                let smaller = x < y ? x : y;
                value = smaller / halfWidth;

                value = 1 - value;
                value *= value * value;

                grid[i][j] = value;
            }
        }

        return grid;
    }

    radialGradient()
    {
        let plain = this.plainMap(1);
        let grid = []
        let gridWidth = this.width;
        let gridHeight = this.height;

        let euclideanDistance = (point1, point2) => 
        {
            return Math.sqrt
            (
              Math.abs(Math.pow(point1.x - point2.x, 2)) +
              Math.abs(Math.pow(point1.y - point2.y, 2))
            )
        }
          
        let centrePoint = {x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2)}
        let furthestDistanceFromCentre = euclideanDistance({x: 0, y: 0}, centrePoint);
          
        for (let x = 0; x < gridWidth; x++) 
        {
            grid[x] = [];
            for (var y = 0; y < gridHeight; y++) 
            {
                let val = Math.floor(furthestDistanceFromCentre - euclideanDistance({x: x, y: y}, centrePoint));
                val = (val / furthestDistanceFromCentre);
                grid[x][y] = plain[x][y] - val;
            }
        }

        return grid;
    }

    plainMap(value)
    {
        let plain = [];

        for(let x = 0; x < this.width; x++)
        {
            plain[x] = [];
            for(let y = 0; y < this.height; y++)
            {   
                plain[x][y] = value;
            }
        }

        return plain;
    }
}