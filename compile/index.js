'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

var _conjunctionJunction = require('conjunction-junction');

var _graphs = require('./helpers/graphs');

var _preSetExtract = require('./helpers/pre-set-extract');

var _preSetEdit = require('./helpers/pre-set-edit');

var _palettes = require('./helpers/palettes');

var _controls = require('./helpers/controls');

var _dimensions = require('./helpers/dimensions');

var _layers = require('./helpers/layers');

var _selectors = require('./3selectors');

var _selectors2 = _interopRequireDefault(_selectors);

var _controls2 = require('./2controls');

var _controls3 = _interopRequireDefault(_controls2);

var _footer = require('./2footer');

var _footer2 = _interopRequireDefault(_footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// console.log('helpers', helpers);
console.log('createGraph', _graphs.createGraph);
// console.log('calcTicks', calcTicks);

var GraphWrapper = function (_React$Component) {
  _inherits(GraphWrapper, _React$Component);

  function GraphWrapper(props) {
    _classCallCheck(this, GraphWrapper);

    var _this = _possibleConstructorReturn(this, (GraphWrapper.__proto__ || Object.getPrototypeOf(GraphWrapper)).call(this, props));

    _this.state = {

      // status
      hide: false, // use this for a forced refresh
      ready: false, // so graph doesn't load before data
      paused: true,
      needRefresh: false,
      waitingOnPreSetIdFromProps: false,
      waitingOnDataFromProps: false,

      // keys mostly just initialized data types, see componentDidMount() for initialization
      legendObject: {},
      layersAllPrefixed: [],
      layerUnitsArray: [],
      layersGroupedByUnits: [[]],
      layerGroupByJSXOptions: [],
      layersThatHaveUnits: [],
      layersSelected: Array.isArray(_this.props.layersSelected) ? _this.props.layersSelected : [], // use as many keys as desired
      layersRawPrefixCount: _this.props.layersRawPrefixCount,

      legendUnits: _this.props.legendUnits || {},
      legendAbbrevs: _this.props.legendAbbrevs ? _this.props.legendAbbrevs : _this.props.legendLabels ? _this.props.legendLabels : {},
      legendLabels: _this.props.legendLabels || {},

      graphData: {}, // pass as props to graph
      graphOptions: { // pass as props to graph
        scales: {
          yAxes: []
        }
      },
      // data
      dataType: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.dataType) ? _this.props.dataType : 1,
      dataConvertFrom: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.dataConvertFrom) ? _this.props.dataConvertFrom : 1, // convert from what to 1
      dataType0Raw: Array.isArray(_this.props.dataType0) ? _this.props.dataType0 : [],
      dataType1Raw: Array.isArray(_this.props.dataType1) ? _this.props.dataType1 : [],
      dataType1Processed: [],
      dataType2Raw: Array.isArray(_this.props.dataType2) ? _this.props.dataType2 : [[]],
      dataType2Processed: [[]],

      indexAbbrev: 0,
      indexLabels: 1,
      indexUnits: 2,

      graphName: _this.props.graphName,
      titleText: _this.props.titleText || 'data',

      styles: _this.props.styles || {},

      cssStyleColorsNamedArray: [],
      cssStyleColorsNamed: _this.props.cssStyleColorsNamed || (0, _palettes.createNamed)('bright'),
      cssRgbArray: _this.props.cssRgbArray || (0, _palettes.selectPalette)(30), // array of styles to loop through//  VVVVVVVVVVV edit location per project VVVVVVVVVVV

      cssBackground: _this.props.cssBackground || 'gray',
      cssLegendPosition: _this.props.cssLegendPosition || 'bottom',

      cssDivOuter: {},
      cssDivGraph: {},
      cssDivControls: {},
      cssDivFooter: {},
      cssDivSelectors: {},
      cssWidthOuter: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.cssWidthOuter) ? _this.props.cssWidthOuter : 200,
      cssHeightOuter: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.cssHeightOuter) ? _this.props.cssHeightOuter : 150,
      cssWidthControls: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.cssWidthControls) ? _this.props.cssWidthControls : 40,
      cssHeightFooter: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.cssHeightFooter) ? _this.props.cssHeightFooter : 60,
      cssHeightSelectors: (0, _conjunctionJunction.isPrimitiveNumber)(_this.props.cssHeightSelectors) ? _this.props.cssHeightSelectors : 'auto',
      cssCanvasHeight: 0,
      cssCanvasWidth: 0,

      icons: _this.props.icons,

      selectorsPopover: false,
      selectorsInFocus: 'none', // this updates in componentDidMount
      preSetSaveAllow: true,
      // configure settings in control bar
      selectorsAllow: typeof _this.props.selectorsAllow === 'boolean' ? _this.props.selectorsAllow : true,
      closeAllow: typeof _this.props.closeAllow === 'boolean' ? _this.props.closeAllow : false,
      printAllow: typeof _this.props.printAllow === 'boolean' ? _this.props.printAllow : true,
      backgroundAllow: typeof _this.props.backgroundAllow === 'boolean' ? _this.props.backgroundAllow : true,
      advanceAllow: typeof _this.props.advanceAllow === 'boolean' ? _this.props.advanceAllow : false,
      yAxisAllow: typeof _this.props.yAxisAllow === 'boolean' ? _this.props.yAxisAllow : true,
      // configure settings in selectors
      groupAllow: typeof _this.props.groupAllow === 'boolean' ? _this.props.groupAllow : false,

      groupColors: _this.props.groupColors || {},
      groupDotColors: {},
      groupTrue: typeof _this.props.groupTrue === 'boolean' ? _this.props.groupTrue : false,
      groupByOnMount: _this.props.groupByOnMount,
      groupsSub: _this.props.groupsSub,
      groups: [],

      preSetGroupEditMode: typeof _this.props.preSetGroupEditMode === 'boolean' ? _this.props.preSetGroupEditMode : false,
      preSetGlobalPalettes: [],
      preSetGlobalPalette: '',
      preSetGlobalColorOptions: [],

      preSetSaveSettings: _extends({ useOnlyExplicitStylesWhenUngrouped: false, prefixGroups: false, prefixGroupsSub: false, preSetSaveAsType: 'single' }, _this.props.preSetSaveSettings),
      preSets: _this.props.preSets || {},
      preSetIdActive: '',
      preSetIds: [],
      preSetNames: [],
      preSetFuncs: [],
      preSetIcons: [],
      preSetLayers: [],
      // preSetStyleOptionsJSX:  [[]],

      keyToCompareOnNewData: _this.props.keyToCompareOnNewData || 'xLabel',

      xStart: 0,
      xEnd: _this.props.xEnd || 1000,
      xIdealTickSpacing: _this.props.xIdealTickSpacing || 6,
      xLabelStartAt: _this.props.xLabelStartAt || null, // ignored if not a number
      xLabelKey: _this.props.xLabelKey || null,
      xLabel: _this.props.xLabel,

      yAxisArray: [], // used as history in createGraph()
      yAxisIdArray: [], // used as history in createGraph()
      yAxisUnitOptions: _this.props.yAxisUnitOptions || {},
      yAxisInFocus: 'default',

      // callback functions to access parent
      handleBackgroundColor: typeof _this.props.handleBackgroundColor === 'function' ? _this.props.handleBackgroundColor : function () {},
      handleCloseGraph: typeof _this.props.handleCloseGraph === 'function' ? _this.props.handleCloseGraph : function () {},
      handlePreSetSave: typeof _this.props.handlePreSetSave === 'function' ? _this.props.handlePreSetSave : function () {},
      handleFetchAdvanceRequest: _this.props.handleFetchAdvanceRequest
    };

    _this.toggleLayerGroup = _this.toggleLayerGroup.bind(_this);
    _this.handleGroupBy = _this.handleGroupBy.bind(_this);
    _this.handleLayerSelection = _this.handleLayerSelection.bind(_this);
    _this.toggleSelectorsPopover = _this.toggleSelectorsPopover.bind(_this);
    _this.toggleSelectorsInFocus = _this.toggleSelectorsInFocus.bind(_this);
    _this.handleRangeChange = _this.handleRangeChange.bind(_this);
    _this.handleTickChange = _this.handleTickChange.bind(_this);
    _this.toggleLayerGroup = _this.toggleLayerGroup.bind(_this);
    _this.handleBackgroundChange = _this.handleBackgroundChange.bind(_this);
    _this.printGraph = _this.printGraph.bind(_this);
    _this.handlePreSetSelect = _this.handlePreSetSelect.bind(_this);
    _this.handlePreSetSave = _this.handlePreSetSave.bind(_this);
    _this.receiveNewStyles = _this.receiveNewStyles.bind(_this);
    _this.graphAdvance = _this.graphAdvance.bind(_this);
    _this.advanceDataFromProps = _this.advanceDataFromProps.bind(_this);
    _this.handleYAxisSelector = _this.handleYAxisSelector.bind(_this);
    return _this;
  }

  // move this to conjunction-junction


  _createClass(GraphWrapper, [{
    key: 'parseEvent',
    value: function parseEvent(event) {
      var value = !event ? null : !event.target ? event : event.target.value ? event.target.value : event;
      return value;
    }

    // @@@@@@@@@@@@@@@@@@ LIFE CYCLE @@@@@@@@@@@@@@@@

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      window.scrollTo(0, 0);
      return new Promise(function (resolve, reject) {
        var dimensions = (0, _dimensions.calcDimensions)(_this2.state);
        resolve(_this2.setState(dimensions));
      }).then(function () {
        _this2.createGroupByOptionsJSX();
      }).then(function () {
        var that = _this2;
        _this2.setState((0, _controls.formatControls)(_this2.state, that)); // formatControls returns an object
      }).then(function () {
        var selectorsInFocus = !_this2.state.selectorsAllow ? 'none' : !_this2.props.selectorsInFocus ? 'layers' : _this2.props.selectorsInFocus;
        var preSetIdActive = (0, _preSetExtract.selectDefaultPreSet)(_this2.state.preSets, _this2.state.graphName);
        _this2.setState({
          selectorsInFocus: selectorsInFocus,
          preSetIdActive: preSetIdActive
        });
        return;
      }).then(function () {
        // options and pallettes are necessary for tests, even when editing is not allowed
        // all these are necessary for editing
        var preSetGlobalColorOptions = (0, _palettes.listBright)();
        var preSetGlobalPalettes = (0, _palettes.createPreSetGlobalPalettes)();
        var preSetGlobalPalette = preSetGlobalPalettes[preSetGlobalColorOptions[0]];
        _this2.setState({
          preSetGlobalPalettes: preSetGlobalPalettes,
          preSetGlobalPalette: preSetGlobalPalette,
          preSetGlobalColorOptions: preSetGlobalColorOptions
        });
        return;
      }).then(function () {
        if (_this2.state.groupByOnMount) {
          var groupByData = (0, _layers.createGroupByData)(_this2.state.groupByOnMount, _this2.state.dataType1Raw);
          /* createGroupByData() returns these keys:
              dataType2Raw,
              dataConvertFrom,
              groupBy,
              groups,
              groupTrue,
          */
          _this2.setState(groupByData);
          return;
        }
        return;
      }).then(function () {
        var graphInfo = (0, _graphs.createGraphInfoOnGroupOrMount)(_this2.state);
        /* createGraphInfoOnGroupOrMount returns
            layersThatHaveUnits, 
            layersAllPrefixed,
            legendObject,
            layersGroupedByUnits,
            layerUnitsArray,
            dataType: 1,
            dataType1Processed
        */
        _this2.setState(graphInfo);
        return;
      }).then(function () {
        if (_this2.state.preSetIdActive) {
          _this2.handlePreSetSelect(_this2.state.preSetIdActive);
          return;
        } else {
          var _parseDefaultLayerSel = (0, _layers.parseDefaultLayerSelection)(_this2.state),
              layersSelected = _parseDefaultLayerSel.layersSelected,
              firstLayerOnList = _parseDefaultLayerSel.firstLayerOnList;
          // this pops the first layer off the list, then adds it back to force a re-render;
          // ARE WE SURE WE NEED THIS????


          return new Promise(function (resolve, reject) {
            resolve(_this2.setState({ layersSelected: layersSelected }));
          }).then(function () {
            _this2.handleLayerSelection(firstLayerOnList);
          });
        }
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.advanceDataFromProps();
      // this.assignNewPreSetId();
    }

    // @@@@@@@@@@@@@@@@@@ MAJOR RENDERING @@@@@@@@@@@@@@@@

  }, {
    key: 'handleGroupBy',
    value: function handleGroupBy(event) {
      var _this3 = this;

      // handleGroupBy should ONLY run from subcomponents
      // convert data type 1 to type 2
      var theKey = this.parseEvent(event);
      if (!theKey) return;
      var groupByData = (0, _layers.createGroupByData)(theKey, this.state.dataType1Raw);
      return new Promise(function (resolve, reject) {
        resolve(_this3.setState(groupByData));
      }).then(function () {
        var graphInfo = (0, _graphs.createGraphInfoOnGroupOrMount)(_this3.state);
        _this3.setState(graphInfo);
        return;
      });
    }
  }, {
    key: 'handleGraphChange',
    value: function handleGraphChange(changeInput) {
      /* changeInput can include any keys below
        layersSelected    
        xIdealTickSpacing 
        cssBackground     
        xStart            
        xEnd               
        legendPosition    
        xLabel            
        xLabelKey         
        xLabelStartAt     
        yAxisUnitOptions  
      */
      console.log('state in handleGraphChange,', this.state);
      var input = (0, _graphs.formatGraphKeysInput)(changeInput, this.state);
      var graphKeys = (0, _graphs.createGraph)(input);
      /* graphKeys includes: 
         graphData,    
         graphOptions,
         ready,
         needRefresh,  
         cssBackground, 
         layersSelected,  
         yAxisArray,   
         xIdealTickSpacingPrior
       */
      this.setState(graphKeys);
      if (graphKeys.needRefresh) {
        this.refreshGraph();
      }
    }
  }, {
    key: 'refreshGraph',
    value: function refreshGraph() {
      var _this4 = this;

      // runs when a refresh key is sent from createGraph()
      // refresh keys include axes changes
      // many keys will re-render correctly without a hard refresh
      this.setState({ hide: true });
      setTimeout(function () {
        _this4.setState({ hide: false });
      }, 100);
    }

    // @@@@@@@@@@@@@@@@@@ MAJOR CONTROLS @@@@@@@@@@@@@@@@

  }, {
    key: 'toggleSelectorsPopover',
    value: function toggleSelectorsPopover() {
      this.setState({
        selectorsPopover: !this.state.selectorsPopover
      });
    }
  }, {
    key: 'toggleSelectorsInFocus',
    value: function toggleSelectorsInFocus(focus) {
      var selectorsInFocus = focus ? focus : 'none';
      if (this.state.selectorsInFocus === 'none') {
        // look into React.findDOMNode... to focus
      }
      this.setState({
        selectorsInFocus: selectorsInFocus
      });
    }
  }, {
    key: 'handleYAxisSelector',
    value: function handleYAxisSelector() {
      var yAxisInFocus = this.state.yAxisInFocus === 'default' ? 'auto' : this.state.yAxisInFocus === 'auto' ? 'default' : 'default';
      this.setState({ yAxisInFocus: yAxisInFocus });
      this.handleGraphChange({ yAxisUnitOptions: yAxisInFocus === 'auto' ? {} : this.state.yAxisUnitOptions });
    }

    // @@@@@@@@@@@@@@@@@ MINOR CONTROLS @@@@@@@@@@@@@@@@

  }, {
    key: 'handleBackgroundChange',
    value: function handleBackgroundChange(color) {
      // toggle background between white and black, graph font color is opposite
      // hides then shows graph to force a re-render of the canvas
      var cssBackground = typeof color === 'string' ? color : this.state.cssBackground === 'white' ? 'gray' : 'white';
      this.state.handleBackgroundColor(cssBackground);
      this.handleGraphChange({ cssBackground: cssBackground });
    }
  }, {
    key: 'printGraph',
    value: function printGraph() {
      if (this.state.cssBackground === 'white') {
        // if already white, print, else, turn white, wait, then print
        window.print();
      } else {
        this.handleBackgroundChange('white');
        setTimeout(function () {
          window.print();
        }, 2000); // 2000 seems to be long enough to complete canvas animations before printing
      }
    }

    // @@@@@@@@@@@@@@@@@@ LAYERS @@@@@@@@@@@@@@@@

  }, {
    key: 'createGroupByOptionsJSX',
    value: function createGroupByOptionsJSX() {
      // runs only when allowing group but not already grouped
      var layerGroupByJSXOptions = !Array.isArray(this.state.layersThatHaveUnits) ? [] : this.state.layersThatHaveUnits.map(function (layer, i) {
        return _react2.default.createElement(
          'option',
          { key: i, value: layer },
          layer
        );
      });
      this.setState({ layerGroupByJSXOptions: layerGroupByJSXOptions });
    }
  }, {
    key: 'handleLayerSelection',
    value: function handleLayerSelection(event) {
      // handleLayerSelection should only run from subcomponents
      var key = this.parseEvent(event);
      if (!key) return;
      var layersSelected = (0, _layers.createLayersSelected)(key, this.state.layersSelected);
      this.handleGraphChange({ layersSelected: layersSelected });
    }
  }, {
    key: 'toggleLayerGroup',
    value: function toggleLayerGroup(group) {
      if (!(0, _conjunctionJunction.isObjectLiteral)(this.state.layersGroupedByUnits)) return;
      var theGroup = this.state.layersGroupedByUnits[group];
      if (!Array.isArray(theGroup)) return;
      var layersSelected = (0, _layers.toggleLayerGroup)(this.state, theGroup);
      this.handleGraphChange({ layersSelected: layersSelected });
    }

    // @@@@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@@@

  }, {
    key: 'handleRangeChange',
    value: function handleRangeChange(event, key) {
      var _this5 = this;

      var value = parseInt(event.target.value, 10);
      this.setState(_defineProperty({}, key, value));
      setTimeout(function () {
        _this5.handleGraphChange(_defineProperty({}, key, value));
      }, 100);
    }
  }, {
    key: 'handleTickChange',
    value: function handleTickChange(event) {
      var _this6 = this;

      var rawValue = parseInt(event.target.value, 10);
      var value = !(0, _conjunctionJunction.isPrimitiveNumber)(rawValue) ? 6 : rawValue < 1 ? 1 : rawValue > 50 ? 50 : rawValue;
      this.setState({ xIdealTickSpacing: value });
      setTimeout(function () {
        _this6.handleGraphChange({ xIdealTickSpacing: value });
      }, 50);
    }

    // @@@@@@@@@@@@@@@@@@ PRESETS @@@@@@@@@@@@@@@@

    // assignNewPreSetId(){
    //   // if we saved a preSet, wait for its ID
    //   // when received, re-load controls
    //   if(this.state.waitingOnPreSetIdFromProps){
    //     if(!this.state.preSetIdActive){
    //       let id;
    //       for (let i in this.props.preSets){
    //         if(this.props.preSets[i].name === this.state.preSetNameNew) {
    //           id = i;
    //         }
    //       }
    //       if(id){
    //         const newPreSets = {
    //           ...this.state.preSets,
    //           [id]: this.props.preSets[id],
    //         }
    //         return new Promise((resolve, reject)=>{
    //           resolve(
    //             this.setState({
    //               preSetIdActive: id,
    //               preSets: newPreSets, 
    //               waitingOnPreSetIdFromProps: false,
    //             })
    //           );
    //         })
    //         .then(()=>{
    //           this.loadControls({id: id});
    //         });
    //       }
    //     } 
    //   }
    // }

  }, {
    key: 'advanceDataFromProps',
    value: function advanceDataFromProps() {
      var _this7 = this;

      if (this.state.waitingOnDataFromProps) {
        // compare ex. dataType1Raw[0][key] against new data [0][key] to see if new data actually arrived
        if (Array.isArray(this.props.dataType1) && Array.isArray(this.state.dataType1Raw)) {
          if ((0, _conjunctionJunction.isObjectLiteral)(this.props.dataType1[0]) && (0, _conjunctionJunction.isObjectLiteral)(this.state.dataType1Raw[0])) {
            if (this.props.dataType1[0][this.props.keyToCompareOnNewData] !== this.state.dataType1Raw[0][this.state.keyToCompareOnNewData]) {
              return new Promise(function (resolve) {
                resolve(_this7.setState({
                  dataType1Raw: _this7.props.dataType1,
                  titleText: _this7.props.titleText
                }));
              }).then(function () {
                // waitingOnDataFromProps update is delayed to give the spinner a little more time
                setTimeout(function () {
                  _this7.setState({
                    waitingOnDataFromProps: false // this is after a timeout so the looading icon doesn't disappear too fast
                  });
                }, 800);
                if (_this7.state.groupByOnMount) {
                  var groupByData = (0, _layers.createGroupByData)(_this7.state.groupByOnMount, _this7.state.dataType1Raw);
                  _this7.setState(groupByData);
                  return;
                }
              }).then(function () {
                var graphInfo = (0, _graphs.createGraphInfoOnGroupOrMount)(_this7.state);
                _this7.setState(graphInfo);
                return;
              }).then(function () {
                _this7.handleGraphChange({});
              });
            }
          }
        }
      }
    }
  }, {
    key: 'handlePreSetSelect',
    value: function handlePreSetSelect(id) {
      var _this8 = this;

      // onMount, it will try to find a preSet id; if no preSets exist, this catches it, unpauses, and stops
      var pausedState = !id ? {
        paused: false,
        preSetSaveAllow: true
      } : {
        preSetSaveAllow: false // forces pre-set save component to unmount while selection occurs, then after selection, it remounts (and updates)
      };

      // this will select all keys in a pre-set list
      var thisPreSet = this.state.preSets[id];
      if (!(0, _conjunctionJunction.isObjectLiteral)(thisPreSet)) return;

      return new Promise(function (resolve, reject) {
        resolve(_this8.setState(pausedState));
      }).then(function () {
        var unpackedPreSet = (0, _preSetExtract.unpackPreSet)(_this8.state, thisPreSet, id);
        /* unpackPreSet returns:
          groupColors,
          groupDotColors,
          preSetIdActive,
          selector0,
          layersSelected,
          styles,
          prefixesToKeepGroups,
          prefixesToKeepGroupsSub,
        */
        var newState2 = _extends({}, _this8.state, unpackedPreSet);
        var layersSelected = (0, _layers.createLayersSelected)(newState2.selector0, newState2.layersSelected);
        _this8.setState(_extends({}, unpackedPreSet, {
          layersSelected: layersSelected
        }));
      }).then(function () {
        if (_this8.state.preSetGroupEditMode) {
          // this is ONLY used in editing mode for group preSets
          var preSetGlobalPalette = _this8.state.preSetGlobalPalettes[(0, _palettes.listBright)()[0]];
          var styles = (0, _preSetEdit.applyPreSetGlobalColorToStyles)({
            styles: _this8.state.styles,
            preSetGlobalPalette: preSetGlobalPalette
          });
          _this8.receiveNewStyles(styles);
        }
      }).then(function () {
        _this8.setState({
          paused: false,
          preSetSaveAllow: true
        }); // defaults to true on load if preset is active, so this reverses that
        return;
      }).then(function () {
        _this8.handleGraphChange({});
        return;
      });
    }
  }, {
    key: 'handlePreSetSave',
    value: function handlePreSetSave(preSet) {
      var _this9 = this;

      if (!(0, _conjunctionJunction.isObjectLiteral)(preSet)) return;
      var hydratedPreSet = _extends({
        graphName: this.state.graphName }, preSet, { // admin
        layersSelected: this.state.layersSelected, // layers
        styles: this.state.styles
      });
      console.log('hydratedPreSet', hydratedPreSet);
      return;
      var updatedPreSet = this.state.handlePreSetSave(hydratedPreSet);
      console.log('updatedPreSet', updatedPreSet);
      if ((0, _conjunctionJunction.isObjectLiteral)(updatedPreSet)) {
        if (updatedPreSet.id) {
          return new Promise(function (resolve, reject) {
            resolve(_this9.setState({
              preSetIdActive: updatedPreSet.id,
              preSets: _extends({}, _this9.state.preSets, _defineProperty({}, updatedPreSet.id, updatedPreSet))
            }));
          }).then(function () {
            _this9.handlePreSetSelect(updatedPreSet.id);
            // this.loadControls();
          });
        } else {
          console.error('there was a problem saving the pre-set (no id):', preSet);
        }
      } else {
        console.error('there was a problem saving the pre-set (no object returned):', preSet);
      }
    }
  }, {
    key: 'receiveNewStyles',
    value: function receiveNewStyles(styles, psgc) {
      var _this10 = this;

      var preSetGlobalColor = psgc ? psgc : this.state.preSetGlobalColor;
      var preSetGlobalPalette = this.state.preSetGlobalPalettes[preSetGlobalColor];

      return new Promise(function (resolve, reject) {
        resolve(_this10.setState({
          styles: styles,
          preSetGlobalColor: preSetGlobalColor,
          preSetGlobalPalette: preSetGlobalPalette
        }));
      }).then(function () {
        _this10.handleGraphChange({});
      }).then(function () {
        _this10.refreshGraph();
        return;
      });
    }

    // @@@@@@@@@@@@@@@@@@ NAVIGATION @@@@@@@@@@@@@@@@

  }, {
    key: 'graphAdvance',
    value: function graphAdvance(advanceBy) {
      var _this11 = this;

      if (typeof this.state.handleFetchAdvanceRequest === 'function') {
        this.setState({ waitingOnDataFromProps: true });
        // the timeout is because the spinner doesn't load instantly
        setTimeout(function () {
          _this11.state.handleFetchAdvanceRequest(advanceBy);
        }, 200);
      }
    }
  }, {
    key: 'render',
    value: function render() {

      // @@@@@@@@@@@@@@@@@@ CONTROLS @@@@@@@@@@@@@@@@
      var s = this.state;

      var controls = _react2.default.createElement(_controls3.default, {
        controlNames: s.controlNames,
        controlIcons: s.controlIcons,
        controlFuncs: s.controlFuncs,
        controlLabels: s.controlLabels,
        waitingOnPreSetIdFromProps: s.waitingOnPreSetIdFromProps,
        preSets: s.preSets,
        preSetIdActive: s.preSetIdActive,
        selectorsPopover: s.selectorsPopover,
        cssBackground: s.cssBackground,

        toggleSelectorsInFocus: this.toggleSelectorsInFocus
      });

      var graph = s.ready && !s.hide && !s.paused ? _react2.default.createElement(_reactChartjs.Line, {
        data: s.graphData,
        options: s.graphOptions,
        height: s.cssCanvasHeight,
        width: s.cssCanvasWidth }) : null;

      var selectors = _react2.default.createElement(_selectors2.default, {
        graphName: s.graphName,
        selectorsInFocus: s.selectorsInFocus,
        cssDivSelectors: s.cssDivSelectors,
        cssStyleColorsNamed: s.cssStyleColorsNamed,
        icons: s.icons,
        preSetSaveAllow: s.preSetSaveAllow,
        groupTrue: s.groupTrue,
        groupAllow: s.groupAllow,
        xStart: s.xStart,
        xEnd: s.xEnd,
        preSets: s.preSets,
        xIdealTickSpacing: s.xIdealTickSpacing,
        layerGroupByJSXOptions: s.layerGroupByJSXOptions,
        preSetGlobalPalettes: s.preSetGlobalPalettes,
        preSetGlobalPalette: s.preSetGlobalPalette,
        preSetGlobalColorOptions: s.preSetGlobalColorOptions,
        preSetIds: s.preSetIds,
        preSetIdActive: s.preSetIdActive,
        layersThatHaveUnits: s.layersThatHaveUnits,
        layersSelected: s.layersSelected,
        legendLabels: s.legendLabels,
        preSetGroupEditMode: s.preSetGroupEditMode,
        preSetSaveSettings: s.preSetSaveSettings,
        styles: s.styles,

        layerUnitsArray: s.layerUnitsArray,
        layersGroupedByUnits: s.layersGroupedByUnits,
        legendObject: s.legendObject,
        indexAbbrev: s.indexAbbrev,

        toggleLayerGroup: this.toggleLayerGroup,
        handleRangeChange: this.handleRangeChange,
        handleTickChange: this.handleTickChange,
        handleGroupBy: this.handleGroupBy,
        handlePreSetSave: this.handlePreSetSave,
        receiveNewStyles: this.receiveNewStyles,
        handleLayerSelection: this.handleLayerSelection
      });

      var footer = _react2.default.createElement(_footer2.default, {
        cssBackground: s.cssBackground,
        groupDotColors: s.groupDotColors,
        titleText: s.titleText,
        advanceAllow: s.advanceAllow,
        waitingOnDataFromProps: s.waitingOnDataFromProps,
        icons: s.icons,
        cssDivFooter: s.cssDivFooter,

        graphAdvance: this.graphAdvance
      });

      return _react2.default.createElement(
        'div',
        { className: 'gw-outer',
          style: s.cssDivOuter },
        _react2.default.createElement(
          'div',
          { className: 'gw-inner' },
          _react2.default.createElement(
            'div',
            { className: 'gw-graph',
              style: s.cssDivGraph },
            graph
          ),
          _react2.default.createElement(
            'div',
            { className: 'gw-controls',
              style: s.cssDivControls },
            controls
          )
        ),
        footer,
        selectors,
        _react2.default.createElement(
          'style',
          null,
          '\n        .gw-outer {\n          position: relative;\n          z-index: 7777;\n          flex-direction: column;\n        }\n        .gw-inner {\n          flex-direction: row;\n        }\n        .gw-graph {\n          position: relative;\n        }\n        .gw-controls {\n          top: 0px;\n          height: 100%;\n          padding-top: 45px;\n          width: 30px;\n          padding-right: 0;\n          margin-right: 20px;\n          flex-direction: column;\n          justify-content: space-around;\n          z-index: 9999;\n        }\n      '
        )
      );
    }
  }]);

  return GraphWrapper;
}(_react2.default.Component);

exports.default = GraphWrapper;