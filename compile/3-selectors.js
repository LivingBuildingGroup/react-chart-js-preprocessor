"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Selectors;
var _layersOnFly = _interopRequireDefault(require("./4-layers-on-fly"));
var _rangeFinder = _interopRequireDefault(require("./4-range-finder"));
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
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
    xEnd: p.xEnd,
    xIdealTickSpacing: p.xIdealTickSpacing,
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