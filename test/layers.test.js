'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  unPrefixLayers,
  groupLayersByUnit,
  calcFirstLayerOnList,
  toggleLayerGroup,
  createLayerSelectors,
  createLayerSelectorsInner,
  createLayersSelected,
  createGroupByData,
  parseDefaultLayerSelection, } = require('../compile/helpers/layers');

describe('layers', ()=> { 

  it('unPrefixLayers is pass-thru if no prefixesToKeep and no prefixes on layers', () => {
    const layers = [
      'layer1',
      'layer2'
    ];
    const prefixesToKeep = [];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers is pass-thru if prefixes not found', () => {
    const layers = [
      'layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers removes prefix if found and not marked keep', () => {
    const layers = [
      'C__layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers keeps prefix if found and marked keep', () => {
    const layers = [
      'A__layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'A__layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'A__layer1',
      'A__layer3',
      'A__rain',
      'B__layer3',
      'B__layer4',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly saving at 2 levels', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = ['A', 'B', 53];
    const expectedResult = [
      '53__B__layer3',
      '53__B__layer4',
      '53__rain',
      'A__layer1',
      'A__layer3',
      'A__rain',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly saving at 2 levels - number as string', () => {
    const layers = [
      'A__layer1',
      'layer2',
      'A__52__layer7',
      'A__53__layer7',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = ['A', 'B', '53'];
    const expectedResult = [
      '53__B__layer3',
      '53__B__layer4',
      '53__rain',
      'A__53__layer7',
      'A__layer1',
      'A__layer3',
      'A__layer7',
      'A__rain',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers removes all prefixes', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = null;
    const expectedResult = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers removes only subgroups listed', () => {
    const layers = [
      'A__52__layer1',
      'B__48__layer2',
    ];
    const prefixesToKeep = ['A', 'B', 52];
    const expectedResult = [
      'A__52__layer1',
      'B__layer2',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });

  it('groupLayersByUnit groups and ignores layers without units', () => {
    const layersThatHaveUnits = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
    ];
    const legendObject = {
      layer1: ['l1', 'layer1', 'lbs'],
      layer2: 'not an array',
      layer3: ['zero','one','units'],
    };
    const indexUnits = 2;
    const expectedResult = {
      layersGroupedByUnits: {
        lbs: ['layer1'],
      },
      layerUnitsArray: ['lbs'],
    };
    const result = groupLayersByUnit(layersThatHaveUnits, legendObject, indexUnits);
    expect(result).to.deep.equal(expectedResult);
  });
  it('groupLayersByUnit groups many layers and ignores layers without units', () => {
    const layersThatHaveUnits = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
      'layer7',
      'layer8',
      'layer0', // intentionally out of order
      'weirdUnit',
    ];
    const legendObject = {
      layer1: ['l1', 'layer1', 'lbs'],
      layer2: 'not an array',
      layer3: ['zero','one','units'],
      layer4: ['?','*', 'gals'],
      layer5: ['?','*', 'gals'], // ignored, doesn't exist
      layer6: ['?','*', 'deg'], // ignored as well
      layer7: ['?','*', 'pounds'],
      layer8: ['?','*', 'lbs'],
      layer0: ['?','*', 'lbs'],
      weirdUnit: ['?','*','apples'],
    };
    const indexUnits = 2;
    const expectedResult = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
    };
    const result = groupLayersByUnit(layersThatHaveUnits, legendObject, indexUnits);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcFirstLayerOnList, list is provided', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits:[
        'layer1',
        'layer2',
        'layer3',
        'layer4',
        'layer7',
        'layer8',
        'layer0', // intentionally out of order
        'weirdUnit',
      ],
    };
    const expectedResult = 'layer1';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it('calcFirstLayerOnList, no list, layerUnitsArray[0] value not found', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['not apples','gals','lbs','pounds'],
      layersThatHaveUnits:'not an array',
    };
    const expectedResult = '';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it('calcFirstLayerOnList, no list, layersGroupedByUnits not an object', () => {
    const state = {
      layersGroupedByUnits: 'not an object',
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits:'not an array',
    };
    const expectedResult = '';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it('calcFirstLayerOnList, no list, layersGroupedByUnits key is not an array', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: 'not an array',
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits:'not an array',
    };
    const expectedResult = '';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it('calcFirstLayerOnList, no list, layerUnitsArray is empty', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: [],
      layersThatHaveUnits:'not an array',
    };
    const expectedResult = '';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it('calcFirstLayerOnList, list is not provided', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits: 'not an array',
    };
    const expectedResult = 'weirdUnit';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });

  it('toggleLayerGroup removes all layers', () => {
    const state = {
      layersSelected: [
        'layer1',
        'layer2',
      ]
    };
    const groupOfLayers = ['layer1','layer2','layer3'];
    const expectedResult = [];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });
  it('toggleLayerGroup removes all layers in group', () => {
    const state = {
      layersSelected: [
        'layer1',
        'layer2',
        'layerA',
        'layerB',
      ]
    };
    const groupOfLayers = ['layer1','layer2','layer3'];
    const expectedResult = [
      'layerA',
      'layerB',
    ];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });
  it('toggleLayerGroup adds all layers in group', () => {
    const state = {
      layersSelected: [
        'layerA',
        'layerB',
      ]
    };
    const groupOfLayers = ['layer1','layer2','layer3'];
    const expectedResult = [
      'layerA',
      'layerB',
      'layer1',
      'layer2',
      'layer3',
    ];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });
  it('toggleLayerGroup adds full group if layersSelected is not an array', () => {
    const state = {
      layersSelected: 'not an array',
    };
    const groupOfLayers = ['layer1','layer2','layer3'];
    const expectedResult = [
      'layer1',
      'layer2',
      'layer3',
    ];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });
  it('toggleLayerGroup returns empty array as worst case', () => {
    const state = {
      layersSelected: 'not an array',
    };
    const groupOfLayers = 'neither an array';
    const expectedResult = [];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });
  it('toggleLayerGroup returns layers selected if group is not an array', () => {
    const state = {
      layersSelected: [
        'layerA',
        'layerB',
        'layer1',
        'layer2',
        'layer3',
      ],
    };
    const groupOfLayers = 'not an array';
    const expectedResult = [
      'layerA',
      'layerB',
      'layer1',
      'layer2',
      'layer3',
    ];
    const result = toggleLayerGroup(state, groupOfLayers);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createLayerSelectors again', () => {
    const input = {
      data: [
        {
          '52__B__layer2': 4,
          '53__B__layer2': 5,
          '52__A__layer1': 3,
        },
      ],
      units: {
        layer1: 'gals',
        layer2: 'lbs',
      },
      abbrevs: {
        layer1: 'GALS',
        layer2: 'POUNDS',
      },
      labels: {
        layer1: 'gallons of stuff',
        layer2: 'lbs is weight',
      },
    };
    const expectedResult = {
      layersThatHaveUnits: [
        '52__A__layer1',
        '52__B__layer2',
        '53__B__layer2',
      ],
      layersAllPrefixed: [
        '52__A__layer1',
        '52__B__layer2',
        '53__B__layer2',
      ],
      legendObject: {
        '52__A__layer1': ['52 A GALS','52 A gallons of stuff','gals'],
        '52__B__layer2': ['52 B POUNDS','52 B lbs is weight','lbs'],
        '53__B__layer2': ['53 B POUNDS','53 B lbs is weight','lbs'],
      }
    };
    const result = createLayerSelectors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createLayerSelectors convert 1', ()=>{
    const dataConvertFrom = 1;
    const data = [
      {
        unit1: 3,
        unit2: 5,
      }
    ];
    const units = {
      unit1: 'gals',
      unit2: 'lbs',
    };
    const labels = {
      unit1: 'gallons of stuff',
      unit2: 'lbs is weight',
    };
    const abbrevs = {
      unit1: 'GALS',
      unit2: 'POUNDS',
    };
    const input = {
      dataConvertFrom,
      data,
      units,
      labels,
      abbrevs,
    };
    const expectedResult = {
      layersThatHaveUnits: [
        'unit1',
        'unit2',
      ],
      layersAllPrefixed: [
        'unit1',
        'unit2',
      ],
      legendObject: {
        unit1: ['GALS'   ,'gallons of stuff', 'gals'],
        unit2: ['POUNDS' ,'lbs is weight'   , 'lbs' ],
      },
    };
    const result = createLayerSelectors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createLayerSelectors convert 2 without arrays', ()=>{
    const input = {
      data: [
        {
          test1__unit1: 3,
          test1__unit2: 5,
          test2__unit1: 33,
          test2__unit2: 55,
        }
      ], 
      units: {
        unit1: 'gals',
        unit2: 'lbs',
      },
      abbrevs: {
        unit1: 'GALS',
        unit2: 'POUNDS',
      },
      labels: {
        unit1: 'gallons of stuff',
        unit2: 'lbs is weight',
      },

    };
    const expectedResult = {
      layersThatHaveUnits: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
      legendObject: {
        test1__unit1: ['test1 GALS'  ,'test1 gallons of stuff', 'gals'],
        test2__unit1: ['test2 GALS'  ,'test2 gallons of stuff', 'gals'],
        test1__unit2: ['test1 POUNDS','test1 lbs is weight'   , 'lbs' ],
        test2__unit2: ['test2 POUNDS','test2 lbs is weight'   , 'lbs' ],
      },
      layersAllPrefixed: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
    };
    const result = createLayerSelectors(input);
    expect(result).to.deep.equal(expectedResult);
  });

});