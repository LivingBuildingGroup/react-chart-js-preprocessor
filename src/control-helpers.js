import { isObjectLiteral } from 'conjunction-junction';

export const formatControlsTopAndBot = (state, that) => {

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
  }
  if(state.backgroundAllow){
    controlsTop.push({
      name:     'background',
      id:       'background',
      iconName: 'PaletteSolid',
      func:     that.handleBackgroundColor,
      label:    'Toggle between white and dark gray graph background.',
    });
  }
  if(state.yAxisAllow){
    controlsTop.push({
      name:     'y-Axis',
      id:       'y-Axis',
      iconName: 'ArrowsAltV',
      func:     that.handleYAxisSelector,
      label:    'Toggle Y-Axis settings',
    });
  }
  if(state.selectorsAllow){
    controlsBot.push({
      name:     'selector',
      id:       'selector',
      iconName: 'Edit',
      func:     that.toggleSelectorsPopover,
      label:    'Open graph customization options',
    });
  }
  return {
    controlsTop,
    controlsBot,
  };
};

export const formatControlsPresets = (preSets, that) => {
  const controlsPresets = [];
  if(!isObjectLiteral(preSets)) {
    return controlsPresets;
  }
  for(let id in preSets){
    const thisPreset = preSets[id];
    controlsPresets.push({
      name:     thisPreset.name || 'pre-set',
      id,
      iconName: thisPreset.icon || 'CoffeePot',
      func:     ()=>that.handlePreSetSelect(id),
      label:    thisPreset.name || 'pre-set',
    });
  }
  controlsPresets.sort((a,b)=>{
    if(a.id > b.id){
      return 1;
    }
    return -1;
  });

  return controlsPresets;
};

export const formatControls = (state, that) => {
  const {
    controlsTop,
    controlsBot,
  } = formatControlsTopAndBot(state, that);
  
  const controlsPresets = formatControlsPresets(state.preSets, that);

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