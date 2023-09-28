"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LayersOnFly;
var _conjunctionJunction = require("conjunction-junction");
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function LayersOnFly(props) {
  var handleLayerSelection = typeof props.handleLayerSelection === 'function' ? props.handleLayerSelection : function () {};
  // how can we prevent this from having to loop on every render?
  var layerCheckboxes = [];
  var legendHash = props.legendHash || {};
  props.layerUnitsArray.forEach(function (unit) {
    var cbs = props.layersGroupedByUnits[unit].map(function (key) {
      var checked = !Array.isArray(props.layersSelected) ? false : props.layersSelected.includes(key) ? true : false;
      var thisLegend = legendHash[key] || {};
      var label = thisLegend.l || key;
      var def = thisLegend.d || key;
      var displayClass = typeof label === 'string' && label.includes('PREDICTED') ? 'rcjspp-sel-predicted-selector' : '';
      return /*#__PURE__*/_react["default"].createElement("label", {
        key: key,
        className: "rcjspp-sel-label-radio ".concat(displayClass, " tooltip")
      }, /*#__PURE__*/_react["default"].createElement("input", {
        name: key,
        type: "checkbox",
        className: "rcjspp-sel-input-radio",
        onChange: function onChange(e) {
          return handleLayerSelection(e);
        },
        checked: checked,
        value: key
      }), label, /*#__PURE__*/_react["default"].createElement("div", {
        className: "popover"
      }, /*#__PURE__*/_react["default"].createElement("p", null, def)));
    });
    layerCheckboxes.push( /*#__PURE__*/_react["default"].createElement("div", {
      key: unit,
      className: "rcjspp-sel-checkbox-group-container"
    }, /*#__PURE__*/_react["default"].createElement("h3", {
      className: "rcjspp-sel-checkbox-group-header",
      onClick: function onClick() {
        return props.toggleLayerGroup(unit);
      }
    }, (0, _conjunctionJunction.convertScToSpace)((0, _conjunctionJunction.titleCaseWord)(unit))), cbs));
  });
  var noneAreChecked = Array.isArray(props.layersSelected) && props.layersSelected.length === 0;
  var uncheckAll = /*#__PURE__*/_react["default"].createElement("label", {
    className: "rcjspp-sel-label-radio"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    className: "rcjspp-sel-input-radio",
    onChange: function onChange(e) {
      return props.handleLayerSelection(e);
    },
    checked: noneAreChecked,
    value: "de-select-all"
  }), "Deselect all layers");
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-sel-inner-container"
  }, uncheckAll, /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-sel-checkbox-container"
  }, layerCheckboxes));
}