var UI = 
{
    initialize: function()
    {
        //Create UI (Sliders/Checkbox/Buttons)
        //-----Slider to alter Map Shape (FallOff) - Link to HTML - and set Variables
        sliderFallOff = {element:createSlider(0.05,1,.5,.05)};
        sliderFallOff.element.class('slider');
        let myDiv = createDiv('<p>Falloff</p>');
        myDiv.id('slider-falloff');
        myDiv.parent('input-noise-shape-holder');
        sliderFallOff.element.parent(myDiv);
        fallOff = sliderFallOff.element.value();
        
        //-----Slider to alter Map Shape (Scale) - Link to HTML - and set Variables
        sliderNoiseScale = {element:createSlider(0,.5,.22,0.01)};
        sliderNoiseScale.element.class('slider');
        myDiv = createDiv('<p>Scale</p>')
        myDiv.id('slider-scale');
        myDiv.parent('input-noise-shape-holder');
        sliderNoiseScale.element.parent(myDiv);
        noiseScale = sliderNoiseScale.element.value();
        
        //-----Checkbox to Substract Gradient from Map - Link to HTML - and set Variables;
        checkBoxGradient = {element:createCheckbox('Island',true)};
        checkBoxGradient.element.class('checkbox');
        myDiv = createDiv();
        myDiv.id('checkbox-gradient');
        myDiv.parent('input-noise-shape-holder');
        checkBoxGradient.element.parent(myDiv);
        gradient = checkBoxGradient.element.value();

        //-----Button for New Map Generation - Link to HTML - and set Variables
        buttonNewMap = {element:createButton('New Map')};
        buttonNewMap.element.class('button');
        myDiv = createDiv();
        myDiv.id('button-new-map');
        myDiv.parent('input-noise-shape-holder');
        buttonNewMap.element.parent(myDiv);

        //-----Create Radio Button to Switch between Visual Representation of Map - and set Variables
        radioVisuals = {element:createRadio()};
        radioVisuals.element.class('radio');
        radioVisuals.element.option('Sprites');
        radioVisuals.element.option('Circles');
        radioVisuals.element.option('Squares');
        radioVisuals.element.option('Triangles');
        myDiv = createDiv();
        myDiv.id('radio-visuals');
        myDiv.parent('input-visuals-holder');
        radioVisuals.element.parent(myDiv);
        radioVisuals.element.value('Circles');


        checkBoxOutline = {element:createCheckbox('No Fill',true)};
        checkBoxOutline.element.class('checkbox');
        myDiv = createDiv();
        myDiv.id('checkbox-outline');
        myDiv.parent('input-visuals-holder');
        checkBoxOutline.element.parent(myDiv);
        outline = checkBoxOutline.element.value();

        //-----Create 7 Sliders for Height Distribution - Link to HTML - and set Variables
        for(i = 1; i < 8; i++)
        {
            let max = 1 / sprites.length;
            slidersHeightRange[i] = {element:createSlider(0,max,max,max/20),step:max/20};
            slidersHeightRange[i].element.class('slider');
            myDiv = createDiv('<p>Height '+i+'</p');
            myDiv.id('slider-height-range-'+String[i]);
            myDiv.parent('input-height-range-holder');
            slidersHeightRange[i].element.parent(myDiv);
            heightRanges[i] = slidersHeightRange[i].element.value();
        }

        for(i = 0; i < 8; i++)
        {
            textFieldsColor[i] = {element:createInput(colors[i])};
            textFieldsColor[i].element.class('textfield');
            myDiv = createDiv('<p>Visuals Color '+i+'</p>');
            myDiv.id('textfield-visuals-color-'+String[i]);
            myDiv.parent('input-visuals-color-holder');
            textFieldsColor[i].element.parent(myDiv);
        }

    },

    update: function()
    { 
        let updated = false;

        //Store Latest UI Values
        let prevFallOff = fallOff;
        let prevNoiseScale = noiseScale;
        let prevGradient = gradient;
        let prevVisuals = visuals;
        let prevOutline = outline;

    //Update Current UI Values
        fallOff = sliderFallOff.element.value();
        noiseScale = sliderNoiseScale.element.value();
        gradient = checkBoxGradient.element.checked();
        visuals = radioVisuals.element.value();
        outline = checkBoxOutline.element.checked();
        buttonNewMap.element.mousePressed(newMap);

        //Compare UI Values for Changes
        if (prevFallOff != fallOff || prevNoiseScale != noiseScale || prevGradient != gradient || prevVisuals != visuals || prevOutline != outline)
        {
            updated = true;
        }
    
        //Store Latest and Update Current UI Values for Height Distribution - and compare for Changes
        for(i = 1; i < sprites.length; i++)
        {
            prevHeightRanges[i] = heightRanges[i];
            heightRanges[i] = slidersHeightRange[i].element.value();
            if (prevHeightRanges[i] != heightRanges[i])
            {
                updated = true;
            }
        }

        for(i = 0; i < sprites.length; i++)
        {
            prevColors[i] = colors[i];
            colors[i] = textFieldsColor[i].element.value();
            if (prevColors[i] != colors[i])
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
                    slidersHeightRange[i-1].element.value(heightRanges[i-1]);
                }
                else if (prevHeightRanges[i-1] < heightRanges[i-1])
                {
                    if (heightRanges[i-1] > heightRanges[i])
                    {
                        heightRanges[i] += slidersHeightRange[i].step;
                        slidersHeightRange[i].element.value(heightRanges[i]);
                    }
                }
            }
        }
    }
}