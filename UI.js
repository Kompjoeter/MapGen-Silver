class Slider
{
    constructor(minRange,maxRange,defaultValue,step,name)
    {
 
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.defaultValue = defaultValue;
        this.step = step;
        this.name = name;
        this.slider = this.create();
    }

    create()
    {
        let slider = createSlider(this.minRange,this.maxRange,this.defaultValue,this.step);
        return slider;
    }
}