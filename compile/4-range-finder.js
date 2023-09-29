"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeFinder;
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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