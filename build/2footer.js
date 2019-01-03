'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Footer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conjunctionJunction = require('conjunction-junction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Footer(props) {

  var formatTitle = function formatTitle(titleText, groupDotColors, cssBackground) {
    // this is a method, vs helper function, ONLY because it uses JSX
    var graphTitleClass = cssBackground === 'white' ? 'gw-title-black' : '';

    var titleArray = [];
    for (var id in titleText) {
      titleArray.push(_react2.default.createElement(
        'div',
        { key: id, className: 'gw-title-inner-container' },
        _react2.default.createElement('div', {
          className: 'gw-title-color-dot', key: id,
          style: { backgroundColor: 'rgb(' + groupDotColors[id] + ')' } }),
        _react2.default.createElement(
          'h3',
          { className: 'gw-title ' + graphTitleClass + ' gw-title-major' },
          titleText[id].tMajor
        ),
        _react2.default.createElement(
          'h3',
          { className: 'gw-title ' + graphTitleClass + ' gw-title-minor' },
          titleText[id].tMinor
        )
      ));
    }

    var titleTextJSX = (0, _conjunctionJunction.isObjectLiteral)(titleText) ? _react2.default.createElement(
      'div',
      { className: 'gw-title-wrap-container' },
      titleArray,
      _react2.default.createElement(
        'style',
        null,
        '\n          .gw-title-inner-container {\n            justify-content: center;\n            align-items: center;\n            margin-right: 25px;\n            margin-left: 25px;\n          }\n          .gw-title-color-dot {\n            border-radius: 50%;\n            height: 15px;\n            width: 15px;\n            background-color: white;\n          }\n          .gw-title {\n            color: white;\n            text-align: center;\n            margin-top: 10px;\n            margin-bottom: 10px;\n            flex-grow: 1;\n          }\n          .gw-title.gw-title-black {\n            color: #333;\n          }\n          .gw-title.gw-subtitle {\n            display: none;\n          \n          }\n          @media print{\n            .gw-title.gw-subtitle {\n              display: block;\n            }\n          }\n          .gw-title-wrap-container {\n            flex-wrap: wrap;\n            justify-content: center;\n            align-items: center;\n            flex-grow: 1;\n          }\n          .gw-title-major {\n            margin-left: 3px;\n          }\n          .gw-title-minor {\n            font-weight: 100;\n            font-size: 67%;\n            opacity: 0.75;\n            margin-left: 3px;\n          }\n          .gw-title-inner-container {\n            justify-content: center;\n            align-items: center;\n            margin-right: 25px;\n            margin-left: 25px;\n          }\n          .gw-title-color-dot {\n            border-radius: 50%;\n            height: 15px;\n            width: 15px;\n            background-color: white;\n          }\n        '
      )
    ) : null;

    return titleTextJSX;
  };

  // const graphTitleClass = props.cssBackground === 'white' ? 'gw-title-black' : '' ;

  // const graphTitle      = props.titleTextJSX ? props.titleTextJSX :
  //   typeof props.titleText === 'string' ?
  //   <h3 className={`gw-title ${graphTitleClass}`}>{props.titleText}</h3> :
  //   <h3 className={`gw-title ${graphTitleClass}`}>graph!</h3>

  var graphTitle = formatTitle(props.titleText, props.groupDotColors, props.cssBackground);

  var graphSubTitle = null; // <h3 className={`gw-title gw-subtitle ${graphTitleClass}`}>Displaying: ????</h3>

  var spinner = !props.advanceAllow ? null : !props.waitingOnDataFromProps ? null : _react2.default.createElement(
    'div',
    { className: 'gw-advance-waiting' },
    _react2.default.createElement('div', null)
  );

  var hideAdvanceButtonClass = props.waitingOnDataFromProps ? 'transparent' : '';

  var i = props.icons || {};
  var IconLeft = i.caret_left;
  var IconRight = i.caret_right;

  var buttonAdvanceLeft = props.advanceAllow ? _react2.default.createElement(
    'div',
    { className: 'gw-advance-button gw-control gw-control-over-' + props.cssBackground + ' tooltip ' + hideAdvanceButtonClass, onClick: function onClick() {
        return props.graphAdvance(-1);
      } },
    _react2.default.createElement(
      'div',
      { className: 'popover' },
      _react2.default.createElement(
        'p',
        null,
        'retreat the graph to the prior event'
      )
    ),
    _react2.default.createElement(IconLeft, { style: { height: 36 } })
  ) : null;

  var buttonAdvanceRight = props.advanceAllow ? _react2.default.createElement(
    'div',
    { className: 'gw-advance-button gw-control gw-control-over-' + props.cssBackground + ' tooltip ' + hideAdvanceButtonClass, onClick: function onClick() {
        return props.graphAdvance(1);
      } },
    _react2.default.createElement(
      'div',
      { className: 'popover' },
      _react2.default.createElement(
        'p',
        null,
        'advance the graph to the next event'
      )
    ),
    _react2.default.createElement(IconRight, { style: { height: 36 } })
  ) : null;

  return _react2.default.createElement(
    'div',
    { className: 'gw-footer',
      style: props.cssDivFooter },
    buttonAdvanceLeft,
    spinner,
    graphTitle,
    graphSubTitle,
    spinner,
    buttonAdvanceRight,
    _react2.default.createElement(
      'style',
      null,
      '\n    .gw-title {\n      color: white;\n      text-align: center;\n      margin-top: 10px;\n      margin-bottom: 10px;\n      flex-grow: 1;\n    }\n    .gw-advance-spinner-container {\n      height: 36px;\n      overflow: hidden;\n    }\n    .gw-advance-spinner-container .line-scale-pulse-out-rapid > div {\n      background-color: white ;\n    }\n    .gw-advance-button {\n      font-size: 72px;\n      min-width: 30px;\n      justify-content: center;\n      align-items: center;\n    }\n    @media(min-width: 520px){\n      .gw-advance-button {\n        font-size: 36px;\n      }\n    }\n    .gw-control {\n      cursor: pointer;\n    }\n    .gw-control.gw-control-over-white{\n      color: #333;\n    }\n    .gw-control.gw-control-over-gray {\n      color: white;\n    }\n    @media print {\n      .gw-control {\n        display: none !important;\n      }\n    }\n    .gw-footer {\n      justify-content: space-between;\n      min-height: 36px;\n      margin-bottom: 15px;\n    }\n    @media(min-width: 520px){\n      .gw-footer {\n        margin-bottom: 5px;\n      }\n    }\n\n    .gw-advance-waiting > div {\n      width: 40px;\n      height: 40px;\n      background-color: yellow;\n      border-radius: 100%;\n    \n      -webkit-animation: blinking 1.0s infinite ease-in-out;\n      animation: blinking 1.0s infinite ease-in-out;\n    }\n    \n    @-webkit-keyframes blinking {\n      0% { -webkit-transform: scale(0.0) }\n      100% {\n        -webkit-transform: scale(1.0);\n        opacity: 0;\n      }\n    }\n    \n    @keyframes blinking {\n      0% {\n        transform: scale(0.0);\n        -webkit-transform: scale(0.0);\n      } 100% {\n        transform: scale(1.0);\n        -webkit-transform: scale(1.0);\n        opacity: 0;\n      }\n    }\n    '
    )
  );
}