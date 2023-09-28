"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeFinder;
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function RangeFinder(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-sel-row-form",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
      className: "rcjspp-sel-row-form-label",
      children: ["Start of Range", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        type: "number",
        name: "start-of-range",
        step: 1,
        className: "rcjspp-sel-input",
        onChange: function onChange(e) {
          return props.handleRangeChange(e, 'xStart');
        },
        value: props.xStart
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
      className: "rcjspp-sel-row-form-label",
      children: ["End of Range", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        type: "number",
        step: 1,
        className: "rcjspp-sel-input",
        onChange: function onChange(e) {
          return props.handleRangeChange(e, 'xEnd');
        },
        value: props.xEnd
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
      className: "rcjspp-sel-row-form-label",
      children: ["Increment Size", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        type: "number",
        step: 1,
        className: "rcjspp-sel-input",
        onChange: function onChange(e) {
          return props.handleTickChange(e);
        },
        value: props.xIdealTickSpacing
      })]
    }), !props.isGrouped && props.groupAllow ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
      className: "rcjspp-sel-row-form-label",
      children: ["Group By", /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
        className: "rcjspp-sel-input",
        onChange: function onChange(e) {
          return props.handleGroupBy(e);
        },
        children: props.layerGroupByJSXOptions
      })]
    }) : null]
  });
}