class Map
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        //Initialize 2d Grid
        this.grid = new Array(this.width);
        for(let i = 0; i < this.width; i++)
        {
            this.grid[i] = new Array(this.height)
        }
    }

    islandMap()
    {
        let noiseMap = this.noiseMap();
        let gradientMap = this.radialGradient();

        for(let y = 0; y < mapLoaded.height; y++)
        {
            for(let x = 0; x < mapLoaded.width; x++)
            {
                let valNoise = noiseMap[x][y];
                let valGradient = gradientMap[x][y];
                this.grid[x][y] = valNoise - valGradient;
            }
        }

    }

    noiseMap()
    {
        let noiseMap = [];
        let noiseVal;
        let noiseScale = 0.1;

        for(let x = 0; x < this.width; x++)
        {
            noiseMap[x] = [];
            for(let y = 0; y < this.height; y++)
            {
                noiseDetail(2, 0.2);
                noiseVal = noise((x) * noiseScale, (y) * noiseScale);
                noiseVal = noiseVal * 255;
                noiseMap[x][y] = noiseVal;
            }
        }
        return noiseMap;
    }

    radialGradient()
    {
        let plain = this.plainMap();
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
            grid[x] = []
            for (var y = 0; y < gridHeight; y++) 
            {
                let val = Math.floor(furthestDistanceFromCentre - euclideanDistance({x: x, y: y}, centrePoint));
                val = (val / furthestDistanceFromCentre) *255;
                grid[x][y] = plain[x][y] - val;
            }
        }

        return grid;
    }

    plainMap()
    {
        let plain = [];

        for(let x = 0; x < this.width; x++)
        {
            plain[x] = [];
            for(let y = 0; y < this.height; y++)
            {   
                plain[x][y] = 200;
            }
        }

        return plain;
    }
}