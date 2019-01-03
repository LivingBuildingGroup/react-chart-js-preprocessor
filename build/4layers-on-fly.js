'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LayersOnFly;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conjunctionJunction = require('conjunction-junction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LayersOnFly(props) {

  var groupBy = !props.groupTrue && props.groupAllow ? _react2.default.createElement(
    'label',
    { className: 'gw-sel-row-form-label' },
    'Group By',
    _react2.default.createElement(
      'select',
      { className: 'gw-sel-input',
        onChange: function onChange(e) {
          return props.handleGroupBy(e);
        } },
      props.layerGroupByJSXOptions
    )
  ) : null;

  var rangeFinder = _react2.default.createElement(
    'div',
    { className: 'gw-sel-row-form' },
    _react2.default.createElement(
      'label',
      { className: 'gw-sel-row-form-label' },
      'Start of Range',
      _react2.default.createElement('input', {
        type: 'number',
        name: 'start-of-range',
        step: 1,
        className: 'gw-sel-input',
        onChange: function onChange(e) {
          return props.handleRangeChange(e, 'xStart');
        },
        value: props.xStart })
    ),
    _react2.default.createElement(
      'label',
      { className: 'gw-sel-row-form-label' },
      'End of Range',
      _react2.default.createElement('input', {
        type: 'number',
        step: 1,
        className: 'gw-sel-input',
        onChange: function onChange(e) {
          return props.handleRangeChange(e, 'xEnd');
        },
        value: props.xEnd })
    ),
    _react2.default.createElement(
      'label',
      { className: 'gw-sel-row-form-label' },
      'Increment Size',
      _react2.default.createElement('input', {
        type: 'number',
        step: 1,
        className: 'gw-sel-input',
        onChange: function onChange(e) {
          return props.handleTickChange(e);
        },
        value: props.xIdealTickSpacing })
    ),
    groupBy
  );

  // how can we prevent this from having to loop on every render?
  var layerCheckboxes = [];

  props.layerUnitsArray.forEach(function (unit) {

    var cbs = props.layersGroupedByUnits[unit].map(function (key) {

      var checked = !Array.isArray(props.layersSelected) ? false : props.layersSelected.includes(key) ? true : false;

      var display = !props.legendObject ? key : !Array.isArray(props.legendObject[key]) ? key : props.legendObject[key][props.indexAbbrev];

      return _react2.default.createElement(
        'label',
        { key: key, className: 'gw-sel-label-radio' },
        _react2.default.createElement('input', {
          name: key,
          type: 'checkbox',
          className: 'gw-sel-input-radio',
          onChange: function onChange(e) {
            return props.handleLayerSelection(e);
          },
          checked: checked,
          value: key }),
        display
      );
    });

    layerCheckboxes.push(_react2.default.createElement(
      'div',
      {
        key: unit, className: 'gw-sel-checkbox-group-container' },
      _react2.default.createElement(
        'h3',
        { className: 'gw-sel-checkbox-group-header',
          onClick: function onClick() {
            return props.toggleLayerGroup(unit);
          } },
        (0, _conjunctionJunction.convertScToSpace)((0, _conjunctionJunction.titleCaseWord)(unit))
      ),
      cbs
    ));
  });

  return _react2.default.createElement(
    'div',
    { className: 'gw-sel-inner-container' },
    rangeFinder,
    _react2.default.createElement(
      'div',
      { className: 'gw-sel-checkbox-container' },
      layerCheckboxes
    ),
    _react2.default.createElement(
      'style',
      null,
      '\n      .gw-sel-inner-container {\n        padding: 5px;\n        flex-direction: column;\n      }\n      .gw-sel-checkbox-container {\n        flex-direction: row;\n        flex-wrap: wrap;\n        margin-top: 15px;\n        justify-content: space-around;\n      }\n      @media(min-width: 800px){\n        .gw-sel-checkbox-container {\n          overflow-y: scroll;\n        }\n      }\n      .gw-sel-row-form-label {\n        display: flex;\n        margin-right: 20px;\n        align-items: baseline;\n      }\n      .gw-sel-row-form .gw-sel-input {\n        font-size: 16px;\n        display: flex;\n        min-height: 14px;\n        padding: 3px;\n        width: 4em;\n      }\n      .gw-sel-row-form {\n        justify-content: space-between;\n      }\n      .gw-sel-row.gw-sel-input-radio {\n        width: 5%;\n      }\n      .gw-sel-checkbox-group-container {\n        flex-direction: column; \n        margin-bottom: 10px;\n        margin-right: 20px;\n      }\n      .gw-sel-checkbox-group-container .gw-sel-checkbox-group-header {\n        margin-top: 10px;\n        margin-bottom: 5px;\n      }\n      .gw-sel-checkbox-group .gw-sel-label-radio {\n        display: flex;\n      }\n      .gw-sel-label-radio {\n        cursor: pointer;\n      }\n      .gw-sel-label-radio:hover {\n        background-color: rgba(125, 157, 165, 0.1);\n      }\n    '
    )
  );
}