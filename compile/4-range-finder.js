"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeFinder;
function RangeFinder(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-sel-row-form"
  }, /*#__PURE__*/React.createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Start of Range", /*#__PURE__*/React.createElement("input", {
    type: "number",
    name: "start-of-range",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleRangeChange(e, 'xStart');
    },
    value: props.xStart
  })), /*#__PURE__*/React.createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "End of Range", /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleRangeChange(e, 'xEnd');
    },
    value: props.xEnd
  })), /*#__PURE__*/React.createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Increment Size", /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: 1,
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleTickChange(e);
    },
    value: props.xIdealTickSpacing
  })), !props.isGrouped && props.groupAllow ? /*#__PURE__*/React.createElement("label", {
    className: "rcjspp-sel-row-form-label"
  }, "Group By", /*#__PURE__*/React.createElement("select", {
    className: "rcjspp-sel-input",
    onChange: function onChange(e) {
      return props.handleGroupBy(e);
    }
  }, props.layerGroupByJSXOptions)) : null);
}