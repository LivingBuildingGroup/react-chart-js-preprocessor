'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./palettes'),
    selectPalette = _require.selectPalette,
    createNamed = _require.createNamed;

var _require2 = require('conjunction-junction'),
    isObjectLiteral = _require2.isObjectLiteral,
    generateRandomNumber = _require2.generateRandomNumber;

var createStyle = exports.createStyle = function createStyle(input) {
  var defaultGeneral = {
    fill: true,
    opacityBackground: 0.1,
    // 0.05: faint on white, barely visible over gray, 
    // 0.1: faint over white and gray (good for all colors over white)
    // 0.2: prominent but translucent over white and gray (good for dark colors over gray)
    // 1 is solid, 0.2:, 
    opacityBackgroundHover: 0.4,
    opacityBorder: 1,
    opacityBorderHover: 1,
    opacityPoint: 1,
    opacityPointHover: 1,
    opacityPointBackgroundHover: 1,

    lineTension: 0.5, // over 0.5 seems bulbous, 0 is angular
    bezierCurve: true,
    bezierCurveTension: 0.5,

    borderCapStyle: 'butt',
    borderDash: [], // [10,10] => ok, [20,20] => long dash, long gap, [5,20] => short dash, long gap
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    borderWidth: 1, // This is the LINE. 1: general all-purpose, 3: very thick line
    pointBorderWidth: 1, // 1: general all-purpose, 3: big dots
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10
  };
  var general = {};
  for (var key in defaultGeneral) {
    if (_typeof(input[key]) === _typeof(defaultGeneral[key])) {
      general[key] = input[key];
    } else {
      general[key] = defaultGeneral[key];
    }
  }

  var color = input.color;
  if (!color) {
    var randomNumber = generateRandomNumber(1, 23);
    color = selectPalette(23)[randomNumber];
  }
  var colors = {
    backgroundColor: 'rgba(' + color + ',' + general.opacityBackground + ')',
    hoverBackgroundColor: 'rgba(' + color + ',' + general.opacityBackgroundHover + ')',
    borderColor: 'rgba(' + color + ',' + general.opacityBorder + ')',
    hoverBorderColor: 'rgba(' + color + ',' + general.opacityBorderHover + ')',
    pointBorderColor: 'rgba(' + color + ',' + general.opacityPoint + ')',
    pointHoverBorderColor: 'rgba(' + color + ',' + general.opacityPointHover + ')',
    pointHoverBackgroundColor: 'rgba(' + color + ',' + general.opacityPointBackgroundHover + ')'
  };
  // this allows user input to override the default of everything being only one color
  for (var _key in colors) {
    if (_typeof(input[_key]) === _typeof(colors[_key])) {
      colors[_key] = input[_key];
    }
  }
  // pointBackgroundColor is treated separately; it can be explicitly declared, but the default is white, not the same color as everything else
  colors.pointBackgroundColor = input.pointBackgroundColor ? 'rgba(' + input.pointBackgroundColor + ',1)' : '#fff';
  return Object.assign({}, general, colors);
};

var createStylesArray = exports.createStylesArray = function createStylesArray(layersSelected, styleKey, namedColors, fallbackArray) {
  if (!Array.isArray(layersSelected)) return [];
  var sk = styleKey;
  var nc = isObjectLiteral(namedColors) ? namedColors : createNamed('bright');
  var fa = fallbackArray ? fallbackArray : selectPalette(30);
  var skipper = fallbackArray ? 0 : 1; // skip 0 index of selectPalette because it is white
  var stylesArray =
  // no style key = just pick colors off the array
  !isObjectLiteral(sk) ? layersSelected.map(function (k, i) {
    var index = Math.min(i + skipper, fa.length - 1); // do not default to white; do not overshoot length due to skipper
    return createStyle({ color: fa[index] });
  }) :
  // there is a style key
  layersSelected.map(function (k, i) {
    var index = Math.min(i + skipper, fa.length - 1); // do not default to white; do not overshoot length due to skipper
    // layer is not in key = color from array
    var style = !sk[k] ? { color: fa[index] } :
    // layer has color and style
    sk[k].color && sk[k].style ? Object.assign({}, sk[k].style,
    // convert named color (string) to rgba as needed
    { color: nc[sk[k].color] ? nc[sk[k].color] : sk[k].color }) : sk[k].color ?
    // convert named color (string) to rgba as needed
    { color: nc[sk[k].color] ? nc[sk[k].color] : sk[k].color } : sk[k].style ? Object.assign({}, sk[k].style, { color: fa[index] }) : { color: fa[index] };
    return createStyle(style);
  });
  return stylesArray;
};

// export default {
//   createStyle,
//   createStylesArray,
// };