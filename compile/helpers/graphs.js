'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    immutableArrayInsert = _require.immutableArrayInsert,
    convertCcToSpace = _require.convertCcToSpace,
    convertScToSpace = _require.convertScToSpace;

var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

var indexAbbrev = 0;
var indexLabel = 1;
var indexUnit = 2;

var _require2 = require('./layers'),
    createLayerSelectors = _require2.createLayerSelectors;

var _require3 = require('./styles'),
    createStylesArray = _require3.createStylesArray;

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

var parseDataArraysByKeys = exports.parseDataArraysByKeys = function parseDataArraysByKeys(dataObjectsArray, layersArray) {
  if (!Array.isArray(dataObjectsArray)) return [[]];
  if (!Array.isArray(layersArray)) return [[]];
  var dataType0Processed = layersArray.map(function (key) {
    return dataObjectsArray.map(function (k) {
      return k[key];
    });
  });
  return dataType0Processed;
};

var parseLabelsByKeys = exports.parseLabelsByKeys = function parseLabelsByKeys(legendObject, layersArray) {
  var dataLabelArray = layersArray.map(function (key) {
    var label = typeof legendObject[key] === 'string' ? legendObject[key] : !Array.isArray(legendObject[key]) ? key : typeof legendObject[key][indexLabel] === 'string' ? legendObject[key][indexLabel] : key;
    return label;
  });
  return dataLabelArray;
};

