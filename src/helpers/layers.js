const {
  addAllItemsToArray,
  removeAllItemsFromArray,
  isObjectLiteral,
  immutableArraySplice,
  immutableArrayInsert,
  subArrayByKey,
} = require('conjunction-junction');

export const unPrefixLayers = (layers, prefixesToKeep) => {
  const pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [] ;
  const newLayerObj = {};
  layers.forEach(l=>{
    const lSplit = l.split('__');
    const lFiltered = lSplit.filter((l,i)=>{
      return pre2K.includes(l) ||
        pre2K.includes(`${l}`) ||
        pre2K.includes(parseInt(l,10)) ||
        i === lSplit.length-1; // always return the last segment
    });
    const lJoin = lFiltered.join('__');
    newLayerObj[lJoin] = true;
  });
  const newLayers = [];
  for(let k in newLayerObj){
    newLayers.push(k);
  }
  newLayers.sort(); // this sorts by prefix, which is preferred in the UI
  return newLayers;
};

export const groupLayersByUnit = (layersThatHaveUnits, legendObject, indexUnits) => {
  const layersGroupedByUnits = {};
  layersThatHaveUnits.forEach(key=>{
    const thisUnit =
      !Array.isArray(legendObject[key]) ?
        'units' :
        legendObject[key][indexUnits];
      
    if(!Array.isArray(layersGroupedByUnits[thisUnit])){
      if(thisUnit !== 'units'){
        layersGroupedByUnits[thisUnit] = [];
      }
    }
    if(thisUnit !== 'units'){
      layersGroupedByUnits[thisUnit].push(key);
    }
  });

  // the array is so units can be sorted in a predictable order
  const layerUnitsArray = [];
  for(let unit in layersGroupedByUnits){
    layerUnitsArray.push(unit);
    layersGroupedByUnits[unit].sort();
  }
  layerUnitsArray.sort();

  return {
    layersGroupedByUnits,
    layerUnitsArray
  };
};

export const calcFirstLayerOnList = state => {
  // find the first layer listed, which is used to toggle a single layer on as a default condition if there is no preSet
  // if layers are supplied, just read the first one
  // if layers are not supplied (something else is wrong), but at least try to find a layer
  const { layersGroupedByUnits, layerUnitsArray, layersThatHaveUnits } = state;
  const firstLayerOnList = 
    Array.isArray(layersThatHaveUnits) ?
      layersThatHaveUnits[0] :
      !Array.isArray(layerUnitsArray) ?
        '' :
        !isObjectLiteral(layersGroupedByUnits) ?
          '' :
          !Array.isArray(layersGroupedByUnits[layerUnitsArray[0]]) ?
            '' :
            layersGroupedByUnits[layerUnitsArray[0]][0];
  return firstLayerOnList;
};

export const toggleLayerGroup = (state, groupOfLayers) => {
  // add or remove an entire group of layer from the layers selected
  let action = 
    !Array.isArray(state.layersSelected) ?
      'new' :
      'add' ;

  if(!Array.isArray(groupOfLayers)){
    if(!Array.isArray(state.layersSelected)){
      return [];
    } else {
      return state.layersSelected;
    } 
  }

  let index = 0;
  while(action==='add' && index < groupOfLayers.length){
    action = 
      state.layersSelected.includes(groupOfLayers[index]) ?
        'remove' : 
        'add' ;
    index ++;
  }

  const layersSelected =
    action === 'new' ?
      groupOfLayers :
      action === 'add' ?
        addAllItemsToArray(state.layersSelected, groupOfLayers) :
        action === 'remove' ?
          removeAllItemsFromArray(state.layersSelected, groupOfLayers) :
          state.layersSelected ;

  return layersSelected;
};

