const { isObjectLiteral } = require('conjunction-junction');

const Dummy = () => {
  return null;
};
const iconStyle = {height: 20, width: 20};

export const formatControlsWithoutPreSets = (state, that) => {
  const icons = state.icons || {};
  const Print        = typeof icons.Print        === 'function' ? icons.Print        : Dummy ;
  const PaletteSolid = typeof icons.PaletteSolid === 'function' ? icons.PaletteSolid : Dummy ;
  const ArrowsAltV   = typeof icons.ArrowsAltV   === 'function' ? icons.ArrowsAltV   : Dummy ;
  const Edit         = typeof icons.Edit         === 'function' ? icons.Edit         : Dummy ;
  
  const controlNamesTop = [];
  const controlIconsTop = [];
  const controlFuncsTop = [];
  const controlLabelsTop= [];
  const controlNamesBot = [];
  const controlIconsBot = [];
  const controlFuncsBot = [];
  const controlLabelsBot= [];
  if(state.printAllow){
    controlNamesTop.push('print');
    controlIconsTop.push(<Print style={iconStyle}/>);
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if(state.backgroundAllow){
    controlNamesTop.push('background');
    controlIconsTop.push(<PaletteSolid style={iconStyle}/>);
    controlFuncsTop.push(that.handleBackgroundChange);
    controlLabelsTop.push('Toggle white graph background');
  }
  if(state.yAxisAllow){
    controlNamesTop.push('y-Axis');
    controlIconsTop.push(<ArrowsAltV style={iconStyle}/>);
    controlFuncsTop.push(that.handleYAxisSelector);
    controlLabelsTop.push('Toggle Y-Axis settings');
  }
  if(state.selectorsAllow){
    controlNamesBot.push('selector');
    controlIconsBot.push(<Edit style={iconStyle}/>);
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

export const formatPreSetsForControls = (preSets, icons={}, that) => {
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
    return preSets[id].name || 'pre-set';
  });
  const preSetIcons = preSetIds.map(id=>{
    const Icon = typeof icons[preSets[id].icon] === 'function' ?
      icons[preSets[id].icon] : Dummy;
    return <Icon style={iconStyle}/>
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