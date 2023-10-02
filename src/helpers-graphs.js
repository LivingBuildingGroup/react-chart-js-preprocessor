"use strict";

const {
  isPrimitiveNumber,
  isObjectLiteral,
  immutableArrayInsert,
  convertCcToSc,
  convertScToSpace,
} = require("conjunction-junction");
const { subArrayByKey } = require("conjunction-junction/build/objects");
const { createLayerSelectors } = require("./helpers-layers");
const { createStylesArray } = require("./helpers-styles");

const alpha = ["A", "B", "C", "D", "E", "F", "G", "H"];

const indexLabel = 1;
const indexUnit = 2;

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

const parseDataArraysByKeys = (dataObjectsArray, layersSelected) => {
  if (!Array.isArray(dataObjectsArray)) {
    return [[]];
  }
  if (!Array.isArray(layersSelected)) {
    return [[]];
  }
  const dataType0Processed = layersSelected.map((key) => {
    return dataObjectsArray.map((k) => {
      if (key === "contribRunoffLTotal") {
        return k.runoffLTotal;
      } else {
        return k[key];
      }
    });
  });
  return dataType0Processed;
};

const parseLabelsByKeys = (legendHash, layersSelected) => {
  const dataLabelArray = layersSelected.map((key) => {
    const label =
      typeof legendHash[key] === "string"
        ? legendHash[key]
        : legendHash[key] && legendHash[key].l
        ? legendHash[key].l
        : key;
    return label;
  });
  return dataLabelArray;
};

const parseYAxisByKeys = (legendUnits = {}, layersSelected) => {
  const axesUsed = [];
  const yAxisIdArray = [];
  const yAxisArray = layersSelected.map((layerName, i) => {
    const yAxisLabel =
      legendUnits &&
      legendUnits[layerName] &&
      typeof legendUnits[layerName] === "string"
        ? convertScToSpace(legendUnits[layerName])
        : "units";
    const axisIndex = axesUsed.findIndex((a) => a === yAxisLabel);
    if (axisIndex < 0) {
      yAxisIdArray[i] = alpha[axesUsed.length];
      axesUsed.push(yAxisLabel);
    } else {
      yAxisIdArray[i] = alpha[axisIndex];
    }
    return yAxisLabel;
  });
  return {
    yAxisArray,
    yAxisIdArray,
  };
};

const parseDataType1To0 = (
  dataType1,
  legendHash,
  layersSelected,
  legendUnits
) => {
  if (
    !Array.isArray(dataType1) ||
    !Array.isArray(layersSelected) ||
    !isObjectLiteral(legendHash)
  ) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: [],
    };
  }

  const dataType0Raw = parseDataArraysByKeys(dataType1, layersSelected);
  const dataLabelArray = parseLabelsByKeys(legendHash, layersSelected);
  const { yAxisArray, yAxisIdArray } = parseYAxisByKeys(
    legendUnits,
    layersSelected
  );
  console.log({
    yAxisArray,
    yAxisIdArray,
  });
  return {
    dataType0Raw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
  };
};

const parseDataType2To0 = (
  arraysOfDataObjects,
  arrayOfDataGroups,
  legendHash,
  layersSelectedRaw,
  legendUnits
) => {
  if (
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arraysOfDataObjects[0]) ||
    !Array.isArray(layersSelectedRaw) ||
    !Array.isArray(arrayOfDataGroups) ||
    !isObjectLiteral(legendHash)
  ) {
    return {
      dataType0Raw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: [],
    };
  }

  let dataType0Raw = [];
  arraysOfDataObjects.forEach((group) => {
    const subgroup = parseDataArraysByKeys(group, layersSelectedRaw);
    dataType0Raw = [...dataType0Raw, ...subgroup];
  });

  const rawLabels = parseLabelsByKeys(legendUnits, layersSelectedRaw);
  let dataLabelArray = [];
  let layersSelected = [];
  arrayOfDataGroups.forEach((group) => {
    const prefixedLabels = rawLabels.map((l) => `${group} ${l}`);
    const prefixedKeys = layersSelectedRaw.map((k) => `${group}${k}`);
    dataLabelArray = [...dataLabelArray, ...prefixedLabels];
    layersSelected = [...layersSelected, ...prefixedKeys];
  });

  const { yAxisArray, yAxisIdArray } = parseYAxisByKeys(
    legendHash,
    layersSelectedRaw
  );
  return {
    dataType0Raw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    layersSelected,
  };
};

