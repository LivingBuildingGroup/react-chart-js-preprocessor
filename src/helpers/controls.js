const { isObjectLiteral } = require('conjunction-junction');

export const formatControlsWithoutPreSets = (state, that) => {
  const icons = state.icons;
  
  const controlNamesTop = [];
  const controlIconsTop = [];
  const controlFuncsTop = [];
  const controlLabelsTop= [];
  const controlNamesBot = [];
  const controlIconsBot = [];
  const controlFuncsBot = [];
  const controlLabelsBot= [];
  if(state.closeAllow && typeof state.handleCloseGraph === 'function'){
    controlNamesTop.push('close');
    controlIconsTop.push(icons.times);
    controlFuncsTop.push(state.handleCloseGraph);
    controlLabelsTop.push('Close the graph');
  }
  if(state.printAllow){
    controlNamesTop.push('print');
    controlIconsTop.push(icons.print);
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if(state.backgroundAllow){
    controlNamesTop.push('background');
    controlIconsTop.push(icons.palette_solid);
    controlFuncsTop.push(that.handleBackgroundChange);
    controlLabelsTop.push('Toggle white graph background');
  }
  if(state.yAxisAllow){
    controlNamesTop.push('y-Axis');
    controlIconsTop.push(icons.arrows_alt_v);
    controlFuncsTop.push(that.handleYAxisSelector);
    controlLabelsTop.push('Toggle Y-Axis settings');
  }
  if(state.selectorsAllow){
    controlNamesBot.push('selector');
    controlIconsBot.push(icons.edit);
    controlFuncsBot.push(that.toggleSelectorsPopover);
    controlLabelsBot.push('Open graph customization options');
  }
  return {
    controlNamesTop,
    controlIconsTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconsBot,
    controlFuncsBot,
    controlLabelsBot,
  };
};

export const formatPreSetsForControls = (preSets, icons, that) => {
  if(!isObjectLiteral(preSets)) {
    return { 
      preSetIds  : [],
      preSetNames: [],
      preSetIcons: [],
      preSetFuncs: [],
    };
  }
  const preSetIds = [];
  for(let id in preSets){
    preSetIds.push(id);
  }
  preSetIds.sort();
  const preSetNames = preSetIds.map(id=>{
    return preSets[id].name;
  });
  const preSetIcons = preSetIds.map(id=>{
    return icons[preSets[id].icon];
  });
  const preSetFuncs = preSetIds.map(id=>{
    return ()=>that.handlePreSetSelect(id);
  });
  return {
    preSetIds,
    preSetNames,
    preSetIcons,
    preSetFuncs,
  };
};

export const formatControls = (state, that) => {
  const {
    controlNamesTop,
    controlIconsTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconsBot,
    controlFuncsBot,
    controlLabelsBot,
  } = formatControlsWithoutPreSets(state, that);
  
  const {
    preSetIds,
    preSetNames,
    preSetIcons,
    preSetFuncs,
  } = formatPreSetsForControls(state.preSets, state.icons, that);

  const controlNames = [
    ...controlNamesTop, 
    ...preSetNames,
    ...controlNamesBot, 
  ];
  const controlIcons = [
    ...controlIconsTop, 
    ...preSetIcons,
    ...controlIconsBot, 
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
  return {
    preSetIds,
    controlNames,
    controlIcons,
    controlFuncs,
    controlLabels,
  };
};

// export default {
//   formatControlsWithoutPreSets,
//   formatPreSetsForControls,
//   formatControls,
// };