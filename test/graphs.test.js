'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  // data
  parseDataArraysByKeys,
  parseLabelsByKeys,
  parseYAxisByKeys,
  parseDataType1To0,
  parseDataType2To1,
  parseDataType2To0,
  parseDataType1,
  calcDataLength,
  conformDataLength,
  addDataset, 
  addDatapoints,
  editDatapoint,
  createGraphData,
  // axes
  calcTicks,
  createXAxis,
  createYAxis, // tested via createYAxes
  createYAxesOptions,
  createYAxes,
  // legend
  createLegend,
  // options
  createGraphOptions,
  checkForGraphRefresh,
  createGraph,
  
  createGraphInfoOnGroupOrMount,
  formatGraphKeysInput,
} = require('../build/helpers/graphs');

describe('graphs', ()=> { 

  it('parseDataArraysByKeys default if dataObjectsArray not an array', () => {
    const dataObjectsArray = 'not an array';
    const layersArray = [
      'key1', 'key3'
    ];
    const expectedResult = [
      []
    ];
    const result = parseDataArraysByKeys(dataObjectsArray, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataArraysByKeys default if layersArray not an array', () => {
    const dataObjectsArray = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const layersArray = 'not an array';
    const expectedResult = [
      []
    ];
    const result = parseDataArraysByKeys(dataObjectsArray, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataArraysByKeys', () => {
    const dataObjectsArray = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const layersArray = [
      'key1', 'key3'
    ];
    const expectedResult = [
      [1, 15],
      [5, 52],
    ];
    const result = parseDataArraysByKeys(dataObjectsArray, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseLabelsByKeys no Y-axis keys', () => {
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: 'the first key',
      key2: 'the second key',
      key3: 'banana',
      key4: 'not used',
      key5: 'decimals'
    };
    const expectedResult = [
      'the first key', 'banana',
    ];
    const result = parseLabelsByKeys(legendObject, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseLabelsByKeys with Y-axis keys', () => {
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: ['1st K', 'the first key' ,'meter'],
      key2: ['2nd K', 'the second key','yard' ],
      key3: ['Ban'  , 'banana'        ,'stick'],
      key4: ['Huh?' , 'not used'      ,'meter'],
      key5: ['EU'   , 'decimals'      ,'meter'],
    };
    const expectedResult = [
      'the first key', 'banana',
    ];
    const result = parseLabelsByKeys(legendObject, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseYAxisByKeys with no keys', () => {
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: 'the first key',
      key2: 'the second key',
      key3: 'banana',
      key4: 'not used',
      key5: 'decimals'
    };
    const expectedResult = {
      yAxisArray: [
        'units', 'units',
      ],
      yAxisIdArray: [
        'A', 'A'
      ],
    };
    const result = parseYAxisByKeys(legendObject, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseYAxisByKeys w/ keys', () => {
    const layersArray = [
      'key1', 'key3', 'key5',
    ];
    const legendObject = { // with no Y-axis units
      key1: ['1st K', 'the first key' ,'meter'],
      key2: ['2nd K', 'the second key','yard' ],
      key3: ['Ban'  , 'banana'        ,'stick'],
      key4: ['Huh?' , 'not used'      ,'meter'],
      key5: ['EU'   , 'decimals'      ,'meter'],
    };
    const expectedResult = {
      yAxisArray: [
        'meter', 'stick', 'meter',
      ],
      yAxisIdArray: [
        'A', 'B', 'A'
      ],
    };
    const result = parseYAxisByKeys(legendObject, layersArray);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseDataType1To0 defaults if dataType1Processed not an array', () => {
    const dataType1Processed = 'not an array';
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw:  [[]],
      dataLabelArray:[],
      yAxisArray:    [],
      yAxisIdArray:  [],
    };
    const result = parseDataType1To0(
      dataType1Processed, 
      legendObject, 
      layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType1To0 defaults if layersArray not an array', () => {
    const dataType1Processed = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const layersArray = 'not an array';
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw:  [[]],
      dataLabelArray:[],
      yAxisArray:    [],
      yAxisIdArray:  [],
    };
    const result = parseDataType1To0(
      dataType1Processed, 
      legendObject, 
      layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType1To0 defaults if legendObject not an object', () => {
    const dataType1Processed = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = 'not an object';
    const expectedResult = {
      dataType0Raw:  [[]],
      dataLabelArray:[],
      yAxisArray:    [],
      yAxisIdArray:  [],
    };
    const result = parseDataType1To0(
      dataType1Processed, 
      legendObject, 
      layersArray);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType1To0', () => {
    const dataType1Processed = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const layersArray = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [
        [1, 15], // test1 key1
        [5, 52], // test1 key3
      ],
      dataLabelArray: [
        'the first key', 'banana',
      ],
      yAxisArray: [
        'lbs', 'cubits',
      ],
      yAxisIdArray: [
        'A', 'B',
      ],
    };
    const result = parseDataType1To0(
      dataType1Processed, 
      legendObject, 
      layersArray);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseDataType2To0 default if arraysOfDataObjects not an array', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const layersArrayRaw = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [
        [1,   15], // test1 key1
        [5,   52], // test1 key3
        [11, 151], // test7 key1
        [51, 521], // test7 key3
      ],
      dataLabelArray: [
        'test1 the first key', 'test1 banana',
        'test7 the first key', 'test7 banana',
      ],
      yAxisArray: [
        'lbs', 'cubits',
      ],
      yAxisIdArray: [
        'A', 'B',
      ],
      layersArray: [
        'test1key1', 'test1key3',
        'test7key1', 'test7key3',
      ],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To0 default if layerArrayRaw not an array', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const layersArrayRaw = 'not an array';
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To0 default if arraysOfDataObjects[0] not an array', () => {
    const arraysOfDataObjects = [
      'not an array',
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const layersArrayRaw = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To0 default if arrayOfDataGroups not an array', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = 'not an array';
    const layersArrayRaw = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To0 default if legendObject not an object', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const layersArrayRaw = [
      'key1', 'key3'
    ];
    const legendObject = 'not an object';
    const expectedResult = {
      dataType0Raw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To0', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const layersArrayRaw = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['1st K', 'the first key' , 'lbs'       ],
      key2: ['2nd K', 'the second key', 'ft'        ],
      key3: ['Ban'  , 'banana'        , 'cubits'    ],
      key4: ['N/A'  , 'not used'      , 'nanometers'],
      key5: ['M'    , 'decimals'      , 'meters'    ],
    };
    const expectedResult = {
      dataType0Raw: [
        [1,   15], // test1 key1
        [5,   52], // test1 key3
        [11, 151], // test7 key1
        [51, 521], // test7 key3
      ],
      dataLabelArray: [
        'test1 the first key', 'test1 banana',
        'test7 the first key', 'test7 banana',
      ],
      yAxisArray: [
        'lbs', 'cubits',
      ],
      yAxisIdArray: [
        'A', 'B',
      ],
      layersArray: [
        'test1key1', 'test1key3',
        'test7key1', 'test7key3',
      ],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      layersArrayRaw);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseDataType2To1 default if arraysOfDataObjects not an array', () => {
    const arraysOfDataObjects = 'not an array';
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const expectedResult = {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: 'invalid data types',
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1 default if arraysOfDataObjects not an array', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = 'not an array';
    const expectedResult = {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: 'invalid data types',
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1 errs if arrays different lengths', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = ['a shorter array'];
    const expectedResult = {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: `we found ${arrayOfDataGroups.length} labels and ${arraysOfDataObjects.length} arrays.`,
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1 errs if arraysOfDataObjects is array of other than arrays', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      'not an array', // ERR IS HERE !
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
  
    const expectedResult = {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: 'expected a subarray, but found none',
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1 errs if arraysOfDataObjects has varying lengths', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
        {
          key1: 156, // pt 2
          key2: 366,
          key3: 526,
          key5: 3.86,
          keyX: 716,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const expectedResult = {
      dataObjectsArray: [
        {
          test1__key1: 1,
          test1__key2: 3,
          test1__key3: 5,
          test1__key5: 3.5,
          test1__keyX: 7,
  
          test7__key1: 11,
          test7__key2: 31,
          test7__key3: 51,
          test7__key5: 3.51,
          test7__keyX: 71,
        },
        {
          test1__key1: 15,
          test1__key2: 36,
          test1__key3: 52,
          test1__key5: 3.8,
          test1__keyX: 71,
  
          test7__key1: 151,
          test7__key2: 361,
          test7__key3: 521,
          test7__key5: 3.81,
          test7__keyX: 711,
        },
        {
          test1__key1: 156, // TEST 1 HAS 3 IN ITS ARRAY, TEST 2 HAS ONLY 2
          test1__key2: 366,
          test1__key3: 526,
          test1__key5: 3.86,
          test1__keyX: 716,
        },
      ],
      indexOfLongestArray: 0,
      longestArrayLength: 3,
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1 errs if keys to skip', () => {
    const keysSkip = ['key2', 'keyX', 'keyKeyKey'];
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
        {
          key1: 156, // pt 2
          key2: 366,
          key3: 526,
          key5: 3.86,
          keyX: 716,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31, // keep this; it is last occurrence of key2
          key3: 51,
          key5: 3.51,
          keyX: 71, // keep this; it is last occurrence of keyX
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const expectedResult = {
      dataObjectsArray: [
        {
          test1__key1: 1,
          // test1__key2: 3,
          test1__key3: 5,
          test1__key5: 3.5,
          // test1__keyX: 7,
  
          test7__key1: 11,
          key2: 31,
          test7__key3: 51,
          test7__key5: 3.51,
          keyX: 71,
        },
        {
          test1__key1: 15,
          // test1__key2: 36,
          test1__key3: 52,
          test1__key5: 3.8,
          // test1__keyX: 71,
  
          test7__key1: 151,
          key2: 361,
          test7__key3: 521,
          test7__key5: 3.81,
          keyX: 711,
        },
        {
          test1__key1: 156, // TEST 1 HAS 3 IN ITS ARRAY, TEST 2 HAS ONLY 2
          key2: 366,
          test1__key3: 526,
          test1__key5: 3.86,
          keyX: 716,
        },
      ],
      indexOfLongestArray: 0,
      longestArrayLength: 3,
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      keysSkip);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType2To1', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const expectedResult = {
      dataObjectsArray: [
        {
          test1__key1: 1,
          test1__key2: 3,
          test1__key3: 5,
          test1__key5: 3.5,
          test1__keyX: 7,
  
          test7__key1: 11,
          test7__key2: 31,
          test7__key3: 51,
          test7__key5: 3.51,
          test7__keyX: 71,
        },
        {
          test1__key1: 15,
          test1__key2: 36,
          test1__key3: 52,
          test1__key5: 3.8,
          test1__keyX: 71,
  
          test7__key1: 151,
          test7__key2: 361,
          test7__key3: 521,
          test7__key5: 3.81,
          test7__keyX: 711,
        },
      ],
      indexOfLongestArray: 0,
      longestArrayLength: 2,
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseDataType1 calling parseDataType2To1', () => {
    const state = {
      groups: [
        'test1', 'test7'
      ],
      dataConvertFrom: 2,
      dataType2Raw: [
        [ // group 0 = test 1
          // this is longest array
          {
            key1: 1,  // pt 0
            key2: 3,
            key3: 5,
            key5: 3.5,
            keyX: 7,
            xLabel: 'one',
          },
          {
            key1: 15, // pt 1
            key2: 36,
            key3: 52,
            key5: 3.8,
            keyX: 71,
            xLabel: 'two',
          },
        ],
        [ // group 1 = test 7
          {
            key1: 11,
            key2: 31,
            key3: 51,
            key5: 3.51,
            keyX: 71,
            xLabel: 'one again',
          },
          {
            key1: 151,
            key2: 361,
            key3: 521,
            key5: 3.81,
            keyX: 711,
            xLabel: 'two again',
          },
        ]
      ]
    };
    const expectedResult = [
      {
        test1__key1: 1,
        test1__key2: 3,
        test1__key3: 5,
        test1__key5: 3.5,
        test1__keyX: 7,
  
        test7__key1: 11,
        test7__key2: 31,
        test7__key3: 51,
        test7__key5: 3.51,
        test7__keyX: 71,
        xLabel: 'one again',
      },
      {
        test1__key1: 15,
        test1__key2: 36,
        test1__key3: 52,
        test1__key5: 3.8,
        test1__keyX: 71,
  
        test7__key1: 151,
        test7__key2: 361,
        test7__key3: 521,
        test7__key5: 3.81,
        test7__keyX: 711,
        xLabel: 'two again',
      },
    ];
    const result = parseDataType1(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType1 empty array if no data', () => {
    const state = {
      groups: [
        'test1', 'test7'
      ],
      dataType2Raw: 'not an array',
      dataConvertFrom: 'not 2 or 0',
      dataType1Raw: 'not an array',
    };
    const expectedResult = [];
    const result = parseDataType1(state);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseDataType1 TEMPORARY empty array if type 0', () => {
    // have not written type 0 yet, not sure if needed
    const state = {
      groups: [
        'test1', 'test7'
      ],
      dataConvertFrom: 0,
      dataType1Raw: ['array but doesn\'t matter'],
    };
    const expectedResult = [];
    const result = parseDataType1(state);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcDataLength', ()=>{
    const dataType0Raw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const end = 5;
    const expectedResult = {
      first: 2,
      last: 5,
      dataLength: 4,
    };
    const result = calcDataLength(dataType0Raw, start, end);
    expect(result).to.deep.equal(expectedResult);
  });

  it('conformDataLength trim either end', ()=>{
    const dataType0Raw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const length = 4;
    const expectedResult = [
      ['a', 4, 5, 'b'],
      ['c', 3, 2, 'd'],
    ];
    const pointsToAdd = undefined;
    const result = conformDataLength(
      dataType0Raw, 
      start, 
      length,
      pointsToAdd
    );
    expect(result).to.deep.equal(expectedResult);
  });

  it('conformDataLength trim and extend', ()=>{
    const dataType0Raw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const length = 11;
    const expectedResult = [
      ['a', 4, 5, 'b', 7, 8, null, null, null],
      ['c', 3, 2, 'd', 9, 0, null, null, null],
    ];
    const pointsToAdd = 3;
    const result = conformDataLength(
      dataType0Raw, 
      start, 
      length,
      pointsToAdd
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('addDataset', ()=> {
    const style = {
      styling: 'stuff',
    };
    const graphData = {
      labels: [ 'point1', 'point2', 'point3' ],
      datasets: [
        Object.assign({},
          style,
          {
            data: [
              0.01,
              0.12,
              0.08,
            ],
            label: 'dataset 0',
          }
        ),
        Object.assign({},
          style,
          {
            data: [
              0.03,
              0.15,
              0.14,
            ],
            label: 'dataset 1',
          }
        )
      ],
    };
    const newData = graphData.datasets[0].data.map(d=>2);
    const expectedResult = {
      labels: [ 'point1', 'point2', 'point3' ],
      datasets: [
        Object.assign({},
          style,
          {
            data: [
              0.01,
              0.12,
              0.08,
            ],
            label: 'dataset 0',
          }
        ),
        Object.assign({},
          style,
          {
            data: [
              0.03,
              0.15,
              0.14,
            ],
            label: 'dataset 1',
          }
        ),
        {
          styling: 'stuff',
          data: [
            2,
            2,
            2,
          ],
          label: 'dataset 2',
        },
      ],
    };
    const result = addDataset({
      graphData,
      data: newData,
      style,
    });
    expect(result).to.deep.equal(expectedResult);
  });

  it('addDatapoints', ()=> {
    const style = {
      styling: 'stuff',
    };
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        Object.assign({},
          style,
          {
            data: [
              0.01,
              0.12,
              0.08,
            ],
            label: 'dataset 0',
          }
        ),
        Object.assign({},
          style,
          {
            data: [
              0.03,
              0.15,
              0.14,
            ],
            label: 'dataset 1',
          }
        )
      ],
    };
    const newData = [1,2];
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2', 'point3' ],
      datasets: [
        Object.assign({},
          style,
          {
            data: [
              0.01,
              0.12,
              0.08,
              1,
            ],
            label: 'dataset 0',
          }
        ),
        Object.assign({},
          style,
          {
            data: [
              0.03,
              0.15,
              0.14,
              2,
            ],
            label: 'dataset 1',
          }
        )
      ],
    };
    const result = addDatapoints({
      graphData,
      data: newData,
    });
    expect(result).to.deep.equal(expectedResult);
  });

  it('editDatapoint', ()=> {
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            99,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const result = editDatapoint({
      graphData,
      data: 99,
      setIndex: 1,
      index: 2
    });
    expect(result).to.deep.equal(expectedResult);
  });

  it('editDatapoint', ()=> {
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            99,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const result = editDatapoint({
      graphData,
      data: 99,
      setIndex: 1,
      index: 2
    });
    expect(result).to.deep.equal(expectedResult);
  });

  it('createGraphData 1', ()=>{
    const input = {
      layersSelected: ['rain_in', 'rain_gals', 'mins'],
      dataType0Processed: [ // 3 datasets
        [1, 15],    // each dataset has 2 items in increment
        [5, 52],
        [3, 77],
      ],
      dataLabelArray: [
        'the first key', 'banana', 'time',
      ],
      yAxisArray: [
        'lbs', 'cubits', 'lbs',
      ],
      yAxisIdArray: [
        'A', 'B', 'A',
      ],
      stylesArray: [
        { style1: 'value1' },
        { style2: 'value2' },
        { style3: 'value3' },
      ],
    };
    const expectedResult = {
      labels: [0,1], // 1 per increment
      datasets: [
        {
          style1: 'value1',
          label: 'the first key',
          yAxisID: 'A',
          data: [1, 15],
        },
        {
          style2: 'value2',
          label: 'banana',
          yAxisID: 'B',
          data: [5, 52],
        },
        {
          style3: 'value3',
          label: 'time',
          yAxisID: 'A',
          data: [3, 77],
        },
      ],
    }; 
    const result = createGraphData(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createGraphData 1 specific labels', ()=>{
    const input = {
      layersSelected: ['rain_in', 'rain_gals', 'mins'],
      xLabelsArray: ['5/2','5/3'],
      dataType0Processed: [ // 3 datasets
        [1, 15],    // each dataset has 2 items in increment
        [5, 52],
        [3, 77],
      ],
      dataLabelArray: [
        'the first key', 'banana', 'time',
      ],
      yAxisArray: [
        'lbs', 'cubits', 'lbs',
      ],
      yAxisIdArray: [
        'A', 'B', 'A',
      ],
      stylesArray: [
        { style1: 'value1' },
        { style2: 'value2' },
        { style3: 'value3' },
      ],
    };
    const expectedResult = {
      labels: ['5/2','5/3'], // 1 per increment
      datasets: [
        {
          style1: 'value1',
          label: 'the first key',
          yAxisID: 'A',
          data: [1, 15],
        },
        {
          style2: 'value2',
          label: 'banana',
          yAxisID: 'B',
          data: [5, 52],
        },
        {
          style3: 'value3',
          label: 'time',
          yAxisID: 'A',
          data: [3, 77],
        },
      ],
    }; 
    const result = createGraphData(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcTicks 33/6', ()=> {
    const dataLength =   33;
    const idealSpacing =  6;
    const expectedResult = {
      maxTicksLimitDown:  5,
      lengthRoundDown:   31, // actual math + 1
      pointsToRemove:     2, 
      maxTicksLimitUp:    6,
      lengthRoundUp:     37, // actual math + 1
      pointsToAdd:        4,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcTicks 77/4', ()=> {
    const dataLength =   77;
    const idealSpacing =  4;
    const expectedResult = {
      maxTicksLimitDown: 19,
      lengthRoundDown:   77, // actual math + 1
      pointsToRemove:     0,
      maxTicksLimitUp:   19,
      lengthRoundUp:     77, // actual math + 1
      pointsToAdd:        0,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcTicks 80/5', ()=> {
    const dataLength =   80;
    const idealSpacing =  5;
    const expectedResult = {
      maxTicksLimitDown: 16,
      lengthRoundDown:   76,
      pointsToRemove:     4, // 0 is actual, but loops through to 5 for a whole step down, then back up by 1 (-5 + 1 = -4, so 4 "remove")
      maxTicksLimitUp:   17,
      lengthRoundUp:     81,
      pointsToAdd:        1,// actual math + 1,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createXAxis over white', ()=>{
    const options = {
      label: 'x-axis',
      cssBackground: 'white',
      min: 5,
      max: 40,
      maxTicksLimit: 20,
    };
    const expectedResult = {
      display: true,
      gridLines: {
        display: true,
        zeroLineColor: 'black', // calculated
        color: 'rgba(68,68,68,0.5)', // calculated
        axisColor: 'rgba(68,68,68,0.5)', // calculated
      },
      pointLabels :{
        fontSize: 12,
      },
      ticks: {
        display: true,
        autoSkip: true,
        min: 5, // calculated, def 0
        max: 40, // calculated
        maxTicksLimit: 20, // calculated, def 100
        fontColor: 'rgb(0, 0, 77)', // calculated
      },
      scaleLabel: { // labels the entire scale
        display: true,
        labelString: 'x-axis', // calculated
        fontColor: 'rgb(0, 0, 77)', // calculated
      },
    }; 
    const result = createXAxis(options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createXAxis over gray with defaults', ()=>{
    const options = {
      label: 'x-axis over gray',
      // cssBackground: 'white',
      // min: 5,
      // max: 40,
      // maxTicksLimit: 20,
    };
    const expectedResult = {
      display: true,
      gridLines: {
        display: true,
        zeroLineColor: 'white', // calculated
        color: 'rgba(119,119,119,0.5)', // calculated
        axisColor: 'rgba(119,119,119,0.5)', // calculated
      },
      pointLabels :{
        fontSize: 12,
      },
      ticks: {
        display: true,
        autoSkip: true,
        min: 0, // calculated, def 0
        max: 500, // calculated
        maxTicksLimit: 100, // calculated, def 100
        fontColor: 'white', // calculated
      },
      scaleLabel: { // labels the entire scale
        display: true,
        labelString: 'x-axis over gray', // calculated
        fontColor: 'white', // calculated
      },
    }; 
    const result = createXAxis(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createYAxesOptions one explicit Y units another not specified', ()=>{
    const options = {
      labels: ['one', 'two'],
      cssBackground: 'white',
      yAxisUnitOptions: {
        one: {
          min: 3,
          max: 7,
          maxTicksLimitY: 4,
        },
      }
    };
    const expectedResult = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        cssBackground: 'white',
        min: 3,
        max: 7,
        maxTicksLimitY: 4,
      },
      {
        label: 'two',
        id: 'B',
        position: 'left',
        cssBackground: 'white',
        min: undefined,
        max: undefined,
        maxTicksLimitY: undefined,
      }
    ];
    const result = createYAxesOptions(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createYAxesOptions Y units another not specified', ()=>{
    const options = {
      labels: ['one', 'two'],
      cssBackground: 'white',
    };
    const expectedResult = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        cssBackground: 'white',
        min: undefined,
        max: undefined,
        maxTicksLimitY: undefined,
      },
      {
        label: 'two',
        id: 'B',
        position: 'left',
        cssBackground: 'white',
        min: undefined,
        max: undefined,
        maxTicksLimitY: undefined,
      }
    ];
    const result = createYAxesOptions(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createYAxesOptions both Y units specified', ()=>{
    const options = {
      labels: ['one', 'two'],
      cssBackground: 'white',
      yAxisUnitOptions: {
        one: {
          min: 3,
          max: 7,
          maxTicksLimitY: 4,
        },
        two: {
          min: 33,
          max: 77,
          maxTicksLimitY: 44,
        },
      }
    };
    const expectedResult = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        cssBackground: 'white',
        min: 3,
        max: 7,
        maxTicksLimitY: 4,
      },
      {
        label: 'two',
        id: 'B',
        position: 'left',
        cssBackground: 'white',
        min: 33,
        max: 77,
        maxTicksLimitY: 44,
      }
    ];
    const result = createYAxesOptions(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createYAxes over white', ()=>{
    const arrayOfOptions = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        cssBackground: 'white',
        min: 33,
        max: 77,
        maxTicksLimitY: 44,
      },
      {
        label: 'two',
        id: 'B',
        position: 'left',
        cssBackground: 'white',
        min: 0,
        max: undefined,
        maxTicksLimitY: undefined,
      }
    ];
    const expectedResult = [
      {
        id: 'A', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'black', // calculated
          color: 'rgba(68,68,68,0.5)', // calculated
          axisColor: 'rgba(68,68,68,0.5)', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'rgb(0, 0, 77)', // calculated
          min: 33,
          max: 77,
          maxTicksLimit: 44,
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'one', // calculated
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
      }, 
      {
        id: 'B', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'black', // calculated
          color: 'rgba(68,68,68,0.5)', // calculated
          axisColor: 'rgba(68,68,68,0.5)', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'rgb(0, 0, 77)', // calculated
          min: 0,
          max: undefined,
          maxTicksLimit: undefined,
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'two', // calculated
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
      }
    ];
    const result = createYAxes(arrayOfOptions);
    expect(result).to.deep.equal(expectedResult);
  });
  it('createYAxes over gray', ()=>{
    const arrayOfOptions = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        // cssBackground: 'white',
        min: 33,
        max: 77,
        maxTicksLimitY: 44,
      },
      {
        label: 'two',
        id: 'B',
        position: 'left',
        // cssBackground: 'white',
      }
    ];
    const expectedResult = [
      {
        id: 'A', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'white', // calculated
          color: 'rgba(119,119,119,0.5)', // calculated
          axisColor: 'rgba(119,119,119,0.5)', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'white', // calculated
          min: 33,
          max: 77,
          maxTicksLimit: 44,
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'one', // calculated
          fontColor: 'white', // calculated
        },
      }, 
      {
        id: 'B', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'white', // calculated
          color: 'rgba(119,119,119,0.5)', // calculated
          axisColor: 'rgba(119,119,119,0.5)', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'white', // calculated
          min: undefined,
          max: undefined,
          maxTicksLimit: undefined,
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'two', // calculated
          fontColor: 'white', // calculated
        },
      }
    ];
    const result = createYAxes(arrayOfOptions);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createLegend over white', ()=>{
    const options = {
      position: 'top',
      cssBackground: 'white',
    };
    const expectedResult = {
      display: true,
      position: 'top', // default to bottom
      fullWidth: true,
      reverse: false,
      labels: {
        fontColor: 'black',
      },
    }; 
    const result = createLegend(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createGraphOptions over white', ()=>{
    const options = {
      cssBackground: 'white',     // overall cssBackground
      legendPosition: 'top',   // where to put legend
      yLabel: ['one', 'two'], // one label for each Y axis
      xLabel: 'x-axis',        // one label for X axis (can have multiple, but currently I only have 1)
      minX: 5,                 // start data here, data starts at 0, so 5 would truncate 4 from front
      maxX: 40,                // end data here, e.g. if data goes through 100, we only show 5-40 in this case
      maxTicksLimitX: 20,      // not working 100% of time, if we have 40 ticks, this should show 1 tick every 2 points; this works until the screen gets wider, then the ticks seem to double
      yAxisUnitOptions: {
        one: {
          min: 3,
          max: 7,
          maxTicksLimitY: 4,
        },
      },
    };
    const expectedResult = {
      responsive: true,
      tooltips: {
        mode: 'label'
      },
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: 'top', // default to bottom
        fullWidth: true,
        reverse: false,
        labels: {
          fontColor: 'black',
        },
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: 'rgba(68,68,68,0.5)', // calculated
              axisColor: 'rgba(68,68,68,0.5)', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              autoSkip: true,
              min: 5, // calculated, def 0
              max: 40, // calculated
              maxTicksLimit: 20, // calculated, def 100
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'x-axis', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }
        ],
        yAxes: [
          {
            id: 'A', // calculated
            position: 'left', // calculated
            type: 'linear',
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: 'rgba(68,68,68,0.5)', // calculated
              axisColor: 'rgba(68,68,68,0.5)', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              fontColor: 'rgb(0, 0, 77)', // calculated
              min: 3,
              max: 7, 
              maxTicksLimit: 4,
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'one', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }, 
          {
            id: 'B', // calculated
            position: 'left', // calculated
            type: 'linear',
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: 'rgba(68,68,68,0.5)', // calculated
              axisColor: 'rgba(68,68,68,0.5)', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              fontColor: 'rgb(0, 0, 77)', // calculated
              min: undefined,
              max: undefined, 
              maxTicksLimit: undefined,
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'two', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }
        ]
      }
    }; 
    const result = createGraphOptions(options);
    expect(result).to.deep.equal(expectedResult);
  });

  it('checkForGraphRefresh nothing passed in is false', () => {
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh();
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh array is longer', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          }
        ]
      }
    };
    const cssBackground      =  'white';
    const cssBackgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'prior Y axes length: 2, new length: 3'
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh array is shorter', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const cssBackground      =  'white';
    const cssBackgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'prior Y axes length: 3, new length: 2'
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh array order diff', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
        ]
      }
    };
    const cssBackground      =  'white';
    const cssBackgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'id mismatch at index 1 (old: C, new: B)',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh cssBackground diff 1', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const cssBackground      =  'white';
    const cssBackgroundPrior =  undefined;
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh cssBackground diff 2', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const cssBackground      =  undefined;
    const cssBackgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });

  it('checkForGraphRefresh cssBackground diff 2', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const cssBackground      =  'gray';
    const cssBackgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh all same', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const cssBackground      =  'gray';
    const cssBackgroundPrior =  'gray';
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('checkForGraphRefresh cssBackground same no arrays', () => {
    const cssBackground      =  'gray';
    const cssBackgroundPrior =  'gray';
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh(
      undefined, undefined, 
      cssBackground, cssBackgroundPrior
    );
    expect(result).to.deep.equal(expectedResult);
  });

  it('createGraph',()=>{

    const input = {
      // data are ALL fetched, more than we want to graph
      dataType1Processed: [
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
        {
          key1: 25,
          key2: 46,
          key3: 62,
          key5: 3.9,
          keyX: 72,
        },
      ],
      // legend SHOULD have a key for all data
      legendObject: {
      //     label           , Y axis
        key1: ['1stK', 'the first key' , 'lbs'       ],
        key2: ['2ndK', 'the second key', 'ft'        ],
        key3: ['Bana', 'banana'        , 'cubits'    ],
        key4: ['NoUs', 'not used'      , 'nanometers'],
        key5: ['Decs', 'decimals'      , 'meters'    ],
      },
      // this narrows down data to what we want to graph
      layersSelected: [
        'key1', 'key3'
      ],
      xIdealTickSpacing: 1,
      xLabel: 'minutes',
      cssBackground: 'gray',
      xStart: 0,
      xEnd: 2,
      legendPosition: 'bottom',
      stylesArray: [
        { style1: 'value1' },
        { style2: 'value2' },
        { style3: 'value3' },
      ],
      graphOptionsPrior: {
        scales: {
          yAxes: [
            {
              id: 'A',
              scaleLabel: {
                labelString: 'lbs',
              }
            },
            {
              id: 'B',
              scaleLabel: {
                labelString: 'ft',
              }
            },
            {
              id: 'C',
              scaleLabel: {
                labelString: 'in',
              }
            }
          ]
        }
      },
      cssBackgroundPrior: 'gray',
      xLabelKey: undefined,
      xLabelStartAt: undefined,
      yAxisUnitOptions: {
        lbs: {
          min: 35,
          max: 75,
          maxTicksLimitY: 45,
        },
      },
    };
    const expectedResult = {
      graphData: {
        datasets: [
          {
            data: [
              1,
              15,
              25,
            ],
            label: 'the first key',
            style1: 'value1',
            yAxisID: 'A',
          },
          {
            data: [
              5,
              52,
              62,
            ],
            label: 'banana',
            style2: 'value2',
            yAxisID: 'B',
          },
        ],
        labels: [
          0,
          1,
          2,
        ],
      },
      graphOptions: {
        legend: {
          display: true,
          fullWidth: true,
          labels: {
            fontColor: 'white',
          },
          position: 'bottom',
          reverse: false,
        },
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                axisColor: 'rgba(119,119,119,0.5)',
                color: 'rgba(119,119,119,0.5)',
                display: true,
                zeroLineColor: 'white',
              },
              pointLabels: {
                fontSize: 12,
              },
              scaleLabel: {
                display: true,
                fontColor: 'white',
                labelString: 'minutes',
              },
              ticks: {
                autoSkip: true,
                display: true,
                fontColor: 'white',
                max: 4,  // lengthRoundUp + 1
                maxTicksLimit: 3, // data length
                min: 0,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                axisColor: 'rgba(119,119,119,0.5)',
                color: 'rgba(119,119,119,0.5)',
                display: true,
                zeroLineColor: 'white',
              },
              id: 'A',
              pointLabels: {
                fontSize: 12,
              },
              position: 'left',
              scaleLabel: {
                display: true,
                fontColor: 'white',
                labelString: 'lbs',
              },
              ticks: {
                display: true,
                fontColor: 'white',
                min: 35,
                max: 75,
                maxTicksLimit: 45,
              },
              type: 'linear',
            },
            {
              display: true,
              gridLines: {
                axisColor: 'rgba(119,119,119,0.5)',
                color: 'rgba(119,119,119,0.5)',
                display: true,
                zeroLineColor: 'white',
              },
              id: 'B',
              pointLabels: {
                fontSize: 12,
              },
              position: 'left',
              scaleLabel: {
                display: true,
                fontColor: 'white',
                labelString: 'cubits',
              },
              ticks: {
                display: true,
                fontColor: 'white',
                min: undefined,
                max: undefined,
                maxTicksLimit: undefined,
              },
              type: 'linear',
            },
          ],
        },
        tooltips: {
          mode: 'label',
        },
      },
      needRefresh: true,
      ready: true,
      xIdealTickSpacingPrior: 1, // regurgitated from last time for later comparison
      cssBackground: 'gray', // regurgitated
      layersSelected: [ // reguritated
        'key1',
        'key3',
      ],
      yAxisArray: [  // history key
        'lbs',       // key 1
        'cubits',    // key 3
      ],
      testingKeys: {
        yAxisIdArray: [ // testing key only
          'A',          // key 1
          'B',          // key 3
        ],
        dataType0Raw: [  // testing key only
          [            // key 1
            1,
            15,
            25,
          ],
          [            // key 3
            5,
            52,
            62,
          ],
        ],
        dataType0Processed: [  // testing key only
          [            // key 1
            1,
            15,
            25,
          ],
          [            // key 3
            5,
            52,
            62,
          ],
        ],
        dataLabelArray: [ // testing key only
          // this just looks up the key's label in legendObject
          'the first key',// key 1
          'banana',       // key 3
        ],
        first: 0,
        dataLength: 3,
        maxTicksLimitDown: 3,
        maxTicksLimitUp: 3,
        lengthRoundDown: 3,
        lengthRoundUp: 3,
        pointsToRemove: 0,
        refreshMessage: 'X-axis tick count changed',
        pointsToAdd: 0,
        ticksXChanged: true,
      }
    };
    const result = createGraph(input);
    expect(result).to.deep.equal(expectedResult);
  });

});
