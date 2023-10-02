'use strict';

const {
  addAllItemsToArray,
  removeAllItemsFromArray,
  immutableArraySplice,
  immutableArrayInsert,
} = require('conjunction-junction');

const unPrefixLayers = (layers, prefixesToKeep) => {
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

const groupLayersByUnit = (layersThatHaveUnits, legendHash) => {
  const layersGroupedByUnits = {};
  layersThatHaveUnits.forEach(key=>{
    const thisUnit = legendHash[key] && legendHash[key].u ?
      legendHash[key].u :
      'units';
      
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

const createLayersSelectedByGroup = (layersSelected, groupOfLayers) => {
  // add or remove an entire group of layer from the layers selected
  let action = 
    !Array.isArray(layersSelected) ?
      'new' :
      'add' ;

  if(!Array.isArray(groupOfLayers)){
    if(!Array.isArray(layersSelected)){
      return [];
    } else {
      return layersSelected;
    } 
  }

  let index = 0;
  while(action==='add' && index < groupOfLayers.length){
    action = 
      layersSelected.includes(groupOfLayers[index]) ?
        'remove' : 
        'add' ;
    index ++;
  }

  const newLayersSelected =
    action === 'new' ?
      groupOfLayers :
      action === 'add' ?
        addAllItemsToArray(layersSelected, groupOfLayers) :
        action === 'remove' ?
          removeAllItemsFromArray(layersSelected, groupOfLayers) :
          layersSelected ;

  return newLayersSelected;
};

const createLayersSelectedWithOneLayerFlipped = (layerSelected, layersSelected) => {
  if(!layerSelected) {
    return layersSelected;
  }
  if(layerSelected==='de-select-all'){
    return [];
  }
  const indexSelected = Array.isArray(layersSelected) ? layersSelected.findIndex(s=>s===layerSelected) : -1 ;
  const newLayersSelected =
    indexSelected >= 0 ? 
      immutableArraySplice(indexSelected, layersSelected) : // it is selected, so remove it
      immutableArrayInsert(null, layersSelected, layerSelected); // not selected, so add it
  if(!Array.isArray(newLayersSelected) || newLayersSelected.length <= 0){ // make sure at least 1 layerSelected is selected
    // eslint-disable-next-line no-console
    console.warn('No layers are selected. Cancelling');
    return;
  }
  return newLayersSelected;
};

const createLayerSelectorsInner = input => {

  const {
    data,
    legendHash
  } = input;

  const oneUnit = data[0]; // always receiving dataType1
  // console.log({oneUnit});
  const _legendHash        = {};
  const layersAllTemp      = [];
  const layersThatHaveUnitsTemp= [];
  const layersThatHaveNoUnitsHash = {};
  
  for(let layerName in oneUnit){

    const split = layerName.split('__');
    const unPrefix = split[split.length-1];
    layersAllTemp.push({unPrefix, layerName});
    const thisLayerInHash = legendHash[unPrefix];
    // console.log({layerName, split, unPrefix, thisLayerInHash});
    if(thisLayerInHash){
      if (typeof thisLayerInHash === 'string') {
        thisLayerInHash = { key: thisLayerInHash };  
      }
      if(!thisLayerInHash.l){thisLayerInHash.l=layerName;}
      if(!thisLayerInHash.a){thisLayerInHash.a=thisLayerInHash.l;}
      if(!thisLayerInHash.d){thisLayerInHash.d=thisLayerInHash.l;}
      if(!thisLayerInHash.u){thisLayerInHash.u='none';}
      const prefixes = split.length > 1 ? split.slice(0,split.length-1) : [] ;
      const prefixesFormatted = prefixes.length > 0 ? `${prefixes.join(' ')} ` : '' ;
      layersThatHaveUnitsTemp.push({unPrefix, layerName});
      _legendHash[layerName] = {
        l: `${prefixesFormatted}${thisLayerInHash.l}`,
        a: `${prefixesFormatted}${thisLayerInHash.a}`,
        u: thisLayerInHash.u,                         
        d: `${prefixesFormatted}${thisLayerInHash.d}`,
      };
    } else {
      layersThatHaveNoUnitsHash[unPrefix] = true;
    }
  }

  // sort by unprefixed layers so that like layers (e.g. "rain") are grouped, not like groups (e.g. "test 52")
  layersAllTemp.sort(          (a,b)=>a.unPrefix>b.unPrefix);
  layersThatHaveUnitsTemp.sort((a,b)=>a.unPrefix>b.unPrefix);
  const layersAllPrefixed   = layersAllTemp.map(l=>l.layerName);
  const layersThatHaveUnits = layersThatHaveUnitsTemp.map(l=>l.layerName);
  const layersThatHaveNoUnits = [];
  for(let l in layersThatHaveNoUnitsHash){
    layersThatHaveNoUnits.push(l);
  }

  return {
    layersThatHaveUnits,
    layersAllPrefixed,
    legendHash,
  };

};

const createLayerSelectors = (gs, _legendHash) => {

  const {
    layersThatHaveUnits, // all layers with units, available for selection
    layersThatHaveNoUnits,
    layersAllPrefixed,      // all layers, regardless of unit or selection capability, such as ids and timestamps
    legendHash,
  } = createLayerSelectorsInner({
    data:                gs.dataType1,
    groups:              gs.groups,
    groupsSub:           gs.groupsSub,
    legendHash:          _legendHash,
  });

  // console.log({layersThatHaveUnits, // all layers with units, available for selection
  //   layersThatHaveNoUnits,
  //   layersAllPrefixed,      // all layers, regardless of unit or selection capability, such as ids and timestamps
  //   legendHash,});

  const {
    layersGroupedByUnits,
    layerUnitsArray
  } = groupLayersByUnit(layersThatHaveUnits, legendHash);

  // console.log({layersGroupedByUnits, layerUnitsArray})
  return {
    layersThatHaveUnits, 
    layersThatHaveNoUnits,
    layersAllPrefixed,
    legendHash,
    layersGroupedByUnits,
    layerUnitsArray,
  };
};

module.exports = {
  unPrefixLayers,
  groupLayersByUnit,
  createLayersSelectedByGroup,
  createLayersSelectedWithOneLayerFlipped,
  createLayerSelectors,
  createLayerSelectorsInner,
};