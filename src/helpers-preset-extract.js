'use strict';

const { 
  isObjectLiteral, } = require('conjunction-junction');
const { listBright,
  createPresetGlobalPalettes } = require('pretty-colors');

const createLayersSelectedFromPreset = (thisPreset, isGrouped, groupsRaw) => {
  const groups = Array.isArray(groupsRaw) ? groupsRaw : [] ;
  if(!thisPreset || !Array.isArray(thisPreset.layersSelected)){
    return [''];
  }

  if(thisPreset.type === 'group' &&
    isGrouped && 
    thisPreset.layersSelected.length > 0){
    const layersSelected = [];
    thisPreset.layersSelected.forEach(layer=>{
      groups.forEach(group=>{
        layersSelected.push(`${group}__${layer}`);
      });
    });
    return layersSelected;
  }
  
  return thisPreset.layersSelected;
};
  
const _validateFormatAllStylesInput = input => {
  if(!isObjectLiteral(input)){
    return 'input is not an object';
  }
  const {
    thisPreset, 
    groups, 
    groupsSub,
    layersAllPrefixed, } = input;
  const styles = thisPreset ? thisPreset.styles : {} ;
  if(!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  let noString;
  layersAllPrefixed.forEach((l, i)=>{
    if(typeof l !== 'string'){
      noString = `layersAllPrefixed item ${l} at index ${i} is not a string`;
    }
  });
  if(noString) {
    return noString;
  }
  if(!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if(!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if(!isObjectLiteral(thisPreset)){
    return 'thisPreset is not an object';
  }
  if(!isObjectLiteral(styles)){
    return 'styles is not an object';
  }
  return 'ok';
};
  
const parseGroupsFromLayer = (layer, groups, groupsSub) => {
  let group, groupSub;
  groups.forEach(g=>{
    if(layer.includes(`${g}__`)){
      group = g;
    }
  });
  groupsSub.forEach(s=>{
    if(layer.includes(`${s}__`)){
      groupSub = s;
    }
  });
  const g = group    ? `${group}`    : '' ;
  const g_ = g       ? `${g}__`      : '' ;
  const s = groupSub ? `${groupSub}` : '' ;
  const s_ = s       ? `${s}__`      : '' ;
  return { g, g_, s, s_ };
};
  
const selectBestStyleMatch = (thisPreset, layer, unPrefix, g_, s_) => {
  const presetStyle = isObjectLiteral(thisPreset.styles) ? thisPreset.styles : {} ;
  const s =
      isObjectLiteral(presetStyle[layer]) ?
        Object.assign({},presetStyle[layer]) : 
        isObjectLiteral(presetStyle[unPrefix]) ?
          Object.assign({},presetStyle[unPrefix]) : 
          isObjectLiteral(presetStyle[`${g_}${s_}${layer}`]) ?
            Object.assign({},presetStyle[`${g_}${s_}${layer}`]) : 
            isObjectLiteral(presetStyle[`${g_}${layer}`]) ?
              Object.assign({},presetStyle[`${g_}${layer}`]) : 
              isObjectLiteral(presetStyle[`${s_}${layer}`]) ?
                Object.assign({},presetStyle[`${s_}${layer}`]) : 
                {style:{}} ;
    // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {} ;
  return s;
};
  
const selectBestColorMatch = (thisStyle, newGroupColors, presetGlobalPalettes, shade, group) => {
  let color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  const ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {} ;
  const psgp = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {} ;
  // worst case, this is undefined, if undefined, we just skip the lookup
  const groupColor = ngc[group];
  if(groupColor){
    if(psgp[groupColor]){
      // shade is 1-indexed for the user
      // change shade to 0-index for JS
      if(shade >= 0 && psgp[groupColor][shade-1]){
        color = psgp[groupColor][shade-1];
      }
    }
  }
  color = color ? color : '80, 80, 80';
  return color;
};
  
const formatAllStyles = input => {
  const {
    layersAllPrefixed,
    groups, 
    groupsSub,
    thisPreset, 
    newGroupColors, 
    presetGlobalPalettes } = input;
  
  const validated = _validateFormatAllStylesInput(input);
  if(validated !== 'ok') {
    return { message: validated };
  }
  
  const theseStyles = {};
  
  layersAllPrefixed.forEach(layer=>{
    // double underscore denotes prefix
    const unPrefixedArr = layer.split('__');
    // un-prefixed layer is LAST part after last double-underscore.  We can have multiple prefixes.
    // e.g. "layer" >> "layer" ; "A__layer" >> "layer" ; "53__A__layer" >> "layer"
    const unPrefix = unPrefixedArr[unPrefixedArr.length-1];
      
    const { g, g_, s, s_} = parseGroupsFromLayer(layer, groups, groupsSub);
    const thisStyle = selectBestStyleMatch(thisPreset, layer, unPrefix, g_, s_);
    const shade = 
        !isObjectLiteral(thisStyle.style) ? 
          0 :
          thisStyle.style.shade > 0 ?
            thisStyle.style.shade : 
            0 ;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, presetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });
  
  return theseStyles;
};
  
const prioritizeGroups = (groups, groupColors) => {
  const gc = isObjectLiteral(groupColors) ? groupColors : {} ;
    
  // list priorities
  // in the event of conflicts, the first request in the ordered array 'groups' is given first priority
  // if group color not already used
  const gcPriority = {};
  groups.forEach(g=>{
    if(gc[g] && !gcPriority[gc[g]]){
      gcPriority[gc[g]] = g; 
    }
  });
  
  // sort groups according to priority
  const groups1 = [];
  const groups2 = [];
  groups.forEach(g=>{
    if(gcPriority[gc[g]] === g){
      groups1.push(g);
    } else {
      groups2.push(g);
    }
  });
    
  return {
    groupsPrioritized: [...groups1, ...groups2],
    gc,
    gcPriority,
  };
};
  
const assignPresetGroupColors = input => {
  const {
    groups, 
    groupColors, 
    presetGlobalColorOptions,
    presetGlobalPalettes, } = input;
  
  const defaultReturn = {
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!Array.isArray(groups)) return defaultReturn;
    
  const psgpFromUser = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {} ;
  const psgp = Object.assign({}, createPresetGlobalPalettes(), psgpFromUser );
  const psgco = Array.isArray(presetGlobalColorOptions) ? presetGlobalColorOptions : listBright() ;
  
  const defaultColor = '80, 80, 80';
  const colorsUsed     = {};
  const newGroupColors = {};
  const groupDotColors = {};
  
  const {gc, 
    gcPriority, 
    groupsPrioritized } = prioritizeGroups(groups, groupColors);
  
  const _useSpecifiedColor = _group => {
    // LOCAL MUTATING FUNCTION
    colorsUsed[gc[_group]] = true;
    newGroupColors[_group] = gc[_group];
    groupDotColors[_group] = 
        Array.isArray(psgp[newGroupColors[_group]]) ? 
          psgp[newGroupColors[_group]][0] : 
          defaultColor;
  };
  
  const _useDefaultColor = (_group, _color) => {
    // LOCAL MUTATING FUNCTION
    if(!colorsUsed[_color]){
      colorsUsed[_color]     = true;
      newGroupColors[_group] = _color;
      groupDotColors[_group] = 
          Array.isArray(psgp[newGroupColors[_group]]) ? 
            psgp[newGroupColors[_group]][0] : 
            defaultColor;
    }
  };
  
  // these run in priority order, so we don't need to check for priority during the loop
  groupsPrioritized.forEach(group=>{
    // if we did supply a group color
    if(gc[group]){
      // prioritized fill up colors used first
      if(!colorsUsed[gc[group]]){
        _useSpecifiedColor(group);
        // else if group color is already used (priority is used first)
      } else {
        psgco.forEach(color=>{
          if(!newGroupColors[group]){
            _useDefaultColor(group, color);
          }
        });
      }
      // we did not supply a group color
    } else {
      psgco.forEach(color=>{
        if(!newGroupColors[group]){
          _useDefaultColor(group, color);
        }
      });
    }
  });
  return {
    testKeys: {
      gcPriority,
      colorsUsed,
    },
    newGroupColors,
    groupDotColors,
  };
};
  
const formatGroupsStyles = input => {
  const {
    groups, 
    groupColors, 
    groupsSub,
    presetGlobalColorOptions, 
    presetGlobalPalettes, 
    layersAllPrefixed,
    thisPreset,
    isGrouped  } = input;
  
  const defaultObject = {
    styles: {},
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!isObjectLiteral(thisPreset)){
    // i.e. no material to read from
    return defaultObject;
  } else if(!isObjectLiteral(thisPreset.styles)){
    // i.e. no material to read from
    return defaultObject;
  }
  defaultObject.styles = thisPreset.styles;

  // below are ONLY if grouped
  if (isGrouped && Array.isArray(groups)) {
    const {
      newGroupColors, 
      groupDotColors } = assignPresetGroupColors({
      groups, 
      groupColors, 
      presetGlobalPalettes,
      presetGlobalColorOptions,
    });
  
    const styles = formatAllStyles({
      groups, 
      groupsSub,
      newGroupColors, 
      presetGlobalPalettes,
      layersAllPrefixed,
      thisPreset, 
    });
  
    return {
      newGroupColors,
      groupDotColors,
      styles,
    };
  }
  // if not grouped
  return defaultObject;

};
  
const unpackPreset = (gs, thisPreset, id) => {
  const { 
    isGrouped, 
    groups,
    groupColors, 
    groupsSub,
    presetGlobalPalettes, 
    presetGlobalColorOptions,
    layersAllPrefixed,
  } = gs;
  const layersSelected = createLayersSelectedFromPreset(
    thisPreset, 
    isGrouped, 
    groups
  );
  const {
    styles,
    newGroupColors,
    groupDotColors } = formatGroupsStyles({
    thisPreset, 
    isGrouped, 
    groups, 
    groupsSub: Array.isArray(groupsSub) ? groupsSub : [''] ,
    groupColors, 
    presetGlobalColorOptions, 
    presetGlobalPalettes, 
    layersAllPrefixed,
  });
  
  // this prefixes as determined by gs, i.e. parent
  // this does not allow individual presets to decide what to prefix (see above)
  const prefixesToKeepGroups =
    !Array.isArray(gs.groups) ? [] :
      gs.groups ;
  
  const prefixesToKeepGroupsSub =
    !Array.isArray(gs.groupsSub) ? [] :
      gs.groupsSub ;
  
  return {
    groupColors:    newGroupColors,
    groupDotColors,
    presetIdActive: id,
    layersSelected,
    styles,
    prefixesToKeepGroups,
    prefixesToKeepGroupsSub,
  };
};
  
const selectDefaultPreset = presets => {
  let presetIdActive;
  for(let id in presets){
    if(presets[id].def){
      presetIdActive = id;
    }
  }
  if(presetIdActive) {
    return presetIdActive;
  }
  // worst case, no default and id list didn't load yet
  
  for(let id in presets){
    presetIdActive = id;
  }
  
  return presetIdActive;
};

module.exports = {
  createLayersSelectedFromPreset,
  _validateFormatAllStylesInput,
  parseGroupsFromLayer,
  selectBestStyleMatch,
  selectBestColorMatch,
  formatAllStyles,
  assignPresetGroupColors,
  formatGroupsStyles,
  unpackPreset,
  selectDefaultPreset,
};