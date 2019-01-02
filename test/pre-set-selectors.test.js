'use strict';
const chai = require('chai');
const expect = chai.expect;

const { 
  formatPreSetSelectorColumns,} = require('../compile/helpers/pre-set-selectors');

describe('pre-set-selectors', ()=>{
  it('formatPreSetSelectorColumns', () => {
    const cssStyleColorsNamed = {
      red: 'red',
      yellow: 'yellow',
    };
    const expectedResult = {
      cssStyleColorsNamedArray: ['red', 'yellow'],
      preSetColumns: [
        { 
          key: 'color',
          label: 'color',
          type: 'color',
          optionLabels: ['red', 'yellow'],
          optionValues: ['red', 'yellow'],
          defaultValue: 'red',
        },
        { 
          key: 'fill',
          label: 'fill',
          type: 'boolean',
          optionLabels: ['true', 'false'],
          optionValues: ['true' ,'false' ],
          defaultValue:  'true',
        },
        { 
          key: 'opacityBackground',
          label: 'fill opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 0.1,
        },
        { 
          key: 'opacityBorder',
          label: 'line opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
        {
          key: 'borderWidth',
          label: 'line weight',
          type: 'number',
          step: 0.1,
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          key: 'borderDash',
          label: 'line type',
          type: 'array',
          optionLabels: ['solid', 'medium dashes','long dashes and gaps','medium dashes, short gaps','short dashes, long gaps','long dashes, short gaps'],
          optionValues: [ ''  , '10,10'        ,'20,20'                 ,'10,5'                     ,'5,20'                   ,'20, 5'                  ],
          defaultValue:   '',
        },
        {
          key: 'pointBorderWidth',
          label: 'point size',
          type: 'number',
          step: 0.1,
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          key: 'opacityPoint',
          label: 'point opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
      ],
    };
    const result = formatPreSetSelectorColumns(cssStyleColorsNamed);
    expect(result).to.deep.equal(expectedResult);
  });

})