'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LayersSave;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conjunctionJunction = require('conjunction-junction');

var _preSetSelectors = require('./helpers/pre-set-selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LayersSave(props) {

  var preSetGlobalColorSelector = props.preSetGroupEditMode ? _react2.default.createElement(
    'div',
    { className: 'gw-sel-style-row tooltip' },
    _react2.default.createElement(
      'div',
      { className: 'popover popover-wide-readme' },
      _react2.default.createElement(
        'p',
        null,
        'You are in \'group pre-set edit mode\'. I.e. save this preset for a single test, then use it for multiple overlaied tests. Upon overlay each test gets 1 color. Test colors here, but the color is not saved here. We do save shades here. In the first column, select shade 1 (bright), 2 (lightest), 9 (darkest), or 0 to always use the same color (e.g. blue for rain).'
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'gw-sel-style-row-label gw-sel-style-row-active' },
      'test with this color:'
    ),
    _react2.default.createElement('div', { className: 'gw-sel-style-col-header gw-sel-style-select-shade' }),
    _react2.default.createElement(
      'select',
      {
        className: 'gw-sel-style-select',
        onChange: function onChange(e) {
          return props.handlePreSetGlobalColor(e);
        },
        value: props.preSetGlobalColor },
      props.preSetGlobalColorOptionsJSX
    ),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' }),
    _react2.default.createElement('div', { className: 'gw-sel-style-input' })
  ) : null;

  var layersForSelectors = props.selectorsInFocus === 'edit-all' ? props.layersThatHaveUnits : props.layersSelected;

  var preSetInputs = !Array.isArray(layersForSelectors) ? null : layersForSelectors.map(function (layer, i) {
    var layerSplit = layer.split('__');
    var group = void 0,
        subGroup = void 0,
        key = void 0;
    if (layerSplit.length === 1) {
      key = layerSplit[0];
    } else if (layerSplit.length === 2) {
      group = layerSplit[0];
      key = layerSplit[1];
    } else if (layerSplit.length === 3) {
      group = layerSplit[0];
      subGroup = layerSplit[1];
      key = layerSplit[2];
    }
    var groupWithSpace = group ? group + ' ' : '';
    var subGroupWithSpace = subGroup ? subGroup + ' ' : '';
    var header = '' + groupWithSpace + subGroupWithSpace + props.legendLabels[key];

    var shadeValue = !props.preSetGroupEditMode ? 0 : !props.styles[layer] ? 0 : !props.styles[layer].style ? 0 : !props.styles[layer].style.shade ? 0 : props.styles[layer].style.shade;

    var disabledShadeClass = shadeValue <= 0 ? 'gw-sel-disabled' : '';
    var shadeSelector = props.preSetGroupEditMode ? _react2.default.createElement(
      'select',
      {
        className: 'gw-sel-style-select gw-sel-style-select-shade ' + disabledShadeClass,
        onChange: function onChange(e) {
          return props.handlePreSetEdit(e, layer, { type: 'shade' });
        },
        value: shadeValue },
      props.preSetShadeOptionsJSX
    ) : _react2.default.createElement('div', { className: 'gw-sel-style-select gw-sel-style-select-shade' });

    var selectors = props.preSetColumns.map(function (col, j) {

      var thisLayer = (0, _conjunctionJunction.isObjectLiteral)(props.styles[layer]) ? props.styles[layer] : {};
      var value = (0, _preSetSelectors.parseSelectorValue)(thisLayer, col, props.preSetGroupEditMode);
      var disabledColorClass = col.type === 'color' && props.preSetGroupEditMode && shadeValue > 0 ? 'gw-sel-disabled' : '';

      var input = col.type === 'number' ? _react2.default.createElement('input', {
        key: '' + layer + col.key + '-' + j,
        type: 'number',
        step: col.step,
        className: 'gw-sel-style-input gw-sel-style-input-' + col.key,
        onChange: function onChange(e) {
          return props.handlePreSetEdit(e, layer, col);
        },
        value: value }) : _react2.default.createElement(
        'select',
        {
          key: '' + layer + col.key + '-' + j,
          className: 'gw-sel-style-select gw-sel-style-input-' + col.key + ' ' + disabledColorClass,
          onChange: function onChange(e) {
            return props.handlePreSetEdit(e, layer, col);
          },
          value: value },
        props.preSetStyleOptionsJSX[j]
      );

      return input;
    });

    var rowActiveClass = props.layersSelected.includes(layer) ? 'gw-sel-style-row-active' : '';

    var fullRow = _react2.default.createElement(
      'div',
      { key: '' + layer + i,
        className: 'gw-sel-style-row' },
      _react2.default.createElement(
        'div',
        { key: header + '-header',
          className: 'gw-sel-style-row-label ' + rowActiveClass,
          onClick: function onClick() {
            return props.handleLayerSelection(layer);
          } },
        header
      ),
      shadeSelector,
      selectors
    );

    return fullRow;
  });
  // end preSetInputs

  return _react2.default.createElement(
    'div',
    { className: 'gw-sel-style-body' },
    preSetGlobalColorSelector,
    preSetInputs,
    _react2.default.createElement(
      'style',
      null,
      '\n      .gw-sel-style-body {\n        overflow-y: scroll;\n      }\n      .gw-sel-style-col-header {\n        width: 10%;\n        padding-left: 7px;\n      }\n      .gw-sel-style-body {\n        display: block;\n        padding-top: 45px;\n        margin-bottom: 20px;\n      }\n      .gw-sel-style-row {\n        height: 20px;\n      }\n      .gw-sel-style-row-label {\n        display: block;\n        width: 20%;\n        height: 100%;\n        overflow: scroll;\n        cursor: pointer;\n        color: #aaa;\n        padding-left: 10px;\n      }\n      .gw-sel-style-row-active {\n        color: inherit;\n      }\n      .gw-sel-style-input,\n      .gw-sel-style-select {\n        width: 10%;\n        height: 100%;\n      }\n      .gw-sel-style-select-shade {\n        width: 40px;\n      }\n      .gw-sel-disabled {\n        color: transparent;\n      }\n    '
    )
  );
}