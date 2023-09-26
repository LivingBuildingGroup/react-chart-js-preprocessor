'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _require = require('conjunction-junction'),
  isPrimitiveNumber = _require.isPrimitiveNumber,
  isObjectLiteral = _require.isObjectLiteral;
var consoleDeveloperWarnings = function consoleDeveloperWarnings(props) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var expected = {
    layersSelected: {
      type: 'array',
      required: false
    },
    legendHash: {
      type: 'object',
      required: true,
      notes: 'required for labeling, units, axes, and grouping of selectors'
    },
    dataType: {
      type: 'number',
      required: false,
      notes: 'the type of data we are sending, defaults to 1'
    },
    dataConvertFrom: {
      type: 'number',
      required: !(props.dataType === 1 || props.dataType === undefined),
      notes: 'you need to declare a data type to convert from if your data is not type 1'
    },
    dataType0: {
      type: 'array',
      required: props.dataType === 0,
      notes: 'array of primitives, not typical'
    },
    dataType1: {
      type: 'array',
      required: props.dataType === 1 || props.dataType === undefined,
      notes: 'array of objects, typical'
    },
    dataType2: {
      type: 'array',
      required: props.dataType === 2,
      notes: 'compound array of objects, used for groups'
    },
    graphName: {
      required: true,
      type: 'string',
      notes: 'required to select presets'
    },
    titleText: {
      required: 'preferred',
      type: ['string', 'object'],
      notes: 'title will be "data" if nothing is provided'
    },
    cssStyleColorsNamed: {
      required: false,
      type: 'array',
      notes: 'only required to override default colors, which are beautiful, so you can leave them alone'
    },
    cssRgbArray: {
      required: false,
      type: 'array',
      notes: 'only required to override default colors, which are beautiful, so you can leave them alone'
    },
    cssBackground: {
      required: false,
      type: 'string',
      notes: 'defaults to white or gray background'
    },
    cssLegendPosition: {
      required: false,
      type: 'string',
      notes: 'defaults to legend on the bottom'
    },
    cssWidthOuter: {
      type: 'number',
      required: true,
      notes: 'required to set the size of the graph, since this number is fixed on mount, be sure not to mount the graph until your window has loaded and these dimensions are calculated'
    },
    cssHeightOuter: {
      type: 'number',
      required: true,
      notes: 'required to set the size of the graph, since this number is fixed on mount, be sure not to mount the graph until your window has loaded and these dimensions are calculated'
    },
    cssWidthControls: {
      type: 'number',
      required: false,
      notes: 'defaults to 40'
    },
    cssHeightFooter: {
      type: 'number',
      required: false,
      notes: 'saves space for the footer, defaults to 160; this is so that the dimensions you provide are for the graph, and so that the footer does not eat into graph space, which can be a problem on small screens'
    },
    cssHeightSelectors: {
      type: 'number',
      required: false,
      notes: 'required only to fix the height of selectors, which we used to do frequently, but it is better just to let them flow with the window, so prefer to omit this prop'
    },
    selectorsAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to true, only set to false if you do not want users to be able to use selectors'
    },
    selectorsInFocus: {
      type: 'string',
      required: false,
      notes: 'used to set the default selector in focus on load'
    },
    printAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to true, only set to false if you do not want users to be able to print'
    },
    backgroundAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to true, only set to false if you do not want users to be able to toggle the background color'
    },
    advanceAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to false, typically set to true for platforms IF the platform is not the last one in the list'
    },
    retreatAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to false, typically set to true for platforms IF the platform is not the first one in the list'
    },
    yAxisAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to true, only set to false if you do not want the user to toggle the Y axes'
    },
    groupAllow: {
      type: 'boolean',
      required: false,
      notes: 'defaults to false, typically set to true ONLY you want to let the user group data (same as "overlay" in search selectors), which is tricky; a good example is pulling up multiple tests and grouping the tests by id after they mount; better to disable this and group before'
    },
    groupColors: {
      type: 'boolean',
      required: false,
      notes: 'typically omit, and send in colors with each item, e.g. a color per test; I think these might be overwritten by that data anyway'
    },
    isGrouped: {
      type: 'boolean',
      required: false,
      notes: 'defaults to false, typically set this to true when a search is performed for group data; when data is already grouped, the groupAllow property is disabled (cannot group twice)'
    },
    groupByOnMount: {
      type: 'string',
      required: false,
      notes: 'defaults to undefined, typical use case is to 1) search for tests with "overlay" checked, 2) search form knows that overlay tests groups labHiFreq by id_test, 3) set groupByOnMount to id_test, 4) let GraphWrapper group the data'
    },
    groupsSub: {
      type: 'array',
      required: false,
      notes: 'defualts to undefined, this is used to prefix layers within a group; typical use use is to 1) search for platform events, 2) platform events get grouped by event #, 3) platforms A, B, C, D are passed in as groupsSub, 4) GraphWrapper then formats layers as EVENT_PLATFORM_LAYER'
    },
    presets: {
      type: 'object',
      required: true,
      notes: 'no data will initially load without presets; you could potentially just allow the user to use selectors, but that is not a good option'
    },
    keyToCompareOnNewData: {
      type: 'string',
      required: false,
      deprecated: true,
      notes: 'use keyToCompareOnNewData'
    },
    keyToCompareOnAdvance: {
      type: 'string',
      required: false,
      deprecated: true,
      notes: 'defaults to xLabel; key to compare when the graph advances position'
    },
    xEnd: {
      type: 'number',
      required: false,
      notes: 'end of X axis; defaults to 1000 (I think this resets to the actual end if over 1000); best to let default and change via selectors'
    },
    xIdealTickSpacing: {
      type: 'number',
      required: false,
      notes: 'spacing of ticks on X axis; defaults to 6; best to let default and change via selectors'
    },
    xLabelStartAt: {
      type: 'number',
      required: false,
      notes: 'defaults to null; I cannot think of a use case for this. X axis always starts at 0, so I do not know why we would start the labels other than zero; I think that would result in an incorrect labeling, but that is not tested'
    },
    xLabelKey: {
      type: 'string',
      required: false,
      notes: 'key in the data set to use for labeling the X axis; defaults to sequence of integers (index of the array of data); set this to "xLabel" you do want to use something else (such as a formatted date); currently xLabel is hard-coded in, and not used for anything else, to use that key'
    },
    xLabel: {
      type: 'string',
      required: false,
      notes: 'overall label for the X axis, such as "hourly measurements"'
    },
    yAxisUnitOptions: {
      type: 'array',
      required: 'preferred',
      notes: 'this defaults to an empty object, which is "squish to fit" if omitted'
    },
    handleBackgroundColor: {
      type: 'function',
      required: props.backgroundAllow,
      notes: 'defaults to an empty function; GraphWrapper always has a transparent background, but changes its colors to work over a white or dark gray/black background; it is outside the scope of GraphWrapper to change the background, since you might want the background to be larger than the graph'
    },
    handleFetchAdvanceRequest: {
      type: 'function',
      required: props.advanceAllow || props.retreatAllow,
      notes: 'GraphWrapper does not fetch your data; you need to do that outside the widget; if you are going to let the user advance or retreat, pass in a function that will do that'
    },
    onMount: {
      type: 'function',
      required: false,
      notes: 'pass in a function that you want to run when GraphWrapper mounts; the function will have no effect on GraphWrapper'
    },
    developerWarnings: {
      type: 'boolean',
      required: false,
      notes: 'if you are seeing this message, you have developer warnings turned on'
    }
  };
  for (var prop in expected) {
    var theProp = expected[prop];
    var youSent = props[prop];
    var problem = expected[prop].type === ['string', 'object'] && !(isObjectLiteral(youSent) || typeof youSent === 'string') ? 'not object or string' : expected[prop].type === 'object' && !isObjectLiteral(youSent) ? 'not object' : expected[prop].type === 'array' && !Array.isArray(youSent) ? 'not array' : expected[prop].type === 'number' && !isPrimitiveNumber(youSent) ? 'not number' : expected[prop].type === 'string' && typeof youSent !== 'string' ? 'not string' : expected[prop].type === 'boolean' && typeof youSent !== 'boolean' ? 'not boolean' : null;
    var method = theProp.required === true && problem ? 'error' : theProp.required && problem ? 'warn' : problem && options.all ? 'log' : null;
    if (method) {
      console[method](prop, theProp.type, theProp.notes, 'you sent: ', Array.isArray(youSent) ? 'array' : _typeof(youSent), youSent);
    }
  }
};
module.exports = {
  consoleDeveloperWarnings: consoleDeveloperWarnings
};