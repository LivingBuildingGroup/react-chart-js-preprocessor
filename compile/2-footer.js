"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Footer;
var _conjunctionJunction = require("conjunction-junction");
var _browserHelpers = require("browser-helpers");
var _somethingRatherIconic = require("something-rather-iconic");
function Footer(props) {
  var formatTitle = function formatTitle(titleText, groupDotColors) {
    // this is a method, vs helper function, ONLY because it uses JSX

    var titleArray = [];
    for (var id in titleText) {
      var dot = typeof groupDotColors[id] === 'string' ? /*#__PURE__*/React.createElement("div", {
        className: "rcjspp-title-color-dot",
        key: id,
        style: {
          backgroundColor: "rgb(".concat(groupDotColors[id], ")")
        }
      }) : null;
      var theTitle = /*#__PURE__*/React.createElement("div", {
        key: id,
        className: "rcjspp-title-inner-container ".concat(titleText[id].tooltip ? 'tooltip' : '')
      }, typeof titleText[id].link === 'string' ? /*#__PURE__*/React.createElement("a", {
        href: titleText[id].link,
        target: "_blank"
      }, dot) : dot, /*#__PURE__*/React.createElement("h3", {
        className: "rcjspp-title rcjspp-title-major"
      }, titleText[id].tMajor), /*#__PURE__*/React.createElement("h3", {
        className: "rcjspp-title rcjspp-title-minor"
      }, titleText[id].tMinor), titleText[id].tooltip ? /*#__PURE__*/React.createElement("div", {
        className: "popover"
      }, /*#__PURE__*/React.createElement("p", null, titleText[id].tooltip)) : null);
      titleArray.push(theTitle);
    }
    var titleTextJSX = (0, _conjunctionJunction.isObjectLiteral)(titleText) ? /*#__PURE__*/React.createElement("div", {
      className: "rcjspp-title-wrap-container"
    }, titleArray) : null;
    return titleTextJSX;
  };

  // const graphTitle      = props.titleTextJSX ? props.titleTextJSX :
  //   typeof props.titleText === 'string' ?
  //   <h3 className={`rcjspp-title`}>{props.titleText}</h3> :
  //   <h3 className={`rcjspp-title`}>graph!</h3>

  var graphTitle = formatTitle(props.titleText, props.groupDotColors);
  var graphSubTitle = null; // <h3 className={`rcjspp-title rcjspp-subtitle`}>Displaying: ????</h3>

  var spinnerRight = !props.advanceAllow ? null : !props.waitingOnDataFromProps ? null : /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-waiting rcjspp-advance-waiting-right"
  }, /*#__PURE__*/React.createElement("div", null));
  var spinnerLeft = !props.retreatAllow ? null : !props.waitingOnDataFromProps ? null : /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-waiting rcjspp-advance-waiting-left"
  }, /*#__PURE__*/React.createElement("div", null));
  var hideAdvanceButtonClass = props.waitingOnDataFromProps ? 'transparent' : '';
  var win = typeof window !== 'undefined' ? window : {};
  var _calcMinimumWindowDim = (0, _browserHelpers.calcMinimumWindowDimensions)(win),
    cssWidthOuter = _calcMinimumWindowDim.cssWidthOuter;
  var popoverRightClass = cssWidthOuter > props.bp ? 'tooltip-bottom-right' : 'tooltip-bottom-left';
  var googleTagManagerClassLeft = 'rcjspp-event-button left true1 true2';
  var googleTagManagerClassRight = 'rcjspp-event-button right true1 true2';
  var buttonAdvanceLeft = props.retreatAllow ? /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-button rcjspp-advance-button-left rcjspp-control tooltip tooltip-bottom-left ".concat(hideAdvanceButtonClass, " ").concat(googleTagManagerClassLeft),
    onClick: function onClick() {
      return props.graphAdvance(-1);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "popover"
  }, /*#__PURE__*/React.createElement("p", null, "retreat the graph to the prior event")), /*#__PURE__*/React.createElement(_somethingRatherIconic.CaretLeft, {
    style: {
      height: 36
    }
  })) : /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-button rcjspp-control"
  });
  var buttonAdvanceRight = props.advanceAllow ? /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-button rcjspp-advance-button-right rcjspp-control tooltip ".concat(popoverRightClass, " ").concat(hideAdvanceButtonClass, " ").concat(googleTagManagerClassRight),
    onClick: function onClick() {
      return props.graphAdvance(1);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "popover"
  }, /*#__PURE__*/React.createElement("p", null, "advance the graph to the next event")), /*#__PURE__*/React.createElement(_somethingRatherIconic.CaretRight, {
    style: {
      height: 36
    }
  })) : /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-advance-button rcjspp-control"
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-footer",
    style: props.cssDivFooter
  }, /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-footer-top"
  }, buttonAdvanceLeft, spinnerLeft, graphTitle, graphSubTitle, spinnerRight, buttonAdvanceRight), /*#__PURE__*/React.createElement("div", {
    className: "rcjspp-footer-bottom"
  }, /*#__PURE__*/React.createElement("p", {
    className: "rcjspp-footer-description"
  }, "We used to allow a legend description here...")));
}