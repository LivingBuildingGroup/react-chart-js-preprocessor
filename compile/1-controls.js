"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Controls;
var icons = _interopRequireWildcard(require("something-rather-iconic"));
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var iconStyle = {
  height: 20,
  width: 20
};
function Controls(props) {
  var controlsFromProps = Array.isArray(props.controls) ? props.controls : [];
  var activePreset = props.presets["".concat(props.presetIdActive)] || {};
  var activePresetName = activePreset.namePreset;
  var controls = props.waitingOnPresetIdFromProps ? null :
  // to force a re-render
  controlsFromProps.map(function (c, i) {
    var activeClass = activePresetName === c.name ? 'rcjspp-preset-control-active' : "rcjspp-control-over-".concat(props.cssBackground);
    var vPosition = c === 'selector' ? 'bottom' : 'top';
    var iconName = icons[c.iconName] ? c.iconName : 'ExclamationTriangle';
    if (!icons[c.iconName]) {
      console.warn('did not find icon', c.iconName, '. Check presets.');
    }
    var Icon = icons[iconName];
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: i,
      className: "rcjspp-control tooltip tooltip-".concat(vPosition, "-right ").concat(activeClass),
      onClick: c.func
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "popover"
    }, Array.isArray(c.label) ? c.label.map(function (l, i) {
      return /*#__PURE__*/_react["default"].createElement("p", {
        key: i
      }, l);
    }) : /*#__PURE__*/_react["default"].createElement("p", null, c.label)), /*#__PURE__*/_react["default"].createElement(Icon, {
      style: iconStyle
    }));
  });

  // if only one control, adding one more causes
  // the single control to be positioned lower (more visible)
  if (Array.isArray(controls) && controls.length === 1) {
    controls.unshift( /*#__PURE__*/_react["default"].createElement("div", {
      key: "extra"
    }));
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "rcjspp-controls-outermost"
  }, controls);
}