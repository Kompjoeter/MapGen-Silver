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

    expMap()
    {
        let gradientMap = this.radialGradient();

        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < this.width; x++)
            {

                let nx = x; 
                let ny = y;

                let noiseVal = 
                .5 * this.getNoise(1*nx,1*ny) +
                0.5 * this.getNoise(2*nx,2*ny) +
                0.25 * this.getNoise(4*nx,2*ny);
                
                noiseVal = Math.pow(noiseVal,exponent); //0 - 10
                this.grid[x][y] = (noiseVal);// - gradientMap[x][y];
            }
        }
    }

    getNoise(x, y)
    {
        let noiseVal;
        
        noiseVal = noise((x) * scale, (y) * scale);

        return noiseVal;
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
                val = (val / furthestDistanceFromCentre);
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
                plain[x][y] = .75;
            }
        }

        return plain;
    }
}