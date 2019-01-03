'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  applyPreSetGlobalColorToStyles,
  correctPrefixOfLayersSelected,
  editOneStyle,
} = require('../build/helpers/pre-set-edit');

describe('pre-set-edit', ()=> { 

  it('correctPrefixOfLayersSelected empty array if no state', () => {
    const state = 'not an object';
    const expectedResult = {
      prefixesToKeep: null,
      layers: [],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected empty array if layersSelected not an array', () => {
    const state = {
      layersSelected: 'not an array'
    };
    const expectedResult = {
      prefixesToKeep: null,
      layers: [],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected returns layersSelected if preSetSaveSettings not an object', () => {
    const state = {
      layersSelected: [
        'layer1',
        'layer2',
      ]
    };
    const expectedResult = {
      prefixesToKeep: null,
      layers: [
        'layer1',
        'layer2',
      ],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected unprefixes all layers if groups not provided, EVEN if both prefixes settings are true', () => {
    const state = {
      layersSelected: [
        'A__layer1',
        'B__layer2',
      ],
      preSetSaveSettings: {
        prefixGroups:    true,
        prefixGroupsSub: true,
      }
    };
    const expectedResult = {
      prefixesToKeep: null,
      layers: [
        'layer1',
        'layer2',
      ],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected removes subPrefixes but keeps groups', () => {
    const state = {
      layersSelected: [
        'A__52__layer1',
        'B__48__layer2',
      ],
      preSetSaveSettings: {
        prefixGroups:    true,
        prefixGroupsSub: false,
      },
      prefixesToKeepGroups: ['A', 'B'],
      prefixesToKeepGroupsSub: ['52', '48'],
    };
    const expectedResult = {
      prefixesToKeep: ['A', 'B'],
      layers: [ // sorted
        'A__layer1',
        'B__layer2',
      ],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected removes subPrefixes ONLY if listed', () => {
    const state = {
      layersSelected: [
        'A__52__layer1',
        'B__48__layer2',
      ],
      preSetSaveSettings: {
        prefixGroups:    true,
        prefixGroupsSub: true,
      },
      prefixesToKeepGroups:    ['A', 'B'],
      prefixesToKeepGroupsSub: ['52'],
    };
    const expectedResult = {
      prefixesToKeep: ['A', 'B', '52'],
      layers: [ // sorted
        'A__52__layer1',
        'B__layer2',
      ],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('correctPrefixOfLayersSelected removes group prefixes but keeps subs', () => {
    const state = {
      layersSelected: [
        'A__52__layer1',
        'B__48__layer2',
      ],
      preSetSaveSettings: {
        prefixGroups:    false,
        prefixGroupsSub: true,
      },
      prefixesToKeepGroups:    ['A', 'B'],
      prefixesToKeepGroupsSub: ['52', '48'],
    };
    const expectedResult = {
      prefixesToKeep: ['52', '48'],
      layers: [ // sorted
        '48__layer2',
        '52__layer1',
      ],
    };
    const result = correctPrefixOfLayersSelected(state);
    expect(result).to.deep.equal(expectedResult);
  });

  const preSetGlobalPalette = [
    '  0,   0, 254',
    '189, 209, 245',
    '155, 180, 223',
    '123, 147, 190',
    ' 81, 103, 144',
    ' 53,  74, 112',
    ' 33,  53,  93',
    ' 14,  34,  71',
    '  3,  19,  51',
  ];
  
  const manyStyles = {
    layer1: {
      color: '80, 80, 80',
      style: { 
        borderColor: '254, 32, 78'
      },
    },
    layer2: { 
      color: '80, 80, 80', 
      style: {} 
    },
    layer3: {
      color: '77, 77, 77',
      style: {},
    },
    A__layer4: {
      color: '34, 52, 78',
      style: {},
    },
    '57__layer4': {
      color: '34, 52, 78',
      style: {
        shade: -1, // << should NOT trigger edit, and should never exist either
      },
    },
    A__57__layer5: {
      color: '44, 46, 67',
      style: {
        shade: 0, // << should NOT trigger edit, as 0 = 'do not apply'
      },
    },
    C__layer6: {
      color: '253, 253, 253', // <<<<<< color should edit
      style: {
        shade: 8,  // <<<<<< over 0 triggers edit
        borderDashOffset: 0.2,
      }
    },
    C__53__layer6: {
      color: '253, 253, 253', // <<<<<< color should edit
      style: {
        shade: 5, // <<<<<< over 0 triggers edit
        borderDashOffset: 0.2,
      }
    },
    C__54__layer6: {
      color: '253, 253, 253', // <<<<<< color should edit
      style: {
        shade: 2, // <<<<<< over 0 triggers edit
        borderDashOffset: 0.2,
      }
    },
    C__54__layer4: {
      color: '34, 52, 78',
      style: {},
    },
    '53__layer6': {
      color: '80, 80, 80', // <<<<<< color should edit
      style: {
        shade: 1, // <<<<<< over 0 triggers edit
        borderDashOffset: 0.2,
      }
    },
  };

  it('applyPreSetGlobalColorToStyles returns empty if no existing styles', () => {
    const input = {
      preSetGlobalPalette,
      styles: {},
      property: {
        type: 'shade',
        key: null, // key is used for properties other than shade or color, such as "borderDash"
      }
    };
    const expectedResult = {};
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('applyPreSetGlobalColorToStyles one existing style', () => {
    const input = {
      preSetGlobalPalette,
      styles: {
        layer1: {
          color: 'blue',
          style: {
            borderDash: [10,10],
            shade: 1,
          },
        },
      },
    };
    const expectedResult = {
      layer1: {
        color: '  0,   0, 254',
        colorOld: 'blue',
        style: {
          borderDash: [10, 10],
          shade: 1,
        }
      }
    };
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('applyPreSetGlobalColorToStyles many existing styles', () => {
    const input = {
      preSetGlobalPalette,
      styles: manyStyles,
    };
    const expectedResult =  Object.assign({},
      manyStyles,
      {
        C__layer6: Object.assign({},
          manyStyles.C__layer6,
          {
            color: ' 14,  34,  71',
            colorOld: manyStyles.C__layer6.color,
          }
        ),
        C__53__layer6: Object.assign({},
          manyStyles.C__53__layer6,
          {
            color: ' 81, 103, 144',
            colorOld: manyStyles.C__53__layer6.color,
          }
        ),
        C__54__layer6: Object.assign({},
          manyStyles.C__54__layer6,
          {
            color: '189, 209, 245',
            colorOld: manyStyles.C__54__layer6.color,
          }
        ),
        '53__layer6': Object.assign({},
          manyStyles['53__layer6'],
          {
            color: '  0,   0, 254',
            colorOld: manyStyles['53__layer6'].color,
          }
        ),
      }
    );
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('editOneStyle returns {} if input not an object', () => {
    const input = 'not an object';
    const expectedResult = {};
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle returns {} if styles not an object', () => {
    const input = {
      value: 'false',
      layer: 'layer2',
      preSetGlobalPalette,
    };
    const expectedResult = {};
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle returns input if property not an object', () => {
    const input = {
      styles: manyStyles,
      value: 'false',
      layer: 'layer2',
      preSetGlobalPalette,
    };
    const expectedResult = manyStyles;
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle returns input if layer not a string', () => {
    const input = {
      styles: manyStyles,
      value: 'false',
      layer: ['not a string'],
      property: {
        type: 'boolean',
        key: 'fill',
      },
      preSetGlobalPalette,
    };
    const expectedResult = manyStyles;
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle boolean fill false', () => {
    const input = {
      styles: manyStyles,
      value: 'false',
      layer: 'layer2',
      property: {
        type: 'boolean',
        key: 'fill',
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                fill: false,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle boolean fill true', () => {
    const input = {
      styles: manyStyles,
      value: 'true',
      layer: 'layer2',
      property: {
        type: 'boolean',
        key: 'fill',
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                fill: true,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle array borderDash', () => {
    const input = {
      styles: manyStyles,
      value: [10,10],
      layer: 'layer2',
      property: {
        type: 'array',
        key: 'borderDash',
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                borderDash: [10,10],
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle stringified array borderDash', () => {
    const input = {
      styles: manyStyles,
      value: '10,10',
      layer: 'layer2',
      property: {
        type: 'array',
        key: 'borderDash',
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                borderDash: [10,10],
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle number opacityBackground', () => {
    const input = {
      styles: manyStyles,
      value: 0.23,
      layer: 'layer2',
      property: {
        type: 'number',
        key: 'opacityBackground',
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                opacityBackground: 0.23,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle shade > 0 changes color, colorOld, shade', () => {
    const input = {
      styles: manyStyles,
      value: 3,
      layer: 'layer2',
      property: {
        type: 'shade',
        key: null,
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            color: preSetGlobalPalette[3-1],
            colorOld: manyStyles.layer2.color,
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                shade: 3,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle shade > 0 changes color, colorOld, shade, preSetGlobalPalette not an array so uses default color', () => {
    const input = {
      styles: manyStyles,
      value: 3,
      layer: 'layer2',
      property: {
        type: 'shade',
        key: null,
      },
      preSetGlobalPalette: 'not an array',
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            color: '80, 80, 80',
            colorOld: manyStyles.layer2.color,
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                shade: 3,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle shade = 0 shade starting with no colorOld', () => {
    const input = {
      styles: manyStyles,
      value: 0,
      layer: 'layer2',
      property: {
        type: 'shade',
        key: null,
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            color: undefined,
            colorOld: manyStyles.layer2.color,
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                shade: 0,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle shade = 0 color reverts to colorOld', () => {
    const input = {
      styles: Object.assign({},
        manyStyles,
        {
          layer2: Object.assign({},
            manyStyles.layer2,
            {
              colorOld: 'any old color',
            }
          ),
        }
      ),
      value: 0,
      layer: 'layer2',
      property: {
        type: 'shade',
        key: null,
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            color: 'any old color',
            colorOld: manyStyles.layer2.color,
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                shade: 0,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('editOneStyle color changes color, colorOld, shade=0', () => {
    const input = {
      styles: manyStyles,
      value: 'not a real color',
      layer: 'layer2',
      property: {
        type: 'color',
        key: null,
      },
      preSetGlobalPalette,
    };
    const expectedResult = Object.assign({},
      manyStyles,
      {
        layer2: Object.assign({},
          manyStyles.layer2,
          {
            color: 'not a real color',
            colorOld: manyStyles.layer2.color,
            style: Object.assign({},
              manyStyles.layer2.style,
              {
                shade: 0,
              }
            )
          }
        ),
      }  
    );
    const result = editOneStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });

});