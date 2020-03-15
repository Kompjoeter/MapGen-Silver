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
        let endMap = new Array(width);
        for(let i = 0; i < width; i++)
        {
            endMap[i] = new Array(height)
        }

        if (gradient)
        {
            var gradientMap = this.radialGradient();
        }

        for(let y = 0; y < height; y++)
        {
            for(let x = 0; x < width; x++)
            {

                let nx = x; 
                let ny = y;

                let noiseVal = 
                .5 * this.getNoise(scales[0],1*nx,1*ny) +
                0.5 * this.getNoise(scales[1],2*nx,2*ny) +
                0.25 * this.getNoise(scales[2],4*nx,2*ny); 
                
                noiseVal = Math.pow(noiseVal,exponent); //0 - 10
                if (gradient)
                {
                    noiseVal -= gradientMap[x][y];
                }
                endMap[x][y] = (noiseVal);
            }
        }
        return endMap;
    }

    getNoise(noiseScale, x, y)
    {
        let noiseVal;
        
        noiseVal = noise((x) * noiseScale, (y) * noiseScale);

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

    plainMap()
    {
        let plain = [];

        for(let x = 0; x < this.width; x++)
        {
            plain[x] = [];
            for(let y = 0; y < this.height; y++)
            {   
                plain[x][y] = 1;
            }
        }

        return plain;
    }
}