'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatSelectors,
  _validateFormatAllStylesInput, // tested as subfunction
  parseGroupsFromLayer,
  selectBestStyleMatch,
  selectBestColorMatch,
  formatAllStyles,
  assignPreSetGroupColors,
  formatGroupsStyles,
  unpackPreSet,
  selectDefaultPreSet,} = require('../build/helpers/pre-set-extract');

describe('pre-set-extract', ()=> { 

  it('formatSelectors single no group', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groups = [];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single no group one layer only', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groups = [];
    const expectedResult = {
      selectors: [
        'layer1',
      ],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single with group stays single', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = true;
    const groups = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with group gets prefixed', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groups = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup gets prefixed if groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groups = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        '52__A__layer1',
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
      selectorsRemaining: [
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup does NOT prefixed if NOT groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = false;
    const groups = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is not Array', () => {
    const thisPreSet = {
      layersSelected: 'not an array',
      type: 'single',
    };
    const groupTrue = false;
    const groups = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is empty', () => {
    const thisPreSet = {
      layersSelected: [],
      type: 'single',
    };
    const groupTrue = false;
    const groups = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groups);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseGroupsFromLayer no input = all empty strings', () => {
    const layer     = 'layer';
    const groups    = []; // validated as an array before function is invoked
    const groupsSub = []; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer no prefix = all empty strings', () => {
    const layer     = 'layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer mismatch prefix = all empty strings', () => {
    const layer     = 'B__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer matching group prefix', () => {
    const layer     = 'A__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  'A',
      g_: 'A__',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer matching subgroup prefix', () => {
    const layer     = '54__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '54',
      s_: '54__',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer group and subgroup matching prefixes', () => {
    const layer     = 'A__54__layer';
    const groups    = ['A','B']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  'A',
      g_: 'A__',
      s:  '54',
      s_: '54__',
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectBestStyleMatch = thisPreSet.layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        layer: {
          color: 'blue',
          style: {
            borderDash: [20,20],
          }
        }
      }
    };
    const styles    = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'blue',
      style: {
        borderDash: [20,20],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.unPrefix color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
        layer: {
          color: 'blue',
          style: {
            borderDash: [20,20],
          }
        }
      }
    };
    const styles    = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.g__s__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__54__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.g__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.s__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        '54__layer': {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      A__layer: {
        color: 'red',
        style: {
          borderDash: [10,10],
        }
      },
      layer: {
        color: 'blue',
        style: {
          borderDash: [20,20],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.unPrefix color', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      layer: {
        color: 'red',
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {},
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.unPrefix color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      layer: {
        color: 'red',
        style: {
          borderDash: [10,10],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = empty object on no styles sent', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {}; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      style: {},
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectBestColorMatch 80 80 80 as default no valid input', () => {
    // all parameters are validated before function is invoked
    const thisStyle = 'not an object';
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch 80 80 80 as default no group colors', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {};
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = thisStyle.color even if no other valid input', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = thisStyle.color even if group colors valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = group color if valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        '54, 67, 82',
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '54, 67, 82';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = this style color if shade not valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 5; 
    const preSetGlobalPalettes = {
      red: [
        '54, 67, 82',
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = this style color if group color falsey', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        false,
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = default if group color falsey and this style not specified', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {};
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        false,
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });

  it('formatAllStyles input is not an object', () => {
    const expectedResult = {
      message: 'input is not an object'
    };
    const input = 'not an object';
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed is not an array', () => {
    const input = {};
    const expectedResult = {
      message: 'layersAllPrefixed is not an array'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed empty', () => {
    const input = {
      layersAllPrefixed: [],
    };
    const expectedResult = {
      message: 'groups is not an array'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed has non-string key', () => {
    const input = {
      layersAllPrefixed: ['string', 'string2', {}, 3, 'string'],
    };
    const expectedResult = {
      // loops all and sends message on LAST non-matching item, vs first
      message: 'layersAllPrefixed item 3 at index 3 is not a string'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed has non-string key', () => {
    const input = {
      layersAllPrefixed: ['string', 'string2', 'string'],
    };
    const expectedResult = {
      message: 'groups is not an array'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles groupsSub is not an array', () => {
    const input = {
      groups: [],
      layersAllPrefixed: ['string', 'string2', 'string'],
    };
    const expectedResult = {
      message: 'groupsSub is not an array'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles thisPreSet is not an object', () => {
    const input = {
      groups: [],
      groupsSub: [],
      layersAllPrefixed: ['string', 'string2', 'string'],
    };
    const expectedResult = {
      message: 'thisPreSet is not an object'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles styles is not an object', () => {
    const input = {
      groups: [],
      groupsSub: [],
      layersAllPrefixed: ['string', 'string2', 'string'],
      thisPreSet: {},
    };
    const expectedResult = {
      message: 'styles is not an object'
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles handles variety of input types', () => {
    const input = {
      groups: ['A', 'B', 'C'],
      groupsSub: [52, 57],
      newGroupColors: {
        C: 'red',
      },
      preSetGlobalPalettes: {
        red: [
          '253, 253, 253',
          '254, 0, 0',
          '33, 33, 33',
          '44, 44, 44',
        ]
      },
      layersAllPrefixed: [
        'layer1', 
        'layer2', 
        'layer3', 
        'A__layer4', 
        '57__layer4',
        'A__57__layer5',
        'C__layer6',
        'C__53__layer6',
        'C__54__layer6',
        'C__54__layer4',
        '53__layer6',
      ],
      styles: {
        layer4: {
          color: '34, 52, 78'
        },
        layer5: {
          color: '44, 46, 67'
        },
      },
      thisPreSet: {
        styles: {
          A__52__layer1: {
            style: {
              borderColor: '254, 32, 78'
            },
          },
          '52_layer2': {
            style: {
              borderDash: [15, 3],
            }
          },
          layer3: {
            color: '77, 77, 77',
          },
          layer6: {
            style: {
              shade: 1,
              borderDashOffset: 0.2,
            }
          }
        }
      },
    };
    const expectedResult = {
      // one key for each layer selected
      layer1: { // read from A__52__layer1
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
        //   borderColor: '254, 32, 78' // DELETED bc NO CASCADE!
        },
      },
      layer2: { // read from 52__layer2
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
        //   borderDash: [15, 3],// DELETED bc NO CASCADE!
        } 
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
        style: {},
      },
      A__57__layer5: {
        color: '44, 46, 67',
        style: {},
      },
      C__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1,
          borderDashOffset: 0.2,
        }
      },
      C__53__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer4: {
        color: '34, 52, 78', // from general styles, group C does not affect it, because no shade
        style: {},
      },
      '53__layer6': {
        color: '80, 80, 80', // default, none specified
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('assignPreSetGroupColors defaults as type only if no input', () => {
    const input = {};
    const expectedResult = {
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults as type only if groups is empty array', () => {
    const input = {
      groups: [],
      // groupColors
      // preSetGlobalColorOptions,
      // preSetGlobalPalettes
    };
    const expectedResult = {
      testKeys: {
        colorsUsed  : {},
        gcPriority  : {}
      },
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults as type only if only groups is populated', () => {
    const input = {
      groups: ['A'],
      // groupColors
      // preSetGlobalColorOptions,
      // preSetGlobalPalettes
    };

    const expectedResult = {
      newGroupColors: {
        A: 'green',
      },
      groupDotColors: {
        A: '  0, 254,   0',
      },
      testKeys: {
        colorsUsed    : {
          green: true, // index 0 of default presetGlobalPalettes
        },
        gcPriority: {},
      }
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults to gray if group color not defined', () => {
    const input = {
      groups: ['A'],
      groupColors: {
        A: 'not a named color',
      }
      // preSetGlobalColorOptions,
      // preSetGlobalPalettes
    };
    const expectedResult = {
      newGroupColors: {
        A: 'not a named color',
      },
      groupDotColors: {
        A: '80, 80, 80',
      },
      testKeys: {
        colorsUsed: {
          'not a named color': true,
        },
        gcPriority: {
          'not a named color': 'A',
        },
      }
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults to preset palette when palette not defined', () => {
    const input = {
      groups: ['A', 'B'],
      groupColors: {
        A: 'red',
        B: 'blue',
      }
      // preSetGlobalColorOptions,
      // preSetGlobalPalettes
    };
    const expectedResult = {
      newGroupColors: {
        A: 'red',
        B: 'blue',
      },
      groupDotColors: {
        A: '254,   0,   0',
        B: '  0,   0, 254',
      },
      testKeys: {
        colorsUsed: {
          red: true,
          blue: true,
        },
        gcPriority: {
          red: 'A',
          blue: 'B',
        },
      }
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors uses preSetGlobalPalettes', () => {
    const input = {
      groups: ['A', 'B'],
      groupColors: {
        A: 'red',
        B: 'blue',
      },
      // preSetGlobalColorOptions,
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
      }
    };
    const expectedResult = {
      newGroupColors: {
        A: 'red',
        B: 'blue',
      },
      groupDotColors: {
        A: '254, 0, 0',
        B: '0, 254, 0',
      },
      testKeys: {
        colorsUsed: {
          red: true,
          blue: true,
        },
        gcPriority: {
          red: 'A',
          blue: 'B',
        },
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors uses preSetGlobalPalettes + defaults applies color to group', () => {
    const input = {
      groups: ['A', 'B', 'C'],
      groupColors: {
        A: 'red',
        B: 'blue',
      },
      preSetGlobalColorOptions: [
        'green',
        'yellow',
        'orange',
        'red',
        'purple',
        'violet',
        'blue',
      ],
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
        // green is intentionally omitted
      },
    };
    const expectedResult = {
      newGroupColors: {
        A: 'red',
        B: 'blue',
        C: 'green',
      },
      groupDotColors: {
        A: '254, 0, 0',
        B: '0, 254, 0',
        C: '  0, 254,   0' // defaults correctly, because though not explicitly declared, it does not conflict with the default
      },
      testKeys: {
        colorsUsed: {
          red: true,
          blue: true,
          green: true,
        },
        gcPriority: {
          red: 'A',
          blue: 'B',
        },
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors resolves duplicate group colors', () => {
    const input = {
      groups: ['A', 'B', 'C'],
      groupColors: {
        A: 'red',
        B: 'blue',
        C: 'red',
      },
      preSetGlobalColorOptions: [
        'green',
        'yellow',
        'orange',
        'red',
        'purple',
        'violet',
        'blue',
      ],
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
        // green is intentionally omitted
      },
    };
    const expectedResult = {
      newGroupColors: {
        A: 'red',
        B: 'blue',
        C: 'green',
      },
      groupDotColors: {
        A: '254, 0, 0',
        B: '0, 254, 0',
        C: '  0, 254,   0' // defaults correctly, because though not explicitly declared, it does not conflict with the default
      },
      testKeys: {
        colorsUsed: {
          red: true,
          blue: true,
          green: true,
        },
        gcPriority: {
          red: 'A',
          blue: 'B',
          // green: 'C', // not a priority, because not REQUESTED! 
        },
      }
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors resolves many duplicate group colors', () => {
    const input = {
      groups: ['A','B','C','D','E','F','G'],
      groupColors: {
        A: 'red',
        B: 'blue',
        C: 'red',
        D: 'red',
        E: 'red',
        F: 'yellow',
        G: 'red',
      },
      preSetGlobalColorOptions: [
        'green',
        'yellow',
        'orange',
        'red',
        'purple',
        'violet',
        'blue',
      ],
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
        // omitted colors are patched with preSetGlobalColorOptions
      },
    };
    const expectedResult = {
      newGroupColors: {
        A: 'red',    // requested and priority
        B: 'blue',   // requested and priority
        C: 'green',  // requested red, but not priority and already used
        D: 'orange', // requested red, but not priority and already used
        E: 'purple', // requested red, but not priority and already used
        F: 'yellow', // requested and priority
        G: 'violet', // requested red, but not priority and already used
      },
      groupDotColors: {
        A: '254, 0, 0',     // red, requested and priority
        B: '0, 254, 0',     // blue, requested and priority
        C: '  0, 254,   0', // green = 1st available default
        D: '254, 128,   0', // orange = 2nd available default
        E: '169,   0,  81', // purple = 3rd available default
        F: '254, 254,   0', // yellow (requested and priority)
        G: '254,   0, 254', // violet = 4th available default
      },
      testKeys: {
        colorsUsed: {
          red:    true,
          blue:   true,
          green:  true,
          yellow: true,
          orange: true,
          purple: true,
          violet: true,
        },
        gcPriority: {
          red: 'A',
          blue: 'B',
          yellow: 'F',
        },
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatGroupsStyles default type only if no input', () => {
    const input = {};
    const expectedResult = {
      stylesAppended: {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatGroupsStyles default type only if thisPreSet has no styles', () => {
    const input = {
      thisPreSet: 'not an object',
    };
    const expectedResult = {
      stylesAppended: {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatGroupsStyles default type only if thisPreSet styles not an object', () => {
    const input = {
      thisPreSet: {
        styles: 'not an object',
      },
    };
    const expectedResult = {
      stylesAppended: {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatGroupsStyles default type only if thisPreSet styles not an object', () => {
    const input = {
      thisPreSet: {
        styles: 'not an object',
      },
    };
    const expectedResult = {
      stylesAppended: {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  const formatGroupStylesInput = {
    groupTrue: true,
    groups: ['A', 'B', 'C'],
    groupColors: {
      A: 'red',
      B: 'blue',
      C: 'red', // this changes to green since A is already red
    },
    groupsSub: [52, 57],
    preSetGlobalColorOptions: [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'violet',
      'blue',
    ],
    // preSetGlobalPalettes: {}, // this defaults if not specified
    layersAllPrefixed: [
      'layer1', 
      'layer2', 
      'layer3', 
      'A__layer4', 
      '57__layer4',
      'A__57__layer5',
      'C__layer6',
      'C__53__layer6',
      'C__54__layer6',
      'C__54__layer4',
      '53__layer6',
    ],
    styles: {
      layer4: {
        color: '34, 52, 78'
      },
      layer5: {
        color: '44, 46, 67'
      },
    },
    thisPreSet: {
      styles: {
        A__52__layer1: {
          style: {
            borderColor: '254, 32, 78'
          },
        },
        '52_layer2': {
          style: {
            borderDash: [15, 3],
          }
        },
        layer3: {
          color: '77, 77, 77',
        },
        layer6: {
          style: {
            shade: 1,
            borderDashOffset: 0.2,
          }
        }
      }
    },
  };
  const formatGroupStylesExpectedResultGrouped = {
    newGroupColors: {
      A: 'red',   // A = red, priority
      B: 'blue',  // B = blue, priority
      C: 'green', // C = green, 1st available default
    },
    groupDotColors: {
      A: '254,   0,   0',    // A = red, priority
      B: '  0,   0, 254',    // B = blue, priority
      C: '  0, 254,   0' // C = green, 1st available default
    },
    stylesAppended: {
      // one key for each layer selected
      layer1: { // read from A__52__layer1
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
          //   borderColor: '254, 32, 78' // DELETED bc NO CASCADE!
        },
      },
      layer2: { // read from 52__layer2
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
          //   borderDash: [15, 3],// DELETED bc NO CASCADE!
        } 
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
        style: {},
      },
      A__57__layer5: {
        color: '44, 46, 67',
        style: {},
      },
      C__layer6: {
        color: '80, 80, 80', // default bc no color explicitly specified - AND we are not using groups
        style: {
          shade: 1,
          borderDashOffset: 0.2,
        }
      },
      C__53__layer6: {
        color: '80, 80, 80',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer6: {
        color: '80, 80, 80',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer4: {
        color: '34, 52, 78', // from general styles, group C does not affect it, because no shade
        style: {},
      },
      '53__layer6': {
        color: '80, 80, 80', // default, none specified
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
    },
  };
  it('formatGroupsStyles not grouped', () => {
    const input = Object.assign({},
      formatGroupStylesInput,
      {groupTrue: false}
    );
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(formatGroupStylesExpectedResultGrouped);
  });
  it('formatGroupsStyles grouped', () => {
    const input = Object.assign({},
      formatGroupStylesInput,
      {groupTrue: true}
    );
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(formatGroupStylesExpectedResultGrouped);
  });
  it('formatGroupsStyles explicit only', () => {
    const thisPreSet = Object.assign({},
      formatGroupStylesInput.thisPreSet,
      {
        useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatGroupStylesInput,
      {
        groupTrue: false,
        thisPreSet,
      }
    );
    const expectedResult = {
      newGroupColors: {},
      groupDotColors: {},
      stylesAppended: {
        // from styles
        layer4: {
          color: '34, 52, 78'
        },
        layer5: {
          color: '44, 46, 67'
        },
        // from preSet
        A__52__layer1: {
          style: {
            borderColor: '254, 32, 78'
          },
        },
        '52_layer2': {
          style: {
            borderDash: [15, 3],
          }
        },
        layer3: {
          color: '77, 77, 77',
        },
        layer6: {
          style: {
            shade: 1,
            borderDashOffset: 0.2,
          }
        }
      },
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatGroupsStyles group of explicit only', () => {
    const thisPreSet = Object.assign({},
      formatGroupStylesInput.thisPreSet,
      {
        useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatGroupStylesInput,
      {
        groupTrue: true,
        thisPreSet,
      }
    );
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(formatGroupStylesExpectedResultGrouped);
  });

  const formatPreSetToLoadPreSet = {
    layersSelected: [
      'layer1',
      'layer2',
    ],
    type: 'group',
    styles: {
      A__52__layer1: {
        style: {
          borderColor: '254, 32, 78'
        },
      },
      '52_layer2': {
        style: {
          borderDash: [15, 3],
        }
      },
      layer3: {
        color: '77, 77, 77',
      },
      layer6: {
        style: {
          shade: 1,
          borderDashOffset: 0.2,
        }
      }
    }
  };
  const formatPreSetToLoadInput = {
    groupTrue: true,
    groups: ['A', 'B', 'C'],
    groupColors: {
      A: 'red',
      B: 'blue',
      C: 'red', // this changes to green since A is already red
    },
    groupsSub: [52, 57],
    // preSetGlobalPalettes: {}, // this defaults if not specified
    preSetGlobalColorOptions: [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'violet',
      'blue',
    ],
    layersAllPrefixed: [
      'layer1', 
      'layer2', 
      'layer3', 
      'A__layer4', 
      '57__layer4',
      'A__57__layer5',
      'C__layer6',
      'C__53__layer6',
      'C__54__layer6',
      'C__54__layer4',
      '53__layer6',
    ],
    styles: {
      layer4: {
        color: '34, 52, 78'
      },
      layer5: {
        color: '44, 46, 67'
      },
    },
  };
  const id = 333;
  const formatPreSetToLoadExpectedResultGrouped = {
    groupColors: {
      A: 'red',   // A = red, priority
      B: 'blue',  // B = blue, priority
      C: 'green', // C = green, 1st available default
    },
    groupDotColors: {
      A: '254,   0,   0',    // A = red, priority
      B: '  0,   0, 254',    // B = blue, priority
      C: '  0, 254,   0' // C = green, 1st available default
    },
    preSetIdActive: 333,
    selector0: 'A__layer1',
    layersSelected: [
      'B__layer1',
      'C__layer1',
      'A__layer2',
      'B__layer2',
      'C__layer2',
    ],
    styles: {
      // one key for each layer selected
      layer1: { // read from A__52__layer1
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
          //   borderColor: '254, 32, 78' // DELETED bc NO CASCADE!
        },
      },
      layer2: { // read from 52__layer2
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
          //   borderDash: [15, 3],// DELETED bc NO CASCADE!
        } 
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
        style: {},
      },
      A__57__layer5: {
        color: '44, 46, 67',
        style: {},
      },
      C__layer6: {
        color: '80, 80, 80', // default bc no color explicitly specified - AND we are not using groups
        style: {
          shade: 1,
          borderDashOffset: 0.2,
        }
      },
      C__53__layer6: {
        color: '80, 80, 80',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer6: {
        color: '80, 80, 80',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer4: {
        color: '34, 52, 78', // from general styles, group C does not affect it, because no shade
        style: {},
      },
      '53__layer6': {
        color: '80, 80, 80', // default, none specified
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
    },
    prefixesToKeepGroups: [],    
    prefixesToKeepGroupsSub: [],
  };
  it('unpackPreSet groupTrue = true', () => {
    const thisPreSet = Object.assign({},
      formatPreSetToLoadPreSet,
      {
        type: 'group',
        // useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatPreSetToLoadInput,
      {
        groupTrue: true,
        // groups
      }
    );
    const expectedResult = formatPreSetToLoadExpectedResultGrouped;
    const result = unpackPreSet(input, thisPreSet, id);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unpackPreSet groupTrue = false', () => {
    const thisPreSet = Object.assign({},
      formatPreSetToLoadPreSet,
      {
        type: 'group',
        // useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatPreSetToLoadInput,
      {
        groupTrue: false,
        // groups
      }
    );
    const expectedResult = Object.assign({},
      formatPreSetToLoadExpectedResultGrouped,
      {
        selector0: 'layer1',
        layersSelected: [
          'layer2',
        ],
      }
    );
    const result = unpackPreSet(input, thisPreSet, id);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unpackPreSet type is not group', () => {
    const thisPreSet = Object.assign({},
      formatPreSetToLoadPreSet,
      {
        type: 'not a group',
        // useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatPreSetToLoadInput,
      {
        groupTrue: true, // preSet is not a group, so this is effectively false
        // groups
      }
    );
    const expectedResult = Object.assign({},
      formatPreSetToLoadExpectedResultGrouped,
      {
        selector0: 'layer1',
        layersSelected: [
          'layer2',
        ],
      }
    );
    const result = unpackPreSet(input, thisPreSet, id);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unpackPreSet explicit only', () => {
    const thisPreSet = Object.assign({},
      formatPreSetToLoadPreSet,
      {
        type: 'group',
        useOnlyExplicitStylesWhenUngrouped: true,
      }
    );
    const input = Object.assign({},
      formatPreSetToLoadInput,
      {
        groupTrue: false,
        // groups
      }
    );
    // results when useOnlyExplicitStylesWhenUngrouped = true
    // and groupTrue = false (i.e. ungrouped and use explicit when un-grouped)
    // group colors and dot colors empty
    // layers not prefixed
    // styles are simple aggregation of explicit styles
    const expectedResult = {
      groupColors: {},
      groupDotColors: {},
      preSetIdActive: id,
      selector0: 'layer1',
      layersSelected: [
        'layer2',
      ],
      styles: {
        // from styles
        layer4: {
          color: '34, 52, 78'
        },
        layer5: {
          color: '44, 46, 67'
        },
        // from preSet
        A__52__layer1: {
          style: {
            borderColor: '254, 32, 78'
          },
        },
        '52_layer2': {
          style: {
            borderDash: [15, 3],
          }
        },
        layer3: {
          color: '77, 77, 77',
        },
        layer6: {
          style: {
            shade: 1,
            borderDashOffset: 0.2,
          }
        }
      },
      prefixesToKeepGroups: [],  
      prefixesToKeepGroupsSub: [],  
    };
    const result = unpackPreSet(input, thisPreSet, id);
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
          def: true,
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'weather',
    };
    const expectedResult = undefined;
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });

});