export const createLayerSelectorsInner = input => {

  const {
    data,
    units,
    abbrevs,
    labels,
  } = input;

  // always receiving dataType1Processed
  const oneUnit = data[0] ;

  const legendObject       = {};
  const layersAllTemp      = [];
  const layersThatHaveUnitsTemp= [];

  for(let layer in oneUnit){
    const split = layer.split('__');
    const unPrefix = split[split.length-1];
    layersAllTemp.push({unPrefix, layer});
    if(units[unPrefix]){
      const prefixes = split.length > 1 ? split.slice(0,split.length-1) : [] ;
      const prefixesFormatted = prefixes.length > 0 ? `${prefixes.join(' ')} ` : '' ;
      layersThatHaveUnitsTemp.push({unPrefix, layer});
      legendObject[layer] = [
        `${prefixesFormatted}${abbrevs[unPrefix]}`, 
        `${prefixesFormatted}${labels[unPrefix]}`, 
        units[unPrefix],
      ];
    }
  }

  // sort by unprefixed layers so that like layers (e.g. "rain") are grouped, not like groups (e.g. "test 52")
  layersAllTemp.sort(          (a,b)=>a.unPrefix>b.unPrefix);
  layersThatHaveUnitsTemp.sort((a,b)=>a.unPrefix>b.unPrefix);
  const layersAllPrefixed   = layersAllTemp.map(l=>l.layer);
  const layersThatHaveUnits = layersThatHaveUnitsTemp.map(l=>l.layer);

  return {
    layersThatHaveUnits,
    layersAllPrefixed,
    legendObject,
  };

};

export const createLayerSelectors = state => {

  const {
    layersThatHaveUnits, // all layers with units, available for selection
    layersAllPrefixed,      // all layers, regardless of unit or selection capability, such as ids and timestamps
    legendObject,
  } = createLayerSelectorsInner({
    data:                state.dataType1Processed,
    groups:              state.groups,
    groupsSub:           state.groupsSub,
    units:               state.legendUnits,
    abbrevs:             state.legendAbbrevs,
    labels:              state.legendLabels,
  });

  const {
    layersGroupedByUnits,
    layerUnitsArray
  } = groupLayersByUnit(layersThatHaveUnits, legendObject, state.indexUnits);

  return {
    layersThatHaveUnits, 
    layersAllPrefixed,
    legendObject,
    layersGroupedByUnits,
    layerUnitsArray,
  };
};

export const createLayersSelected = (key, layersSelected) => {
  if(!key) return;
  const indexSelected = Array.isArray(layersSelected) ? layersSelected.findIndex(s=>s===key) : -1 ;
  const newLayersSelected =
    indexSelected >= 0 ? 
      immutableArraySplice(indexSelected, layersSelected) : // it is selected, so remove it
      immutableArrayInsert(null, layersSelected, key); // not selected, so add it
  if(!Array.isArray(layersSelected)){ // make sure at least 1 key is selected
    console.warn('No keys are selected. Cancelling');
    return;
  } else if(layersSelected.length <= 0){
    console.warn('At least one key must be selected. Cancelling');
    return;
  }
  return newLayersSelected;
};

export const createGroupByData = (theKey, dataType1Raw) => {
  // convert data type 1 to type 2
  if(!theKey) return;
  const {
    groupBy,
    arraysOfDataObjects,  // arrays is parallel with values; i.e. arrays[0] is an array for 35, arrays[1] is an array for 36;
    arrayOfDataGroups, // values: values of keys, e.g. if we find id_test: 35, 36, the array will be [35, 36];
  } = subArrayByKey(dataType1Raw, theKey);
  return {
    dataType2Raw:        arraysOfDataObjects,
    dataConvertFrom:     2,
    groupBy,
    groups:              arrayOfDataGroups,
    groupTrue:           true,
  };
};

export const parseDefaultLayerSelection = state => {
  const firstLayerOnList = calcFirstLayerOnList(state);
  const layersSelected = createLayersSelected(firstLayerOnList, state.layersSelected);
  return {
    firstLayerOnList,
    layersSelected,
  };
};

// export default {
//   unPrefixLayers,
//   groupLayersByUnit,
//   calcFirstLayerOnList,
//   toggleLayerGroup,
//   createLayerSelectors,
//   createLayerSelectorsInner,
//   createLayersSelected,
//   createGroupByData,
//   parseDefaultLayerSelection,
// };