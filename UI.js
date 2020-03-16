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

var UI = 
{
    initialize: function()
    {
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
    },

    update: function()
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
    },

    adjustSliders: function()
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
}