const parseDataType2To1 = (
  arraysOfDataObjects,
  arrayOfDataGroups,
  keysSkip
) => {
  if (
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arrayOfDataGroups)
  ) {
    return {
      dataObjectsArray: [],
      dataLabelArray: [],
      message: "invalid data types",
    };
  }

  if (arrayOfDataGroups.length !== arraysOfDataObjects.length) {
    return {
      dataObjectsArray: [],
      dataLabelArray: [],
      message: `we found ${arrayOfDataGroups.length} labels and ${arraysOfDataObjects.length} arrays.`,
    };
  }

  let indexOfLongestArray = 0;
  let longestArrayLength = 0;
  let arrErr = false;
  arraysOfDataObjects.forEach((arr, i) => {
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
      message: "expected a subarray, but found none",
    };
  }

  const longestArray = arraysOfDataObjects[indexOfLongestArray];

  // validated, all arrays are present, and 1 label per array
  const dataObjectsArray = longestArray.map(() => {
    return {};
  });

  const keysToSkip = Array.isArray(keysSkip) ? keysSkip : [];
  // return new object with all keys prefixed
  arraysOfDataObjects.forEach((group, i) => {
    const prefix = arrayOfDataGroups[i];
    const prefixDivider = "__";
    group.forEach((innerObject, pt) => {
      for (let key in innerObject) {
        // the double underscore is intentional
        // we might want to un-prefix later
        if (keysToSkip.includes(key)) {
          dataObjectsArray[pt][key] = innerObject[key];
        } else {
          dataObjectsArray[pt][`${prefix}${prefixDivider}${key}`] =
            innerObject[key];
        }
      }
    });
  });

  return {
    dataObjectsArray,
    indexOfLongestArray,
    longestArrayLength,
  };
};

const parseDataType1 = (gs) => {
  const keysSkip = ["xLabel"];

  const dataType1ParsedFrom2 = Array.isArray(gs.dataType2Raw)
    ? parseDataType2To1(gs.dataType2Raw, gs.groups, keysSkip).dataObjectsArray
    : [];

  const dataType1 =
    gs.dataConvertFrom === 2
      ? dataType1ParsedFrom2
      : gs.dataConvertFrom === 0 // <<< must be a future option
      ? []
      : Array.isArray(gs.dataType1Raw)
      ? gs.dataType1Raw.map((d) => Object.assign({}, d))
      : [];

  return dataType1;
};

const calcDataLength = (dataType0Raw, start, end) => {
  const oneDataset = !Array.isArray(dataType0Raw)
    ? null
    : !Array.isArray(dataType0Raw[0])
    ? null
    : dataType0Raw[0];
  if (!oneDataset)
    return {
      first: 0,
      last: 0,
      dataLength: 0,
    };
  const same = {
    first: 0,
    last: oneDataset.length - 1,
    dataLength: oneDataset.length,
  };
  if (!isPrimitiveNumber(start) || !isPrimitiveNumber(end)) return same;
  const first = start < 0 ? 0 : start;
  const last = end > oneDataset.length - 1 ? oneDataset.length - 1 : end;
  if (first >= last) return same;
  // should be validated that we have at least 2 datapoints, start before end, within array
  return {
    first,
    last,
    dataLength: last - first + 1,
  };
};

const conformDataLength = (dataType0Raw, first, length, pointsToAdd) => {
  // assume
  const oneDataset = !Array.isArray(dataType0Raw)
    ? []
    : !Array.isArray(dataType0Raw[0])
    ? []
    : dataType0Raw[0];
  if (oneDataset.length === length) {
    return dataType0Raw;
  }
  const end = first + length;
  const extension = [];
  if (pointsToAdd) {
    for (let i = 0; i < pointsToAdd; i++) {
      extension.push(null);
    }
  }
  const dataType0Processed = dataType0Raw.map((a) => {
    const newArray = a.slice(first, end);
    if (pointsToAdd) {
      newArray.push(...extension);
    }
    return newArray;
  });
  return dataType0Processed;
};

const addDataset = (input) => {
  const { graphData, data, label, style, styles } = input;
  const gd = Object.assign({}, graphData);
  const theLabel =
    typeof label === "string" ? label : `dataset ${gd.datasets.length}`;
  const styl = style
    ? style
    : styles
    ? styles.style2 // make this pick from the array
    : gd.datasets[0];
  const newDataset = Object.assign({}, styl, {
    data,
    label: theLabel,
  });
  const datasets = [...gd.datasets, newDataset];
  return Object.assign({}, gd, {
    datasets,
  });
};

