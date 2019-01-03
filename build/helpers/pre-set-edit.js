'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('./layers'),
    unPrefixLayers = _require2.unPrefixLayers;

var correctPrefixOfLayersSelected = exports.correctPrefixOfLayersSelected = function correctPrefixOfLayersSelected(state) {
  // state.layersSelected is expected to have the maximum amount of prefix
  // i.e. we may strip off prefixes, but we won't add them
  var defaultReturn = {
    prefixesToKeep: null,
    layers: []
  };
  if (!isObjectLiteral(state)) return defaultReturn;
  var preSetSaveSettings = state.preSetSaveSettings,
      prefixesToKeepGroups = state.prefixesToKeepGroups,
      prefixesToKeepGroupsSub = state.prefixesToKeepGroupsSub,
      layersSelected = state.layersSelected;

  if (!Array.isArray(layersSelected)) return defaultReturn;
  defaultReturn.layers = layersSelected;
  if (!isObjectLiteral(preSetSaveSettings)) return defaultReturn;

  var prefixGroups = preSetSaveSettings.prefixGroups;
  var prefixGroupsSub = preSetSaveSettings.prefixGroupsSub;

  var prefixesToKeep = prefixGroups && prefixGroupsSub && Array.isArray(prefixesToKeepGroups) && Array.isArray(prefixesToKeepGroupsSub) ? [].concat(_toConsumableArray(prefixesToKeepGroups), _toConsumableArray(prefixesToKeepGroupsSub)) : prefixGroups ? prefixesToKeepGroups || null : // null here and below is fallback for consistency in testing, in the edge case that prefixesToKeepGroups = true, but groups is undefined
  prefixGroupsSub ? prefixesToKeepGroupsSub || null : null;
  return {
    prefixesToKeep: prefixesToKeep,
    layers: unPrefixLayers(layersSelected, prefixesToKeep)
  };
};

var _parseValue = exports._parseValue = function _parseValue(type, value) {
  var v = value;
  if (type === 'number' || type === 'shade') {
    v = parseFloat(value, 10);
    // type array = borderDash
  } else if (type === 'array') {
    var arr = typeof value === 'string' ? value.split(',') : Array.isArray(value) ? value : [];
    v = arr.map(function (a) {
      return parseInt(a, 10);
    });
    // type boolean = fill
  } else if (type === 'boolean') {
    v = value === 'true';
  }
  return v;
};

var editOneStyle = exports.editOneStyle = function editOneStyle(input) {
  if (!isObjectLiteral(input)) return {};
  var styles = input.styles,
      value = input.value,
      layer = input.layer,
      property = input.property,
      preSetGlobalPalette = input.preSetGlobalPalette,
      cssStyleColorsNamed = input.cssStyleColorsNamed;

  if (!isObjectLiteral(styles)) return {};
  if (!isObjectLiteral(property)) return styles;
  if (typeof layer !== 'string') return styles;

  var type = property.type,
      key = property.key;

  var psgp = Array.isArray(preSetGlobalPalette) ? preSetGlobalPalette : [];

  var stylesNew = Object.assign({}, styles);
  var v = _parseValue(type, value);

  var defaultColor = '80, 80, 80';
  var defaultNamedColor = 'blue';

  var nc = isObjectLiteral(cssStyleColorsNamed) ? cssStyleColorsNamed : {};

  var nestedStyle = !stylesNew[layer] ? {} : isObjectLiteral(stylesNew[layer].style) ? Object.assign({}, stylesNew[layer].style) : {};

  if (!stylesNew[layer]) {
    stylesNew[layer] = {};
  }

  var snl = stylesNew[layer];

  if (type === 'color') {
    nestedStyle.shade = 0;
    snl.style = nestedStyle;
    snl.color = v;
    snl.colorOld = snl.color ? snl.color : defaultColor;
  } else if (type === 'shade' && v === 0) {
    nestedStyle.shade = 0;
    snl.style = nestedStyle;
    snl.color = snl.colorOld ? snl.colorOld : snl.color ? snl.color : defaultColor;
    snl.colorOld = nc[snl.color] ? snl.color : snl.colorOld ? snl.colorOld : defaultNamedColor;
  } else if (type === 'shade') {
    nestedStyle.shade = v;
    snl.style = nestedStyle;
    snl.color = psgp[v - 1] ? psgp[v - 1] : defaultColor; // preSetGlobalPalette is 1-indexed for the user, so subtract 1, since it is actually 0-indexed
    snl.colorOld = nc[snl.colorOld] ? snl.colorOld : defaultNamedColor;
  } else {
    nestedStyle[key] = v;
    snl.style = nestedStyle;
  }
  return stylesNew;
};

var applyPreSetGlobalColorToStyles = exports.applyPreSetGlobalColorToStyles = function applyPreSetGlobalColorToStyles(input) {
  // invoked by <GraphWrapper/>
  var styles = input.styles,
      preSetGlobalPalette = input.preSetGlobalPalette;

  var s = Object.assign({}, styles);
  for (var layer in s) {
    if (!isObjectLiteral(s[layer].style)) {
      s[layer].style = {};
    }
    if (s[layer].style.shade > 0) {
      var shade = s[layer].style.shade - 1;
      var colorOld = s[layer].color;
      var color = preSetGlobalPalette[shade];
      s[layer].color = color;
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