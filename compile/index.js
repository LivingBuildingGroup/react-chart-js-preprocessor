"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RCJSPP;
var _react = _interopRequireWildcard(require("react"));
var _reactChartjs = require("react-chartjs-2");
var _conjunctionJunction = require("conjunction-junction");
var _browserHelpers = require("browser-helpers");
var _prettyColors = require("pretty-colors");
var _helpersPresetExtract = require("./helpers-preset-extract");
var _helpersLayers = require("./helpers-layers");
var _helpersGraphs = require("./helpers-graphs");
var _helpersDeveloperWarnings = require("./helpers-developer-warnings");
var _helpersControls = require("./helpers-controls");
var _controls = _interopRequireDefault(require("./2-controls"));
var _footer = _interopRequireDefault(require("./2-footer"));
var _selectors = _interopRequireDefault(require("./3-selectors"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var indexAbbrev = 0;
var indexLabels = 1;
var indexUnits = 2;
var indexDef = 3;
var deepCopy = function deepCopy(o) {
  if (Array.isArray(o)) {
    return o.map(function (x) {
      return deepCopy(x);
    });
  }
  if ((0, _conjunctionJunction.isObjectLiteral)(o)) {
    var newO = {};
    for (var k in o) {
      newO[k] = deepCopy(o[k]);
    }
    return newO;
  }
  return o;
};
function RCJSPP(props) {
  // @@@@@@@@@@@@@@ STATE CONSTANTS @@@@@@@@@@@@@@@@
  var verbose = !!props.verbose;
  var _useState = (0, _react.useState)(props.legendHash || {}),
    _useState2 = _slicedToArray(_useState, 2),
    legendHash = _useState2[0],
    setLegendHash = _useState2[1];
  var _useState3 = (0, _react.useState)(props.legendDescription || ''),
    _useState4 = _slicedToArray(_useState3, 2),
    legendDescription = _useState4[0],
    setLegendDescription = _useState4[1];
  var _useState5 = (0, _react.useState)({
      selectorsAllow: typeof props.selectorsAllow === 'boolean' ? props.selectorsAllow : true,
      printAllow: typeof props.printAllow === 'boolean' ? props.printAllow : true,
      backgroundAllow: typeof props.backgroundAllow === 'boolean' ? props.backgroundAllow : true,
      advanceAllow: typeof props.advanceAllow === 'boolean' ? props.advanceAllow : false,
      retreatAllow: typeof props.retreatAllow === 'boolean' ? props.retreatAllow : false,
      yAxisAllow: typeof props.yAxisAllow === 'boolean' ? props.yAxisAllow : true,
      groupAllow: typeof props.groupAllow === 'boolean' ? props.groupAllow : false,
      allowNewDataAsProps: props.allowNewDataAsProps,
      footerInclude: typeof props.footerInclude === 'boolean' ? props.footerInclude : true,
      selectorsInclude: typeof props.selectorsInclude === 'boolean' ? props.selectorsInclude : true
    }),
    _useState6 = _slicedToArray(_useState5, 1),
    allowed = _useState6[0];

  // @@@@@@@@@@@ STATE STATUS @@@@@@@@@@@@@@@@

  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    waitingOnDataFromProps = _useState8[0],
    setWaitingOnDataFromProps = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    hasMounted = _useState10[0],
    setHasMounted = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isHidden = _useState12[0],
    setIsHidden = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    isReady = _useState14[0],
    setIsReady = _useState14[1];

  // @@@@@@@@@@@ STATE / NON-GRAPH @@@@@@@@@@@@@@@@

  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    selectorsPopover = _useState16[0],
    setSelectorsPopover = _useState16[1];
  var _useState17 = (0, _react.useState)('none'),
    _useState18 = _slicedToArray(_useState17, 2),
    selectorsInFocus = _useState18[0],
    setSelectorsInFocus = _useState18[1];
  var _useState19 = (0, _react.useState)({
      cssStyleColorsNamedArray: [],
      cssStyleColorsNamed: props.cssStyleColorsNamed || (0, _prettyColors.createNamed)('bright'),
      cssRgbArray: props.cssRgbArray || (0, _prettyColors.selectPalette)(30),
      // array of styles to loop through//  VVVVVVVVVVV edit location per project VVVVVVVVVVV

      cssDivOuter: {},
      cssDivGraph: {},
      cssDivControls: {},
      cssDivFooter: {},
      cssDivSelectors: {},
      cssWidthOuter: (0, _conjunctionJunction.isPrimitiveNumber)(props.cssWidthOuter) ? props.cssWidthOuter : 200,
      cssHeightOuter: (0, _conjunctionJunction.isPrimitiveNumber)(props.cssHeightOuter) ? props.cssHeightOuter : 150,
      cssWidthControls: (0, _conjunctionJunction.isPrimitiveNumber)(props.cssWidthControls) ? props.cssWidthControls : 40,
      cssHeightFooter: (0, _conjunctionJunction.isPrimitiveNumber)(props.cssHeightFooter) ? props.cssHeightFooter : 160,
      cssHeightSelectors: (0, _conjunctionJunction.isPrimitiveNumber)(props.cssHeightSelectors) ? props.cssHeightSelectors : 'auto',
      cssCanvasHeight: 0,
      cssCanvasWidth: 0
    }),
    _useState20 = _slicedToArray(_useState19, 2),
    css = _useState20[0],
    setCss = _useState20[1];

  // @@@@@@@@@@@@@@ STATE: GRAPH @@@@@@@@@@@@@@@@

  var _useState21 = (0, _react.useState)(props.presets || {}),
    _useState22 = _slicedToArray(_useState21, 1),
    presets = _useState22[0];
  var _useState23 = (0, _react.useState)(props.cssBackground || 'gray'),
    _useState24 = _slicedToArray(_useState23, 2),
    cssBackground = _useState24[0],
    setCssBackground = _useState24[1];

  // keys mostly just initialized data types, see componentDidMount() for initialization
  var _useState25 = (0, _react.useState)([]),
    _useState26 = _slicedToArray(_useState25, 2),
    layersAllPrefixed = _useState26[0],
    setLayersAllPrefixed = _useState26[1];
  var _useState27 = (0, _react.useState)([]),
    _useState28 = _slicedToArray(_useState27, 2),
    layerUnitsArray = _useState28[0],
    setLayerUnitsArray = _useState28[1];
  var _useState29 = (0, _react.useState)([[]]),
    _useState30 = _slicedToArray(_useState29, 2),
    layersGroupedByUnits = _useState30[0],
    setLayersGroupedByUnits = _useState30[1];
  var _useState31 = (0, _react.useState)([]),
    _useState32 = _slicedToArray(_useState31, 2),
    layersThatHaveUnits = _useState32[0],
    setLayersThatHaveUnits = _useState32[1];
  var _useState33 = (0, _react.useState)(Array.isArray(props.layersSelected) ? props.layersSelected : []),
    _useState34 = _slicedToArray(_useState33, 2),
    layersSelected = _useState34[0],
    setLayersSelected = _useState34[1]; // use as many keys as desired

  var _useState35 = (0, _react.useState)({}),
    _useState36 = _slicedToArray(_useState35, 2),
    graphData = _useState36[0],
    setGraphData = _useState36[1]; // pass as props to graph
  var _useState37 = (0, _react.useState)({
      // pass as props to graph
      scales: {
        yAxes: []
      }
    }),
    _useState38 = _slicedToArray(_useState37, 2),
    graphOptions = _useState38[0],
    setGraphOptions = _useState38[1];
  // data
  var _useState39 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.dataType) ? props.dataType : 1),
    _useState40 = _slicedToArray(_useState39, 2),
    dataType = _useState40[0],
    setDataType = _useState40[1];
  var _useState41 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.dataConvertFrom) ? props.dataConvertFrom : 1),
    _useState42 = _slicedToArray(_useState41, 2),
    dataConvertFrom = _useState42[0],
    setDataConvertFrom = _useState42[1]; // convert from what to 1
  var _useState43 = (0, _react.useState)(Array.isArray(props.dataType1) ? props.dataType1 : []),
    _useState44 = _slicedToArray(_useState43, 2),
    dataType1Raw = _useState44[0],
    setDataType1Raw = _useState44[1];
  var _useState45 = (0, _react.useState)(Array.isArray(props.dataType1) ? props.dataType1.map(function (d) {
      return Object.assign({}, d);
    }) : []),
    _useState46 = _slicedToArray(_useState45, 2),
    dataType1 = _useState46[0],
    setDataType1 = _useState46[1];
  var _useState47 = (0, _react.useState)(Array.isArray(props.dataType2) ? props.dataType2 : [[]]),
    _useState48 = _slicedToArray(_useState47, 2),
    dataType2Raw = _useState48[0],
    setDataType2Raw = _useState48[1];
  var _useState49 = (0, _react.useState)(props.titleText || 'data'),
    _useState50 = _slicedToArray(_useState49, 2),
    titleText = _useState50[0],
    setTitleText = _useState50[1];
  var _useState51 = (0, _react.useState)({}),
    _useState52 = _slicedToArray(_useState51, 2),
    styles = _useState52[0],
    setStyles = _useState52[1]; // populated on presetSelect

  var _useState53 = (0, _react.useState)(props.groupColors || {}),
    _useState54 = _slicedToArray(_useState53, 2),
    groupColors = _useState54[0],
    setGroupColors = _useState54[1];
  var _useState55 = (0, _react.useState)({}),
    _useState56 = _slicedToArray(_useState55, 2),
    groupDotColors = _useState56[0],
    setGroupDotColors = _useState56[1];
  var _useState57 = (0, _react.useState)(typeof props.isGrouped === 'boolean' ? props.isGrouped : false),
    _useState58 = _slicedToArray(_useState57, 2),
    isGrouped = _useState58[0],
    setIsGrouped = _useState58[1];
  var _useState59 = (0, _react.useState)(props.groupByOnMount),
    _useState60 = _slicedToArray(_useState59, 1),
    groupByOnMount = _useState60[0];
  var _useState61 = (0, _react.useState)(props.groupsSub),
    _useState62 = _slicedToArray(_useState61, 2),
    groupsSub = _useState62[0],
    setGroupsSub = _useState62[1];
  var _useState63 = (0, _react.useState)([]),
    _useState64 = _slicedToArray(_useState63, 2),
    groups = _useState64[0],
    setGroups = _useState64[1];
  var _useState65 = (0, _react.useState)([]),
    _useState66 = _slicedToArray(_useState65, 2),
    presetGlobalPalettes = _useState66[0],
    setPresetGlobalPalettes = _useState66[1];
  var _useState67 = (0, _react.useState)(''),
    _useState68 = _slicedToArray(_useState67, 2),
    presetGlobalPalette = _useState68[0],
    setPresetGlobalPalette = _useState68[1];
  var _useState69 = (0, _react.useState)([]),
    _useState70 = _slicedToArray(_useState69, 2),
    presetGlobalColorOptions = _useState70[0],
    setPresetGlobalColorOptions = _useState70[1];
  var _useState71 = (0, _react.useState)(props.presetIdActive || ''),
    _useState72 = _slicedToArray(_useState71, 2),
    presetIdActive = _useState72[0],
    setPresetIdActive = _useState72[1];
  var _useState73 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.xStart) ? props.xStart : 0),
    _useState74 = _slicedToArray(_useState73, 2),
    xStart = _useState74[0],
    setXStart = _useState74[1];
  var _useState75 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.xEnd) ? props.xEnd : 1000),
    _useState76 = _slicedToArray(_useState75, 2),
    xEnd = _useState76[0],
    setXEnd = _useState76[1];
  var _useState77 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.xIdealTickSpacing) ? props.xIdealTickSpacing : 6),
    _useState78 = _slicedToArray(_useState77, 2),
    xIdealTickSpacing = _useState78[0],
    setXIdealTickSpacing = _useState78[1];
  var _useState79 = (0, _react.useState)((0, _conjunctionJunction.isPrimitiveNumber)(props.xMaxTickSpacing) ? props.xMaxTickSpacing : 50),
    _useState80 = _slicedToArray(_useState79, 2),
    xMaxTickSpacing = _useState80[0],
    setXMaxTickSpacing = _useState80[1];
  var _useState81 = (0, _react.useState)(props.xLabelKey || null),
    _useState82 = _slicedToArray(_useState81, 2),
    xLabelKey = _useState82[0],
    setXLabelKey = _useState82[1];
  var _useState83 = (0, _react.useState)(props.xLabel),
    _useState84 = _slicedToArray(_useState83, 2),
    xLabel = _useState84[0],
    setXLabel = _useState84[1];
  var _useState85 = (0, _react.useState)([]),
    _useState86 = _slicedToArray(_useState85, 2),
    yAxisArray = _useState86[0],
    setYAxisArray = _useState86[1]; // used as history in createGraph()
  var _useState87 = (0, _react.useState)(Array.isArray(props.yAxisUnitOptions) && props.yAxisUnitOptions[0] ? props.yAxisUnitOptions[0] : {}),
    _useState88 = _slicedToArray(_useState87, 2),
    yAxisUnitOptions = _useState88[0],
    setYAxisUnitOptions = _useState88[1];
  var _useState89 = (0, _react.useState)(0),
    _useState90 = _slicedToArray(_useState89, 2),
    yAxisInFocus = _useState90[0],
    setYAxisInFocus = _useState90[1];
  var packGraphState = function packGraphState(gs, full) {
    var graphState = {
      // modified via          used by
      layersAllPrefixed: layersAllPrefixed,
      // handleGroupBy         unpackPreset
      // createGraphInfoOnGroupOrMount
      layerUnitsArray: layerUnitsArray,
      // handleGroupBy         
      // createGraphInfoOnGroupOrMount
      layersGroupedByUnits: layersGroupedByUnits,
      // handleGroupBy         
      // createGraphInfoOnGroupOrMount
      layersThatHaveUnits: layersThatHaveUnits,
      // handleGroupBy         
      // createGraphInfoOnGroupOrMount
      layersSelected: layersSelected,
      // handlePresetSelect,   createLayersSelectedByGroup, createGraph
      // toggleLayerGroup,     createLayersSelectedWithOneLayerFlipped
      // handleLayerSelection  

      dataType: dataType,
      // handleGroupBy
      // createGraphInfoOnGroupOrMount
      dataConvertFrom: dataConvertFrom,
      // handleGroupBy
      dataType1Raw: dataType1Raw,
      // updateDataFromProps   createGraphInfoOnGroupOrMount
      dataType1: dataType1,
      // updateDataFromProps   createGraph
      // handleGroupBy,        
      // updateDataFromProps
      // createGraphInfoOnGroupOrMount
      dataType2Raw: dataType2Raw,
      // handleGroupBy
      // createGraphInfoOnGroupOrMount
      groupColors: groupColors,
      // handlePresetSelect    unpackPreset, 
      groupDotColors: groupDotColors,
      // handlePresetSelect                  
      isGrouped: isGrouped,
      // handleGroupBy         unpackPreset
      groupByOnMount: groupByOnMount,
      // NONE                  createGraphInfoOnGroupOrMount
      // groupByNow:           // handleGroupBy         createGraphInfoOnGroupOrMount
      groupsSub: groupsSub,
      // NONE                  unpackPreset
      groups: groups,
      // handleGroupBy         unpackPreset
      presetGlobalPalettes: presetGlobalPalettes,
      // NONE                  unpackPreset
      presetGlobalPalette: presetGlobalPalette,
      // NONE
      presetGlobalColorOptions: presetGlobalColorOptions,
      // NONE                  unpackPreset
      presetIdActive: presetIdActive,
      // handlePresetSelect    
      styles: styles,
      // handlePresetSelect    createGraph
      // prefixesToKeepGroups,    // handlePresetSelect    
      // prefixesToKeepGroupsSub, // handlePresetSelect    
      xStart: xStart,
      // handleRangeChange     createGraph
      xEnd: xEnd,
      // handleRangeChange     createGraph
      xIdealTickSpacing: xIdealTickSpacing,
      // handleTickChange      createGraph
      xLabelKey: xLabelKey,
      // NONE									createGraph
      xLabel: xLabel,
      // NONE									createGraph
      yAxisArray: yAxisArray,
      // handleGraphChange
      yAxisUnitOptions: yAxisUnitOptions,
      // handleYAxisSelector   createGraph
      yAxisInFocus: yAxisInFocus,
      // handleYAxisSelector
      legendHash: legendHash,
      // handleGroupBy         createGraph
      // createGraphInfoOnGroupOrMount
      cssBackground: cssBackground,
      // handleBackgroundColor createGraph
      cssStyleColorsNamed: css.cssStyleColorsNamed,
      // NONE                  createGraph
      cssRgbArray: css.cssRgbArray
      // NONE                  createGraph
    };

    if (full) {
      graphState.allowed = allowed;
      graphState.waitingOnDataFromProps = waitingOnDataFromProps;
      graphState.hasMounted = hasMounted;
      graphState.isHidden = isHidden;
      graphState.isReady = isReady;
      graphState.selectorsPopover = selectorsPopover;
      graphState.selectorsInFocus = selectorsInFocus;
      graphState.titleText = titleText;
      graphState.css = css;
      graphState.graphData = graphData;
      graphState.graphOptions = graphOptions;
    }
    if ((0, _conjunctionJunction.isObjectLiteral)(gs)) {
      for (var k in gs) {
        graphState[k] = gs[k];
      }
    }
    return graphState;
  };

  // @@@@@@@@@@@@@@@@@@ END STATE @@@@@@@@@@@@@@@@

  (0, _react.useEffect)(function () {
    if (!hasMounted) {
      if (typeof props.onMount === 'function') {
        props.onMount();
      }
      if (props.developerWarnings) {
        (0, _helpersDeveloperWarnings.consoleDeveloperWarnings)(props);
      }

      // CSS ok to populate like this b/c
      // on mount gets only primitives
      // updating here gets objects & arrays
      var dimensions = (0, _browserHelpers.calcDimensions)(css);
      var newCss = _objectSpread(_objectSpread({}, css), dimensions);
      setCss(newCss); // end CSS populate

      setSelectorsInFocus(!allowed.selectorsAllow ? 'none' :
      // set on mount, does not change
      props.selectorsInFocus ? props.selectorsInFocus : 'layers');
      var graphState = packGraphState();
      graphState.presetIdActive = presets && presets[props.presetIdActive] ? props.presetIdActive : (0, _helpersPresetExtract.selectDefaultPreset)(presets);
      setPresetIdActive(graphState.presetIdActive);

      // options and pallettes are necessary for tests, even when editing is not allowed
      // all these are necessary for editing
      graphState.presetGlobalColorOptions = (0, _prettyColors.listBright)();
      graphState.presetGlobalPalettes = (0, _prettyColors.createPresetGlobalPalettes)();
      graphState.presetGlobalPalette = graphState.presetGlobalPalettes[graphState.presetGlobalColorOptions[0]];
      setPresetGlobalColorOptions(graphState.presetGlobalColorOptions);
      setPresetGlobalPalettes(graphState.presetGlobalPalettes);
      setPresetGlobalPalette(graphState.presetGlobalPalette);
      var graphInfo = (0, _helpersGraphs.createGraphInfoOnGroupOrMount)(graphState, legendHash, indexUnits);
      graphState.verbose = verbose;
      graphState.layersThatHaveUnits = graphInfo.layersThatHaveUnits;
      graphState.layersAllPrefixed = graphInfo.layersAllPrefixed;
      graphState.layersGroupedByUnits = graphInfo.layersGroupedByUnits;
      graphState.layerUnitsArray = graphInfo.layerUnitsArray;
      graphState.dataType = graphInfo.dataType;
      graphState.dataType1 = graphInfo.dataType1;
      setLayersThatHaveUnits(graphInfo.layersThatHaveUnits);
      setLayersAllPrefixed(graphInfo.layersAllPrefixed);
      setLayersGroupedByUnits(graphInfo.layersGroupedByUnits);
      setLayerUnitsArray(graphInfo.layerUnitsArray);
      setDataType(graphInfo.dataType);
      setDataType1(graphInfo.dataType1);
      setLegendHash(graphInfo.legendHash);
      var skipPacking = true;
      handlePresetSelect(graphState.presetIdActive, graphState, skipPacking);
      setHasMounted(true);
      setIsReady(true);
    }
  }, [hasMounted]);

  // @@@@@@@@@@@@@@@@@@ MAJOR RENDERING @@@@@@@@@@@@@@@@

  var handleGraphChange = function handleGraphChange(gs, skipPacking) {
    // graphState is OK to mutate
    // graphState NEVER affects state (in hooks)
    // graphState is ONLY sent to functional helpers to create objects
    // those objects or keys from those objects are then sent to state
    // if you want to change state to match graphState, you MUST set each individual key before sending here
    // sending here only affects the graph output, but does not update user input, which can lead to bugginess if you do not set state BEFORE sending here!
    var graphState = skipPacking ? gs : packGraphState(gs);
    // createGraph consumes newGs (partial state, what changes only)
    // and graphState (what already exists)
    // then merges those into a new graphState
    var theGraph = (0, _helpersGraphs.createGraph)(graphState);
    setGraphData(theGraph.graphData);
    setGraphOptions(theGraph.graphOptions);
    setYAxisArray(theGraph.yAxisArray);
    setIsReady(true);
    if (theGraph.needsRefresh) {
      setTimeout(function () {
        setIsHidden(true);
      }, 300);
      setTimeout(function () {
        setIsHidden(false);
      }, 400);
    }
  };
  var handlePresetSelect = function handlePresetSelect(presetId, gs, _skipPacking) {
    var graphState = !(0, _conjunctionJunction.isObjectLiteral)(gs) ? packGraphState() : _skipPacking ? gs : packGraphState(gs);
    var thisPreset = presets ? presets[presetId] : null;
    if (!(0, _conjunctionJunction.isObjectLiteral)(thisPreset)) {
      return;
    }
    var unpackedPreset = (0, _helpersPresetExtract.unpackPreset)(graphState, thisPreset, presetId);
    graphState.groupColors = unpackedPreset.groupColors;
    graphState.groupDotColors = unpackedPreset.groupDotColors;
    graphState.presetIdActive = unpackedPreset.presetIdActive;
    graphState.styles = unpackedPreset.styles;
    graphState.layersSelected = unpackedPreset.layersSelected;
    setGroupColors(unpackedPreset.groupColors);
    setGroupDotColors(unpackedPreset.groupDotColors);
    setPresetIdActive(unpackedPreset.presetIdActive);
    setStyles(unpackedPreset.styles);
    setLayersSelected(unpackedPreset.layersSelected);
    // graphState.prefixesToKeepGroups    = unpackedPreset.prefixesToKeepGroups;
    // graphState.prefixesToKeepGroupsSub = unpackedPreset.prefixesToKeepGroupsSub;
    // setPrefixesToKeepGroups(unpackedPreset.prefixesToKeepGroups);
    // setPrefixesToKeepGroupsSub(unpackedPreset.prefixesToKeepGroupsSub);
    var skipPacking = true; // always b/c packed above
    handleGraphChange(graphState, skipPacking);
  };

  // @@@@@@@@@@@@ CHANGE GRAPH: LAYERS @@@@@@@@@@@@@@

  var handleLayerSelection = function handleLayerSelection(event, gs, _skipPacking) {
    var graphState = !(0, _conjunctionJunction.isObjectLiteral)(gs) ? packGraphState() : _skipPacking ? gs : packGraphState(gs);
    var layerSelected = (0, _conjunctionJunction.parseEvent)(event);
    if (!layerSelected) {
      return;
    }
    console.log({
      layerSelected: layerSelected
    });
    // createLayersSelectedWithOneLayerFlipped returns layersSelected with the first argument flipped
    // i.e. if first argument already selected, removes,
    // if first argument not selected, adds
    var _layersSelected = (0, _helpersLayers.createLayersSelectedWithOneLayerFlipped)(layerSelected, layersSelected);
    graphState.layersSelected = _layersSelected;
    setLayersSelected(_layersSelected);
    var skipPacking = true; // always b/c packed above
    handleGraphChange(graphState, skipPacking);
  };
  var toggleLayerGroup = function toggleLayerGroup(group) {
    if (!(0, _conjunctionJunction.isObjectLiteral)(layersGroupedByUnits)) {
      return;
    }
    var theGroup = layersGroupedByUnits[group];
    if (!Array.isArray(theGroup)) {
      return;
    }
    var _layersSelected = (0, _helpersLayers.createLayersSelectedByGroup)(layersSelected, theGroup);
    setLayersSelected(_layersSelected);
    var graphState = packGraphState({
      layersSelected: _layersSelected
    });
    var skipPacking = true;
    handleGraphChange(graphState, skipPacking);
  };

  // @@@@@@@@@@@@@@@@@@ CHANGE GRAPH: AXES @@@@@@@@@@@@@@@@

  var handleRangeChange = function handleRangeChange(event, key) {
    var value = parseInt(event.target.value, 10);
    if (key === 'xStart' || key === 'xEnd') {
      var graphState = packGraphState(_defineProperty({}, key, value));
      if (key === 'xStart') {
        setXStart(value);
      } else {
        setXEnd(value);
      }
      var skipPacking = true;
      handleGraphChange(graphState, skipPacking);
    }
  };
  var handleTickChange = function handleTickChange(event) {
    var rawValue = parseInt(event.target.value, 10);
    var value = !(0, _conjunctionJunction.isPrimitiveNumber)(rawValue) ? 6 : rawValue < 1 ? 1 : rawValue > xMaxTickSpacing ? xMaxTickSpacing : rawValue;
    var graphState = packGraphState({
      xIdealTickSpacing: value
    });
    setXIdealTickSpacing(value);
    var skipPacking = true;
    handleGraphChange(graphState, skipPacking);
  };
  var handleYAxisSelector = function handleYAxisSelector() {
    var yAxesLength = Array.isArray(props.yAxisUnitOptions) ? props.yAxisUnitOptions.length : 0;
    var _yAxisInFocus = (0, _conjunctionJunction.isPrimitiveNumber)(yAxisInFocus) && yAxisInFocus + 1 <= yAxesLength - 1 ? yAxisInFocus + 1 : 0;
    setYAxisInFocus(_yAxisInFocus);
    var _yAxisUnitOptions = Array.isArray(props.yAxisUnitOptions) ? props.yAxisUnitOptions[yAxisInFocus] : {};
    setYAxisUnitOptions(_yAxisUnitOptions);
    var graphState = packGraphState({
      yAxisInFocus: _yAxisInFocus,
      yAxisUnitOptions: _yAxisUnitOptions
    });
    handleGraphChange(graphState, true);
  };

  // @@@@@@@@@@@@@ CHANGE GRAPH: GROUPING @@@@@@@@@@@@@@@@

  var handleGroupBy = function handleGroupBy(event) {
    // handleGroupBy should ONLY run from subcomponents
    // convert data type 1 to type 2
    var _groupByNow = (0, _conjunctionJunction.parseEvent)(event);
    if (!_groupByNow) {
      return;
    }
    var graphState = packGraphState();
    graphState.groupByNow = _groupByNow;
    var graphInfo = (0, _helpersGraphs.createGraphInfoOnGroupOrMount)(graphState, legendHash);
    graphState.dataType = graphInfo.dataType;
    graphState.dataType1 = graphInfo.dataType1;
    graphState.layersThatHaveUnits = graphInfo.layersThatHaveUnits;
    graphState.layersAllPrefixed = graphInfo.layersAllPrefixed;
    graphState.layersGroupedByUnits = graphInfo.layersGroupedByUnits;
    graphState.layerUnitsArray = graphInfo.layerUnitsArray;
    setDataType(graphInfo.dataType);
    setDataType1(graphInfo.dataType1);
    setLayersThatHaveUnits(graphInfo.layersThatHaveUnits);
    setLayersAllPrefixed(graphInfo.layersAllPrefixed);
    setLayersGroupedByUnits(graphInfo.layersGroupedByUnits);
    setLayerUnitsArray(graphInfo.layerUnitsArray);
    setLegendHash(graphInfo.legendHash);
  };

  // @@@@@@@@@@@ FUNCTIONS THAT DEAL WITH NEW PROPS @@@@@@@@@@@

  var updateDataFromProps = function updateDataFromProps() {
    var dataType1Old = Array.isArray(dataType1Raw) ? dataType1Raw : [];
    var dataType1New = Array.isArray(props.dataType1) ? props.dataType1 : [];
    var extendedLength = dataType1New.length - dataType1Old.length;
    if (extendedLength > 0) {
      var dataToAdd = dataType1New.slice(dataType1New.length - newIsLonger, dataType1New.length);
      dataType1New = [].concat(_toConsumableArray(dataType1New), _toConsumableArray(dataToAdd));
      var _dataType1Raw = dataType1New.map(function (d) {
        return Object.assign({}, d);
      });
      var graphState = packGraphState({
        dataType1: dataType1New,
        dataType1Raw: _dataType1Raw
      });
      setDataType1(dataType1New);
      setDataType1Raw(_dataType1Raw);
      var skipPacking = true;
      handleGraphChange(graphState, skipPacking);
    }
  };
  var advanceDataFromProps = function advanceDataFromProps() {
    if (waitingOnDataFromProps && props.keyToCompareOnAdvance && Array.isArray(props.dataType1) && Array.isArray(dataType1Raw) && (0, _conjunctionJunction.isObjectLiteral)(props.dataType1[0]) && (0, _conjunctionJunction.isObjectLiteral)(dataType1Raw[0]) && props.dataType1[0][props.keyToCompareOnAdvance] !== dataType1Raw[0][props.keyToCompareOnAdvance]) {
      var graphState = packGraphState({
        legendHash: props.legendHash,
        titleText: props.titleText,
        dataType1Raw: props.dataType1
      });
      setTitleText(props.titleText);
      setDataType1Raw(props.dataType1);
      if (graphState.groupByOnMount) {
        var graphInfo = (0, _helpersGraphs.createGraphInfoOnGroupOrMount)(graphState, legendHash);
        graphState.layersThatHaveUnits = graphInfo.layersThatHaveUnits;
        graphState.layersAllPrefixed = graphInfo.layersAllPrefixed;
        graphState.layersGroupedByUnits = graphInfo.layersGroupedByUnits;
        graphState.layerUnitsArray = graphInfo.layerUnitsArray;
        graphState.dataType1 = graphInfo.dataType1;
        setLayersThatHaveUnits(graphInfo.layersThatHaveUnits);
        setLayersAllPrefixed(graphInfo.layersAllPrefixed);
        setLayersGroupedByUnits(graphInfo.layersGroupedByUnits);
        setLayerUnitsArray(graphInfo.layerUnitsArray);
        setDataType1(graphInfo.dataType1);
        setLegendHash(graphInfo.legendHash);
      }
      setWaitingOnDataFromProps(false);
      var skipPacking = true;
      handleGraphChange(graphState, skipPacking);
    }
  };
  var graphAdvance = function graphAdvance(advanceBy) {
    if (typeof props.handleFetchAdvanceRequest === 'function') {
      setWaitingOnDataFromProps(true);
      // the timeout is because the spinner doesn't load instantly
      props.handleFetchAdvanceRequest(advanceBy);
    } else {
      console.warn('handleFetchAdvanceRequest is not a function');
    }
  };
  (0, _react.useEffect)(function () {
    if (waitingOnDataFromProps) {
      advanceDataFromProps();
    } else if (allowed.allowNewDataAsProps) {
      if (dataType1Raw !== props.dataType1) {
        updateDataFromProps();
      }
    }
  });

  // @@@@@@@@@@@@@@@@@@ SELECTORS @@@@@@@@@@@@@@@@

  var toggleSelectorsPopover = function toggleSelectorsPopover() {
    setSelectorsPopover(!selectorsPopover);
  };
  var toggleSelectorsInFocus = function toggleSelectorsInFocus(focus) {
    setSelectorsInFocus(focus || 'none');
  };

  // @@@@@@@@@@@@@@@@@ MINOR CONTROLS @@@@@@@@@@@@@@@@

  var handleBackgroundColor = function handleBackgroundColor(color) {
    // toggle background between white and black, graph font color is opposite
    // hides then shows graph to force a re-render of the canvas
    var _cssBackground = color === 'white' ? 'white' : color === 'gray' ? 'gray' : cssBackground === 'white' ? 'gray' : 'white';
    setCssBackground(_cssBackground);
    if (typeof props.handleBackgroundColor === 'function') {
      props.handleBackgroundColor(_cssBackground);
    } else {
      console.warn('handleBackgroundColor is not a function');
    }
  };
  var printGraph = function printGraph() {
    if (css.cssBackground === 'white') {
      // if already white, print, else, turn white, wait, then print
      window.print();
    } else {
      handleBackgroundColor('white');
      setTimeout(function () {
        window.print();
      }, 2000); // 2000 seems to be long enough to complete canvas animations before printing
    }
  };

  var _useState91 = (0, _react.useState)((0, _helpersControls.formatControls)({
      printAllow: allowed.printAllow,
      // all below are set on mount, not changed after
      backgroundAllow: allowed.backgroundAllow,
      yAxisAllow: allowed.yAxisAllow,
      selectorsAllow: allowed.selectorsAllow,
      presets: props.presets
    }, {
      printGraph: printGraph,
      handleBackgroundColor: handleBackgroundColor,
      handleYAxisSelector: handleYAxisSelector,
      toggleSelectorsPopover: toggleSelectorsPopover,
      handlePresetSelect: handlePresetSelect
    })),
    _useState92 = _slicedToArray(_useState91, 2),
    controls = _useState92[0],
    setControls = _useState92[1];

  // @@@@@@@@@@@@@@@@@@ RENDER @@@@@@@@@@@@@@@@

  var footerFontColor = cssBackground === 'white' ? '#333' : 'white';
  var bp = 500; // breakpoint

  var spinnerMargin = 80;
  var spinnerSize = Math.random() * 20 + 40;
  var spinnerColorIndex = Math.floor(Math.random() * 5);
  var spinnerColors = ['red', 'yellow', 'pink', 'green', 'purple', 'blue'];
  var spinnerColor = spinnerColors[spinnerColorIndex] || 'white';
  var controlsElement = /*#__PURE__*/(0, _jsxRuntime.jsx)(_controls["default"], {
    controls: controls,
    cssBackground: cssBackground,
    presets: presets,
    presetIdActive: presetIdActive,
    selectorsPopover: selectorsPopover,
    toggleSelectorsInFocus: toggleSelectorsInFocus
  });
  var graph = isReady && !isHidden ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactChartjs.Line, {
    data: graphData,
    options: graphOptions,
    height: css.cssCanvasHeight,
    width: css.cssCanvasWidth
  }) : null;
  var selectors = allowed.selectorsInclude ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_selectors["default"], {
    cssDivSelectors: css.cssDivSelectors,
    cssStyleColorsNamed: css.cssStyleColorsNamed,
    legendHash: legendHash,
    indexDef: indexDef,
    selectorsInFocus: selectorsInFocus,
    groupAllow: allowed.groupAllow,
    isGrouped: isGrouped,
    xStart: xStart,
    xEnd: xEnd,
    xIdealTickSpacing: xIdealTickSpacing,
    layersThatHaveUnits: layersThatHaveUnits,
    layersSelected: layersSelected,
    layerUnitsArray: layerUnitsArray,
    layersGroupedByUnits: layersGroupedByUnits,
    indexAbbrev: indexAbbrev,
    toggleLayerGroup: toggleLayerGroup,
    handleRangeChange: handleRangeChange,
    handleTickChange: handleTickChange,
    handleGroupBy: handleGroupBy,
    handleLayerSelection: handleLayerSelection
  }) : null;
  var footer = allowed.footerInclude ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_footer["default"], {
    cssDivFooter: css.cssDivFooter,
    waitingOnDataFromProps: waitingOnDataFromProps,
    bp: bp,
    advanceAllow: allowed.advanceAllow,
    retreatAllow: allowed.retreatAllow,
    groupDotColors: groupDotColors,
    titleText: titleText,
    legendDescription: legendDescription,
    graphAdvance: graphAdvance
  }) : null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rcjspp-outer",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "rcjspp-inner",
      style: css.cssDivInner,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "rcjspp-graph",
        style: css.cssDivGraph,
        children: graph
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "rcjspp-controls",
        style: css.cssDivControls,
        children: controlsElement
      })]
    }), footer, selectors, /*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
      children: "\n\t\t\t.rcjspp-outer {\n\t\t\t\tposition: relative;\n\t\t\t\tz-index: 7777;\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t.rcjspp-inner {\n\t\t\t\tflex-direction: row;\n\t\t\t}\n\t\t\t.rcjspp-graph {\n\t\t\t\tposition: relative;\n\t\t\t}\n\t\t\t.rcjspp-controls {\n\t\t\t\ttop: 0px;\n\t\t\t\theight: 100%;\n\t\t\t\twidth: 30px;\n\t\t\t\tpadding-right: 0;\n\t\t\t\tmargin-right: 20px;\n\t\t\t\tflex-direction: column;\n\t\t\t\tjustify-content: space-around;\n\t\t\t\tz-index: 9999;\n\t\t\t}\n\t\t\t@media print {\n\t\t\t\t.rcjspp-controls {\n\t\t\t\t\tdisplay: none;\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\t.rcjspp-controls-outermost {\n\t\t\t\ttop: 0px;\n\t\t\t\theight: 100%;\n\t\t\t\twidth: 30px;\n\t\t\t\tpadding-right: 0;\n\t\t\t\tmargin-right: 20px;\n\t\t\t\tflex-direction: column;\n\t\t\t\tjustify-content: space-around;\n\t\t\t\tz-index: 9999;\n\t\t\t}\n\t\t\t.tooltip .popover p.rcjspp-sel-popover:hover {\n\t\t\t\tcolor: rgb(103, 175, 103) !important;\n\t\t\t}\n\t\t\t.rcjspp-control {\n\t\t\t\tcursor: pointer;\n\t\t\t\tmin-height: 25px;\n\t\t\t}\n\t\t\t.rcjspp-control.rcjspp-control-over-white{\n\t\t\t\tcolor: #333;\n\t\t\t}\n\t\t\t.rcjspp-control.rcjspp-control-over-gray {\n\t\t\t\tcolor: white;\n\t\t\t}\n\t\t\t.rcjspp-control.rcjspp-pre-set-control-active {\n\t\t\t\tcolor: orange;\n\t\t\t}\n\t\t\t@media print {\n\t\t\t\t.rcjspp-control {\n\t\t\t\t\tdisplay: none !important;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-control.rcjspp-control-print {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t@media (min-width: 800px) {\n\t\t\t\t.rcjspp-control.rcjspp-control-print {\n\t\t\t\t\tdisplay: flex;\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\t.rcjspp-title-inner-container {\n\t\t\t\tjustify-content: center;\n\t\t\t\talign-items: center;\n\t\t\t\tmargin-right: 25px;\n\t\t\t\tmargin-left: 25px;\n\t\t\t}\n\t\t\t.rcjspp-title-color-dot {\n\t\t\t\tborder-radius: 50%;\n\t\t\t\theight: 15px;\n\t\t\t\twidth: 15px;\n\t\t\t\tbackground-color: white;\n\t\t\t}\n\t\t\t.rcjspp-title {\n\t\t\t\tcolor: ".concat(footerFontColor, ";\n\t\t\t\ttext-align: center;\n\t\t\t\tmargin-top: 10px;\n\t\t\t\tmargin-bottom: 10px;\n\t\t\t\tflex-grow: 1;\n\t\t\t}\n\t\t\t.rcjspp-title.rcjspp-subtitle {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t@media print{\n\t\t\t\t.rcjspp-title.rcjspp-subtitle {\n\t\t\t\t\tdisplay: block;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-title-wrap-container {\n\t\t\t\tflex-wrap: wrap;\n\t\t\t\tjustify-content: center;\n\t\t\t\talign-items: center;\n\t\t\t\tflex-grow: 1;\n\t\t\t}\n\t\t\t.rcjspp-title-major {\n\t\t\t\tmargin-left: 3px;\n\t\t\t}\n\t\t\t.rcjspp-title-minor {\n\t\t\t\tfont-weight: 100;\n\t\t\t\tfont-size: 67%;\n\t\t\t\topacity: 0.75;\n\t\t\t\tmargin-left: 3px;\n\t\t\t}\n\t\t\t.rcjspp-title-inner-container {\n\t\t\t\tjustify-content: center;\n\t\t\t\talign-items: center;\n\t\t\t\tmargin-right: 25px;\n\t\t\t\tmargin-left: 25px;\n\t\t\t}\n\t\t\t.rcjspp-title-color-dot {\n\t\t\t\tborder-radius: 50%;\n\t\t\t\theight: 15px;\n\t\t\t\twidth: 15px;\n\t\t\t\tbackground-color: white;\n\t\t\t}\n\n\t\t\t.rcjspp-footer {\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t@media print {\n\t\t\t\t.rcjspp-footer {\n\t\t\t\t\tdisplay: none;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-title {\n\t\t\t\tcolor: ").concat(footerFontColor, ";\n\t\t\t\ttext-align: center;\n\t\t\t\tmargin-top: 10px;\n\t\t\t\tmargin-bottom: 10px;\n\t\t\t\tflex-grow: 1;\n\t\t\t}\n\t\t\t.rcjspp-advance-spinner-container {\n\t\t\t\theight: 36px;\n\t\t\t\toverflow: hidden;\n\t\t\t}\n\t\t\t.rcjspp-advance-spinner-container .line-scale-pulse-out-rapid > div {\n\t\t\t\tbackground-color: white ;\n\t\t\t}\n\t\t\t.rcjspp-advance-button {\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 45px;\n\t\t\t\tjustify-content: center;\n\t\t\t\talign-items: center;\n\t\t\t}\n\t\t\t.rcjspp-advance-button:hover {\n\t\t\t\topacity: 0.7;\n\t\t\t}\n\t\t\t.rcjspp-advance-button-left {\n\t\t\t\tleft: 0;\n\t\t\t\tbottom: 110px;\n\t\t\t}\n\t\t\t.rcjspp-advance-button-right {\n\t\t\t\tleft: 0;\n\t\t\t\tbottom: 50px;\n\t\t\t}\n\t\t\t@media(min-width: ").concat(bp, "px){\n\t\t\t\t.rcjspp-advance-button-left {\n\t\t\t\t\tleft: 0;\n\t\t\t\t\tbottom: 0;\n\t\t\t\t}\n\t\t\t\t.rcjspp-advance-button-right {\n\t\t\t\t\tleft: auto;\n\t\t\t\t\tright: 0;\n\t\t\t\t\tbottom: 0;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-control {\n\t\t\t\tcursor: pointer;\n\t\t\t\tcolor: ").concat(footerFontColor, ";\n\t\t\t}\n\t\t\t@media print {\n\t\t\t\t.rcjspp-control {\n\t\t\t\t\tdisplay: none !important;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-footer-top {\n\t\t\t\twidth: 100%;\n\t\t\t\tposition: relative;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\tmin-height: 36px;\n\t\t\t}\n\t\t\t.rcjspp-footer-bottom {\n\t\t\t\twidth: 100%;\n\t\t\t}\n\t\t\t.rcjspp-footer-description {\n\t\t\t\tfont-size: 12px;\n\t\t\t\tline-height: 14px;\n\t\t\t\tfont-weight: 100;\n\t\t\t\topacity: 0.85;\n\t\t\t\ttext-align: left;\n\t\t\t\tcolor: ").concat(footerFontColor, ";\n\t\t\t\tpadding: 20px;\n\t\t\t\twidth: 100%;\n\t\t\t}\n\t\n\t\t\t.rcjspp-advance-waiting {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 50%;\n\t\t\t\tmargin-top: -").concat(spinnerSize / 2, "px;\n\t\t\t}\n\t\t\t.rcjspp-advance-waiting-left {\n\t\t\t\tleft: ").concat(spinnerMargin, "px;\n\t\t\t\tmargin-left: -").concat(spinnerSize / 2, "px;\n\t\t\t}\n\t\t\t.rcjspp-advance-waiting-right {\n\t\t\t\tright: ").concat(spinnerMargin, "px;\n\t\t\t\tmargin-right: -").concat(spinnerSize / 2, "px;\n\t\t\t}\n\t\t\t.rcjspp-advance-waiting > div {\n\t\t\t\twidth: ").concat(spinnerSize, "px;\n\t\t\t\theight: ").concat(spinnerSize, "px;\n\t\t\t\tbackground-color: ").concat(spinnerColor, ";\n\t\t\t\tborder-radius: 100%;\n\t\t\t\t-webkit-animation: blinking 1.0s infinite ease-in-out;\n\t\t\t\tanimation: blinking 1.0s infinite ease-in-out;\n\t\t\t}\n\t\n\t\t\t@-webkit-keyframes blinking {\n\t\t\t\t0% { -webkit-transform: scale(0.0) }\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: scale(1.0);\n\t\t\t\t\topacity: 0;\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\t@keyframes blinking {\n\t\t\t\t0% {\n\t\t\t\t\ttransform: scale(0.0);\n\t\t\t\t\t-webkit-transform: scale(0.0);\n\t\t\t\t} 100% {\n\t\t\t\t\ttransform: scale(1.0);\n\t\t\t\t\t-webkit-transform: scale(1.0);\n\t\t\t\t\topacity: 0;\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\t.rcjspp-selectors-outermost {\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t@media print {\n\t\t\t\t.rcjspp-selectors-outermost {\n\t\t\t\t\tdisplay: none;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-sel-style-col-header {\n\t\t\t\twidth: 10%;\n\t\t\t\tpadding-left: 7px;\n\t\t\t}     \n\t\t\t.rcjspp-sel-style-select-shade {\n\t\t\t\twidth: 40px;\n\t\t\t} \n\t\t\t.rcjspp-sel-style-row-label {\n\t\t\t\tdisplay: block;\n\t\t\t\twidth: 20%;\n\t\t\t\theight: 100%;\n\t\t\t\toverflow: scroll;\n\t\t\t\tcursor: pointer;\n\t\t\t\tcolor: #aaa;\n\t\t\t\tpadding-left: 10px;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-row-active {\n\t\t\t\tcolor: inherit;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-header-row {\n\t\t\t\tbackground-color: white;\n\t\t\t\topacity: 0.85;\n\t\t\t\tjustify-content: flex-end;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 45px;\n\t\t\t\tpadding-top: 5px;\n\t\t\t}\n\t\t\t.rcjspp-selectors {\n\t\t\t\ttop: 100%;\n\t\t\t\tflex-direction: column;\n\t\t\t\tbackground-color: white;\n\t\t\t\twidth: 100%;\n\t\t\t\twidth: 100vw;\n\t\t\t\tz-index: 9999;\n\t\t\t}\n\t\t\t@media(min-width: 800px){\n\t\t\t\t.rcjspp-selectors {\n\t\t\t\t\toverflow-y: scroll;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-pre-set-save-container {\n\t\t\t\tbackground-color: white;\n\t\t\t\tdisplay: block;\n\t\t\t\theight: 75px;\n\t\t\t}\n\n\n\t\t\t.rcjspp-sel-row-form {\n\t\t\t\twidth: 100%;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\tpadding: 5px;\n\t\t\t}\n\t\t\t.rcjspp-sel-row-form-label {\n\t\t\t\tdisplay: flex;\n\t\t\t\tmargin-right: 20px;\n\t\t\t\talign-items: baseline;\n\t\t\t}\n\t\t\t.rcjspp-sel-row-form .rcjspp-sel-input {\n\t\t\t\tfont-size: 16px;\n\t\t\t\tdisplay: flex;\n\t\t\t\tmin-height: 14px;\n\t\t\t\tpadding: 3px;\n\t\t\t\twidth: 4em;\n\t\t\t}\n\t\t\t.rcjspp-sel-row.rcjspp-sel-input-radio {\n\t\t\t\twidth: 5%;\n\t\t\t}\n\n\t\t\t.rcjspp-sel-inner-container {\n\t\t\t\tpadding: 5px;\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t.rcjspp-sel-checkbox-container {\n\t\t\t\tflex-direction: row;\n\t\t\t\tflex-wrap: wrap;\n\t\t\t\tmargin-top: 15px;\n\t\t\t\tjustify-content: space-around;\n\t\t\t}\n\t\t\t@media(min-width: 800px){\n\t\t\t\t.rcjspp-sel-checkbox-container {\n\t\t\t\t\toverflow-y: scroll;\n\t\t\t\t}\n\t\t\t}\n\t\t\t.rcjspp-sel-checkbox-group-container {\n\t\t\t\tflex-direction: column; \n\t\t\t\tmargin-bottom: 10px;\n\t\t\t\tmargin-right: 20px;\n\t\t\t}\n\t\t\t.rcjspp-sel-checkbox-group-container .rcjspp-sel-checkbox-group-header {\n\t\t\t\tmargin-top: 10px;\n\t\t\t\tmargin-bottom: 5px;\n\t\t\t}\n\t\t\t.rcjspp-sel-checkbox-group .rcjspp-sel-label-radio {\n\t\t\t\tdisplay: flex;\n\t\t\t}\n\t\t\t.rcjspp-sel-label-radio {\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\t\t\t.rcjspp-sel-label-radio:hover {\n\t\t\t\tbackground-color: rgba(125, 157, 165, 0.1);\n\t\t\t}\n\t\t\t.rcjspp-sel-predicted-selector {\n\t\t\t\tcolor: red;\n\t\t\t}\n\n\n\t\t\t.rcjspp-pre-set-save-button {\n\t\t\t\tpadding: 5px;\n\t\t\t\tmargin-right: 20px;\n\t\t\t}\n\t\t\t.rcjspp-pre-set-save-toggle-container {\n\t\t\t\tflex-direction: column;\n\t\t\t\tmargin: 15px;\n\t\t\t\twidth: 200px;\n\t\t\t\tflex-grow: 0;\n\t\t\t\tflex-shrink: 0;\n\t\t\t}\n\t\t\t.rcjspp-pre-set-input-label {\n\t\t\t\tpadding-left: 5px;\n\t\t\t}\n\t\t\t.rcjspp-pre-set-input {\n\t\t\t\tmin-width: 150px;\n\t\t\t}\n\t\t\t.rcjspp-pre-set-save-inner-container {\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: row;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\twidth: 100%;\n\t\t\t}\n\t\t\t.rcjspp-pre-set-selector {\n\t\t\t\tmin-width: 100px;\n\t\t\t}\n\n\t\t\t.rcjspp-sel-style-body {\n\t\t\t\toverflow-y: scroll;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-col-header {\n\t\t\t\twidth: 10%;\n\t\t\t\tpadding-left: 7px;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-body {\n\t\t\t\tdisplay: block;\n\t\t\t\tpadding-top: 45px;\n\t\t\t\tmargin-bottom: 20px;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-row {\n\t\t\t\theight: 20px;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-row-label {\n\t\t\t\tdisplay: block;\n\t\t\t\twidth: 20%;\n\t\t\t\theight: 100%;\n\t\t\t\toverflow: scroll;\n\t\t\t\tcursor: pointer;\n\t\t\t\tcolor: #aaa;\n\t\t\t\tpadding-left: 10px;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-row-active {\n\t\t\t\tcolor: inherit;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-input,\n\t\t\t.rcjspp-sel-style-select {\n\t\t\t\twidth: 10%;\n\t\t\t\theight: 100%;\n\t\t\t}\n\t\t\t.rcjspp-sel-style-select-shade {\n\t\t\t\twidth: 40px;\n\t\t\t}\n\t\t\t.rcjspp-sel-disabled {\n\t\t\t\tcolor: transparent;\n\t\t\t}\n\t\t")
    })]
  });
}