const addDatapoints = (input) => {
  const { graphData, data, label } = input;
  const newLabel =
    typeof label === "string" ? label : `point${graphData.labels.length}`;
  const newLabels = [...graphData.labels, newLabel];
  const newDatasets = graphData.datasets.map((d, i) => {
    const newDat = [...d.data, data[i]];
    return Object.assign({}, d, {
      data: newDat,
    });
  });
  return Object.assign({}, graphData, {
    datasets: newDatasets,
    labels: newLabels,
  });
};

const editDatapoint = (input) => {
  const { graphData, data, setIndex, index } = input;
  if (!isPrimitiveNumber(setIndex)) return graphData;
  if (!isPrimitiveNumber(index)) return graphData;

  const dataset = graphData.datasets[setIndex];
  const newData = immutableArrayInsert(index, dataset.data, data);
  const newDataset = Object.assign({}, dataset, {
    data: newData,
  });
  const newDatasets = immutableArrayInsert(
    setIndex,
    graphData.datasets,
    newDataset
  );

  return Object.assign({}, graphData, {
    datasets: newDatasets,
  });
};
const filterData = (
  originalData,
  labelsArray,
  minX,
  maxX,
  incrementSize,
  verbose
) => {
  const filteredData = [];
  const filteredLabels = [];
  for (let i = minX; i <= maxX; i += incrementSize) {
    filteredData.push(originalData[i]);
    filteredLabels.push(labelsArray[i]);
  }
  return {
    data: filteredData,
    labels: filteredLabels,
  };
};
const createGraphData = (graphState) => {
  // create entirely new data
  const {
    // the following 7 keys are parallel format
    // i.e. arrays of same length, arr1[n] goes with arr2[n]
    layersSelected,
    dataType0Processed,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    stylesArray,
    xLabelsArray,
    verbose,
  } = graphState;
  const xMaxTickLim =
    graphState.xStart - graphState.xEnd > 1000
      ? (graphState.xStart - graphState.xEnd) / 100
      : graphState.xStart - graphState.xEnd > 6000
      ? (graphState.xStart - graphState.xEnd) / 50
      : graphState.xStart - graphState.xEnd > 100
      ? (graphState.xStart - graphState.xEnd) / 10
      : 6;

  const minX = graphState.xStart;
  const maxX = graphState.xEnd;
  const incrementSize = graphState.incrementSize;

  const datasets = Array.isArray(layersSelected)
    ? layersSelected.map((k, i) => {
        const units = yAxisArray[i];
        const unitsIndex = yAxisArray.findIndex((u) => u === units);
        const yAxisID =
          unitsIndex < 0 ? yAxisIdArray[0] : yAxisIdArray[unitsIndex];

        // Filter each dataset based on the same range
        const filteredData = filterData(
          dataType0Processed[i],
          xLabelsArray,
          minX,
          maxX,
          incrementSize,
          verbose
        );

        return {
          ...stylesArray[i],
          label: layersSelected[i],
          yAxisID,
          data: filteredData.data,
          labels: filteredData.labels,
        };
      })
    : [];

  return {
    labels: datasets[0].labels,
    datasets,
  };
};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

const calcTicks = (labels, min, max, increment) => {
  // dataLength should be the data we want to show, i.e. after cropping (by the user), if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  let ticks = [];
  for (let i = min; i <= max; i += increment) {
    ticks.push(labels[i]);
  }
  return ticks;
};
const generateTicks = (labels, min, max, increment) => {
  let ticks = [];
  for (let i = min; i <= max; i += increment) {
    ticks.push(labels[i]);
  }
  return ticks;
};
const defaultTickProperties = {
  display: true,
  autoSkip: true,
  min: 0,
  max: 0,
  increment: 0,
};
const defaultXAxis = {
  display: true,
  // type: 'linear',
  gridLines: {
    display: true,
  },
  scaleLabel: {
    // labels the entire scale
    display: true,
  },
  pointLabels: {
    fontSize: 12,
  },
  ticks: {
    ...defaultTickProperties,
  },
};