var parseYAxisByKeys = exports.parseYAxisByKeys = function parseYAxisByKeys(legendObject, layersArray) {
  var axesUsed = [];
  var yAxisIdArray = [];
  var yAxisArray = layersArray.map(function (key, i) {
    var yAxisLabel = typeof legendObject[key] === 'string' ? 'units' : !Array.isArray(legendObject[key]) ? 'units' : typeof legendObject[key][indexUnit] === 'string' ? convertScToSpace(legendObject[key][indexUnit]) : 'units';
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

var parseDataType1To0 = exports.parseDataType1To0 = function parseDataType1To0(dataType1Processed, legendObject, layersArray) {
  if (!Array.isArray(dataType1Processed) || !Array.isArray(layersArray) || !isObjectLiteral(legendObject)) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }

  var dataType0Raw = parseDataArraysByKeys(dataType1Processed, layersArray);
  var dataLabelArray = parseLabelsByKeys(legendObject, layersArray);

  var _parseYAxisByKeys = parseYAxisByKeys(legendObject, layersArray),
      yAxisArray = _parseYAxisByKeys.yAxisArray,
      yAxisIdArray = _parseYAxisByKeys.yAxisIdArray;

  return {
    dataType0Raw: dataType0Raw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  };
};

var parseDataType2To0 = exports.parseDataType2To0 = function parseDataType2To0(arraysOfDataObjects, arrayOfDataGroups, legendObject, layersArrayRaw) {
  if (!Array.isArray(arraysOfDataObjects) || !Array.isArray(arraysOfDataObjects[0]) || !Array.isArray(layersArrayRaw) || !Array.isArray(arrayOfDataGroups) || !isObjectLiteral(legendObject)) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }

  var dataType0Raw = [];
  arraysOfDataObjects.forEach(function (group) {
    var subgroup = parseDataArraysByKeys(group, layersArrayRaw);
    dataType0Raw = [].concat(_toConsumableArray(dataType0Raw), _toConsumableArray(subgroup));
  });

  var rawLabels = parseLabelsByKeys(legendObject, layersArrayRaw);
  var dataLabelArray = [];
  var layersArray = [];
  arrayOfDataGroups.forEach(function (group) {
    var prefixedLabels = rawLabels.map(function (l) {
      return group + ' ' + l;
    });
    var prefixedKeys = layersArrayRaw.map(function (k) {
      return '' + group + k;
    });
    dataLabelArray = [].concat(_toConsumableArray(dataLabelArray), _toConsumableArray(prefixedLabels));
    layersArray = [].concat(_toConsumableArray(layersArray), _toConsumableArray(prefixedKeys));
  });

  var _parseYAxisByKeys2 = parseYAxisByKeys(legendObject, layersArrayRaw),
      yAxisArray = _parseYAxisByKeys2.yAxisArray,
      yAxisIdArray = _parseYAxisByKeys2.yAxisIdArray;

  return {
    dataType0Raw: dataType0Raw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    layersArray: layersArray
  };
};

var parseDataType2To1 = exports.parseDataType2To1 = function parseDataType2To1(arraysOfDataObjects, arrayOfDataGroups, keysSkip) {
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
      message: 'we found ' + arrayOfDataGroups.length + ' labels and ' + arraysOfDataObjects.length + ' arrays.'
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
          dataObjectsArray[pt]['' + prefix + prefixDivider + key] = innerObject[key];
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

var parseDataType1 = exports.parseDataType1 = function parseDataType1(state) {

  var keysSkip = ['xLabel'];

  var dataType1ParsedFrom2 = Array.isArray(state.dataType2Raw) ? parseDataType2To1(state.dataType2Raw, state.groups, keysSkip).dataObjectsArray : [];

  // NOT DONE YET !!!
  var dataType1ParsedFrom0 = []; // 0 = compound arrays, (e.g. storms)

  var dataType1Processed = state.dataConvertFrom === 2 ? dataType1ParsedFrom2 : state.dataConvertFrom === 0 ? dataType1ParsedFrom0 : Array.isArray(state.dataType1Raw) ? state.dataType1Raw : [];

  return dataType1Processed;
};

var calcDataLength = exports.calcDataLength = function calcDataLength(dataType0Raw, start, end) {
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

var conformDataLength = exports.conformDataLength = function conformDataLength(dataType0Raw, first, length, pointsToAdd) {
  // assume 
  var oneDataset = !Array.isArray(dataType0Raw) ? [] : !Array.isArray(dataType0Raw[0]) ? [] : dataType0Raw[0];
  if (oneDataset.length === length) return dataType0Raw;
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

var addDataset = exports.addDataset = function addDataset(input) {
  var graphData = input.graphData,
      data = input.data,
      label = input.label,
      style = input.style,
      styles = input.styles;

  var gd = Object.assign({}, graphData);
  var theLabel = typeof label === 'string' ? label : 'dataset ' + gd.datasets.length;
  var styl = style ? style : styles ? styles.style2 : // make this pick from the array
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

var addDatapoints = exports.addDatapoints = function addDatapoints(input) {
  var graphData = input.graphData,
      data = input.data,
      label = input.label;

  var newLabel = typeof label === 'string' ? label : 'point' + graphData.labels.length;
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

var editDatapoint = exports.editDatapoint = function editDatapoint(input) {
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

var createGraphData = exports.createGraphData = function createGraphData(input) {
  // create entirely new data
  var layersSelected = input.layersSelected,
      dataType0Processed = input.dataType0Processed,
      dataLabelArray = input.dataLabelArray,
      yAxisArray = input.yAxisArray,
      yAxisIdArray = input.yAxisIdArray,
      stylesArray = input.stylesArray,
      xLabelsArray = input.xLabelsArray,
      xLabelStartAt = input.xLabelStartAt;


  var datasets = layersSelected.map(function (k, i) {
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
  });

  var startAt = isPrimitiveNumber(xLabelStartAt) ? xLabelStartAt : 0;
  var labels = Array.isArray(xLabelsArray) ? xLabelsArray : !Array.isArray(dataType0Processed) ? [] : !Array.isArray(dataType0Processed[0]) ? [] : dataType0Processed[0].map(function (x, i) {
    return i + startAt;
  });

  return {
    labels: labels,
    datasets: datasets
  };
};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

var calcTicks = exports.calcTicks = function calcTicks(dataLength, idealSpacing) {
  // dataLength should be the data we want to show, i.e. after cropping, if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  var maxTicksLimitDown = Math.floor(dataLength / idealSpacing);
  var lengthRoundDown = maxTicksLimitDown * idealSpacing + 1 > dataLength ? maxTicksLimitDown * idealSpacing + 1 - idealSpacing : maxTicksLimitDown * idealSpacing + 1;

  var pointsToRemove = dataLength - lengthRoundDown;

  var maxTicksLimitUp = pointsToRemove === 0 ? maxTicksLimitDown : maxTicksLimitDown + 1;

  var lengthRoundUp =
  // do not round up, if increments of 1
  idealSpacing === 1 ? maxTicksLimitUp : maxTicksLimitUp * idealSpacing + 1 > dataLength + idealSpacing ? maxTicksLimitUp * idealSpacing + 1 - idealSpacing : maxTicksLimitUp * idealSpacing + 1;

  var pointsToAdd = lengthRoundUp - dataLength;

  return {
    maxTicksLimitDown: maxTicksLimitDown,
    lengthRoundDown: lengthRoundDown,
    pointsToRemove: pointsToRemove,
    maxTicksLimitUp: maxTicksLimitUp,
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
  scaleLabel: { // labels the entire scale
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

var createXAxis = exports.createXAxis = function createXAxis(options) {
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
  }) : { display: false };
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
  scaleLabel: { // labels the entire scale
    display: true
  }
};

var createYAxis = exports.createYAxis = function createYAxis(options) {
  var label = options.label,
      id = options.id,
      position = options.position,
      cssBackground = options.cssBackground,
      min = options.min,
      max = options.max,
      maxTicksLimitY = options.maxTicksLimitY;

  var zeroLineColor = cssBackground === 'white' ? 'black' : 'white';
  var gridLinesColor = cssBackground === 'white' ? 'rgba(68,68,68,0.5)' : 'rgba(119,119,119,0.5)';
  var scaleAndTickColor = cssBackground === 'white' ? 'rgb(0, 0, 77)' : 'white';
  var gridLines = Object.assign({}, defaultYAxis.gridLines, {
    zeroLineColor: zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor
  });
  var ticks = Object.assign({}, defaultYAxis.ticks, {
    fontColor: scaleAndTickColor,
    min: min,
    max: max,
    maxTicksLimit: maxTicksLimitY
  });
  var scaleLabel = Object.assign({}, defaultYAxis.scaleLabel, {
    labelString: convertCcToSpace(label),
    fontColor: scaleAndTickColor
  });
  return Object.assign({}, defaultYAxis, {
    id: id || 'A',
    position: position || 'left',
    gridLines: gridLines,
    ticks: ticks,
    scaleLabel: scaleLabel
  });
};

var createYAxesOptions = exports.createYAxesOptions = function createYAxesOptions(options) {
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
      var id = void 0,
          position = void 0;
      if (usedIndex < 0) {
        labelsUsed.push(l);
        id = alpha[labelsUsed.length - 1];
        position = 'left'; // labelsUsed.length % 2 === 0 ? 'right' : 'left' ;
        subOptions.push({
          label: l,
          id: id,
          position: position,
          cssBackground: cssBackground,
          min: thisOption.min,
          max: thisOption.max,
          maxTicksLimitY: thisOption.maxTicksLimitY
        });
      }
    });
  }
  subOptions.sort(function (a, b) {
    return a.label - b.label;
  });
  return subOptions;
};

var createYAxes = exports.createYAxes = function createYAxes(arrayOfOptions) {
  var yAxes = arrayOfOptions.map(function (o) {
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ LEGEND @@@@@@@@@@@@@@@


var defaultLegend = exports.defaultLegend = {
  display: true,
  position: 'bottom',
  fullWidth: true,
  reverse: false,
  labels: {}
};

var createLegend = exports.createLegend = function createLegend(options) {
  var position = options.position,
      cssBackground = options.cssBackground;

  var legendFontColor = cssBackground === 'white' ? 'black' : 'white';
  var labels = Object.assign({}, defaultLegend.labels, {
    fontColor: legendFontColor
  });
  return Object.assign({}, defaultLegend, {
    position: position || 'bottom',
    labels: labels
  });
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

var defaultOptions = exports.defaultOptions = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  maintainAspectRatio: true
};

var createGraphOptions = exports.createGraphOptions = function createGraphOptions(options) {
  var yLabel = options.yLabel,
      xLabel = options.xLabel,
      cssBackground = options.cssBackground,
      minX = options.minX,
      maxX = options.maxX,
      maxTicksLimitX = options.maxTicksLimitX,
      legendPosition = options.legendPosition,
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
  var legendOptions = {
    cssBackground: cssBackground,
    position: legendPosition
  };
  return Object.assign({}, defaultOptions, {
    legend: createLegend(legendOptions),
    scales: {
      xAxes: [createXAxis(xAxisOptions)],
      yAxes: createYAxes(arrayOfYOptions)
    }
  });
};

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

var checkForGraphRefresh = exports.checkForGraphRefresh = function checkForGraphRefresh(graphOptions, graphOptionsPrior, cssBackground, cssBackgroundPrior, ticksXChanged) {
  var message = 'ok';
  var needRefresh = cssBackground !== cssBackgroundPrior;
  if (needRefresh) return { needRefresh: needRefresh, message: 'background changed' };

  if (ticksXChanged) {
    needRefresh = true;
    return { needRefresh: needRefresh, message: 'X-axis tick count changed' };
  }

  var yAxes = !graphOptions ? [] : !graphOptions.scales ? [] : !Array.isArray(graphOptions.scales.yAxes) ? [] : graphOptions.scales.yAxes;
  var yAxesPrior = !graphOptionsPrior ? [] : !graphOptionsPrior.scales ? [] : !Array.isArray(graphOptionsPrior.scales.yAxes) ? [] : graphOptionsPrior.scales.yAxes;

  if (yAxes.length !== yAxesPrior.length) {
    needRefresh = true;
    return { needRefresh: needRefresh, message: 'prior Y axes length: ' + yAxesPrior.length + ', new length: ' + yAxes.length };
  }

  yAxes.forEach(function (a, i) {
    if (!needRefresh) {
      // only check if we don't need a refresh so far
      var oldLabel = !yAxesPrior[i].scaleLabel ? '<no scale label>' : !yAxesPrior[i].scaleLabel.labelString ? '<no label string>' : yAxesPrior[i].scaleLabel.labelString;
      var newLabel = !a.scaleLabel ? '<no scale label>' : !a.scaleLabel.labelString ? '<no label string>' : a.scaleLabel.labelString;
      if (a.id !== yAxesPrior[i].id) {
        needRefresh = true;
        message = 'id mismatch at index ' + i + ' (old: ' + yAxesPrior[i].id + ', new: ' + a.id + ')';
      } else if (oldLabel !== newLabel) {
        needRefresh = true;
        message = 'label mismatch at index ' + i + ' (old: ' + oldLabel + ', new: ' + newLabel + ')';
      }
    }
  });
  return { needRefresh: needRefresh, message: message };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

var createGraph = exports.createGraph = function createGraph(input) {
  var dataType1Processed = input.dataType1Processed,
      legendObject = input.legendObject,
      layersSelected = input.layersSelected,
      xIdealTickSpacing = input.xIdealTickSpacing,
      xIdealTickSpacingPrior = input.xIdealTickSpacingPrior,
      xLabel = input.xLabel,
      cssBackground = input.cssBackground,
      xStart = input.xStart,
      xEnd = input.xEnd,
      legendPosition = input.legendPosition,
      stylesArray = input.stylesArray,
      graphOptionsPrior = input.graphOptionsPrior,
      cssBackgroundPrior = input.cssBackgroundPrior,
      xLabelKey = input.xLabelKey,
      xLabelStartAt = input.xLabelStartAt,
      yAxisUnitOptions = input.yAxisUnitOptions;

  var _parseDataType1To = parseDataType1To0(dataType1Processed, legendObject, layersSelected),
      dataType0Raw = _parseDataType1To.dataType0Raw,
      dataLabelArray = _parseDataType1To.dataLabelArray,
      yAxisArray = _parseDataType1To.yAxisArray,
      yAxisIdArray = _parseDataType1To.yAxisIdArray;

  var _calcDataLength = calcDataLength(dataType0Raw, xStart, xEnd),
      first = _calcDataLength.first,
      dataLength = _calcDataLength.dataLength;

  var _calcTicks = calcTicks(dataLength, xIdealTickSpacing),
      maxTicksLimitDown = _calcTicks.maxTicksLimitDown,
      lengthRoundDown = _calcTicks.lengthRoundDown,
      pointsToRemove = _calcTicks.pointsToRemove,
      maxTicksLimitUp = _calcTicks.maxTicksLimitUp,
      lengthRoundUp = _calcTicks.lengthRoundUp,
      pointsToAdd = _calcTicks.pointsToAdd;

  var dataType0Processed = conformDataLength(dataType0Raw, first, lengthRoundUp, pointsToAdd);

  var optionsInput = {
    yLabel: yAxisArray,
    xLabel: xLabel,
    cssBackground: cssBackground,
    minX: first,
    maxX: lengthRoundUp + 1,
    maxTicksLimitX: maxTicksLimitUp,
    legendPosition: legendPosition,
    yAxisUnitOptions: yAxisUnitOptions
  };

  var graphOptions = createGraphOptions(optionsInput);

  var ticksXChanged = xIdealTickSpacing !== xIdealTickSpacingPrior ? true : false;

  var _checkForGraphRefresh = checkForGraphRefresh(graphOptions, graphOptionsPrior, cssBackground, cssBackgroundPrior, ticksXChanged),
      needRefresh = _checkForGraphRefresh.needRefresh,
      message = _checkForGraphRefresh.message;

  var xLabelsArray = xLabelKey ? parseDataArraysByKeys(dataType1Processed, [xLabelKey])[0] : null;

  var graphData = createGraphData({
    layersSelected: layersSelected,
    dataType0Processed: dataType0Processed,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    stylesArray: stylesArray,
    xLabelStartAt: xLabelStartAt,
    xLabelsArray: xLabelsArray
  });

  return {
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData: graphData, // this includes { datasets, labels }, which go directly to graph
    graphOptions: graphOptions,
    // remaining keys NOT passed as props to graph
    ready: true, // rendering control
    needRefresh: needRefresh, // rendering control
    cssBackground: cssBackground, // regurgitated for ease of returning to statey
    // following 5 arrays are parallel
    layersSelected: layersSelected, // regurgitated for ease of returning to state
    yAxisArray: yAxisArray, // history key
    xIdealTickSpacingPrior: xIdealTickSpacing, // history key
    testingKeys: {
      refreshMessage: message,
      yAxisIdArray: yAxisIdArray,
      dataType0Raw: dataType0Raw,
      dataType0Processed: dataType0Processed,
      dataLabelArray: dataLabelArray,
      first: first,
      dataLength: dataLength,
      maxTicksLimitDown: maxTicksLimitDown,
      maxTicksLimitUp: maxTicksLimitUp,
      lengthRoundDown: lengthRoundDown,
      lengthRoundUp: lengthRoundUp,
      pointsToRemove: pointsToRemove,
      pointsToAdd: pointsToAdd,
      ticksXChanged: ticksXChanged
    }
  };
};

var createGraphInfoOnGroupOrMount = exports.createGraphInfoOnGroupOrMount = function createGraphInfoOnGroupOrMount(state) {
  var data = {
    dataType: 1,
    dataType1Processed: parseDataType1(state)
  };
  var newState = Object.assign({}, state, data);
  var layerSelectors = createLayerSelectors(newState);
  /* createLayerSelectors returns
    layersThatHaveUnits, 
    layersAllPrefixed,
    legendObject,
    layersGroupedByUnits,
    layerUnitsArray,
  */
  return Object.assign({}, data, layerSelectors);
};

var formatGraphKeysInput = exports.formatGraphKeysInput = function formatGraphKeysInput(changeInput, state) {
  // changeInput can include any of the keys below
  // keys are sent individually
  var defaultInput = {
    layersSelected: state.layersSelected,
    xIdealTickSpacing: state.xIdealTickSpacing,
    cssBackground: state.cssBackground,
    xStart: state.xStart,
    xEnd: state.xEnd,
    legendPosition: state.cssLegendPosition,
    xLabel: state.xLabel,
    xLabelKey: state.xLabelKey,
    xLabelStartAt: state.xLabelStartAt,
    yAxisUnitOptions: state.yAxisUnitOptions
  };

  var constantInputs = {
    // constant, never change
    legendObject: state.legendObject,
    // these are used to check for refresh
    cssBackgroundPrior: state.cssBackground,
    graphOptionsPrior: state.graphOptions,
    dataType1Processed: state.dataType1Processed,
    xIdealTickSpacingPrior: state.xIdealTickSpacingPrior
  };

  var input = Object.assign({}, defaultInput, changeInput, constantInputs);

  input.stylesArray = createStylesArray(input.layersSelected, state.styles, state.cssStyleColorsNamed, state.cssRgbArray // this is a default, ignored if 2 prior keys are satisfactory
  );
  // END INPUTS ~~~ UPDATA GRAPH KEYS
  return input;
};

// export default { 
//   // data
//   parseDataArraysByKeys,
//   parseLabelsByKeys,
//   parseYAxisByKeys,
//   parseDataType1To0,
//   parseDataType2To1,
//   parseDataType2To0,
//   parseDataType1,
//   calcDataLength,
//   conformDataLength,
//   addDataset, 
//   addDatapoints,
//   editDatapoint,
//   createGraphData,
//   // axes
//   calcTicks,
//   createXAxis,
//   createYAxis, // tested via createYAxes
//   createYAxesOptions,
//   createYAxes,
//   // legend
//   createLegend,
//   // options
//   createGraphOptions,
//   checkForGraphRefresh,
//   createGraph,

//   createGraphInfoOnGroupOrMount,
//   formatGraphKeysInput,
// };