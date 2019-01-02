'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    precisionRound = _require.precisionRound;

var calcScreenType = exports.calcScreenType = function calcScreenType(w, h) {
  var phoneP_minW = 0;
  var phoneP_maxW = 500;
  var phoneP_minH = 0;
  var phoneP_maxH = 850;
  var phoneL_minW = 400;
  var phoneL_maxW = 850;
  var phoneL_minH = 300;
  var phoneL_maxH = 850;
  var tabletP_minW = 450;
  var tabletP_maxW = 1100;
  var tabletP_minH = 800;
  var tabletP_maxH = 1100;
  var tabletL_minW = 800;
  var tabletL_maxW = 1100;
  var tabletL_minH = 650;
  var tabletL_maxH = 1100;
  var desktopL_minW = 1100;
  var desktopL_minH = 800;
  var heightRanges = [];
  var widthRanges = [];

  if (h >= phoneP_minH && h <= phoneP_maxH && h >= w) heightRanges.push('phoneP');
  if (h >= phoneL_minH && h <= phoneL_maxH && w >= h) heightRanges.push('phoneL');
  if (h >= tabletL_minH && h <= tabletL_maxH && w >= h) heightRanges.push('tabletL');
  if (h >= tabletP_minH && h <= tabletP_maxH && h >= w) heightRanges.push('tabletP');
  if (h >= desktopL_minH && w >= h) heightRanges.push('desktop');

  if (w >= phoneP_minW && w <= phoneP_maxW && h >= w) widthRanges.push('phoneP');
  if (w >= phoneL_minW && w <= phoneL_maxW && w >= h) widthRanges.push('phoneL');
  if (w >= tabletL_minW && w <= tabletL_maxW && w >= h) widthRanges.push('tabletL');
  if (w >= tabletP_minW && w <= tabletP_maxW && h >= w) widthRanges.push('tabletP');
  if (w >= desktopL_minW && w >= h) widthRanges.push('desktop');

  // types are in descending order of optimization. I.e. desktop is most optimized, so use it if we can.
  var types = ['phoneP', 'phoneL', 'tabletP', 'tabletL', 'desktop'];
  var type = 'phoneP'; // default
  types.forEach(function (t) {
    if (heightRanges.includes(t) && widthRanges.includes(t)) {
      type = t;
    }
  });
  return {
    type: type,
    testKeys: {
      heightRanges: heightRanges,
      widthRanges: widthRanges
    }
  };
};

var calcMinimumWindowDimensions = exports.calcMinimumWindowDimensions = function calcMinimumWindowDimensions(win) {
  var availWidth = !win.screen ? win.innerWidth : !win.screen.availWidth ? win.innerWidth : win.screen.availWidth;
  var availHeight = !win.screen ? win.innerHeight : !isPrimitiveNumber(win.screen.availHeight) ? win.innerHeight : win.screen.availHeight;

  var widthLowestCommon = !isPrimitiveNumber(win.innerWidth) ? availWidth : Math.min(win.innerWidth, availWidth);
  var heightLowestCommon = !isPrimitiveNumber(win.innerHeight) ? availHeight : Math.min(win.innerHeight, availHeight);

  return {
    cssWidthOuter: widthLowestCommon,
    cssHeightOuter: heightLowestCommon
  };
};

var calcProportionalDimensions = exports.calcProportionalDimensions = function calcProportionalDimensions(input) {
  var defaultReturn = {
    w: 100,
    h: 100
  };
  if (!isObjectLiteral(input)) return defaultReturn;
  var width = input.width,
      height = input.height,
      cssWidthOuter = input.cssWidthOuter,
      cssHeightOuter = input.cssHeightOuter;


  var widthOuter = isPrimitiveNumber(cssWidthOuter) ? cssWidthOuter : 100;
  var heightOuter = isPrimitiveNumber(cssHeightOuter) ? cssHeightOuter : 100;

  var w = isObjectLiteral(width) ? width : {};
  w.bigEnoughScreen = isPrimitiveNumber(w.bigEnoughScreen) ? w.bigEnoughScreen : 1000;
  w.percentOfScreen = isPrimitiveNumber(w.percentOfScreen) ? w.percentOfScreen : 1;
  w.maxPctOfBigEnough = isPrimitiveNumber(w.maxPctOfBigEnough) ? w.maxPctOfBigEnough : 1;
  var h = isObjectLiteral(height) ? height : {};
  h.bigEnoughScreen = isPrimitiveNumber(h.bigEnoughScreen) ? h.bigEnoughScreen : 1000;
  h.percentOfScreen = isPrimitiveNumber(h.percentOfScreen) ? h.percentOfScreen : 1;
  h.maxPctOfBigEnough = isPrimitiveNumber(h.maxPctOfBigEnough) ? h.maxPctOfBigEnough : 1;

  var widthRatioDelta = w.maxPctOfBigEnough - w.percentOfScreen;
  var widthBelowMin = w.bigEnoughScreen - widthOuter;

  var heightRatioDelta = h.maxPctOfBigEnough - h.percentOfScreen;
  var heightBelowMin = h.bigEnoughScreen - heightOuter;

  var w_ = widthOuter >= w.bigEnoughScreen ? w.percentOfScreen * widthOuter : widthOuter + widthBelowMin * widthRatioDelta;
  var h_ = heightOuter >= h.bigEnoughScreen ? h.percentOfScreen * heightOuter : heightOuter + heightBelowMin * heightRatioDelta;
  var final = {
    testKeys: {
      widthRatioDelta: widthRatioDelta,
      widthBelowMin: widthBelowMin,
      heightRatioDelta: heightRatioDelta,
      heightBelowMin: heightBelowMin
    },
    w: precisionRound(w_, 2),
    h: precisionRound(h_, 2)
  };
  for (var key in final.testKeys) {
    final.testKeys[key] = precisionRound(final.testKeys[key], 2);
  }
  return final;
};

var calcDimensions = exports.calcDimensions = function calcDimensions(state) {
  var cssWidthOuter = state.cssWidthOuter,
      cssHeightOuter = state.cssHeightOuter,
      cssWidthControls = state.cssWidthControls,
      cssHeightFooter = state.cssHeightFooter,
      cssHeightSelectors = state.cssHeightSelectors;


  var cssDivOuter = {
    width: cssWidthOuter,
    height: cssHeightOuter
  };
  var cssDivGraph = {
    width: cssWidthOuter - cssWidthControls,
    height: cssHeightOuter - cssHeightFooter
  };
  var cssDivControls = {
    width: cssWidthControls,
    height: cssHeightOuter - cssHeightFooter
  };
  var cssDivFooter = {
    width: cssWidthOuter,
    height: cssHeightFooter
  };
  var cssDivSelectors = {
    width: cssWidthOuter,
    height: cssHeightSelectors
  };
  var cssCanvasWidth = cssDivGraph.width;
  var cssCanvasHeight = cssDivGraph.height;

  return {
    cssDivOuter: cssDivOuter,
    cssDivGraph: cssDivGraph,
    cssDivControls: cssDivControls,
    cssDivFooter: cssDivFooter,
    cssDivSelectors: cssDivSelectors,
    cssCanvasHeight: cssCanvasHeight,
    cssCanvasWidth: cssCanvasWidth
  };
};

// export default {
//   calcMinimumWindowDimensions,
//   calcScreenType,
//   calcProportionalDimensions,
//   calcDimensions,
// };