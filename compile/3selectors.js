'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _preSetSelectors = require('./helpers/pre-set-selectors');

var _preSetEdit = require('./helpers/pre-set-edit');

var _layersOnFly = require('./4layers-on-fly');

var _layersOnFly2 = _interopRequireDefault(_layersOnFly);

var _preSetLayersSave = require('./4pre-set-layers-save');

var _preSetLayersSave2 = _interopRequireDefault(_preSetLayersSave);

var _preSetAdminSave = require('./4pre-set-admin-save');

var _preSetAdminSave2 = _interopRequireDefault(_preSetAdminSave);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Selectors = function (_React$Component) {
  _inherits(Selectors, _React$Component);

  function Selectors(props) {
    _classCallCheck(this, Selectors);

    var _this = _possibleConstructorReturn(this, (Selectors.__proto__ || Object.getPrototypeOf(Selectors)).call(this, props));

    _this.state = {
      preSetHeaderRowJSX: '',
      preSetGlobalColorOptionsJSX: '',
      preSetShadeOptionsJSX: '',
      preSetShadeColumn: {},
      preSetColumns: [],
      ready: false

    };
    _this.handlePreSetGlobalColor = _this.handlePreSetGlobalColor.bind(_this);
    _this.handlePreSetEdit = _this.handlePreSetEdit.bind(_this);
    return _this;
  }

  // move this to conjunction-junction


  _createClass(Selectors, [{
    key: 'parseEvent',
    value: function parseEvent(event) {
      var value = !event ? null : !event.target ? event : event.target.value ? event.target.value : event;
      return value;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        resolve(_this2.loadPreSetSelectors());
      }).then(function () {
        _this2.setState({ ready: true });
      });
    }
  }, {
    key: 'formatPreSetStyleSelectors',
    value: function formatPreSetStyleSelectors(columns) {
      var preSetStyleOptionsJSX = columns.map(function (style, j) {
        var options = Array.isArray(style.optionLabels) ? style.optionLabels.map(function (label, i) {
          return _react2.default.createElement(
            'option',
            { key: 'o' + i, value: style.optionValues[i] },
            label
          );
        }) : [];
        return options;
      });
      return { preSetStyleOptionsJSX: preSetStyleOptionsJSX };
    }
  }, {
    key: 'formatPreSetShadeSelectors',
    value: function formatPreSetShadeSelectors() {
      var preSetShadeColumn = {
        layer: 'shade',
        label: 'shade',
        type: 'shade',
        optionLabels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        optionValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        defaultValue: 0
      };
      var preSetShadeOptionsJSX = preSetShadeColumn.optionValues.map(function (v) {
        return _react2.default.createElement(
          'option',
          { key: 'shade' + v, value: v },
          v
        );
      });
      // this will not be an array when not in group edit mode
      var psgco = Array.isArray(this.props.preSetGlobalColorOptions) ? this.props.preSetGlobalColorOptions : [];
      var preSetGlobalColorOptionsJSX = psgco.map(function (o) {
        return _react2.default.createElement(
          'option',
          { key: o, value: o },
          o
        );
      });
      return {
        preSetGlobalColorOptionsJSX: preSetGlobalColorOptionsJSX,
        preSetShadeColumn: preSetShadeColumn,
        preSetShadeOptionsJSX: preSetShadeOptionsJSX
      };
    }
  }, {
    key: 'loadPreSetSelectors',
    value: function loadPreSetSelectors() {
      var columns = (0, _preSetSelectors.formatPreSetSelectorColumns)(this.props.cssStyleColorsNamed);
      var header = this.formatPreSetHeader(columns.preSetColumns);
      var styleSelectors = this.formatPreSetStyleSelectors(columns.preSetColumns);
      var shadeSelectors = this.formatPreSetShadeSelectors();
      this.setState(_extends({}, columns, header, styleSelectors, shadeSelectors));
    }
  }, {
    key: 'formatPreSetHeader',
    value: function formatPreSetHeader(columns) {
      var columnsJSX = Array.isArray(columns) ? columns.map(function (style, i) {
        return _react2.default.createElement(
          'div',
          { key: '' + style.key + i,
            className: 'gw-sel-style-col-header' },
          style.label
        );
      }) : null;
      if (Array.isArray(columnsJSX)) {
        columnsJSX.unshift(_react2.default.createElement('div', { key: 'shade', className: 'gw-sel-style-col-header gw-sel-style-select-shade' }));
        columnsJSX.unshift(_react2.default.createElement('div', { key: 'blank', className: 'gw-sel-style-row-label gw-sel-style-row-active' }));
      }
      var preSetHeaderRowJSX = _react2.default.createElement(
        'div',
        { className: 'gw-sel-style-header-row' },
        columnsJSX
      );

      this.setState({ preSetHeaderRowJSX: preSetHeaderRowJSX });
    }
  }, {
    key: 'handlePreSetGlobalColor',
    value: function handlePreSetGlobalColor(event) {
      // this is ONLY used in editing mode for group preSets
      var preSetGlobalColor = event.target.value;
      var preSetGlobalPalette = this.props.preSetGlobalPalettes[preSetGlobalColor];
      var styles = (0, _preSetEdit.applyPreSetGlobalColorToStyles)({
        styles: this.props.styles,
        preSetGlobalPalette: preSetGlobalPalette
      });
      this.props.receiveNewStyles(styles, preSetGlobalColor);
    }
  }, {
    key: 'handlePreSetEdit',
    value: function handlePreSetEdit(event, layer, property) {
      var value = this.parseEvent(event);
      var styles = (0, _preSetEdit.editOneStyle)({
        styles: this.props.styles,
        value: value,
        layer: layer,
        property: property,
        preSetGlobalPalette: this.props.preSetGlobalPalette,
        cssStyleColorsNamed: this.props.cssStyleColorsNamed
      });
      console.log('property', property, 'value', value, 'styles', styles);
      this.props.receiveNewStyles(styles);
    }
  }, {
    key: 'render',
    value: function render() {

      var p = this.props;

      var preSetSave = p.preSetSaveAllow && this.state.ready ? _react2.default.createElement(_preSetAdminSave2.default, {
        icons: p.icons,
        preSetIds: p.preSetIds,
        preSets: p.preSets,
        preSetIdActive: p.preSetIdActive,
        preSetGroupEditMode: p.preSetGroupEditMode,
        preSetSaveSettings: p.preSetSaveSettings,

        handlePreSetSave: p.handlePreSetSave
      }) : null;

      var selectors = p.selectorsInFocus === 'layers' ? _react2.default.createElement(
        'div',
        { className: 'gw-selectors',
          style: p.cssDivSelectors },
        _react2.default.createElement(_layersOnFly2.default, {
          groupTrue: p.groupTrue,
          groupAllow: p.groupAllow,
          handleGroupBy: p.handleGroupBy,
          xStart: p.xStart,
          xEnd: p.xEnd,
          xIdealTickSpacing: p.xIdealTickSpacing,
          layerGroupByJSXOptions: p.layerGroupByJSXOptions,
          handleRangeChange: p.handleRangeChange,
          handleTickChange: p.handleTickChange,
          layerUnitsArray: p.layerUnitsArray,
          layersGroupedByUnits: p.layersGroupedByUnits,
          layersSelected: p.layersSelected,
          legendObject: p.legendObject,
          indexAbbrev: p.indexAbbrev,

          handleLayerSelection: p.handleLayerSelection,
          toggleLayerGroup: p.toggleLayerGroup,
          styles: p.styles
        })
      ) : p.selectorsInFocus.includes('edit') ? _react2.default.createElement(
        'div',
        { className: 'gw-selectors',
          style: p.cssDivSelectors },
        this.state.preSetHeaderRowJSX,
        _react2.default.createElement(_preSetLayersSave2.default, {
          preSetGroupEditMode: p.preSetGroupEditMode,
          selectorsInFocus: p.selectorsInFocus,
          legendLabels: p.legendLabels,
          styles: p.styles,
          layersSelected: p.layersSelected,
          layersThatHaveUnits: p.layersThatHaveUnits,
          handleLayerSelection: p.handleLayerSelection,
          preSetGlobalColor: p.preSetGlobalColor,

          preSetShadeColumn: this.state.preSetShadeColumn,
          preSetShadeOptionsJSX: this.state.preSetShadeOptionsJSX,
          preSetGlobalColorOptionsJSX: this.state.preSetGlobalColorOptionsJSX,
          preSetStyleOptionsJSX: this.state.preSetStyleOptionsJSX,
          preSetColumns: this.state.preSetColumns,

          handlePreSetGlobalColor: this.handlePreSetGlobalColor,
          handlePreSetEdit: this.handlePreSetEdit
        }),
        preSetSave
      ) : null;

      return _react2.default.createElement(
        'div',
        { className: 'gw-selectors-outermost' },
        selectors,
        _react2.default.createElement(
          'style',
          null,
          '\n        .gw-sel-style-col-header {\n          width: 10%;\n          padding-left: 7px;\n        }     \n        .gw-sel-style-select-shade {\n          width: 40px;\n        } \n        .gw-sel-style-row-label {\n          display: block;\n          width: 20%;\n          height: 100%;\n          overflow: scroll;\n          cursor: pointer;\n          color: #aaa;\n          padding-left: 10px;\n        }\n        .gw-sel-style-row-active {\n          color: inherit;\n        }\n        .gw-sel-style-header-row {\n          background-color: white;\n          opacity: 0.85;\n          justify-content: flex-end;\n          width: 100%;\n          height: 45px;\n          position: absolute;\n          padding-top: 5px;\n        }\n        .gw-selectors {\n          position: absolute;\n          top: 100%;\n          flex-direction: column;\n          background-color: white;\n          width: 100%;\n          max-width: 100vw;\n          margin-left: auto;\n          margin-right: auto;\n          margin-bottom: 30px;\n          z-index: 9999;\n        }\n        @media(min-width: 800px){\n          .gw-selectors {\n            overflow-y: scroll;\n          }\n        }\n        .gw-pre-set-save-container {\n          background-color: white;\n          display: block;\n          height: 75px;\n        }\n      '
        )
      );
    }
  }]);

  return Selectors;
}(_react2.default.Component);

exports.default = Selectors;