"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LayersOnFly;
var _conjunctionJunction = require("conjunction-junction");
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
        className: "rcjspp-sel-label-radio ".concat(displayClass, " tooltip"),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          name: key,
          type: "checkbox",
          className: "rcjspp-sel-input-radio",
          onChange: function onChange(e) {
            return handleLayerSelection(e);
          },
          checked: checked,
          value: key
        }), label, /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "popover",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            children: def
          })
        })]
      }, key);
    });
    layerCheckboxes.push( /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "rcjspp-sel-checkbox-group-container",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
        className: "rcjspp-sel-checkbox-group-header",
        onClick: function onClick() {
          return props.toggleLayerGroup(unit);
        },
        children: (0, _conjunctionJunction.convertScToSpace)((0, _conjunctionJunction.titleCaseWord)(unit))
      }), cbs]
    }, unit));
  });
  var noneAreChecked = Array.isArray(props.layersSelected) && props.layersSelected.length === 0;
  var uncheckAll = /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
    className: "rcjspp-sel-label-radio",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      type: "checkbox",
      className: "rcjspp-sel-input-radio",
      onChange: function onChange(e) {
        return props.handleLayerSelection(e);
      },
      checked: noneAreChecked,
      value: "de-select-all"
    }), "Deselect all layers"]
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-sel-inner-container",
    children: [uncheckAll, /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "rcjspp-sel-checkbox-container",
      children: layerCheckboxes
    })]
  });
}