const { isPrimitiveNumber, 
  isObjectLiteral,
  immutableArrayInsert, 
  convertCcToSpace,
  convertScToSpace }  = require('conjunction-junction');

const alpha = ['A','B','C','D','E','F','G','H'];

const indexAbbrev = 0;
const indexLabel  = 1;
const indexUnit   = 2;

const { createLayerSelectors } = require('./layers');
const { createStylesArray }    = require('./styles');

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

export const parseDataArraysByKeys = (dataObjectsArray, layersArray) => {
  if(!Array.isArray(dataObjectsArray)) return [[]];
  if(!Array.isArray(layersArray)) return [[]];
  const dataType0Processed = layersArray.map(key=>{
    return dataObjectsArray.map(k=>k[key]);
  });
  return dataType0Processed;
};

export const parseLabelsByKeys = (legendObject, layersArray) => {
  const dataLabelArray = layersArray.map(key=>{
    const label = 
      typeof legendObject[key] === 'string' ?
        legendObject[key] : 
        !Array.isArray(legendObject[key]) ? 
          key :
          typeof legendObject[key][indexLabel] === 'string' ?
            legendObject[key][indexLabel] :
            key;
    return label;
  });
  return dataLabelArray;
};

export const parseYAxisByKeys = (legendObject, layersArray) => {
  const axesUsed = [];
  const yAxisIdArray = [];
  const yAxisArray = layersArray.map((key,i)=>{
    const yAxisLabel = 
      typeof legendObject[key] === 'string' ?
        'units' : 
        !Array.isArray(legendObject[key]) ? 
          'units' :
          typeof legendObject[key][indexUnit] === 'string' ?
            convertScToSpace(legendObject[key][indexUnit]) :
            'units' ;
    const axisIndex = axesUsed.findIndex(a=>a===yAxisLabel);
    if(axisIndex<0){
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

export const parseDataType1To0 = (dataType1Processed, legendObject, layersArray) => {
  if(
    !Array.isArray(dataType1Processed) ||
    !Array.isArray(layersArray) ||
    !isObjectLiteral(legendObject)
  ) {
    return {
      dataType0Raw:  [[]],
      dataLabelArray:[],
      yAxisArray:    [],
      yAxisIdArray:  [],
    };
  }

  const dataType0Raw = parseDataArraysByKeys(dataType1Processed, layersArray);
  const dataLabelArray = parseLabelsByKeys(legendObject, layersArray);
  const {
    yAxisArray,
    yAxisIdArray,
  } = parseYAxisByKeys(legendObject, layersArray);
  return {
    dataType0Raw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
  };
};

export const parseDataType2To0 = (arraysOfDataObjects, arrayOfDataGroups, legendObject, layersArrayRaw) => {
  if(
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arraysOfDataObjects[0]) ||
    !Array.isArray(layersArrayRaw) ||
    !Array.isArray(arrayOfDataGroups) ||
    !isObjectLiteral(legendObject)
  ) {
    return {
      dataType0Raw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
  }

  let dataType0Raw = [];
  arraysOfDataObjects.forEach(group=>{
    const subgroup = parseDataArraysByKeys(group, layersArrayRaw);
    dataType0Raw = [...dataType0Raw, ...subgroup];
  });

  const rawLabels = parseLabelsByKeys(legendObject, layersArrayRaw);
  let dataLabelArray = [];
  let layersArray = [];
  arrayOfDataGroups.forEach(group=>{
    const prefixedLabels = rawLabels.map(l=>`${group} ${l}`);
    const prefixedKeys   = layersArrayRaw.map(k=>`${group}${k}`);
    dataLabelArray  = [...dataLabelArray , ...prefixedLabels];
    layersArray = [...layersArray, ...prefixedKeys];
  });

  const {
    yAxisArray,
    yAxisIdArray,
  } = parseYAxisByKeys(legendObject, layersArrayRaw);
  return {
    dataType0Raw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    layersArray,
  };
};

export const parseDataType2To1 = (arraysOfDataObjects, arrayOfDataGroups, keysSkip) => {
  if(
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arrayOfDataGroups)
  ) {
    return {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: 'invalid data types',
    };
  }

  if(arrayOfDataGroups.length !== arraysOfDataObjects.length){
    return {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: `we found ${arrayOfDataGroups.length} labels and ${arraysOfDataObjects.length} arrays.`,
    };
  }

  let indexOfLongestArray = 0;
  let longestArrayLength = 0;
  let arrErr = false;
  arraysOfDataObjects.forEach((arr, i)=>{
    if(Array.isArray(arr)){
      if(arr.length > longestArrayLength){
        longestArrayLength = arr.length;
        indexOfLongestArray = i;
      }
    } else {
      arrErr = true; // edit to send a message
    }
  });

  if(arrErr){
    return {
      dataObjectsArray: [],
      dataLabelArray:  [],
      message: 'expected a subarray, but found none',
    };
  }

  const longestArray = arraysOfDataObjects[indexOfLongestArray];

  // validated, all arrays are present, and 1 label per array
  const dataObjectsArray = longestArray.map(()=>{
    return {};
  });

  const keysToSkip = Array.isArray(keysSkip) ? keysSkip : [] ;
  // return new object with all keys prefixed
  arraysOfDataObjects.forEach((group,i)=>{
    const prefix = arrayOfDataGroups[i];
    const prefixDivider = '__';
    group.forEach((innerObject,pt)=>{
      for(let key in innerObject){
        // the double underscore is intentional
        // we might want to un-prefix later
        if(keysToSkip.includes(key)){
          dataObjectsArray[pt][key] = innerObject[key];
        } else {
          dataObjectsArray[pt][`${prefix}${prefixDivider}${key}`] = innerObject[key];
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

export const parseDataType1 = state => {

  const keysSkip = ['xLabel'];

  const dataType1ParsedFrom2 = 
    Array.isArray(state.dataType2Raw) ?
      parseDataType2To1(state.dataType2Raw,
        state.groups, keysSkip).dataObjectsArray :
      [];

  // NOT DONE YET !!!
  const dataType1ParsedFrom0 = []; // 0 = compound arrays, (e.g. storms)

  const dataType1Processed =
    state.dataConvertFrom === 2 ?
      dataType1ParsedFrom2 :
      state.dataConvertFrom === 0 ?
        dataType1ParsedFrom0 :
        Array.isArray(state.dataType1Raw) ? 
          state.dataType1Raw :
          [] ;

  return dataType1Processed;
};

export const calcDataLength = (dataType0Raw, start, end) => {
  const oneDataset = !Array.isArray(dataType0Raw) ? null :
    !Array.isArray(dataType0Raw[0]) ? null :
      dataType0Raw[0];
  if(!oneDataset) return {
    first: 0,
    last: 0,
    dataLength: 0,
  };
  const same = {
    first: 0,
    last: oneDataset.length - 1,
    dataLength: oneDataset.length,
  };
  if( !isPrimitiveNumber(start) || !isPrimitiveNumber(end)) return same;
  const first = start < 0 ? 0 : start;
  const last = end > oneDataset.length-1 ? oneDataset.length-1 : end;
  if( first >= last ) return same;
  // should be validated that we have at least 2 datapoints, start before end, within array
  return {
    first,
    last,
    dataLength: last - first + 1,
  };
};

export const conformDataLength = (dataType0Raw, first, length, pointsToAdd) => {
  // assume 
  const oneDataset = !Array.isArray(dataType0Raw) ? [] :
    !Array.isArray(dataType0Raw[0]) ? [] :
      dataType0Raw[0];
  if(oneDataset.length === length) return dataType0Raw;
  const end = first + length;
  const extension = [];
  if(pointsToAdd){
    for(let i=0; i<pointsToAdd; i++){
      extension.push(null);
    }
  }
  const dataType0Processed = dataType0Raw.map(a=>{
    const newArray = a.slice(first, end);
    if(pointsToAdd){
      newArray.push(...extension);
    }
    return newArray;
  });
  return dataType0Processed;
};

export const addDataset = input => {
  const { graphData, data, label, style, styles } = input;
  const gd = Object.assign({}, graphData);
  const theLabel = typeof label === 'string' ? label : `dataset ${gd.datasets.length}`;
  const styl =
    style ? style :
      styles ? styles.style2 :// make this pick from the array
        gd.datasets[0] ;
  const newDataset = Object.assign({},
    styl,
    {
      data,
      label: theLabel,
    }
  );
  const datasets = [...gd.datasets, newDataset];
  return Object.assign({},
    gd,
    {
      datasets
    }
  );
};

export const addDatapoints = input => {
  const { graphData, data, label } = input;
  const newLabel =
    typeof label === 'string' ? label :
      `point${graphData.labels.length}`;
  const newLabels = [...graphData.labels, newLabel];
  const newDatasets = graphData.datasets.map((d,i)=>{
    const newDat = [...d.data, data[i]];
    return Object.assign({},
      d,
      {
        data: newDat
      }
    );
  });
  return Object.assign({},
    graphData,
    {
      datasets: newDatasets,
      labels: newLabels,
    }
  );
};

export const editDatapoint = input => {
  const { graphData, data, setIndex, index } = input;
  if(!isPrimitiveNumber(setIndex)) return graphData;
  if(!isPrimitiveNumber(index)) return graphData;

  const dataset = graphData.datasets[setIndex];
  const newData = immutableArrayInsert(index, dataset.data, data);
  const newDataset = Object.assign({},
    dataset,
    {
      data: newData,
    }
  );
  const newDatasets = immutableArrayInsert(setIndex, graphData.datasets, newDataset);

  return Object.assign({},
    graphData,
    {
      datasets: newDatasets,
    }
  );
};

export const createGraphData = input => {
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
    // this lone key is just conformed to a number
    xLabelStartAt,
  } = input;


  const datasets = Array.isArray(layersSelected) ? 
    layersSelected.map((k,i)=>{
      const units = yAxisArray[i] ;
      const unitsIndex = yAxisArray.findIndex(u=>u === units);
      const yAxisID = unitsIndex < 0 ?
        yAxisIdArray[0] :
        yAxisIdArray[unitsIndex];
      return Object.assign({},
        stylesArray[i],
        {
          label: dataLabelArray[i],
          yAxisID,
          data: dataType0Processed[i],
        }
      );
    }) : [] ;

  const startAt = isPrimitiveNumber(xLabelStartAt) ?
    xLabelStartAt : 0 ;
  const labels = 
    Array.isArray(xLabelsArray) ?
      xLabelsArray : 
      !Array.isArray(dataType0Processed) ?
        [] :
        !Array.isArray(dataType0Processed[0]) ?
          [] :
          dataType0Processed[0].map((x,i)=>i+startAt);

  return {
    labels,
    datasets,
  };

};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

export const calcTicks = (dataLength, idealSpacing) => {
  // dataLength should be the data we want to show, i.e. after cropping, if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  const maxTicksLimitDown = Math.floor(dataLength/idealSpacing);
  const lengthRoundDown = 
    ((maxTicksLimitDown * idealSpacing) + 1) > dataLength ?
      (maxTicksLimitDown * idealSpacing) + 1 - idealSpacing :
      (maxTicksLimitDown * idealSpacing) + 1 ;

  const pointsToRemove = dataLength - lengthRoundDown;

  const maxTicksLimitUp = pointsToRemove === 0 ?
    maxTicksLimitDown :
    maxTicksLimitDown + 1;

  const lengthRoundUp = 
    // do not round up, if increments of 1
    idealSpacing === 1 ? 
      maxTicksLimitUp : 
      ((maxTicksLimitUp * idealSpacing) + 1) > dataLength + idealSpacing ?
        (maxTicksLimitUp * idealSpacing) + 1 - idealSpacing :
        (maxTicksLimitUp * idealSpacing) + 1 ;

  const pointsToAdd = lengthRoundUp - dataLength;

  return {
    maxTicksLimitDown,
    lengthRoundDown,
    pointsToRemove,
    maxTicksLimitUp,
    lengthRoundUp,
    pointsToAdd,
  };
};

const defaultXAxis = {
  display: true,
  // type: 'linear',
  gridLines: {
    display: true,
  },
  scaleLabel: { // labels the entire scale
    display: true,
  },
  pointLabels :{
    fontSize: 12,
  },
  ticks: {
    display: true,
    autoSkip: true,
    // stepSize: 6, // this is not working
    // min: 0,   // changing these will change the dataset displayed
    // max: 186, // ""
    // maxTicksLimit: 100,
    // suggestedMin: 6,   // not using these
    // suggestedMax: 100, // ""
  }
};

export const createXAxis = options => {
  const { label, cssBackground, min, max, maxTicksLimit } = options;
  const zeroLineColor = 
    cssBackground === 'white' ?
      'black':
      'white';
  const gridLinesColor =
    cssBackground === 'white' ?
      'rgba(68,68,68,0.5)':
      'rgba(119,119,119,0.5)';
  const scaleAndTickColor =
    cssBackground === 'white' ?
      'rgb(0, 0, 77)':
      'white';
  const gridLines = Object.assign({},
    defaultXAxis.gridLines,
    {
      zeroLineColor,
      color: gridLinesColor,
      axisColor: gridLinesColor,
    }
  );
  const ticks = Object.assign({},
    defaultXAxis.ticks,
    {
      fontColor: scaleAndTickColor,
      min: min || 0,
      max: max || 500,
      maxTicksLimit: maxTicksLimit || 100,
    }
  );
  const scaleLabel = 
    label ?
      Object.assign({},
        defaultXAxis.scaleLabel,
        {
          labelString: label,
          fontColor: scaleAndTickColor,
        } 
      ):
      { display: false } ;
  return Object.assign({},
    defaultXAxis,
    {
      gridLines,
      ticks,
      scaleLabel,
    }
  );
};

const defaultYAxis = {
  type: 'linear',
  display: true,
  gridLines: {
    display: true,
  },
  pointLabels :{
    fontSize: 12,
  },
  ticks: {
    display: true,
  },
  scaleLabel: { // labels the entire scale
    display: true,
  },
};

export const createYAxis = options => {
  const { label, id, position, cssBackground, min, max, maxTicksLimitY } = options;
  const zeroLineColor = 
    cssBackground === 'white' ?
      'black':
      'white';
  const gridLinesColor =
    cssBackground === 'white' ?
      'rgba(68,68,68,0.5)':
      'rgba(119,119,119,0.5)';
  const scaleAndTickColor =
    cssBackground === 'white' ?
      'rgb(0, 0, 77)':
      'white';
  const gridLines = Object.assign({},
    defaultYAxis.gridLines,
    {
      zeroLineColor,
      color: gridLinesColor,
      axisColor: gridLinesColor,
    }
  );
  const ticks = Object.assign({},
    defaultYAxis.ticks,
    {
      fontColor: scaleAndTickColor,
      min,
      max,
      maxTicksLimit: maxTicksLimitY,
    }
  );
  const scaleLabel = Object.assign({},
    defaultYAxis.scaleLabel,
    {
      labelString: convertCcToSpace(label),
      fontColor: scaleAndTickColor,
    }
  );
  return Object.assign({},
    defaultYAxis,
    {
      id: id || 'A',
      position: position || 'left',
      gridLines,
      ticks,
      scaleLabel,
    }
  );
};

export const createYAxesOptions = options => {
  const { labels, cssBackground, yAxisUnitOptions } = options;
  const _yAxisUnitOptions = isObjectLiteral(yAxisUnitOptions) ? yAxisUnitOptions : {} ;
  let labelsUsed = [];
  const subOptions = [];
  if(Array.isArray(labels)){
    labels.forEach(l=>{
      const thisOption = isObjectLiteral(_yAxisUnitOptions[l]) ? _yAxisUnitOptions[l] : {} ;
      const usedIndex = labelsUsed.findIndex(u=>u===l);
      let id, position;
      if(usedIndex < 0){
        labelsUsed.push(l);
        id = alpha[labelsUsed.length-1];
        position = 'left' ; // labelsUsed.length % 2 === 0 ? 'right' : 'left' ;
        subOptions.push({
          label: l,
          id,
          position,
          cssBackground,
          min: thisOption.min,
          max: thisOption.max,
          maxTicksLimitY: thisOption.maxTicksLimitY,
        });
      }
    });
  }
  subOptions.sort((a,b)=>a.label - b.label);
  return subOptions;
};

export const createYAxes = arrayOfOptions => {
  const yAxes = arrayOfOptions.map(o=>{
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ LEGEND @@@@@@@@@@@@@@@


export const defaultLegend = {
  display: true,
  position: 'bottom',
  fullWidth: true,
  reverse: false,
  labels: {}  
};

export const createLegend = options => {
  const { position, cssBackground } = options;
  const legendFontColor = 
    cssBackground === 'white' ?
      'black':
      'white';
  const labels = Object.assign({},
    defaultLegend.labels,
    {
      fontColor: legendFontColor,
    }
  );
  return Object.assign({},
    defaultLegend,
    {
      position: position || 'bottom',
      labels,
    }
  );
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

export const defaultOptions = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  maintainAspectRatio: true,
};

export const createGraphOptions = options => {
  const {
    yLabel, 
    xLabel, 
    cssBackground, 
    minX, 
    maxX, 
    maxTicksLimitX,
    legendPosition,
    yAxisUnitOptions,
  } = options;

  const yAxesOptions = {
    labels: Array.isArray(yLabel) ? yLabel : [] ,
    cssBackground,
    yAxisUnitOptions,
  };
  const arrayOfYOptions = createYAxesOptions(yAxesOptions);
  const xAxisOptions = {
    label: xLabel ? xLabel : null ,
    cssBackground,
    min: minX,
    max: maxX,
    maxTicksLimit: maxTicksLimitX,
  };
  const legendOptions = {
    cssBackground,
    position: legendPosition,
  };
  return Object.assign({},
    defaultOptions,
    {
      legend: createLegend(legendOptions),
      scales: {
        xAxes: [ createXAxis(xAxisOptions) ],
        yAxes: createYAxes(arrayOfYOptions)
      },
    }
  );
}; 

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

export const checkForGraphRefresh = (graphOptions, graphOptionsPrior, cssBackground, cssBackgroundPrior, ticksXChanged) => {
  let message = 'ok';
  let needRefresh = cssBackground !== cssBackgroundPrior ;
  if(needRefresh) return {needRefresh, message: 'background changed'};

  if(ticksXChanged) {
    needRefresh = true;
    return {needRefresh, message: 'X-axis tick count changed'};
  }

  const yAxes =
    !graphOptions ? [] :
      !graphOptions.scales ? [] :
        !Array.isArray(graphOptions.scales.yAxes) ? [] :
          graphOptions.scales.yAxes ;
  const yAxesPrior =
    !graphOptionsPrior ? [] :
      !graphOptionsPrior.scales ? [] :
        !Array.isArray(graphOptionsPrior.scales.yAxes) ? [] :
          graphOptionsPrior.scales.yAxes ;

  if(yAxes.length !== yAxesPrior.length) {
    needRefresh = true;
    return {needRefresh, message: `prior Y axes length: ${yAxesPrior.length}, new length: ${yAxes.length}`};
  }

  yAxes.forEach((a,i)=>{
    if(!needRefresh){ // only check if we don't need a refresh so far
      const oldLabel =
        !yAxesPrior[i].scaleLabel ? '<no scale label>' :
          !yAxesPrior[i].scaleLabel.labelString ? '<no label string>' :
            yAxesPrior[i].scaleLabel.labelString;
      const newLabel = 
        !a.scaleLabel ? '<no scale label>' :
          !a.scaleLabel.labelString ? '<no label string>' :
            a.scaleLabel.labelString;
      if(a.id !== yAxesPrior[i].id) {
        needRefresh = true;
        message = `id mismatch at index ${i} (old: ${yAxesPrior[i].id}, new: ${a.id})`;
      } else if(oldLabel !== newLabel){
        needRefresh = true;
        message = `label mismatch at index ${i} (old: ${oldLabel}, new: ${newLabel})`;
      }
    }
  });
  return {needRefresh, message };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

export const createGraph = input => {

  const {
    dataType1Processed,
    legendObject,
    layersSelected,
    xIdealTickSpacing,
    xIdealTickSpacingPrior,
    xLabel,
    cssBackground,
    xStart,
    xEnd, 
    legendPosition,
    stylesArray,
    graphOptionsPrior,
    cssBackgroundPrior,
    xLabelKey,
    xLabelStartAt,
    yAxisUnitOptions,
  } = input;

  const {
    dataType0Raw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
  } = parseDataType1To0(
    dataType1Processed,
    legendObject,
    layersSelected
  );
  const {
    first,
    // last,
    dataLength,
  } = calcDataLength(dataType0Raw,xStart, xEnd);

  const {
    maxTicksLimitDown, // testing only
    lengthRoundDown,   // testing only
    pointsToRemove,    // testing only
    maxTicksLimitUp,
    lengthRoundUp,
    pointsToAdd,
  } = calcTicks(dataLength, xIdealTickSpacing);

  const dataType0Processed = conformDataLength(
    dataType0Raw, 
    first, 
    lengthRoundUp, 
    pointsToAdd
  );
  
  const optionsInput = {
    yLabel: yAxisArray,
    xLabel, 
    cssBackground,
    minX: first,
    maxX: lengthRoundUp + 1, 
    maxTicksLimitX: maxTicksLimitUp,
    legendPosition,
    yAxisUnitOptions,
  };
  
  const graphOptions = createGraphOptions(optionsInput);
  
  const ticksXChanged = xIdealTickSpacing !== xIdealTickSpacingPrior ? true : false ;

  const {needRefresh, message} = checkForGraphRefresh(
    graphOptions, graphOptionsPrior,
    cssBackground, cssBackgroundPrior,
    ticksXChanged
  );

  const xLabelsArray = xLabelKey ?
    parseDataArraysByKeys(dataType1Processed, [xLabelKey])[0] :
    null ;

  const graphData = createGraphData({
    layersSelected,
    dataType0Processed,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    stylesArray,
    xLabelStartAt,
    xLabelsArray,
  });

  return{
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData,      // this includes { datasets, labels }, which go directly to graph
    graphOptions,
    // remaining keys NOT passed as props to graph
    ready: true,    // rendering control
    needRefresh,    // rendering control
    cssBackground,     // regurgitated for ease of returning to statey
    // following 5 arrays are parallel
    layersSelected,   // regurgitated for ease of returning to state
    yAxisArray,     // history key
    xIdealTickSpacingPrior: xIdealTickSpacing, // history key
    testingKeys: {
      refreshMessage: message,
      yAxisIdArray,  
      dataType0Raw,
      dataType0Processed,
      dataLabelArray,
      first,
      dataLength, 
      maxTicksLimitDown,
      maxTicksLimitUp,
      lengthRoundDown,
      lengthRoundUp,
      pointsToRemove,
      pointsToAdd,
      ticksXChanged,
    }
  };
};

export const createGraphInfoOnGroupOrMount = state => {
  const data = {
    dataType: 1,
    dataType1Processed: parseDataType1(state),
  };
  const newState = Object.assign({},
    state,
    data
  );
  const layerSelectors = createLayerSelectors(newState);
  /* createLayerSelectors returns
    layersThatHaveUnits, 
    layersAllPrefixed,
    legendObject,
    layersGroupedByUnits,
    layerUnitsArray,
  */
  return Object.assign({},
    data,
    layerSelectors
  );
};

export const formatGraphKeysInput = (changeInput, state) => {
  // changeInput can include any of the keys below
  // keys are sent individually
  const defaultInput = {
    layersSelected:    state.layersSelected,
    xIdealTickSpacing: state.xIdealTickSpacing,
    cssBackground:     state.cssBackground,
    xStart:            state.xStart,
    xEnd:              state.xEnd, 
    legendPosition:    state.cssLegendPosition,
    xLabel:            state.xLabel,
    xLabelKey:         state.xLabelKey,
    xLabelStartAt:     state.xLabelStartAt,
    yAxisUnitOptions:  state.yAxisUnitOptions,
  };

  const constantInputs = {
    // constant, never change
    legendObject:           state.legendObject,
    // these are used to check for refresh
    cssBackgroundPrior:     state.cssBackground,
    graphOptionsPrior:      state.graphOptions,
    dataType1Processed:     state.dataType1Processed,
    xIdealTickSpacingPrior: state.xIdealTickSpacingPrior,
  };

  const input = Object.assign({},
    defaultInput,
    changeInput,
    constantInputs
  );

  input.stylesArray = createStylesArray(
    input.layersSelected,
    state.styles,
    state.cssStyleColorsNamed,
    state.cssRgbArray // this is a default, ignored if 2 prior keys are satisfactory
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