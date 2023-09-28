"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeFinder;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function RangeFinder(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-sel-row-form"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Start of Range", /*#__PURE__*/_react["default"].createElement("input", {
    type: "number",
    name: "start-of-range",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleRangeChange(e, 'xStart');
    },
    value: props.xStart
  })), /*#__PURE__*/_react["default"].createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "End of Range", /*#__PURE__*/_react["default"].createElement("input", {
    type: "number",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleRangeChange(e, 'xEnd');
    },
    value: props.xEnd
  })), /*#__PURE__*/_react["default"].createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Increment Size", /*#__PURE__*/_react["default"].createElement("input", {
    type: "number",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleTickChange(e);
    },
    value: props.xIdealTickSpacing
  })), !props.isGrouped && props.groupAllow ? /*#__PURE__*/_react["default"].createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Group By", /*#__PURE__*/_react["default"].createElement("select", {
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleGroupBy(e);
    }
  }, props.layerGroupByJSXOptions)) : null);
}