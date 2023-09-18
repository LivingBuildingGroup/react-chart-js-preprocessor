'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = require('conjunction-junction'),
  isPrimitiveNumber = _require.isPrimitiveNumber,
  isObjectLiteral = _require.isObjectLiteral,
  immutableArrayInsert = _require.immutableArrayInsert,
  convertCcToSc = _require.convertCcToSc,
  convertScToSpace = _require.convertScToSpace;
var _require2 = require('conjunction-junction/build/objects'),
  subArrayByKey = _require2.subArrayByKey;
var _require3 = require('./helpers-layers'),
  createLayerSelectors = _require3.createLayerSelectors;
var _require4 = require('./helpers-styles'),
  createStylesArray = _require4.createStylesArray;
var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var indexLabel = 1;
var indexUnit = 2;

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

var parseDataArraysByKeys = function parseDataArraysByKeys(dataObjectsArray, layersSelected) {
  if (!Array.isArray(dataObjectsArray)) {
    return [[]];
  }
  if (!Array.isArray(layersSelected)) {
    return [[]];
  }
  var dataType0Processed = layersSelected.map(function (key) {
    return dataObjectsArray.map(function (k) {
      return k[key];
    });
  });
  return dataType0Processed;
};
var parseLabelsByKeys = function parseLabelsByKeys(legendHash, layersSelected) {
  var dataLabelArray = layersSelected.map(function (key) {
    var label = typeof legendHash[key] === 'string' ? legendHash[key] : legendHash[key] && legendHash[key].l ? legendHash[key].l : key;
    return label;
  });
  return dataLabelArray;
};
var parseYAxisByKeys = function parseYAxisByKeys(legendHash, layersSelected) {
  var axesUsed = [];
  var yAxisIdArray = [];
  var yAxisArray = layersSelected.map(function (layerName, i) {
    var yAxisLabel = legendHash && legendHash[layerName] && typeof legendHash[layerName].u === 'string' ? convertScToSpace(legendHash[layerName].u) : 'units';
    var axisIndex = axesUsed.findIndex(function (a) {
      return a === yAxisLabel;
    });
    if (axisIndex < 0) {
      yAxisIdArray[i] = alpha[axesUsed.length];
      axesUsed.push(yAxisLabel);
    } else {
      yAxisIdArray[i] = alpha[axisIndex];
    }
    return yAxisLabel;
  });
  return {
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  };
};
var parseDataType1To0 = function parseDataType1To0(dataType1, legendHash, layersSelected) {
  if (!Array.isArray(dataType1) || !Array.isArray(layersSelected) || !isObjectLiteral(legendHash)) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }
  var dataType0Raw = parseDataArraysByKeys(dataType1, layersSelected);
  var dataLabelArray = parseLabelsByKeys(legendHash, layersSelected);
  var _parseYAxisByKeys = parseYAxisByKeys(legendHash, layersSelected),
    yAxisArray = _parseYAxisByKeys.yAxisArray,
    yAxisIdArray = _parseYAxisByKeys.yAxisIdArray;
  console.log({
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  });
  return {
    dataType0Raw: dataType0Raw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  };
};
var parseDataType2To0 = function parseDataType2To0(arraysOfDataObjects, arrayOfDataGroups, legendHash, layersSelectedRaw) {
  if (!Array.isArray(arraysOfDataObjects) || !Array.isArray(arraysOfDataObjects[0]) || !Array.isArray(layersSelectedRaw) || !Array.isArray(arrayOfDataGroups) || !isObjectLiteral(legendHash)) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }
  var dataType0Raw = [];
  arraysOfDataObjects.forEach(function (group) {
    var subgroup = parseDataArraysByKeys(group, layersSelectedRaw);
    dataType0Raw = [].concat(_toConsumableArray(dataType0Raw), _toConsumableArray(subgroup));
  });
  var rawLabels = parseLabelsByKeys(legendHash, layersSelectedRaw);
  var dataLabelArray = [];
  var layersSelected = [];
  arrayOfDataGroups.forEach(function (group) {
    var prefixedLabels = rawLabels.map(function (l) {
      return "".concat(group, " ").concat(l);
    });
    var prefixedKeys = layersSelectedRaw.map(function (k) {
      return "".concat(group).concat(k);
    });
    dataLabelArray = [].concat(_toConsumableArray(dataLabelArray), _toConsumableArray(prefixedLabels));
    layersSelected = [].concat(_toConsumableArray(layersSelected), _toConsumableArray(prefixedKeys));
  });
  var _parseYAxisByKeys2 = parseYAxisByKeys(legendHash, layersSelectedRaw),
    yAxisArray = _parseYAxisByKeys2.yAxisArray,
    yAxisIdArray = _parseYAxisByKeys2.yAxisIdArray;
  return {
    dataType0Raw: dataType0Raw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    layersSelected: layersSelected
  };
};
var parseDataType2To1 = function parseDataType2To1(arraysOfDataObjects, arrayOfDataGroups, keysSkip) {
  if (!Array.isArray(arraysOfDataObjects) || !Array.isArray(arrayOfDataGroups)) {
    return {
      dataObjectsArray: [],
      dataLabelArray: [],
      message: 'invalid data types'
    };
  }
  if (arrayOfDataGroups.length !== arraysOfDataObjects.length) {
    return {
      dataObjectsArray: [],
      dataLabelArray: [],
      message: "we found ".concat(arrayOfDataGroups.length, " labels and ").concat(arraysOfDataObjects.length, " arrays.")
    };
  }
  var indexOfLongestArray = 0;
  var longestArrayLength = 0;
  var arrErr = false;
  arraysOfDataObjects.forEach(function (arr, i) {
    if (Array.isArray(arr)) {
      if (arr.length > longestArrayLength) {
        longestArrayLength = arr.length;
        indexOfLongestArray = i;
      }
    } else {
      arrErr = true; // edit to send a message
    }
  });

  if (arrErr) {
    return {
      dataObjectsArray: [],
      dataLabelArray: [],
      message: 'expected a subarray, but found none'
    };
  }
  var longestArray = arraysOfDataObjects[indexOfLongestArray];

  // validated, all arrays are present, and 1 label per array
  var dataObjectsArray = longestArray.map(function () {
    return {};
  });
  var keysToSkip = Array.isArray(keysSkip) ? keysSkip : [];
  // return new object with all keys prefixed
  arraysOfDataObjects.forEach(function (group, i) {
    var prefix = arrayOfDataGroups[i];
    var prefixDivider = '__';
    group.forEach(function (innerObject, pt) {
      for (var key in innerObject) {
        // the double underscore is intentional
        // we might want to un-prefix later
        if (keysToSkip.includes(key)) {
          dataObjectsArray[pt][key] = innerObject[key];
        } else {
          dataObjectsArray[pt]["".concat(prefix).concat(prefixDivider).concat(key)] = innerObject[key];
        }
      }
    });
  });
  return {
    dataObjectsArray: dataObjectsArray,
    indexOfLongestArray: indexOfLongestArray,
    longestArrayLength: longestArrayLength
  };
};
var parseDataType1 = function parseDataType1(gs) {
  var keysSkip = ['xLabel'];
  var dataType1ParsedFrom2 = Array.isArray(gs.dataType2Raw) ? parseDataType2To1(gs.dataType2Raw, gs.groups, keysSkip).dataObjectsArray : [];
  var dataType1 = gs.dataConvertFrom === 2 ? dataType1ParsedFrom2 : gs.dataConvertFrom === 0 ?
  // <<< must be a future option
  [] : Array.isArray(gs.dataType1Raw) ? gs.dataType1Raw.map(function (d) {
    return Object.assign({}, d);
  }) : [];
  return dataType1;
};
var calcDataLength = function calcDataLength(dataType0Raw, start, end) {
  var oneDataset = !Array.isArray(dataType0Raw) ? null : !Array.isArray(dataType0Raw[0]) ? null : dataType0Raw[0];
  if (!oneDataset) return {
    first: 0,
    last: 0,
    dataLength: 0
  };
  var same = {
    first: 0,
    last: oneDataset.length - 1,
    dataLength: oneDataset.length
  };
  if (!isPrimitiveNumber(start) || !isPrimitiveNumber(end)) return same;
  var first = start < 0 ? 0 : start;
  var last = end > oneDataset.length - 1 ? oneDataset.length - 1 : end;
  if (first >= last) return same;
  // should be validated that we have at least 2 datapoints, start before end, within array
  return {
    first: first,
    last: last,
    dataLength: last - first + 1
  };
};
var conformDataLength = function conformDataLength(dataType0Raw, first, length, pointsToAdd) {
  // assume 
  var oneDataset = !Array.isArray(dataType0Raw) ? [] : !Array.isArray(dataType0Raw[0]) ? [] : dataType0Raw[0];
  if (oneDataset.length === length) {
    return dataType0Raw;
  }
  var end = first + length;
  var extension = [];
  if (pointsToAdd) {
    for (var i = 0; i < pointsToAdd; i++) {
      extension.push(null);
    }
  }
  var dataType0Processed = dataType0Raw.map(function (a) {
    var newArray = a.slice(first, end);
    if (pointsToAdd) {
      newArray.push.apply(newArray, extension);
    }
    return newArray;
  });
  return dataType0Processed;
};
var addDataset = function addDataset(input) {
  var graphData = input.graphData,
    data = input.data,
    label = input.label,
    style = input.style,
    styles = input.styles;
  var gd = Object.assign({}, graphData);
  var theLabel = typeof label === 'string' ? label : "dataset ".concat(gd.datasets.length);
  var styl = style ? style : styles ? styles.style2 :
  // make this pick from the array
  gd.datasets[0];
  var newDataset = Object.assign({}, styl, {
    data: data,
    label: theLabel
  });
  var datasets = [].concat(_toConsumableArray(gd.datasets), [newDataset]);
  return Object.assign({}, gd, {
    datasets: datasets
  });
};
var addDatapoints = function addDatapoints(input) {
  var graphData = input.graphData,
    data = input.data,
    label = input.label;
  var newLabel = typeof label === 'string' ? label : "point".concat(graphData.labels.length);
  var newLabels = [].concat(_toConsumableArray(graphData.labels), [newLabel]);
  var newDatasets = graphData.datasets.map(function (d, i) {
    var newDat = [].concat(_toConsumableArray(d.data), [data[i]]);
    return Object.assign({}, d, {
      data: newDat
    });
  });
  return Object.assign({}, graphData, {
    datasets: newDatasets,
    labels: newLabels
  });
};
var editDatapoint = function editDatapoint(input) {
  var graphData = input.graphData,
    data = input.data,
    setIndex = input.setIndex,
    index = input.index;
  if (!isPrimitiveNumber(setIndex)) return graphData;
  if (!isPrimitiveNumber(index)) return graphData;
  var dataset = graphData.datasets[setIndex];
  var newData = immutableArrayInsert(index, dataset.data, data);
  var newDataset = Object.assign({}, dataset, {
    data: newData
  });
  var newDatasets = immutableArrayInsert(setIndex, graphData.datasets, newDataset);
  return Object.assign({}, graphData, {
    datasets: newDatasets
  });
};
var createGraphData = function createGraphData(graphState) {
  // create entirely new data
  var layersSelected = graphState.layersSelected,
    dataType0Processed = graphState.dataType0Processed,
    dataLabelArray = graphState.dataLabelArray,
    yAxisArray = graphState.yAxisArray,
    yAxisIdArray = graphState.yAxisIdArray,
    stylesArray = graphState.stylesArray,
    xLabelsArray = graphState.xLabelsArray;
  var datasets = Array.isArray(layersSelected) ? layersSelected.map(function (k, i) {
    var units = yAxisArray[i];
    var unitsIndex = yAxisArray.findIndex(function (u) {
      return u === units;
    });
    var yAxisID = unitsIndex < 0 ? yAxisIdArray[0] : yAxisIdArray[unitsIndex];
    return Object.assign({}, stylesArray[i], {
      label: dataLabelArray[i],
      yAxisID: yAxisID,
      data: dataType0Processed[i]
    });
  }) : [];
  var startAt = 0;
  var labels = Array.isArray(xLabelsArray) ? xLabelsArray : !Array.isArray(dataType0Processed) ? [] : !Array.isArray(dataType0Processed[0]) ? [] : dataType0Processed[0].map(function (_, i) {
    return i + startAt;
  });
  return {
    labels: labels,
    datasets: datasets
  };
};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

