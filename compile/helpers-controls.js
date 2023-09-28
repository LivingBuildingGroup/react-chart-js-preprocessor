"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatControlsTopAndBot = exports.formatControls = void 0;
var _conjunctionJunction = require("conjunction-junction");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var formatControlsTopAndBot = exports.formatControlsTopAndBot = function formatControlsTopAndBot(state, functionHash) {
  var controlsTop = [];
  var controlsBot = [];
  if (state.printAllow) {
    controlsTop.push({
      name: 'print',
      id: 'print',
      iconName: 'Print',
      func: functionHash.printGraph,
      label: 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).'
    });
  }
  if (state.backgroundAllow) {
    controlsTop.push({
      name: 'background',
      id: 'background',
      iconName: 'PaletteSolid',
      func: functionHash.handleBackgroundColor,
      label: 'Toggle between white and dark gray graph background.'
    });
  }
  if (state.yAxisAllow) {
    controlsTop.push({
      name: 'y-Axis',
      id: 'y-Axis',
      iconName: 'ArrowsAltV',
      func: functionHash.handleYAxisSelector,
      label: 'Toggle Y-Axis settings'
    });
  }
  if (state.selectorsAllow) {
    controlsBot.push({
      name: 'selector',
      id: 'selector',
      iconName: 'Edit',
      func: functionHash.toggleSelectorsPopover,
      label: 'Open graph customization options'
    });
  }
  return {
    controlsTop: controlsTop,
    controlsBot: controlsBot
  };
};
var formatControls = exports.formatControls = function formatControls(state, functionHash) {
  var _formatControlsTopAnd = formatControlsTopAndBot(state, functionHash),
    controlsTop = _formatControlsTopAnd.controlsTop,
    controlsBot = _formatControlsTopAnd.controlsBot;
  var presets = state.presets || {};
  var controlsPresets = [];
  var _loop = function _loop(id) {
    var thisPreset = presets[id];
    controlsPresets.push({
      name: thisPreset.name || 'pre-set',
      id: id,
      iconName: thisPreset.iconName || 'CoffeePot',
      func: function func() {
        return functionHash.handlePresetSelect(id);
      },
      label: thisPreset.namePreset || 'pre-set'
    });
  };
  for (var id in presets) {
    _loop(id);
  }
  controlsPresets.sort(function (a, b) {
    if (a.id > b.id) {
      return 1;
    }
    return -1;
  });
  var controls = [].concat(_toConsumableArray(controlsTop), controlsPresets, _toConsumableArray(controlsBot));
  return controls;
};