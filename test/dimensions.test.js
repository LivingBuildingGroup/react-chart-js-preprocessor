'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  calcScreenType,
  calcMinimumWindowDimensions,
  calcProportionalDimensions,
  calcDimensions,
} = require('../build/helpers/dimensions');

describe('dimensions', ()=> { 

  it('calcScreenType phoneP w001 h001',()=>{
    const w = 1;
    const h = 1;
    const expectedResult = {
      type: 'phoneP',
      testKeys: {
        heightRanges: ['phoneP'],
        widthRanges:  ['phoneP'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType phoneP w320 h700',()=>{
    const w = 320;
    const h = 700;
    const expectedResult = {
      type: 'phoneP',
      testKeys: {
        heightRanges: ['phoneP'],
        widthRanges:  ['phoneP'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType phoneL w700 h320',()=>{
    const w = 700;
    const h = 320;
    const expectedResult = {
      type: 'phoneL',
      testKeys: {
        heightRanges: ['phoneL'],
        widthRanges:  ['phoneL'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType tabletL w1024 h768',()=>{
    const w = 1024;
    const h = 768;
    const expectedResult = {
      type: 'tabletL',
      testKeys: {
        heightRanges: ['phoneL','tabletL'],
        widthRanges:  ['tabletL'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType tabletP w768 h1024',()=>{
    const w = 768;
    const h = 1024;
    const expectedResult = {
      type: 'tabletP',
      testKeys: {
        heightRanges: ['tabletP'],
        widthRanges:  ['tabletP'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType desktop w1100 h800 (min)',()=>{
    const w = 1100;
    const h = 800;
    const expectedResult = {
      type: 'desktop',
      testKeys: {
        heightRanges: ['phoneL','tabletL','desktop'],
        widthRanges:  ['tabletL','desktop'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType desktop w100000 h1000000 (min)',()=>{
    const w = 100000;
    const h = 100000;
    const expectedResult = {
      type: 'desktop',
      testKeys: {
        heightRanges: ['desktop'],
        widthRanges:  ['desktop'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcMinimumWindowDimensions inner is smaller', () => {
    const win = {
      screen: {
        availWidth:  200,
        availHeight: 100,
      },
      innerWidth:  25,
      innerHeight: 50,
    };
    const expectedResult = {
      cssWidthOuter: 25,
      cssHeightOuter: 50,
    };
    const result = calcMinimumWindowDimensions(win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcMinimumWindowDimensions screen is smaller', () => {
    const win = {
      screen: {
        availWidth:  50,
        availHeight: 25,
      },
      innerWidth:  200,
      innerHeight: 100,
    };
    const expectedResult = {
      cssWidthOuter: 50,
      cssHeightOuter: 25,
    };
    const result = calcMinimumWindowDimensions(win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcMinimumWindowDimensions no inners', () => {
    const win = {
      screen: {
        availWidth:  50,
        availHeight: 25,
      },
      // innerWidth:  200,
      // innerHeight: 100,
    };
    const expectedResult = {
      cssWidthOuter: 50,
      cssHeightOuter: 25,
    };
    const result = calcMinimumWindowDimensions(win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcMinimumWindowDimensions no screen', () => {
    const win = {
      // screen: {
      // },
      innerWidth:  200,
      innerHeight: 100,
    };
    const expectedResult = {
      cssWidthOuter: 200,
      cssHeightOuter: 100,
    };
    const result = calcMinimumWindowDimensions(win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcMinimumWindowDimensions no screen keys', () => {
    const win = {
      screen: {
        // availWidth:  50,
        // availHeight: 25,
      },
      innerWidth:  200,
      innerHeight: 100,
    };
    const expectedResult = {
      cssWidthOuter: 200,
      cssHeightOuter: 100,
    };
    const result = calcMinimumWindowDimensions(win);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcProportionalDimensions default on input not an object', () => {
    const input = 'not an object';
    const expectedResult = {
      w: 100,
      h: 100,
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcProportionalDimensions undersized width and height', () => {
    const input = { 
      width: {
        bigEnoughScreen:   900,  // defaults to 1000
        percentOfScreen:   0.80, // defaults to 1 
        maxPctOfBigEnough: 1.1,  // defaults to 1
      }, 
      height: {
        bigEnoughScreen:   500,  // defaults to 1000
        percentOfScreen:   0.70, // defaults to 1 
        maxPctOfBigEnough: 1.2,  // defaults to 1
      }, 
      cssWidthOuter:  150,       // defaults to 100 
      cssHeightOuter: 140,       // defaults to 100
    };
    const expectedResult = {
      testKeys: {
        widthRatioDelta:  0.3, // 1.1 - 0.8,
        widthBelowMin:    750, // 900 - 150,
        heightRatioDelta: 0.5, // 1.2 - 0.7,
        heightBelowMin:   360, // 500 - 140,
      },
      w: 150 + (750 * 0.3), // below big enough, so width  + % of ratio
      h: 140 + (360 * 0.5), // below big enough, so height + % of ratio
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcProportionalDimensions undersized width, not height', () => {
    const input = { 
      width: {
        bigEnoughScreen:   900,  // defaults to 1000
        percentOfScreen:   0.80, // defaults to 1 
        maxPctOfBigEnough: 1.1,  // defaults to 1
      }, 
      height: {
        bigEnoughScreen:   500,  // defaults to 1000
        percentOfScreen:   0.70, // defaults to 1 
        maxPctOfBigEnough: 1.2,  // defaults to 1
      }, 
      cssWidthOuter:  150,       // defaults to 100 
      cssHeightOuter: 600,       // defaults to 100
    };
    const expectedResult = {
      testKeys: {
        widthRatioDelta:  0.3, // 1.1 - 0.8,
        widthBelowMin:    750, // 900 - 150,
        heightRatioDelta: 0.5, // 1.2 - 0.7,
        heightBelowMin:  -100, // 500 - 600,
      },
      w: 150 + (750 * 0.3), // below big enough, so width  + % of ratio
      h: 600 * 0.7,         // big enough, so height * %
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcProportionalDimensions undersized height not width', () => {
    const input = { 
      width: {
        bigEnoughScreen:   900,  // defaults to 1000
        percentOfScreen:   0.80, // defaults to 1 
        maxPctOfBigEnough: 1.1,  // defaults to 1
      }, 
      height: {
        bigEnoughScreen:   500,  // defaults to 1000
        percentOfScreen:   0.70, // defaults to 1 
        maxPctOfBigEnough: 1.2,  // defaults to 1
      }, 
      cssWidthOuter:  1100,      // defaults to 100 
      cssHeightOuter: 140,       // defaults to 100
    };
    const expectedResult = {
      testKeys: {
        widthRatioDelta:  0.3, // 1.1 - 0.8,
        widthBelowMin:   -200, // 900 - 1100,
        heightRatioDelta: 0.5, // 1.2 - 0.7,
        heightBelowMin:   360, // 500 - 140,
      },
      w: 1100 * 0.8, // big enough, so width * %
      h: 140 + (360 * 0.5), // below big enough, so height + % of ratio
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcProportionalDimensions all big enough', () => {
    const input = { 
      width: {
        bigEnoughScreen:   900,  // defaults to 1000
        percentOfScreen:   0.80, // defaults to 1 
        maxPctOfBigEnough: 1.1,  // defaults to 1
      }, 
      height: {
        bigEnoughScreen:   500,  // defaults to 1000
        percentOfScreen:   0.70, // defaults to 1 
        maxPctOfBigEnough: 1.2,  // defaults to 1
      }, 
      cssWidthOuter:  1100,      // defaults to 100 
      cssHeightOuter: 600,       // defaults to 100
    };
    const expectedResult = {
      testKeys: {
        widthRatioDelta:  0.3, // 1.1 - 0.8,
        widthBelowMin:   -200, // 900 - 1100,
        heightRatioDelta: 0.5, // 1.2 - 0.7,
        heightBelowMin:  -100, // 500 - 600,
      },
      w: 1100 * 0.8,           // big enough, so width  * %
      h: 600 * 0.7,            // big enough, so height * %
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcProportionalDimensions all default', () => {
    const input = { 
      width: {
        // bigEnoughScreen:   900,  // defaults to 1000
        // percentOfScreen:   0.80, // defaults to 1 
        // maxPctOfBigEnough: 1.1,  // defaults to 1
      }, 
      height: {
        // bigEnoughScreen:   500,  // defaults to 1000
        // percentOfScreen:   0.70, // defaults to 1 
        // maxPctOfBigEnough: 1.2,  // defaults to 1
      }, 
      // cssWidthOuter:  1100,      // defaults to 100 
      // cssHeightOuter: 140,       // defaults to 100
    };
    const expectedResult = {
      testKeys: {
        widthRatioDelta:  0,   // 100 - 100,
        widthBelowMin:    900, // 1000 - 100
        heightRatioDelta: 0,   // 100 - 100,
        heightBelowMin:   900, // 1000 - 100
      },
      w: 100, // default
      h: 100, // default
    };
    const result = calcProportionalDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcDimensions',()=>{
    const state = {
      cssWidthOuter: 800,
      cssHeightOuter: 400,
      cssWidthControls: 100,
      cssHeightFooter: 300,
      cssHeightSelectors: 100,
    };
    const expectedResult = {
      cssDivOuter: {
        width: 800, // cssWidthOuter,
        height: 400, // cssHeightOuter,
      },
      cssDivGraph: {
        width: 700, // cssWidthOuter - cssWidthControls,
        height: 100, // cssHeightOuter - cssHeightFooter,
      },
      cssDivControls: {
        width: 100, // cssWidthControls,
        height: 100, // cssHeightOuter - cssHeightFooter,
      },
      cssDivFooter: {
        width: 800, // cssWidthOuter,
        height: 300, // cssHeightFooter,
      },
      cssDivSelectors: {
        width: 800, // cssWidthOuter,
        height: 100, // cssHeightSelectors,
      },
      cssCanvasWidth: 700, //cssDivGraph.width
      cssCanvasHeight: 100, //cssDivGraph.height
    };
    const result = calcDimensions(state);
    expect(result).to.deep.equal(expectedResult);
  });

});