const createXAxis = (options) => {
  const { labels, cssBackground, min, max, maxTicksLimit } = options;
  const zeroLineColor = cssBackground === "white" ? "black" : "white";
  const gridLinesColor =
    cssBackground === "white" ? "rgba(68,68,68,0.5)" : "rgba(119,119,119,0.5)";
  const scaleAndTickColor =
    cssBackground === "white" ? "rgb(0, 0, 77)" : "white";
  const incrementSize = Math.ceil((max - min) / (maxTicksLimit - 1));
  const tickValues = generateTicks(labels, min, max, maxTicksLimit);
  const gridLines = Object.assign({}, defaultXAxis.gridLines, {
    zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor,
  });
  const xMaxTickLim =
    max - min > 1000
      ? (max - min) / 100
      : max - min > 6000
      ? (max - min) / 50
      : max - min > 100
      ? (max - min) / 10
      : 6;
  if (typeof displayGridlines === "boolean" && !displayGridlines) {
    gridLines.display = false;
  }
  const ticks = Object.assign({}, defaultXAxis.ticks, {
    fontColor: "black",
    min: min,
    max: max,
    stepSize: maxTicksLimit,
    maxRotation: 45,
    minRotation: 45,
  });
  const scaleLabel = labels
    ? Object.assign({}, defaultXAxis.scaleLabel, {
        labelString: convertCcToSc(labels, " "),
        fontColor: "black",
      })
    : {
        display: false,
      };
  return Object.assign({}, defaultXAxis, {
    id: labels.toString(),
    gridLines,
    ticks,
    scaleLabel,
  });
};

const defaultYAxis = {
  type: "linear",
  display: true,
  gridLines: {
    display: true,
  },
  pointLabels: {
    fontSize: 12,
  },
  ticks: {
    display: true,
  },
  scaleLabel: {
    // labels the entire scale
    display: true,
  },
};

const createYAxis = (options) => {
  const { label, id, cssBackground, min, max, displayTicks, displayGridlines } =
    options;
  const zeroLineColor = cssBackground === "white" ? "black" : "white";
  const gridLinesColor =
    cssBackground === "white" ? "rgba(68,68,68,0.5)" : "rgba(119,119,119,0.5)";
  const scaleAndTickColor =
    cssBackground === "white" ? "rgb(0, 0, 77)" : "white";
  const gridLines = Object.assign({}, defaultYAxis.gridLines, {
    zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor,
  });
  if (typeof displayGridlines === "boolean" && !displayGridlines) {
    gridLines.display = false;
  }
  const ticks = Object.assign({}, defaultYAxis.ticks, {
    fontColor: scaleAndTickColor,
    min,
    max,
  });
  if (typeof displayTicks === "boolean" && !displayTicks) {
    ticks.display = false;
  }
  const scaleLabel = Object.assign({}, defaultYAxis.scaleLabel, {
    labelString: convertCcToSc(label, " "),
    fontColor: scaleAndTickColor,
  });
  return Object.assign({}, defaultYAxis, {
    id: id || "A",
    position: "left",
    gridLines,
    ticks,
    scaleLabel,
  });
};

const createYAxesOptions = (options) => {
  const { labels, cssBackground, yAxisRange, yAxisUnitOptions } = options;
  const _yAxisUnitOptions = isObjectLiteral(yAxisUnitOptions)
    ? yAxisUnitOptions
    : {};
  const subOptions = [];
  if (Array.isArray(labels)) {
    labels.forEach((l, i) => {
      const thisOption = isObjectLiteral(_yAxisUnitOptions[l])
        ? _yAxisUnitOptions[l]
        : {};
      const existingSubOption = subOptions.find((so) => so.label === l);
      if (existingSubOption) {
        existingSubOption.min = Math.min(
          isNaN(existingSubOption.min) ? 0 : existingSubOption.min,
          isNaN(yAxisRange[i].min) ? 0 : yAxisRange[i].min
        );
        existingSubOption.max = Math.max(
          isNaN(existingSubOption.max) ? 0 : existingSubOption.max,
          isNaN(yAxisRange[i].max) ? 0 : yAxisRange[i].max
        );
      } else {
        const id = alpha[subOptions.length];
        const newSubOption = {
          label: l,
          id: id,
          position: "left",
          cssBackground: cssBackground,
          min: yAxisRange[i].min,
          max: yAxisRange[i].max,
          maxTicksLimitY: thisOption.maxTicksLimitY,
        };
        if (typeof thisOption.displayTicks === "boolean") {
          newSubOption.displayTicks = thisOption.displayTicks;
        }
        if (typeof thisOption.displayGridlines === "boolean") {
          newSubOption.displayGridlines = thisOption.displayGridlines;
        }
        subOptions.push(newSubOption);
      }
    });
  }
  subOptions.sort((a, b) => a.label - b.label);
  return subOptions;
};

