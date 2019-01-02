'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatControlsWithoutPreSets,
  formatPreSetsForControls,
  formatControls, } = require('../compile/helpers/controls');

describe('controls', ()=> { 

  it('formatControlsWithoutPreSets all included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      yAxisAllow:      true,
      selectorsAllow:  true,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      controlNamesTop:  ['close'               ,'print'             ,'background'                   ,'y-Axis'                   ],
      controlIconsTop:  [state.icons.times     ,state.icons.print   ,state.icons.palette_solid      ,state.icons.edit           ],
      controlFuncsTop:  [state.handleCloseGraph,that.printGraph     ,that.handleBackgroundChange    ,that.handleYAxisSelector   ],
      controlLabelsTop: ['Close the graph'     ,printText           ,'Toggle white graph background','Toggle Y-Axis settings'   ],
      controlNamesBot:  ['selector'                        ],
      controlIconsBot:  [state.icons.edit                  ],
      controlFuncsBot:  [that.toggleSelectorsPopover       ],
      controlLabelsBot: ['Open graph customization options'],
    };
    const result = formatControlsWithoutPreSets(state, that);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatControlsWithoutPreSets none included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      selectorsAllow:  false,
      yAxisAllow:      false,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
    };
    const expectedResult = {
      controlNamesTop:  [],
      controlIconsTop:  [],
      controlFuncsTop:  [],
      controlLabelsTop: [],
      controlNamesBot:  [],
      controlIconsBot:  [],
      controlFuncsBot:  [],
      controlLabelsBot: [],
    };
    const result = formatControlsWithoutPreSets(state, that);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetsForControls', () => {
    const preSets = {
      '1': {
        name: 'name1',
        icon: ()=>{ return 7; }
      },
      '2': {
        name: 'name2',
        icon: ()=>{ return 8; }
      }
    };
    const that = {
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds  : ['1','2'],
      preSetNames: ['name1','name2'],
      preSetIcons: [preSets['1'].icon,preSets['2'].icon],
      preSetFuncs: [()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2')],
    };
    const result = formatPreSetsForControls(preSets, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.preSetNames).to.deep.equal(expectedResult.preSetNames);
    expect(result.preSetIcons).to.deep.equal(expectedResult.preSetIcons);
    expect(result.preSetFuncs.length).to.equal(2);
    expect(typeof result.preSetFuncs[0]).to.equal('function');
    expect(typeof result.preSetFuncs[1]).to.equal('function');
  });

  it('formatControls all included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      yAxisAllow:      true,
      selectorsAllow:  true,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
      preSets: {
        '1': {
          name: 'name1',
          icon: ()=>{ return 7; }
        },
        '2': {
          name: 'name2',
          icon: ()=>{ return 8; }
        }
      },
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
      handlePreSetChoice: ()=>{},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      preSetIds:        ['1','2'],
      controlNames:  ['close'               ,'print'             ,'background'                   ,'y-Axis'                   ,'name1'                         ,'name2'                         ,'selector'                        ],
      controlIcons:  [state.icons.times     ,state.icons.print   ,state.icons.palette_solid      ,state.icons.edit           ,state.preSets['1'].icon         ,state.preSets['2'].icon         ,state.icons.edit                  ],
      controlFuncs:  [state.handleCloseGraph,that.printGraph     ,that.handleBackgroundChange    ,that.handleYAxisSelector   ,()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2'),that.toggleSelectorsPopover       ],
      controlLabels: ['Close the graph'     ,printText           ,'Toggle white graph background','Toggle Y-Axis settings'   ,'name1'                         ,'name2'                         ,'Open graph customization options'],
    };
    const result = formatControls(state, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.controlNames).to.deep.equal(expectedResult.controlNames);
    expect(result.controlIcons).to.deep.equal(expectedResult.controlIcons);
    expect(result.controlFuncs.length).to.equal(expectedResult.controlFuncs.length);
    expect(typeof result.controlFuncs[0]).to.equal('function');
    expect(typeof result.controlFuncs[1]).to.equal('function');
    expect(typeof result.controlFuncs[2]).to.equal('function');
    expect(typeof result.controlFuncs[3]).to.equal('function');
    expect(typeof result.controlFuncs[4]).to.equal('function');
    expect(typeof result.controlFuncs[5]).to.equal('function');
    expect(typeof result.controlFuncs[6]).to.equal('function');
  });
  it('formatControls no controls included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      yAxisAllow:      false,
      selectorsAllow:  false,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
      preSets: {
        '1': {
          name: 'name1',
          icon: 'icon1'
        },
        '2': {
          name: 'name2',
          icon: 'icon2'
        }
      },
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds:     ['1','2'],
      controlNames:  ['name1'                         ,'name2'                         ],
      controlIcons:  [state.preSets['1'].icon         ,state.preSets['2'].icon         ],
      controlFuncs:  [()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2')],
      controlLabels: ['name1'                         ,'name2'                         ],
    };
    const result = formatControls(state, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.controlNames).to.deep.equal(expectedResult.controlNames);
    expect(result.controlIcons).to.deep.equal(expectedResult.controlIcons);
    expect(result.controlFuncs.length).to.equal(2);
    expect(typeof result.controlFuncs[0]).to.equal('function');
    expect(typeof result.controlFuncs[1]).to.equal('function');
  });
  it('formatControls no preSets included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      yAxisAllow:      true,
      selectorsAllow:  true,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
      preSets: {},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
      handlePreSetChoice: ()=>{},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      preSetIds:     [],
      controlNames:  ['close'               ,'print'             ,'background'                   ,'selector'],
      controlIcons:  [state.icons.times     ,state.icons.print   ,state.icons.palette_solid      ,state.icons.edit           ],
      controlFuncs:  [state.handleCloseGraph,that.printGraph     ,that.handleBackgroundChange    ,that.toggleSelectorsPopover],
      controlLabels: ['Close the graph'     ,printText           ,'Toggle white graph background','Open graph customization options'],
    };
    const result = formatControls(state, that);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatControls no controls, no preSets included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      yAxisAllow:      false,
      selectorsAllow:  false,
      icons: {
        times: ()=>{ return 'times'; },
        print: ()=>{ return 'print'; },
        palette_solid: ()=>{ return 'palette_solid'; },
        arrows_alt_v: ()=>{ return 'arrows_alt_v'; },
        edit: ()=>{ return 'edit'; },
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      handleYAxisSelector: () => {return 4;},
      toggleSelectorsPopover: () => {return 5;},
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds:     [],
      controlNames:  [],
      controlIcons:  [],
      controlFuncs:  [],
      controlLabels: [],
    };
    const result = formatControls(state, that);
    expect(result).to.deep.equal(expectedResult);
  });

});