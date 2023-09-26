"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Controls;
var icons = _interopRequireWildcard(require("something-rather-iconic"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var iconStyle = {
  height: 20,
  width: 20
};
function Controls(props) {
  var controlsFromProps = Array.isArray(props.controls) ? props.controls : [];
  var controls = controlsFromProps.map(function (c, i) {
    var controlNameAsArr = typeof c.name === 'string' ? c.name.split(' ') : [];
    var controlNameAsId = controlNameAsArr.join('-');
    var activeClass = props.presets && props.presets[props.presetIdActive] && props.presets[props.presetIdActive].name === c.name ? 'rcjspp-pre-set-control-active' : "rcjspp-control-over-".concat(props.cssBackground);
    var popover = c.name === 'selector' && props.selectorsPopover ? /*#__PURE__*/React.createElement("div", {
      className: "popover popover-constant popover-bottom-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "rcjspp-sel-popover",
      onClick: function onClick() {
        return props.toggleSelectorsInFocus('none');
      }
    }, "Hide selectors"), /*#__PURE__*/React.createElement("p", {
      className: "rcjspp-sel-popover",
      onClick: function onClick() {
        return props.toggleSelectorsInFocus('layers');
      }
    }, "Layer selectors"), /*#__PURE__*/React.createElement("p", {
      className: "rcjspp-sel-popover",
      onClick: function onClick() {
        return props.toggleSelectorsInFocus('edit-selected');
      }
    }, "Graphic selectors (current layers)"), /*#__PURE__*/React.createElement("p", {
      className: "rcjspp-sel-popover",
      onClick: function onClick() {
        return props.toggleSelectorsInFocus('edit-all');
      }
    }, "Graphic selectors (all layers)")) : /*#__PURE__*/React.createElement("div", {
      className: "popover"
    }, /*#__PURE__*/React.createElement("p", null, c.label));
    var vPosition = c === 'selector' ? 'bottom' : 'top';
    var googleTagManagerClass = "graph-control ".concat(controlNameAsId, " true1 true2");
    var iconName = icons[c.iconName] ? c.iconName : 'ExclamationTriangle';
    if (!icons[c.iconName]) {
      console.log('did not find icon', c.iconName, '. Check pre-sets.');
    }
    var Icon = icons[iconName];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "rcjspp-control tooltip tooltip-".concat(vPosition, "-right ").concat(activeClass, " ").concat(googleTagManagerClass),
      onClick: c.func
    }, popover, /*#__PURE__*/React.createElement(Icon, {
      style: iconStyle
    }));
  });

  // if only one control, adding one more causes
  // the single control to be positioned lower (more visible)
  if (Array.isArray(controls) && controls.length === 1) {
    controls.unshift( /*#__PURE__*/React.createElement("div", {
      key: "extra"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-controls-outermost"
  }, controls);
}