const createYAxes = (arrayOfOptions) => {
  const yAxes = arrayOfOptions.map((o) => {
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

const createGraphOptions = (options) => {
  const {
    yLabel,
    xLabel,
    cssBackground,
    minX,
    maxX,
    maxTicksLimitX,
    yAxisUnitOptions,
    yAxisRange
  } = options;

  const yAxesOptions = {
    labels: Array.isArray(yLabel) ? yLabel : [],
    cssBackground,
    yAxisUnitOptions,
    yAxisRange
  };
  const arrayOfYOptions = createYAxesOptions(yAxesOptions);
  const xAxisOptions = {
    labels: xLabel ? xLabel : [],
    cssBackground,
    min: minX,
    max: maxX,
    maxTicksLimit: maxTicksLimitX,
  };

  return {
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
    },
    responsive: true,
    tooltips: {
      mode: "label",
    },
    maintainAspectRatio: true,
    legend: {
      display: true,
      fullWidth: true,
      reverse: false,
      position: "bottom",
      labels: {
        fontColor: cssBackground === "white" ? "black" : "white",
      },
    },
    scales: {
      xAxes: [createXAxis(xAxisOptions)],
      yAxes: createYAxes(arrayOfYOptions),
    },
  };
};

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

const checkForGraphRefresh = (
  graphOptions,
  graphOptionsPrior,
  cssBackground,
  cssBackgroundPrior,
  isTickChange
) => {
  let message = "ok";
  let needsRefresh = cssBackground !== cssBackgroundPrior;
  if (needsRefresh) return { needsRefresh, message: "background changed" };

  if (isTickChange) {
    needsRefresh = true;
    return { needsRefresh, message: "X-axis tick count changed" };
  }

  const yAxes = !graphOptions
    ? []
    : !graphOptions.scales
    ? []
    : !Array.isArray(graphOptions.scales.yAxes)
    ? []
    : graphOptions.scales.yAxes;
  const yAxesPrior = !graphOptionsPrior
    ? []
    : !graphOptionsPrior.scales
    ? []
    : !Array.isArray(graphOptionsPrior.scales.yAxes)
    ? []
    : graphOptionsPrior.scales.yAxes;

  if (yAxes.length !== yAxesPrior.length) {
    needsRefresh = true;
    return {
      needsRefresh,
      message: `prior Y axes length: ${yAxesPrior.length}, new length: ${yAxes.length}`,
    };
  }

  yAxes.forEach((a, i) => {
    if (!needsRefresh) {
      // only check if we don't need a refresh so far
      const oldLabel = !yAxesPrior[i].scaleLabel
        ? "<no scale label>"
        : !yAxesPrior[i].scaleLabel.labelString
        ? "<no label string>"
        : yAxesPrior[i].scaleLabel.labelString;
      const newLabel = !a.scaleLabel
        ? "<no scale label>"
        : !a.scaleLabel.labelString
        ? "<no label string>"
        : a.scaleLabel.labelString;
      if (a.id !== yAxesPrior[i].id) {
        needsRefresh = true;
        message = `id mismatch at index ${i} (old: ${yAxesPrior[i].id}, new: ${a.id})`;
      } else if (oldLabel !== newLabel) {
        needsRefresh = true;
        message = `label mismatch at index ${i} (old: ${oldLabel}, new: ${newLabel})`;
      }
    }
  });
  return { needsRefresh, message };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

const createGraph = (gs) => {
  const graphState = Object.assign({}, gs, {
    // the 3 below are used to check for refresh
    cssBackgroundPrior: gs.cssBackground,
    graphOptionsPrior: gs.graphOptions,
    stylesArray: createStylesArray(
      gs.layersSelected,
      gs.styles,
      gs.cssStyleColorsNamed,
      gs.cssRgbArray // this is a default, ignored if 2 prior keys are satisfactory
    ),
  });

  const { dataType0Raw, dataLabelArray, yAxisArray, yAxisIdArray } =
    parseDataType1To0(
      graphState.dataType1,
      graphState.legendHash,
      graphState.layersSelected,
      graphState.legendUnits
    );
  const { first, dataLength } = calcDataLength(
    dataType0Raw,
    graphState.xStart,
    graphState.xEnd
  );

  const pointsToAdd = calcTicks(
    dataLabelArray,
    graphState.xStart,
    graphState.xEnd,
    graphState.xIdealTickSpacing
  );
  const maxTicks = pointsToAdd.length;

  const dataType0Processed = conformDataLength(
    dataType0Raw,
    first,
    dataLength,
    pointsToAdd
  );
   const yAxisRange = dataType0Processed.map(dataSet=>{
    const filteredDataSet = dataSet.filter(val => val !== null && val !== undefined)
    const minVal = Math.max(0, Math.min(...filteredDataSet));
    const maxVal = Math.max(...filteredDataSet);
    return { min: minVal, max: maxVal };
   })
  const optionsInput = {
    yLabel: yAxisArray,
    xLabel: graphState.xLabel,
    cssBackground: graphState.cssBackground,
    minX: graphState.xStart,
    maxX: graphState.xEnd,
    maxTicksLimitX: maxTicks,
    yAxisUnitOptions: graphState.yAxisUnitOptions,
    yAxisRange: yAxisRange
  };

  const graphOptions = createGraphOptions(optionsInput);

  const { needsRefresh } = checkForGraphRefresh(
    graphOptions,
    graphState.graphOptionsPrior,
    graphState.cssBackground,
    graphState.cssBackgroundPrior,
    graphState.isTickChange
  );

  const xLabelsArray = graphState.xLabelKey
    ? parseDataArraysByKeys(graphState.dataType1, [graphState.xLabelKey])[0]
    : null;

  const graphData = createGraphData({
    incrementSize: Math.max(1,Math.min(graphState.xIdealTickSpacing,Math.round((graphState.xEnd-graphState.xStart)/2))),
    xStart:graphState.xStart,
    xEnd:graphState.xEnd,
    layersSelected: graphState.layersSelected,
    dataType0Processed,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    yAxisRange,
    stylesArray: graphState.stylesArray,
    xLabelsArray,
  });

  return {
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData, // this includes { datasets, labels }, which go directly to graph
    graphOptions,
    // remaining keys NOT passed as props to graph
    needsRefresh, // rendering control
    yAxisArray, // history key
  };
};

const createGraphInfoOnGroupOrMount = (gs, legendHash, indexUnits) => {
  if (!isObjectLiteral(gs)) {
    return {};
  }
  const graphState = Object.assign({}, gs);
  const groupByNow = graphState.groupByNow || graphState.groupByOnMount;
  if (groupByNow) {
    const {
      groupBy,
      arraysOfDataObjects, // arrays is parallel with values; i.e. arrays[0] is an array for 35, arrays[1] is an array for 36;
      arrayOfDataGroups, // values: values of keys, e.g. if we find id_test: 35, 36, the array will be [35, 36];
    } = subArrayByKey(graphState.dataType1Raw, groupByNow);

    // DANGEROUS !!!!
    graphState.dataType2Raw = arraysOfDataObjects;
    graphState.dataConvertFrom = 2;
    graphState.groupBy = groupBy;
    graphState.groups = arrayOfDataGroups;
    graphState.isGrouped = true;
  }

  const dataType1 = parseDataType1(graphState);

  const layerSelectors = createLayerSelectors(
    graphState,
    legendHash,
    indexUnits
  );

  return {
    dataType: 1,
    dataType1,
    layersThatHaveUnits: layerSelectors.layersThatHaveUnits,
    layersAllPrefixed: layerSelectors.layersAllPrefixed,
    legendHash: layerSelectors.legendHash,
    layersGroupedByUnits: layerSelectors.layersGroupedByUnits,
    layerUnitsArray: layerSelectors.layerUnitsArray,
  };
};

module.exports = {
  // data
  parseDataArraysByKeys,
  parseLabelsByKeys,
  parseYAxisByKeys,
  parseDataType1To0,
  parseDataType2To1,
  parseDataType2To0,
  parseDataType1,
  calcDataLength,
  conformDataLength,
  addDataset,
  addDatapoints,
  editDatapoint,
  createGraphData,
  // axes
  calcTicks,
  createXAxis,
  createYAxis, // tested via createYAxes
  createYAxesOptions,
  createYAxes,
  // options
  createGraphOptions,
  checkForGraphRefresh,
  createGraph,

  createGraphInfoOnGroupOrMount,
};
