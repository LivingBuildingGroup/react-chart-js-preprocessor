'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Controls;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Controls(props) {

  var controlNames = Array.isArray(props.controlNames) ? props.controlNames : [];
  var controlIcons = Array.isArray(props.controlIcons) ? props.controlIcons : [];
  var controlFuncs = Array.isArray(props.controlFuncs) ? props.controlFuncs : [];
  var controlLabels = Array.isArray(props.controlLabels) ? props.controlLabels : [];

  var controls = props.waitingOnPreSetIdFromProps ? null : // to force a re-render
  controlNames.map(function (c, i) {
    var activeClass = props.preSets[props.preSetIdActive] && props.preSets[props.preSetIdActive].name === c ? 'gw-pre-set-control-active' : 'gw-control-over-' + props.cssBackground;
    var popover = c === 'selector' && props.selectorsPopover ? _react2.default.createElement(
      'div',
      { className: 'popover popover-constant popover-bottom-right' },
      _react2.default.createElement(
        'p',
        { className: 'gw-sel-popover', onClick: function onClick() {
            return props.toggleSelectorsInFocus('none');
          } },
        'Hide selectors'
      ),
      _react2.default.createElement(
        'p',
        { className: 'gw-sel-popover', onClick: function onClick() {
            return props.toggleSelectorsInFocus('layers');
          } },
        'Layer selectors'
      ),
      _react2.default.createElement(
        'p',
        { className: 'gw-sel-popover', onClick: function onClick() {
            return props.toggleSelectorsInFocus('edit-selected');
          } },
        'Graphic selectors (current layers)'
      ),
      _react2.default.createElement(
        'p',
        { className: 'gw-sel-popover', onClick: function onClick() {
            return props.toggleSelectorsInFocus('edit-all');
          } },
        'Graphic selectors (all layers)'
      )
    ) : _react2.default.createElement(
      'div',
      { className: 'popover' },
      _react2.default.createElement(
        'p',
        null,
        controlLabels[i]
      )
    );
    var vPosition = c === 'selector' ? 'bottom' : 'top';
    var ControlIcon = typeof controlIcons[i] === 'function' ? controlIcons[i] : null;
    var controlIcon = ControlIcon ? _react2.default.createElement(ControlIcon, { style: { height: 16 } }) : null;
    return _react2.default.createElement(
      'div',
      { key: i,
        className: 'gw-control tooltip tooltip-' + vPosition + '-right ' + activeClass,
        onClick: controlFuncs[i] },
      popover,
      controlIcon
    );
  });
  if (Array.isArray(controls)) {
    if (controls.length === 1) {
      controls.unshift(_react2.default.createElement('div', { key: 'extra' }));
    }
  }

  return _react2.default.createElement(
    'div',
    { className: 'gw-controls-outermost' },
    controls,
    _react2.default.createElement(
      'style',
      null,
      '\n    .gw-controls-outermost {\n      top: 0px;\n      height: 100%;\n      padding-top: 45px;\n      width: 30px;\n      padding-right: 0;\n      margin-right: 20px;\n      flex-direction: column;\n      justify-content: space-around;\n      z-index: 9999;\n    }\n    .tooltip .popover p.gw-sel-popover:hover {\n      color: rgb(103, 175, 103) !important;\n    }\n    .gw-control {\n      cursor: pointer;\n    }\n    .gw-control.gw-control-over-white{\n      color: #333;\n    }\n    .gw-control.gw-control-over-gray {\n      color: white;\n    }\n    .gw-control.gw-pre-set-control-active {\n      color: orange;\n    }\n    @media print {\n      .gw-control {\n        display: none !important;\n      }\n    }\n    .gw-control.gw-control-print {\n      display: none;\n    }\n    @media (min-width: 800px) {\n      .gw-control.gw-control-print {\n        display: flex;\n      }\n    }\n    '
    )
  );
}