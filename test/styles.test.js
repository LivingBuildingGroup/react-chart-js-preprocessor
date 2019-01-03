'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  createStyle,
  createStylesArray, } = require('../build/helpers/styles');

describe('styles', ()=> { 

  it('createStyle full default', () => {
    const expectedResultDefault = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,
    };
    const expectedResultRandom = {
      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
      pointBackgroundColor:      '#fff',
    };
    const input = {};
    const result = createStyle(input);
    for(let key in expectedResultDefault){
      if(result[key] !== expectedResultDefault[key] && !Array.isArray(expectedResultDefault[key])){
        console.log('expected ', expectedResultDefault[key], 'and received', result[key], 'at createStyle full default');
      }
      expect(result[key]).to.deep.equal(expectedResultDefault[key]);
    }
    for(let key in expectedResultRandom){
      if(typeof result[key] !== 'string'){
        console.log('expected ', result[key], 'to be a string at createStyle full default');
      }
      expect(result).to.haveOwnProperty(key);
      expect(typeof result[key]).to.be.a('string');
      expect(result[key]).to.not.include('undefined');
    }
  });
  it('createStyle color only', () => {
    const expectedResult = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(254,254,0,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(254,254,0,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(254,254,0,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(254,254,0,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(254,254,0,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(254,254,0,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(254,254,0,1)',// opacityPointBackgroundHover})',
      pointBackgroundColor:      '#fff',
    };
    const input = {
      color: '254,254,0',
    };
    const result = createStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStyle pointBackground only', () => {
    const input = {
      pointBackgroundColor: '254,254,0',
      color:'227, 163,  79',
    };
    const expectedResult = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
      pointBackgroundColor:      'rgba(254,254,0,1)',
    };
    const result = createStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStyle accept any general input of matching type', () => {
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,
    };
    const colors = {
      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
    };
    const other = {
      pointBackgroundColor:      '#fff',
    };
    for(let key in general){
      const expectedResult = 
      typeof general[key] === 'number' ?
        999 : 
        typeof general[key] === 'string' ?
          'word' :
          Array.isArray(general[key]) ?
            [3,3] :
            typeof general[key] === 'boolean' ?
              false :
              null;
      const input = Object.assign({},
        general,
        colors,
        other,
        {
          [key]: expectedResult,
        }
      );

      const result = createStyle(input);
      expect(result[key]).to.deep.equal(expectedResult);
    }

  });
  it('createStyle reject any non-matching type input', () => {
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,
    };
    const colors = {
      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
    };
    const other = {
      pointBackgroundColor:      '#fff',
    };
    for(let key in general){
      const newValue = 
      typeof general[key] === 'number' ?
        'not a number' : 
        typeof general[key] === 'string' ?
          3 :
          Array.isArray(general[key]) ?
            'not an array' :
            typeof general[key] === 'boolean' ?
              'not a boolean' :
              null;
      const input = Object.assign({},
        general,
        colors,
        {
          [key]: newValue,
        }
      );
      const expectedResult = Object.assign({},
        general,
        colors,
        other // don't send this as input
      );
      const result = createStyle(input);
      expect(result).to.deep.equal(expectedResult);
    }

  });
  it('createStyle accepts any specific color key sent', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,
    };
    const colors = {
      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
    };
    const other = {
      pointBackgroundColor:      '#fff',
    };
    for(let key in colors){
      const input = Object.assign({},
        general,
        colors,
        {
          [key]: '254,253,33',
        }
      );
      const expectedResult = Object.assign({},
        general,
        colors,
        {
          [key]: '254,253,33',
        },
        other // don't send this as input, #fff is default for pointBackgroundColor
      );
      const result = createStyle(input);
      expect(result).to.deep.equal(expectedResult);
    }

  });
  it('createStyle full default with other type comparisons', () => {
    const expectedResult = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
      pointBackgroundColor:      '#fff',
    };
    const input = {
      borderWidth: ()=>{return 'testing typeof function';},
      pointBorderWidth: ()=>{return 'testing typeof object';},
      color: '227, 163,  79',
    };
    const result = createStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createStylesArray 1 specific key, 1 default key, no named colors, no fallback', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',

      pointBackgroundColor:      '#fff',
    };
    const layersSelected = ['lbs','gals'];
    const styleKey = {
      lbs: {
        color: 'red',
        style: {opacityBackground: 0.5},
      },
    };
    const style1 = Object.assign({},
      general,
      {
        opacityBackground: 0.5, // <<<< passed in
        // VVVVVVVVVV color AND opacity passed in
        backgroundColor:           'rgba(254,   0,   0,0.5)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(254,   0,   0,0.4)',// opacityBackgroundHover})',
        // VVVVVVVVVV ONLY color passed in
        borderColor:               'rgba(254,   0,   0,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(254,   0,   0,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(254,   0,   0,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(254,   0,   0,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(254,   0,   0,1)',// opacityPointBackgroundHover})',
      }
    );
    const style2 = Object.assign({},
      general,
      {
        // VVVVVVVVV this is 2nd in array, so color is [2] from palette 23
        backgroundColor:           'rgba( 79, 190,  64,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba( 79, 190,  64,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba( 79, 190,  64,1)',// opacityBorder})',
        hoverBorderColor:          'rgba( 79, 190,  64,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba( 79, 190,  64,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba( 79, 190,  64,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba( 79, 190,  64,1)',// opacityPointBackgroundHover})',
      }
    );
    const expectedResult = [style1, style2];
    const result = createStylesArray(layersSelected, styleKey);
    expect(result).to.deep.equal(expectedResult);

  });
  it('createStylesArray 4 specific keys, named colors, no fallback', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',

      pointBackgroundColor:      '#fff',
    };
    const layersSelected = ['lbs','gals','grams','kilos'];
    const namedColors = {
      color1: '254,   0,   0',
      color2: '  0, 254,   0',
    };
    const styleKey = {
      lbs: {
        color: 'color1',
        style: {opacityBackground: 0.5},
      },
      gals: {
        color: 'color2',
        style: {borderDash: [20,20]},
      },
      grams: {
        color: '252, 231,   3',
      },
      kilos: {
        style: {borderDash: [10,10]},
      },
    };
    const style1 = Object.assign({},
      general,
      {
        opacityBackground: 0.5, // <<<< passed in
        // VVVVVVVVVV color AND opacity passed in
        backgroundColor:           'rgba(254,   0,   0,0.5)',// opacityBackground}),
        // VVVVVVVVVV ONLY color passed in
        hoverBackgroundColor:      'rgba(254,   0,   0,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(254,   0,   0,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(254,   0,   0,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(254,   0,   0,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(254,   0,   0,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(254,   0,   0,1)',// opacityPointBackgroundHover})',
      }
    );
    const style2 = Object.assign({},
      general,
      {
        borderDash: [20,20], // <<<<<< passed in
        // VVVVVVVVVV ONLY color passed in
        backgroundColor:           'rgba(  0, 254,   0,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(  0, 254,   0,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(  0, 254,   0,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(  0, 254,   0,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(  0, 254,   0,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(  0, 254,   0,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(  0, 254,   0,1)',// opacityPointBackgroundHover})',
      }
    );
    const style3 = Object.assign({},
      general,
      {
        // VVVVVVVVVV named color is invalid, but a color is passed in, so use that color
        backgroundColor:           'rgba(252, 231,   3,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(252, 231,   3,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(252, 231,   3,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(252, 231,   3,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(252, 231,   3,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(252, 231,   3,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(252, 231,   3,1)',// opacityPointBackgroundHover})',
      }
    );
    const style4 = Object.assign({},
      general,
      {
        borderDash: [10,10], // <<<<< passed in
        // VVVVVVVVVV color is undefined in key, so mapped from palette23()[3] ... peach8[4]
        backgroundColor:           'rgba(203,  71,  43,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(203,  71,  43,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(203,  71,  43,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(203,  71,  43,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(203,  71,  43,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(203,  71,  43,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(203,  71,  43,1)',// opacityPointBackgroundHover})',
      }
    );
    const expectedResult = [style1, style2, style3, style4];
    const result = createStylesArray(layersSelected, styleKey, namedColors);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStylesArray 5 specific keys, incorrectly named colors, no fallback', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',

      pointBackgroundColor:      '#fff',
    };
    const layersSelected = ['lbs','gals','grams','kilos','cubits'];
    const namedColors = {
      color1: '254,   0,   0',
      color2: '  0, 254,   0',
    };
    const styleKey = {
      lbs: {
        color: 'not color1',
        style: {opacityBackground: 0.5},
      },
      gals: {
        color: 'not color2',
      },
      grams: {
        color: '252, 231,   3',
      },
      kilos: {
        style: {borderDash: [10,10]},
      },
      // intentionally missing cubits
    };
    const style1 = Object.assign({},
      general,
      {
        opacityBackground: 0.5, // <<<< passed in
        // VVVVVVVVVV color AND opacity passed in
        backgroundColor:           'rgba(not color1,0.5)',// opacityBackground}),
        // VVVVVVVVVV ONLY color passed in
        hoverBackgroundColor:      'rgba(not color1,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(not color1,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(not color1,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(not color1,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(not color1,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(not color1,1)',// opacityPointBackgroundHover})',
      }
    );
    const style2 = Object.assign({},
      general,
      {
        // VVVVVVVVVV ONLY color passed in
        backgroundColor:           'rgba(not color2,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(not color2,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(not color2,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(not color2,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(not color2,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(not color2,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(not color2,1)',// opacityPointBackgroundHover})',
      }
    );
    const style3 = Object.assign({},
      general,
      {
        // VVVVVVVVVV named color is invalid, but a color is passed in, so use that color
        backgroundColor:           'rgba(252, 231,   3,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(252, 231,   3,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(252, 231,   3,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(252, 231,   3,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(252, 231,   3,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(252, 231,   3,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(252, 231,   3,1)',// opacityPointBackgroundHover})',
      }
    );
    const style4 = Object.assign({},
      general,
      {
        borderDash: [10,10], // <<<<< passed in
        // VVVVVVVVVV color is undefined in key, so mapped from palette23()[3] ... peach8[4]
        backgroundColor:           'rgba(203,  71,  43,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(203,  71,  43,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(203,  71,  43,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(203,  71,  43,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(203,  71,  43,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(203,  71,  43,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(203,  71,  43,1)',// opacityPointBackgroundHover})',
      }
    );
    const style5 = Object.assign({},
      general,
      {
        // VVVVVVVVVV color is undefined in key, so mapped from palette23()[3] ... peach8[4]
        backgroundColor:           'rgba( 93,   6,  22,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba( 93,   6,  22,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba( 93,   6,  22,1)',// opacityBorder})',
        hoverBorderColor:          'rgba( 93,   6,  22,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba( 93,   6,  22,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba( 93,   6,  22,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba( 93,   6,  22,1)',// opacityPointBackgroundHover})',
      }
    );
    const expectedResult = [style1, style2, style3, style4, style5];
    const result = createStylesArray(layersSelected, styleKey, namedColors);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStylesArray no style key, no named colors, use fallback', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',

      pointBackgroundColor:      '#fff',
    };
    const layersSelected = ['lbs','gals'];
    const namedColors  = 'not an object';
    const styleKey     = 'not an object';
    const fallbackArray = ['254,   0,   0','  0, 254,   0'];
    const style1 = Object.assign({},
      general,
      {
        // VVVVVVVVVV ONLY color passed in
        backgroundColor:           'rgba(254,   0,   0,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(254,   0,   0,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(254,   0,   0,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(254,   0,   0,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(254,   0,   0,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(254,   0,   0,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(254,   0,   0,1)',// opacityPointBackgroundHover})',
      }
    );
    const style2 = Object.assign({},
      general,
      {
        // VVVVVVVVVV ONLY color passed in
        backgroundColor:           'rgba(  0, 254,   0,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(  0, 254,   0,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(  0, 254,   0,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(  0, 254,   0,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(  0, 254,   0,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(  0, 254,   0,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(  0, 254,   0,1)',// opacityPointBackgroundHover})',
      }
    );
    const expectedResult = [style1, style2];
    const result = createStylesArray(layersSelected, styleKey, namedColors, fallbackArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStylesArray no style key, no named colors, NO fallback', () => {
    // we only accept 1 color key, not individuals; this is to ensure colors process correctly, and this keeps each item to ONE color... which is busy enough for a graph!!!
    const general = {
      fill:                   true,
      opacityBackground:      0.1, 
      opacityBackgroundHover: 0.4,
      opacityBorder:          1,
      opacityBorderHover:     1,
      opacityPoint:           1,
      opacityPointHover:      1,
      opacityPointBackgroundHover: 1,
    
      lineTension:            0.5,
      bezierCurve:            true,
      bezierCurveTension:     0.5,
  
      borderCapStyle:         'butt',
      borderDash:             [],
      borderDashOffset:       0.0,
      borderJoinStyle:        'miter',
      borderWidth:            1,
      pointBorderWidth:       1,
      pointHoverRadius:       5,
      pointHoverBorderWidth:  2,
      pointRadius:            1,
      pointHitRadius:         10,

      backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
      hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
      borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
      hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
      pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
      pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
      pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',

      pointBackgroundColor:      '#fff',
    };
    const layersSelected = ['lbs','gals'];
    const style1 = Object.assign({},
      general,
      {
        // VVVVVVVVVV color is mapped from palette23() ... bark8[1]
        backgroundColor:           'rgba(227, 163,  79,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba(227, 163,  79,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba(227, 163,  79,1)',// opacityBorder})',
        hoverBorderColor:          'rgba(227, 163,  79,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba(227, 163,  79,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba(227, 163,  79,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba(227, 163,  79,1)',// opacityPointBackgroundHover})',
      }
    );
    const style2 = Object.assign({},
      general,
      {
        // VVVVVVVVVV color is mapped from palette23() ... fern8[2]
        backgroundColor:           'rgba( 79, 190,  64,0.1)',// opacityBackground}),
        hoverBackgroundColor:      'rgba( 79, 190,  64,0.4)',// opacityBackgroundHover})',
        borderColor:               'rgba( 79, 190,  64,1)',// opacityBorder})',
        hoverBorderColor:          'rgba( 79, 190,  64,1)',// opacityBorderHover})',
        pointBorderColor:          'rgba( 79, 190,  64,1)',// opacityPoint})',
        pointHoverBorderColor:     'rgba( 79, 190,  64,1)',// opacityPointHover})',
        pointHoverBackgroundColor: 'rgba( 79, 190,  64,1)',// opacityPointBackgroundHover})',
      }
    );
    const expectedResult = [style1, style2];
    const result = createStylesArray(layersSelected);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createStylesArray no input', () => {
    const layersSelected = 'not an array';
    const result = createStylesArray(layersSelected);
    expect(result).to.deep.equal([]);
  });

});