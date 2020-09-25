import { isObjectLiteral } from 'conjunction-junction';

export const formatControlsWithoutPreSets = (state, that) => {

  const controlNamesTop = [];
  const controlIconNamesTop = [];
  const controlFuncsTop = [];
  const controlLabelsTop= [];
  const controlNamesBot = [];
  const controlIconNamesBot = [];
  const controlFuncsBot = [];
  const controlLabelsBot= [];

  const controlsTop = [];
  const controlsBot = [];

  if(state.printAllow){
    controlsTop.push({
      name:     'print',
      id:       'print',
      iconName: 'Print',
      func:     that.printGraph,
      label:    'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).',
    });
    controlNamesTop.push('print');
    controlIconNamesTop.push('Print');
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if(state.backgroundAllow){
    controlsTop.push({
      name:     'background',
      id:       'background',
      iconName: 'PaletteSolid',
      func:     that.handleBackgroundColor,
      label:    'Toggle between white and dark gray graph background.',
    });
    controlNamesTop.push('background');
    controlIconNamesTop.push('PaletteSolid');
    controlFuncsTop.push(that.handleBackgroundColor);
    controlLabelsTop.push('Toggle white graph background');
  }
  if(state.yAxisAllow){
    controlsTop.push({
      name:     'y-Axis',
      id:       'y-Axis',
      iconName: 'ArrowsAltV',
      func:     that.handleYAxisSelector,
      label:    'Toggle Y-Axis settings',
    });
    controlNamesTop.push('y-Axis');
    controlIconNamesTop.push('ArrowsAltV');
    controlFuncsTop.push(that.handleYAxisSelector);
    controlLabelsTop.push('Toggle Y-Axis settings');
  }
  if(state.selectorsAllow){
    controlsBot.push({
      name:     'selector',
      id:       'selector',
      iconName: 'Edit',
      func:     that.toggleSelectorsPopover,
      label:    'Open graph customization options',
    });
    controlNamesBot.push('selector');
    controlIconNamesBot.push('Edit');
    controlFuncsBot.push(that.toggleSelectorsPopover);
    controlLabelsBot.push('Open graph customization options');
  }
  return {
    controlsTop,
    controlsBot,
    controlNamesTop,
    controlIconNamesTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconNamesBot,
    controlFuncsBot,
    controlLabelsBot,
  };
};

export const formatPreSetsForControls = (preSets, icons={}, that) => {
  const controlsPresets = [];
  if(!isObjectLiteral(preSets)) {
    return {controlsPresets};
    return { 
      preSetIds  : [],
      preSetNames: [],
      preSetIconNames: [],
      preSetFuncs: [],
    };
  }
  const preSetIds = [];
  for(let id in preSets){
    const thisPreset = preSets[id];
    controlsPresets.push({
      name:     thisPreset.name || 'pre-set',
      id:       'print',
      iconName: thisPreset.icon || 'CoffeePot',
      func:     ()=>that.handlePreSetSelect(id),
      label:    thisPreset.name || 'pre-set',
  
    })
    preSetIds.push(id);
  }
  preSetIds.sort();
  const preSetNames = preSetIds.map(id=>{
    return preSets[id].name || 'pre-set';
  });
  const preSetIconNames = preSetIds.map(id=>preSets[id].icon);
    
  const preSetFuncs = preSetIds.map(id=>{
    return ()=>that.handlePreSetSelect(id);
  });
  return {
    preSetIds,
    preSetNames,
    preSetIconNames,
    preSetFuncs,
    controlsPresets,
  };
};

export const formatControls = (state, that) => {
  const {
    controlsTop,
    controlsBot,
    controlNamesTop,
    controlIconNamesTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconNamesBot,
    controlFuncsBot,
    controlLabelsBot,
  } = formatControlsWithoutPreSets(state, that);
  
  const {
    controlsPresets,
    preSetIds,
    preSetNames,
    preSetIconNames,
    preSetFuncs,
  } = formatPreSetsForControls(state.preSets, state.icons, that);

  const controlNames = [
    ...controlNamesTop, 
    ...preSetNames,
    ...controlNamesBot, 
  ];
  const controlIds = [
    ...controlNamesTop, 
    ...preSetIds,
    ...controlNamesBot, 
  ];
  const controlIconNames = [
    ...controlIconNamesTop, 
    ...preSetIconNames,
    ...controlIconNamesBot, 
  ];
  const controlFuncs = [
    ...controlFuncsTop, 
    ...preSetFuncs,
    ...controlFuncsBot, 
  ];
  const controlLabels = [
    ...controlLabelsTop, 
    ...preSetNames,
    ...controlLabelsBot, 
  ];

  const controlsOld = controlNames.map((n,i)=>{
    return {
      name: n,
      id:       controlIds[i],
      iconName: controlIconNames[i],
      func:     controlFuncs[i],
      label:    controlLabels[i],
    };
  });

  const controls = [
    ...controlsTop,
    ...controlsPresets,
    ...controlsBot,
  ];

  console.log({
    controls,controlsOld
  })
  return {
    preSetIds,
    controlsOld,
    controls,
  };
};