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
  if(state.printAllow){
    controlNamesTop.push('print');
    controlIconNamesTop.push('Print');
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if(state.backgroundAllow){
    controlNamesTop.push('background');
    controlIconNamesTop.push('PaletteSolid');
    controlFuncsTop.push(that.handleBackgroundChange);
    controlLabelsTop.push('Toggle white graph background');
  }
  if(state.yAxisAllow){
    controlNamesTop.push('y-Axis');
    controlIconNamesTop.push('ArrowsAltV');
    controlFuncsTop.push(that.handleYAxisSelector);
    controlLabelsTop.push('Toggle Y-Axis settings');
  }
  if(state.selectorsAllow){
    controlNamesBot.push('selector');
    controlIconNamesBot.push('Edit');
    controlFuncsBot.push(that.toggleSelectorsPopover);
    controlLabelsBot.push('Open graph customization options');
  }
  return {
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
  if(!isObjectLiteral(preSets)) {
    return { 
      preSetIds  : [],
      preSetNames: [],
      preSetIconNames: [],
      preSetFuncs: [],
    };
  }
  const preSetIds = [];
  for(let id in preSets){
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
  };
};

export const formatControls = (state, that) => {
  const {
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

  const controls = controlNames.map((n,i)=>{
    return {
      name: n,
      id:    controlIds[i],
      iconName:  controlIconNames[i],
      func:  controlFuncs[i],
      label: controlLabels[i],
    };
  })
  return {
    preSetIds,
    controls,
  };
};