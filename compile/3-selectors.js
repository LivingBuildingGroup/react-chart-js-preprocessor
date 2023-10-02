"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Selectors;
var _layersOnFly = _interopRequireDefault(require("./4-layers-on-fly"));
var _rangeFinder = _interopRequireDefault(require("./4-range-finder"));
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function Selectors(props) {
  var p = props;
  var layerGroupByJSXOptions = Array.isArray(props.layersThatHaveUnits) ? props.layersThatHaveUnits.map(function (layer, i) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
      value: layer,
      children: layer
    }, i);
  }) : [];
  var rangeFinder = /*#__PURE__*/(0, _jsxRuntime.jsx)(_rangeFinder["default"], {
    isGrouped: p.isGrouped,
    groupAllow: p.groupAllow,
    handleGroupBy: p.handleGroupBy,
    xStart: p.xStart,
    handleXStartChange: p.handleXStartChange,
    xEnd: p.xEnd,
    handleXEndChange: p.handleXEndChange,
    xIdealTickSpacing: p.xIdealTickSpacing,
    handleXIdealTickSpacingChange: p.handleXIdealTickSpacingChange,
    layerGroupByJSXOptions: layerGroupByJSXOptions,
    handleRangeChange: p.handleRangeChange,
    handleTickChange: p.handleTickChange
  });
  var selectors = p.selectorsInFocus === 'layers' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rcjspp-selectors",
    style: p.cssDivSelectors,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layersOnFly["default"], {
      layerUnitsArray: p.layerUnitsArray,
      layersGroupedByUnits: p.layersGroupedByUnits,
      layersSelected: p.layersSelected,
      legendHash: p.legendHash,
      indexAbbrev: p.indexAbbrev,
      indexDef: p.indexDef,
      handleLayerSelection: p.handleLayerSelection,
      toggleLayerGroup: p.toggleLayerGroup
    })
  }) : null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-selectors-outermost",
    children: [rangeFinder, selectors]
  });
}