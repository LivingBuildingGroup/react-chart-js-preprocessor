'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminSave = function (_React$Component) {
  _inherits(AdminSave, _React$Component);

  function AdminSave(props) {
    _classCallCheck(this, AdminSave);

    var _this = _possibleConstructorReturn(this, (AdminSave.__proto__ || Object.getPrototypeOf(AdminSave)).call(this, props));

    _this.state = {
      preSetIds: _this.props.preSetIds || [],
      preSets: _this.props.preSets || {},

      id: _this.props.preSetIdActive,
      name: '',
      icon: '',
      type: _this.props.preSetGroupEditMode ? 'group' : 'single',
      def: false,
      isNew: false,
      isPublic: false,
      preSetSaveSettings: _this.props.preSetSaveSettings,

      preSetIconComponents: [],
      preSetIconJSXOptions: []
    };
    return _this;
  }

  _createClass(AdminSave, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.readPreSetFromSelected();
      this.listAllPreSetIconsAsOptions();
    }
  }, {
    key: 'readPreSetFromSelected',
    value: function readPreSetFromSelected() {
      var thisPreSet = this.state.preSets[this.state.id];
      if (thisPreSet) {
        this.setState({
          name: thisPreSet.name,
          icon: thisPreSet.icon,
          def: thisPreSet.def,
          isPublic: Array.isArray(thisPreSet.permissions) && thisPreSet.permissions.includes('public') ? true : false
        });
      }
    }
  }, {
    key: 'listAllPreSetIconsAsOptions',
    value: function listAllPreSetIconsAsOptions() {
      // this is a method, vs helper function, ONLY because it uses JSX
      var iconsPreSets = this.props.icons || {};
      var preSetIconNames = [];
      var preSetIconComponents = [];
      for (var name in iconsPreSets) {
        preSetIconNames.push(name);
        preSetIconComponents.push(iconsPreSets[name]);
      }
      var preSetIconJSXOptions = preSetIconNames.map(function (name, i) {
        return _react2.default.createElement(
          'option',
          { key: i,
            className: '',
            value: preSetIconNames[i] },
          name
        );
      });
      this.setState({
        preSetIconNames: preSetIconNames,
        preSetIconComponents: preSetIconComponents,
        preSetIconJSXOptions: preSetIconJSXOptions
      });
    }
  }, {
    key: 'toggleSaveType',
    value: function toggleSaveType() {
      this.setState({
        isNew: !this.state.isNew
      });
    }
  }, {
    key: 'toggleIsPublic',
    value: function toggleIsPublic() {
      this.setState({
        isPublic: !this.state.isPublic
      });
    }
  }, {
    key: 'toggleIsDef',
    value: function toggleIsDef() {
      this.setState({
        def: !this.state.def
      });
    }
  }, {
    key: 'handlePreSetName',
    value: function handlePreSetName(event) {
      this.setState({ name: event.target.value });
    }
  }, {
    key: 'handlePreSetIcon',
    value: function handlePreSetIcon(event) {
      this.setState({ icon: event.target.value });
    }
  }, {
    key: 'handlePreSetSave',
    value: function handlePreSetSave(event) {
      event.preventDefault();
      // const stylesDefault = this.props.styles; // used if no styles explicitly sent
      var preSet = {
        id: this.state.isNew ? null : this.state.id, // system-assigned

        type: this.state.type, // admin
        def: this.state.def,
        name: this.state.name,
        icon: this.state.icon,
        permissions: this.state.isPublic ? ['grd', 'public'] : ['grd'],
        preSetSaveSettings: this.state.preSetSaveSettings
      };
      console.log('preSet to save', preSet);
      this.props.handlePreSetSave(preSet);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var preSetSaveButton = _react2.default.createElement(
        'button',
        { type: 'submit',
          className: 'gw-pre-set-save-button',
          onClick: function onClick(e) {
            return _this2.handlePreSetSave(e);
          } },
        'save'
      );

      var saveTypeToggle = _react2.default.createElement(
        'div',
        {
          className: 'gw-pre-set-save-toggle-container' },
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'save-type',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleSaveType();
            },
            checked: this.state.isNew,
            value: this.state.isNew }),
          'save as a new pre-set'
        ),
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'save-type',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleSaveType();
            },
            checked: !this.state.isNew,
            value: !this.state.isNew }),
          'update existing pre-set'
        )
      );

      var isPublicToggle = _react2.default.createElement(
        'div',
        {
          className: 'gw-pre-set-save-toggle-container' },
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'permission',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleIsPublic();
            },
            checked: this.state.isPublic,
            value: this.state.isPublic }),
          'make publicly visible'
        ),
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'permission',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleIsPublic();
            },
            checked: !this.state.isPublic,
            value: !this.state.isPublic }),
          'keep private'
        )
      );

      var defToggle = _react2.default.createElement(
        'div',
        {
          className: 'gw-pre-set-save-toggle-container' },
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'def',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleIsDef();
            },
            checked: this.state.def,
            value: this.state.def }),
          'make default'
        ),
        _react2.default.createElement(
          'label',
          { className: 'gw-pre-set-input-label' },
          _react2.default.createElement('input', {
            name: 'def',
            type: 'radio',
            className: 'gw-pre-set-input',
            onChange: function onChange() {
              return _this2.toggleIsDef();
            },
            checked: !this.state.def,
            value: !this.state.def }),
          'not default'
        )
      );

      var nameSelector = _react2.default.createElement(
        'label',
        { className: 'gw-pre-set-input-label' },
        _react2.default.createElement('input', {
          type: 'text',
          className: 'gw-pre-set-input',
          onChange: function onChange(e) {
            return _this2.handlePreSetName(e);
          },
          value: this.state.name || '' }),
        this.state.isNew ? 'name' : 'new name (only if changing)'
      );

      var IconPreview = this.state.icon && typeof this.props.icons[this.state.icon] === 'function' ? this.props.icons[this.state.icon] : null;
      var iconPreview = IconPreview ? _react2.default.createElement(IconPreview, { style: { height: 16 } }) : null;

      var iconSelector = _react2.default.createElement(
        'label',
        { className: 'gw-pre-set-input-label' },
        _react2.default.createElement(
          'select',
          { className: 'gw-pre-set-selector',
            onChange: function onChange(e) {
              return _this2.handlePreSetIcon(e);
            },
            value: this.state.icon || '' },
          this.state.preSetIconJSXOptions
        ),
        'icon',
        iconPreview
      );

      return _react2.default.createElement(
        'form',
        { className: 'gw-pre-set-save-container' },
        _react2.default.createElement(
          'div',
          { className: 'gw-pre-set-save-inner-container' },
          saveTypeToggle,
          isPublicToggle,
          defToggle,
          nameSelector,
          iconSelector,
          preSetSaveButton
        ),
        _react2.default.createElement(
          'style',
          null,
          '\n        .gw-pre-set-save-button {\n          padding: 5px;\n          margin-right: 20px;\n        }\n        .gw-pre-set-save-toggle-container {\n          flex-direction: column;\n          margin: 15px;\n          width: 200px;\n          flex-grow: 0;\n          flex-shrink: 0;\n        }\n        .gw-pre-set-input-label {\n          padding-left: 5px;\n        }\n        .gw-pre-set-input {\n          min-width: 150px;\n        }\n        .gw-pre-set-save-inner-container {\n          display: flex;\n          flex-direction: row;\n          align-items: center;\n          justify-content: space-between;\n          width: 100%;\n        }\n        .gw-pre-set-selector {\n          min-width: 100px;\n        }\n      '
        )
      );
    }
  }]);

  return AdminSave;
}(_react2.default.Component);

exports.default = AdminSave;