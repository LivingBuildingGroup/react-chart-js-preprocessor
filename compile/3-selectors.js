"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Selectors;
var _layersOnFly = _interopRequireDefault(require("./4-layers-on-fly"));
var _rangeFinder = _interopRequireDefault(require("./4-range-finder"));
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function Selectors(props) {
  var p = props;
  var layerGroupByJSXOptions = Array.isArray(props.layersThatHaveUnits) ? props.layersThatHaveUnits.map(function (layer, i) {
    return /*#__PURE__*/_react["default"].createElement("option", {
      key: i,
      value: layer
    }, layer);
  }) : [];
  var rangeFinder = /*#__PURE__*/_react["default"].createElement(_rangeFinder["default"], {
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
  var selectors = p.selectorsInFocus === 'layers' ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-selectors",
    style: p.cssDivSelectors
  }, /*#__PURE__*/_react["default"].createElement(_layersOnFly["default"], {
    layerUnitsArray: p.layerUnitsArray,
    layersGroupedByUnits: p.layersGroupedByUnits,
    layersSelected: p.layersSelected,
    legendHash: p.legendHash,
    indexAbbrev: p.indexAbbrev,
    indexDef: p.indexDef,
    handleLayerSelection: p.handleLayerSelection,
    toggleLayerGroup: p.toggleLayerGroup
  })) : null;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-selectors-outermost"
  }, rangeFinder, selectors);
}