const { isObjectLiteral} = require('conjunction-junction');
const { unPrefixLayers } = require('./layers');

export const correctPrefixOfLayersSelected = state => {
  // state.layersSelected is expected to have the maximum amount of prefix
  // i.e. we may strip off prefixes, but we won't add them
  const defaultReturn = {
    prefixesToKeep: null,
    layers: [],
  };
  if(!isObjectLiteral(state)) return defaultReturn;
  const {
    preSetSaveSettings, 
    prefixesToKeepGroups,
    prefixesToKeepGroupsSub,
    layersSelected, } = state;
  if(!Array.isArray(layersSelected))       return defaultReturn;
  defaultReturn.layers = layersSelected;
  if(!isObjectLiteral(preSetSaveSettings)) return defaultReturn;

  const prefixGroups    = preSetSaveSettings.prefixGroups;
  const prefixGroupsSub = preSetSaveSettings.prefixGroupsSub;

  const prefixesToKeep = 
    prefixGroups && prefixGroupsSub && 
    Array.isArray(prefixesToKeepGroups) && 
    Array.isArray(prefixesToKeepGroupsSub) ?
      [...prefixesToKeepGroups, ...prefixesToKeepGroupsSub] :
      prefixGroups ?
        prefixesToKeepGroups || null: // null here and below is fallback for consistency in testing, in the edge case that prefixesToKeepGroups = true, but groups is undefined
        prefixGroupsSub ?
          prefixesToKeepGroupsSub || null: 
          null ;
  return {
    prefixesToKeep,
    layers: unPrefixLayers(layersSelected, prefixesToKeep)
  };
};

export const _parseValue = (type, value) => {
  let v = value;
  if(type === 'number' || type === 'shade'){
    v = parseFloat(value, 10);
  // type array = borderDash
  } else if (type === 'array'){
    const arr = typeof value === 'string' ? value.split(',') : Array.isArray(value) ? value : [] ;
    v = arr.map(a=>parseInt(a,10));
  // type boolean = fill
  } else if (type === 'boolean'){
    v = value === 'true';
  }
  return v;
};

export const editOneStyle = input => {
  if(!isObjectLiteral(input)) return {};
  const { styles, 
    value, 
    layer, 
    property, 
    preSetGlobalPalette,
    cssStyleColorsNamed } = input;
  if(!isObjectLiteral(styles))   return {};
  if(!isObjectLiteral(property)) return styles;
  if(typeof layer !== 'string')  return styles;

  const { type, key } = property;
  const psgp = Array.isArray(preSetGlobalPalette) ? preSetGlobalPalette : [] ;

  const stylesNew = Object.assign({}, styles);
  const v = _parseValue(type, value);

  const defaultColor = '80, 80, 80';
  const defaultNamedColor = 'blue';

  const nc = isObjectLiteral(cssStyleColorsNamed) ? cssStyleColorsNamed : {} ;

  const nestedStyle = 
    !stylesNew[layer] ? 
      {} :
      isObjectLiteral(stylesNew[layer].style) ?
        Object.assign({}, stylesNew[layer].style ) :
        {} ;

  if(!stylesNew[layer]) {
    stylesNew[layer] = {};
  }

  const snl = stylesNew[layer];

  if(type === 'color'){
    nestedStyle.shade = 0;
    snl.style = nestedStyle;
    snl.color = v;
    snl.colorOld = snl.color ? snl.color : defaultColor;
  } else if(type === 'shade' && v === 0){
    nestedStyle.shade = 0;
    snl.style = nestedStyle;
    snl.color    = snl.colorOld  ? snl.colorOld : snl.color    ? snl.color    : defaultColor;
    snl.colorOld = nc[snl.color] ? snl.color    : snl.colorOld ? snl.colorOld : defaultNamedColor;
  } else if(type === 'shade'){
    nestedStyle.shade = v;
    snl.style = nestedStyle;
    snl.color = psgp[v-1] ? psgp[v-1] : defaultColor; // preSetGlobalPalette is 1-indexed for the user, so subtract 1, since it is actually 0-indexed
    snl.colorOld = nc[snl.colorOld] ? snl.colorOld : defaultNamedColor;
  } else {
    nestedStyle[key] = v;
    snl.style = nestedStyle;
  }
  return stylesNew;
};

export const applyPreSetGlobalColorToStyles = input => {
  // invoked by <GraphWrapper/>
  const { styles, 
    preSetGlobalPalette } = input;
  const s = Object.assign({}, styles);
  for(let layer in s){
    if(!isObjectLiteral(s[layer].style)){
      s[layer].style = {};
    }
    if(s[layer].style.shade > 0){
      const shade       = s[layer].style.shade - 1;
      const colorOld    = s[layer].color;
      const color       = preSetGlobalPalette[shade];
      s[layer].color    = color;
      s[layer].colorOld = colorOld;
    }
  }
  return s;
};

// export default {
//   applyPreSetGlobalColorToStyles,
//   correctPrefixOfLayersSelected,
//   editOneStyle,
// };