var calcTicks = function calcTicks(dataLength, idealSpacing) {
  // dataLength should be the data we want to show, i.e. after cropping (by the user), if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  var maxTicks = Math.ceil((dataLength - 1) / idealSpacing);
  var lengthRoundUp = idealSpacing * maxTicks;
  var pointsToAdd = lengthRoundUp - dataLength - 1;
  return {
    maxTicks: maxTicks,
    lengthRoundUp: lengthRoundUp,
    pointsToAdd: pointsToAdd
  };
};
var defaultXAxis = {
  display: true,
  // type: 'linear',
  gridLines: {
    display: true
  },
  scaleLabel: {
    // labels the entire scale
    display: true
  },
  pointLabels: {
    fontSize: 12
  },
  ticks: {
    display: true,
    autoSkip: true
    // stepSize: 6, // this is not working
    // min: 0,   // changing these will change the dataset displayed
    // max: 186, // ""
    // maxTicksLimit: 100,
    // suggestedMin: 6,   // not using these
    // suggestedMax: 100, // ""
  }
};

var createXAxis = function createXAxis(options) {
  var label = options.label,
    cssBackground = options.cssBackground,
    min = options.min,
    max = options.max,
    maxTicksLimit = options.maxTicksLimit;
  var zeroLineColor = cssBackground === 'white' ? 'black' : 'white';
  var gridLinesColor = cssBackground === 'white' ? 'rgba(68,68,68,0.5)' : 'rgba(119,119,119,0.5)';
  var scaleAndTickColor = cssBackground === 'white' ? 'rgb(0, 0, 77)' : 'white';
  var gridLines = Object.assign({}, defaultXAxis.gridLines, {
    zeroLineColor: zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor
  });
  var ticks = Object.assign({}, defaultXAxis.ticks, {
    fontColor: scaleAndTickColor,
    min: min || 0,
    max: max || 500,
    maxTicksLimit: maxTicksLimit || 100
  });
  var scaleLabel = label ? Object.assign({}, defaultXAxis.scaleLabel, {
    labelString: label,
    fontColor: scaleAndTickColor
  }) : {
    display: false
  };
  return Object.assign({}, defaultXAxis, {
    gridLines: gridLines,
    ticks: ticks,
    scaleLabel: scaleLabel
  });
};
var defaultYAxis = {
  type: 'linear',
  display: true,
  gridLines: {
    display: true
  },
  pointLabels: {
    fontSize: 12
  },
  ticks: {
    display: true
  },
  scaleLabel: {
    // labels the entire scale
    display: true
  }
};
var createYAxis = function createYAxis(options) {
  var label = options.label,
    id = options.id,
    cssBackground = options.cssBackground,
    min = options.min,
    max = options.max,
    displayTicks = options.displayTicks,
    displayGridlines = options.displayGridlines;
  var zeroLineColor = cssBackground === 'white' ? 'black' : 'white';
  var gridLinesColor = cssBackground === 'white' ? 'rgba(68,68,68,0.5)' : 'rgba(119,119,119,0.5)';
  var scaleAndTickColor = cssBackground === 'white' ? 'rgb(0, 0, 77)' : 'white';
  var gridLines = Object.assign({}, defaultYAxis.gridLines, {
    zeroLineColor: zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor
  });
  if (typeof displayGridlines === 'boolean' && !displayGridlines) {
    gridLines.display = false;
  }
  var ticks = Object.assign({}, defaultYAxis.ticks, {
    fontColor: scaleAndTickColor,
    min: min,
    max: max
  });
  if (typeof displayTicks === 'boolean' && !displayTicks) {
    ticks.display = false;
  }
  var scaleLabel = Object.assign({}, defaultYAxis.scaleLabel, {
    labelString: convertCcToSc(label, ' '),
    fontColor: scaleAndTickColor
  });
  return Object.assign({}, defaultYAxis, {
    id: id || 'A',
    position: 'left',
    gridLines: gridLines,
    ticks: ticks,
    scaleLabel: scaleLabel
  });
};
var createYAxesOptions = function createYAxesOptions(options) {
  var labels = options.labels,
    cssBackground = options.cssBackground,
    yAxisUnitOptions = options.yAxisUnitOptions;
  var _yAxisUnitOptions = isObjectLiteral(yAxisUnitOptions) ? yAxisUnitOptions : {};
  var labelsUsed = [];
  var subOptions = [];
  if (Array.isArray(labels)) {
    labels.forEach(function (l) {
      var thisOption = isObjectLiteral(_yAxisUnitOptions[l]) ? _yAxisUnitOptions[l] : {};
      var usedIndex = labelsUsed.findIndex(function (u) {
        return u === l;
      });
      var id;
      if (usedIndex < 0) {
        labelsUsed.push(l);
        id = alpha[labelsUsed.length - 1];
        var optionsToPush = {
          label: l,
          id: id,
          position: 'left',
          cssBackground: cssBackground,
          min: thisOption.min,
          max: thisOption.max,
          maxTicksLimitY: thisOption.maxTicksLimitY
        };
        if (typeof thisOption.displayTicks === 'boolean') {
          optionsToPush.displayTicks = thisOption.displayTicks;
        }
        if (typeof thisOption.displayGridlines === 'boolean') {
          optionsToPush.displayGridlines = thisOption.displayGridlines;
        }
        subOptions.push(optionsToPush);
      }
    });
  }
  subOptions.sort(function (a, b) {
    return a.label - b.label;
  });
  return subOptions;
};
var createYAxes = function createYAxes(arrayOfOptions) {
  var yAxes = arrayOfOptions.map(function (o) {
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

var createGraphOptions = function createGraphOptions(options) {
  var yLabel = options.yLabel,
    xLabel = options.xLabel,
    cssBackground = options.cssBackground,
    minX = options.minX,
    maxX = options.maxX,
    maxTicksLimitX = options.maxTicksLimitX,
    yAxisUnitOptions = options.yAxisUnitOptions;
  var yAxesOptions = {
    labels: Array.isArray(yLabel) ? yLabel : [],
    cssBackground: cssBackground,
    yAxisUnitOptions: yAxisUnitOptions
  };
  var arrayOfYOptions = createYAxesOptions(yAxesOptions);
  var xAxisOptions = {
    label: xLabel ? xLabel : null,
    cssBackground: cssBackground,
    min: minX,
    max: maxX,
    maxTicksLimit: maxTicksLimitX
  };
  return {
    responsive: true,
    tooltips: {
      mode: 'label'
    },
    maintainAspectRatio: true,
    legend: {
      display: true,
      fullWidth: true,
      reverse: false,
      position: 'bottom',
      labels: {
        fontColor: cssBackground === 'white' ? 'black' : 'white'
      }
    },
    scales: {
      xAxes: [createXAxis(xAxisOptions)],
      yAxes: createYAxes(arrayOfYOptions)
    }
  };
};

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

var checkForGraphRefresh = function checkForGraphRefresh(graphOptions, graphOptionsPrior, cssBackground, cssBackgroundPrior, isTickChange) {
  var message = 'ok';
  var needsRefresh = cssBackground !== cssBackgroundPrior;
  if (needsRefresh) return {
    needsRefresh: needsRefresh,
    message: 'background changed'
  };
  if (isTickChange) {
    needsRefresh = true;
    return {
      needsRefresh: needsRefresh,
      message: 'X-axis tick count changed'
    };
  }
  var yAxes = !graphOptions ? [] : !graphOptions.scales ? [] : !Array.isArray(graphOptions.scales.yAxes) ? [] : graphOptions.scales.yAxes;
  var yAxesPrior = !graphOptionsPrior ? [] : !graphOptionsPrior.scales ? [] : !Array.isArray(graphOptionsPrior.scales.yAxes) ? [] : graphOptionsPrior.scales.yAxes;
  if (yAxes.length !== yAxesPrior.length) {
    needsRefresh = true;
    return {
      needsRefresh: needsRefresh,
      message: "prior Y axes length: ".concat(yAxesPrior.length, ", new length: ").concat(yAxes.length)
    };
  }
  yAxes.forEach(function (a, i) {
    if (!needsRefresh) {
      // only check if we don't need a refresh so far
      var oldLabel = !yAxesPrior[i].scaleLabel ? '<no scale label>' : !yAxesPrior[i].scaleLabel.labelString ? '<no label string>' : yAxesPrior[i].scaleLabel.labelString;
      var newLabel = !a.scaleLabel ? '<no scale label>' : !a.scaleLabel.labelString ? '<no label string>' : a.scaleLabel.labelString;
      if (a.id !== yAxesPrior[i].id) {
        needsRefresh = true;
        message = "id mismatch at index ".concat(i, " (old: ").concat(yAxesPrior[i].id, ", new: ").concat(a.id, ")");
      } else if (oldLabel !== newLabel) {
        needsRefresh = true;
        message = "label mismatch at index ".concat(i, " (old: ").concat(oldLabel, ", new: ").concat(newLabel, ")");
      }
    }
  });
  return {
    needsRefresh: needsRefresh,
    message: message
  };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

var createGraph = function createGraph(gs) {
  var graphState = Object.assign({}, gs, {
    // the 3 below are used to check for refresh
    cssBackgroundPrior: gs.cssBackground,
    graphOptionsPrior: gs.graphOptions,
    stylesArray: createStylesArray(gs.layersSelected, gs.styles, gs.cssStyleColorsNamed, gs.cssRgbArray // this is a default, ignored if 2 prior keys are satisfactory
    )
  });

  var _parseDataType1To = parseDataType1To0(graphState.dataType1, graphState.legendHash, graphState.layersSelected),
    dataType0Raw = _parseDataType1To.dataType0Raw,
    dataLabelArray = _parseDataType1To.dataLabelArray,
    yAxisArray = _parseDataType1To.yAxisArray,
    yAxisIdArray = _parseDataType1To.yAxisIdArray;
  var _calcDataLength = calcDataLength(dataType0Raw, graphState.xStart, graphState.xEnd),
    first = _calcDataLength.first,
    dataLength = _calcDataLength.dataLength;
  var _calcTicks = calcTicks(dataLength, graphState.xIdealTickSpacing),
    maxTicks = _calcTicks.maxTicks,
    lengthRoundUp = _calcTicks.lengthRoundUp,
    pointsToAdd = _calcTicks.pointsToAdd;
  var dataType0Processed = conformDataLength(dataType0Raw, first, lengthRoundUp, pointsToAdd);
  var optionsInput = {
    yLabel: yAxisArray,
    xLabel: graphState.xLabel,
    cssBackground: graphState.cssBackground,
    minX: first,
    maxX: lengthRoundUp,
    maxTicksLimitX: maxTicks,
    yAxisUnitOptions: graphState.yAxisUnitOptions
  };
  var graphOptions = createGraphOptions(optionsInput);
  var _checkForGraphRefresh = checkForGraphRefresh(graphOptions, graphState.graphOptionsPrior, graphState.cssBackground, graphState.cssBackgroundPrior, graphState.isTickChange),
    needsRefresh = _checkForGraphRefresh.needsRefresh;
  var xLabelsArray = graphState.xLabelKey ? parseDataArraysByKeys(graphState.dataType1, [graphState.xLabelKey])[0] : null;
  var graphData = createGraphData({
    layersSelected: graphState.layersSelected,
    dataType0Processed: dataType0Processed,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    stylesArray: graphState.stylesArray,
    xLabelsArray: xLabelsArray
  });
  return {
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData: graphData,
    // this includes { datasets, labels }, which go directly to graph
    graphOptions: graphOptions,
    // remaining keys NOT passed as props to graph
    needsRefresh: needsRefresh,
    // rendering control
    yAxisArray: yAxisArray // history key
  };
};

var createGraphInfoOnGroupOrMount = function createGraphInfoOnGroupOrMount(gs, legendHash, indexUnits) {
  if (!isObjectLiteral(gs)) {
    return {};
  }
  var graphState = Object.assign({}, gs);
  var groupByNow = graphState.groupByNow || graphState.groupByOnMount;
  if (groupByNow) {
    var _subArrayByKey = subArrayByKey(graphState.dataType1Raw, groupByNow),
      groupBy = _subArrayByKey.groupBy,
      arraysOfDataObjects = _subArrayByKey.arraysOfDataObjects,
      arrayOfDataGroups = _subArrayByKey.arrayOfDataGroups;

    // DANGEROUS !!!!
    graphState.dataType2Raw = arraysOfDataObjects;
    graphState.dataConvertFrom = 2;
    graphState.groupBy = groupBy;
    graphState.groups = arrayOfDataGroups;
    graphState.isGrouped = true;
  }
  var dataType1 = parseDataType1(graphState);
  var layerSelectors = createLayerSelectors(graphState, legendHash, indexUnits);
  return {
    dataType: 1,
    dataType1: dataType1,
    layersThatHaveUnits: layerSelectors.layersThatHaveUnits,
    layersAllPrefixed: layerSelectors.layersAllPrefixed,
    legendHash: layerSelectors.legendHash,
    layersGroupedByUnits: layerSelectors.layersGroupedByUnits,
    layerUnitsArray: layerSelectors.layerUnitsArray
  };
};
module.exports = {
  // data
  parseDataArraysByKeys: parseDataArraysByKeys,
  parseLabelsByKeys: parseLabelsByKeys,
  parseYAxisByKeys: parseYAxisByKeys,
  parseDataType1To0: parseDataType1To0,
  parseDataType2To1: parseDataType2To1,
  parseDataType2To0: parseDataType2To0,
  parseDataType1: parseDataType1,
  calcDataLength: calcDataLength,
  conformDataLength: conformDataLength,
  addDataset: addDataset,
  addDatapoints: addDatapoints,
  editDatapoint: editDatapoint,
  createGraphData: createGraphData,
  // axes
  calcTicks: calcTicks,
  createXAxis: createXAxis,
  createYAxis: createYAxis,
  // tested via createYAxes
  createYAxesOptions: createYAxesOptions,
  createYAxes: createYAxes,
  // options
  createGraphOptions: createGraphOptions,
  checkForGraphRefresh: checkForGraphRefresh,
  createGraph: createGraph,
  createGraphInfoOnGroupOrMount: createGraphInfoOnGroupOrMount
};