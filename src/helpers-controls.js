import { isObjectLiteral } from 'conjunction-junction';

export const formatControlsTopAndBot = (state, functionHash) => {

  const controlsTop = [];
  const controlsBot = [];

  if(state.printAllow){
    controlsTop.push({
      name:     'print',
      id:       'print',
      iconName: 'Print',
      func:     functionHash.printGraph,
      label:    'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).',
    });
  }
  if(state.backgroundAllow){
    controlsTop.push({
      name:     'background',
      id:       'background',
      iconName: 'PaletteSolid',
      func:     functionHash.handleBackgroundColor,
      label:    'Toggle between white and dark gray graph background.',
    });
  }
  if(state.yAxisAllow){
    controlsTop.push({
      name:     'y-Axis',
      id:       'y-Axis',
      iconName: 'ArrowsAltV',
      func:     functionHash.handleYAxisSelector,
      label:    'Toggle Y-Axis settings',
    });
  }
  if(state.selectorsAllow){
    controlsBot.push({
      name:     'selector',
      id:       'selector',
      iconName: 'Edit',
      func:     functionHash.toggleSelectorsPopover,
      label:    'Open graph customization options',
    });
  }
  return {
    controlsTop,
    controlsBot,
  };
};

export const formatControls = (state, functionHash) => {
  const {
    controlsTop,
    controlsBot,
  } = formatControlsTopAndBot(state, functionHash);
  
  const presets = state.presets || {};

  const controlsPresets = [];
  for(let id in presets){
    const thisPreset = presets[id];
    controlsPresets.push({
      name:     thisPreset.name || 'pre-set',
      id,
      iconName: thisPreset.iconName || 'CoffeePot',
      func:     ()=>functionHash.handlePresetSelect(id),
      label:    thisPreset.namePreset || 'pre-set',
    });
  }
  controlsPresets.sort((a,b)=>{
    if(a.id > b.id){
      return 1;
    }
    return -1;
  });

  const controls = [
    ...controlsTop,
    ...controlsPresets,
    ...controlsBot,
  ];

  return controls;
};