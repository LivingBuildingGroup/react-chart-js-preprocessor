'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var formatPreSetSelectorColumns = exports.formatPreSetSelectorColumns = function formatPreSetSelectorColumns(cssStyleColorsNamed) {
  // this is only the names of the colors to use for selectors
  var cssStyleColorsNamedArray = [];
  for (var key in cssStyleColorsNamed) {
    cssStyleColorsNamedArray.push(key);
  }
  cssStyleColorsNamedArray.sort();
  var preSetColumns = [{
    key: 'color',
    label: 'color',
    type: 'color',
    optionLabels: cssStyleColorsNamedArray,
    optionValues: cssStyleColorsNamedArray,
    defaultValue: 'red'
  }, {
    key: 'fill',
    label: 'fill',
    type: 'boolean',
    optionLabels: ['true', 'false'],
    optionValues: ['true', 'false'],
    defaultValue: 'true'
  }, {
    key: 'opacityBackground',
    label: 'fill opacity',
    type: 'number',
    step: 0.1,
    min: 0,
    max: 1,
    defaultValue: 0.1
  }, {
    key: 'opacityBorder',
    label: 'line opacity',
    type: 'number',
    step: 0.1,
    min: 0,
    max: 1,
    defaultValue: 1
  }, {
    key: 'borderWidth',
    label: 'line weight',
    type: 'number',
    step: 0.1,
    min: 1,
    max: 10,
    defaultValue: 1
  }, {
    key: 'borderDash',
    label: 'line type',
    type: 'array',
    optionLabels: ['solid', 'medium dashes', 'long dashes and gaps', 'medium dashes, short gaps', 'short dashes, long gaps', 'long dashes, short gaps'],
    optionValues: ['', '10,10', '20,20', '10,5', '5,20', '20, 5'],
    defaultValue: ''
  }, {
    key: 'pointBorderWidth',
    label: 'point size',
    type: 'number',
    step: 0.1,
    min: 1,
    max: 10,
    defaultValue: 1
  }, {
    key: 'opacityPoint',
    label: 'point opacity',
    type: 'number',
    step: 0.1,
    min: 0,
    max: 1,
    defaultValue: 1
  }];
  return {
    preSetColumns: preSetColumns,
    cssStyleColorsNamedArray: cssStyleColorsNamedArray
  };
};

var parseSelectorValue = exports.parseSelectorValue = function parseSelectorValue(thisLayer, c, preSetGroupEditMode) {
  var value = !thisLayer ? c.defaultValue : c.type === 'color' && preSetGroupEditMode && thisLayer.shade > 0 && thisLayer.colorOld ? thisLayer.colorOld : c.type === 'color' ? thisLayer.color : !thisLayer.style ? c.defaultValue : typeof thisLayer.style[c.key] === 'boolean' && thisLayer.style[c.key] ? 'true' : typeof thisLayer.style[c.key] === 'boolean' ? 'false' : !thisLayer.style[c.key] ? c.defaultValue : thisLayer.style[c.key];
  return Array.isArray(value) ? value.join(',') : value;
};

// export default {
//   formatPreSetSelectorColumns,
//   parseSelectorValue
// };