"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Footer;
var _conjunctionJunction = require("conjunction-junction");
var _browserHelpers = require("browser-helpers");
var _somethingRatherIconic = require("something-rather-iconic");
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function Footer(props) {
  var formatTitle = function formatTitle(titleText, groupDotColors) {
    // this is a method, vs helper function, ONLY because it uses JSX

    var titleArray = [];
    for (var id in titleText) {
      var dot = typeof groupDotColors[id] === 'string' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "rcjspp-title-color-dot",
        style: {
          backgroundColor: "rgb(".concat(groupDotColors[id], ")")
        }
      }, id) : null;
      var theTitle = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "rcjspp-title-inner-container ".concat(titleText[id].tooltip ? 'tooltip' : ''),
        children: [typeof titleText[id].link === 'string' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
          href: titleText[id].link,
          target: "_blank",
          children: dot
        }) : dot, /*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
          className: "rcjspp-title rcjspp-title-major",
          children: titleText[id].tMajor
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
          className: "rcjspp-title rcjspp-title-minor",
          children: titleText[id].tMinor
        }), titleText[id].tooltip ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "popover",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            children: titleText[id].tooltip
          })
        }) : null]
      }, id);
      titleArray.push(theTitle);
    }
    var titleTextJSX = (0, _conjunctionJunction.isObjectLiteral)(titleText) ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "rcjspp-title-wrap-container",
      children: titleArray
    }) : null;
    return titleTextJSX;
  };

  // const graphTitle      = props.titleTextJSX ? props.titleTextJSX :
  //   typeof props.titleText === 'string' ?
  //   <h3 className={`rcjspp-title`}>{props.titleText}</h3> :
  //   <h3 className={`rcjspp-title`}>graph!</h3>

  var graphTitle = formatTitle(props.titleText, props.groupDotColors);
  var graphSubTitle = null; // <h3 className={`rcjspp-title rcjspp-subtitle`}>Displaying: ????</h3>

  var spinnerRight = !props.advanceAllow ? null : !props.waitingOnDataFromProps ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rcjspp-advance-waiting rcjspp-advance-waiting-right",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {})
  });
  var spinnerLeft = !props.retreatAllow ? null : !props.waitingOnDataFromProps ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rcjspp-advance-waiting rcjspp-advance-waiting-left",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {})
  });
  var hideAdvanceButtonClass = props.waitingOnDataFromProps ? 'transparent' : '';
  var win = typeof window !== 'undefined' ? window : {};
  var _calcMinimumWindowDim = (0, _browserHelpers.calcMinimumWindowDimensions)(win),
    cssWidthOuter = _calcMinimumWindowDim.cssWidthOuter;
  var popoverRightClass = cssWidthOuter > props.bp ? 'tooltip-bottom-right' : 'tooltip-bottom-left';
  var googleTagManagerClassLeft = 'rcjspp-event-button left true1 true2';
  var googleTagManagerClassRight = 'rcjspp-event-button right true1 true2';
  var buttonAdvanceLeft = props.retreatAllow ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-advance-button rcjspp-advance-button-left rcjspp-control tooltip tooltip-bottom-left ".concat(hideAdvanceButtonClass, " ").concat(googleTagManagerClassLeft),
    onClick: function onClick() {
      return props.graphAdvance(-1);
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "popover",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
        children: "retreat the graph to the prior event"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_somethingRatherIconic.CaretLeft, {
      style: {
        height: 36
      }
    })]
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rcjspp-advance-button rcjspp-control"
  });
  var buttonAdvanceRight = props.advanceAllow ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-advance-button rcjspp-advance-button-right rcjspp-control tooltip ".concat(popoverRightClass, " ").concat(hideAdvanceButtonClass, " ").concat(googleTagManagerClassRight),
    onClick: function onClick() {
      return props.graphAdvance(1);
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "popover",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
        children: "advance the graph to the next event"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_somethingRatherIconic.CaretRight, {
      style: {
        height: 36
      }
    })]
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rcjspp-advance-button rcjspp-control"
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-footer",
    style: props.cssDivFooter,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "rcjspp-footer-top",
      children: [buttonAdvanceLeft, spinnerLeft, graphTitle, graphSubTitle, spinnerRight, buttonAdvanceRight]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "rcjspp-footer-bottom",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
        className: "rcjspp-footer-description",
        children: "We used to allow a legend description here..."
      })
    })]
  });
}