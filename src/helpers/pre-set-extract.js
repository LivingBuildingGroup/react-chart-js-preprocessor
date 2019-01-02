const { isObjectLiteral,
} = require('conjunction-junction');
const { listBright,
  createPreSetGlobalPalettes } = require('./palettes');

export const formatSelectors = (thisPreSet, groupTrue, groupsRaw) => {
  const groups = Array.isArray(groupsRaw) ? groupsRaw : [] ;
  let selectors = [''];
  if(Array.isArray(thisPreSet.layersSelected)){
    if(thisPreSet.layersSelected.length > 0){
      if(thisPreSet.type === 'group'){
        if(groupTrue){
          selectors = [];
          thisPreSet.layersSelected.forEach(layer=>{
            groups.forEach(group=>{
              selectors.push(`${group}__${layer}`);
            });
          });
        } else {
          selectors = thisPreSet.layersSelected;
        }
      } else {
        selectors = thisPreSet.layersSelected;
      }
    }
  }
  const selectorsRemaining = 
    selectors.length <= 1 ? [] :
      selectors.slice(1,selectors.length);

  return { selectors, selectorsRemaining };
};

export const _validateFormatAllStylesInput = input => {
  if(!isObjectLiteral(input)){
    return 'input is not an object';
  }
  const {
    thisPreSet, 
    styles,
    groups, 
    groupsSub,
    layersAllPrefixed, } = input;
  if(!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  let noString;
  layersAllPrefixed.forEach((l, i)=>{
    if(typeof l !== 'string'){
      noString = `layersAllPrefixed item ${l} at index ${i} is not a string`;
    }
  });
  if(noString) return noString;
  if(!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if(!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if(!isObjectLiteral(thisPreSet)){
    return 'thisPreSet is not an object';
  }
  if(!isObjectLiteral(styles)){
    return 'styles is not an object';
  }
  return 'ok';
};

export const parseGroupsFromLayer = (layer, groups, groupsSub) => {
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

export const selectBestStyleMatch = (thisPreSet, styles, layer, unPrefix, g_, s_) => {
  const preSetStyle = isObjectLiteral(thisPreSet.styles) ? thisPreSet.styles : {} ;
  const s =
    isObjectLiteral(preSetStyle[layer]) ?
      Object.assign({},preSetStyle[layer]) : 
      isObjectLiteral(preSetStyle[unPrefix]) ?
        Object.assign({},preSetStyle[unPrefix]) : 
        isObjectLiteral(preSetStyle[`${g_}${s_}${layer}`]) ?
          Object.assign({},preSetStyle[`${g_}${s_}${layer}`]) : 
          isObjectLiteral(preSetStyle[`${g_}${layer}`]) ?
            Object.assign({},preSetStyle[`${g_}${layer}`]) : 
            isObjectLiteral(preSetStyle[`${s_}${layer}`]) ?
              Object.assign({},preSetStyle[`${s_}${layer}`]) : 
              isObjectLiteral(styles[layer]) ?
                Object.assign({},styles[layer]) : 
                isObjectLiteral(styles[unPrefix]) ?
                  Object.assign({},styles[unPrefix]) : 
                  {style:{}} ;
  // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {} ;
  return s;
};

export const selectBestColorMatch = (thisStyle, newGroupColors, preSetGlobalPalettes, shade, group) => {
  let color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  const ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {} ;
  const psgp = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {} ;
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

export const formatAllStyles = input => {
  const {
    layersAllPrefixed,
    groups, 
    groupsSub,
    styles,
    thisPreSet, 
    newGroupColors, 
    preSetGlobalPalettes } = input;

  const validated = _validateFormatAllStylesInput(input);
  if(validated !== 'ok') return { message: validated };

  const theseStyles = {};

  layersAllPrefixed.forEach(layer=>{
    // double underscore denotes prefix
    const unPrefixedArr = layer.split('__');
    // un-prefixed layer is LAST part after last double-underscore.  We can have multiple prefixes.
    // e.g. "layer" >> "layer" ; "A__layer" >> "layer" ; "53__A__layer" >> "layer"
    const unPrefix = unPrefixedArr[unPrefixedArr.length-1];
    
    const { g, g_, s, s_} = parseGroupsFromLayer(layer, groups, groupsSub);
    const thisStyle = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const shade = 
      !isObjectLiteral(thisStyle.style) ? 
        0 :
        thisStyle.style.shade > 0 ?
          thisStyle.style.shade : 
          0 ;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });

  return theseStyles;
};

export const prioritizeGroups = (groups, groupColors) => {
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

export const assignPreSetGroupColors = input => {
  const {
    groups, 
    groupColors, 
    preSetGlobalColorOptions,
    preSetGlobalPalettes, } = input;

  const defaultReturn = {
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!Array.isArray(groups)) return defaultReturn;
  
  const psgpFromUser = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {} ;
  const psgp = Object.assign({}, createPreSetGlobalPalettes(), psgpFromUser );
  const psgco = Array.isArray(preSetGlobalColorOptions) ? preSetGlobalColorOptions : listBright() ;

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

export const formatGroupsStyles = input => {
  const {
    groupTrue, 
    groups, 
    groupColors, 
    groupsSub,
    preSetGlobalColorOptions, 
    preSetGlobalPalettes, 
    layersAllPrefixed,
    styles,
    thisPreSet,  } = input;
  console.log('input to formatGroupsStyles', styles);
  console.log('isGrouped', isGrouped, 'thisPreset', thisPreSet);
  const isGrouped = groupTrue && Array.isArray(groups);

  const defaultObject = {
    stylesAppended:  styles || {},
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!isObjectLiteral(thisPreSet)){
    // i.e. no material to read from
    return defaultObject;
  } else if(!isObjectLiteral(thisPreSet.styles)){
    // i.e. no material to read from
    return defaultObject;
  } else if (!isGrouped && thisPreSet.useOnlyExplicitStylesWhenUngrouped) {
    // preSets may declare that when not grouped, ONLY explicit styles shall be used
    // this allows preSets to save specific styles for individual graphs
    // but when grouped, styles are overwritten by group styles
    // in either case, layers selected remain the same
    defaultObject.stylesAppended = Object.assign({},
      defaultObject.stylesAppended,
      thisPreSet.styles
    );
    return defaultObject;
  }
  const {newGroupColors, 
    groupDotColors} = assignPreSetGroupColors({
    groups, 
    groupColors, 
    preSetGlobalPalettes,
    preSetGlobalColorOptions,
  });

  const stylesAppended = formatAllStyles({
    groups, 
    groupsSub,
    newGroupColors, 
    preSetGlobalPalettes,
    layersAllPrefixed,
    styles,
    thisPreSet, 
  });

  return {
    newGroupColors,
    groupDotColors,
    stylesAppended,
  };
};

export const unpackPreSet = (state, thisPreSet, id) => {
  const { 
    groupTrue, 
    groups,
    groupColors, 
    groupsSub,
    preSetGlobalPalettes, 
    preSetGlobalColorOptions,
    layersAllPrefixed,
    styles,
  } = state;
  console.log('state in unpackPreSet', state);
  const {
    selectorsRemaining,
    selectors      } = formatSelectors(
    thisPreSet, 
    groupTrue, 
    groups
  );
  const {
    stylesAppended,
    newGroupColors,
    groupDotColors } = formatGroupsStyles({
    thisPreSet, 
    groupTrue, 
    groups, 
    groupsSub: Array.isArray(groupsSub) ? groupsSub : [''] ,
    groupColors, 
    preSetGlobalColorOptions, 
    preSetGlobalPalettes, 
    styles,
    layersAllPrefixed,
  });

  // this prefixes as determined by state, i.e. parent
  // this does not allow individual presets to decide what to prefix (see above)
  const prefixesToKeepGroups =
      !Array.isArray(state.groups) ? [] :
        !state.preSetSaveSettings ? [] :
          !state.preSetSaveSettings.prefixGroups ? [] :
            state.groups ;

  const prefixesToKeepGroupsSub =
      !Array.isArray(state.groupsSub) ? [] :
        !state.preSetSaveSettings ? [] :
          !state.preSetSaveSettings.prefixGroupsSub ? [] :
            state.groupsSub ;

  return {
    groupColors:    newGroupColors,
    groupDotColors,
    preSetIdActive: id,
    selector0:      selectors[0],
    layersSelected: selectorsRemaining,
    styles:         stylesAppended,
    prefixesToKeepGroups,
    prefixesToKeepGroupsSub,
  };
};

export const selectDefaultPreSet = (preSets, graphName) => {
  let preSetIdActive;
  for(let id in preSets){
    if(preSets[id].graph === graphName && preSets[id].def){
      preSetIdActive = id;
    }
  }
  if(preSetIdActive) return preSetIdActive;
  // worst case, no default and id list didn't load yet

  for(let id in preSets){
    if(preSets[id].graph === graphName){
      preSetIdActive = id;
    }
  }

  return preSetIdActive;
};

// export default {
//   formatSelectors,
//   _validateFormatAllStylesInput,
//   parseGroupsFromLayer,
//   selectBestStyleMatch,
//   selectBestColorMatch,
//   formatAllStyles,
//   assignPreSetGroupColors,
//   formatGroupsStyles,
//   unpackPreSet,
//   selectDefaultPreSet,
// };