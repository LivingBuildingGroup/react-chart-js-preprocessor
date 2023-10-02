import LayersOnFly              from './4-layers-on-fly';
import RangeFinder              from './4-range-finder';
import React, { useState } from 'react';

export default function Selectors(props) {

  const p = props;

  const layerGroupByJSXOptions = 
    Array.isArray(props.layersThatHaveUnits) ?
    props.layersThatHaveUnits.map((layer,i)=> {
      return <option key={i} value={layer}>
        {layer}
      </option>
    }) : [] ;

  const rangeFinder = <RangeFinder
    isGrouped             ={p.isGrouped}
    groupAllow            ={p.groupAllow}
    handleGroupBy         ={p.handleGroupBy}
    xStart                ={p.xStart}
    handleXStartChange    ={p.handleXStartChange}
    xEnd                  ={p.xEnd}
    handleXEndChange      ={p.handleXEndChange}
    xIdealTickSpacing     ={p.xIdealTickSpacing}
    handleXIdealTickSpacingChange = {p.handleXIdealTickSpacingChange}
    layerGroupByJSXOptions={layerGroupByJSXOptions}
    handleRangeChange     ={p.handleRangeChange}
    handleTickChange      ={p.handleTickChange} />

  const selectors = 
    p.selectorsInFocus === 'layers' ?
      <div className='rcjspp-selectors'
        style={p.cssDivSelectors}>
        <LayersOnFly
          layerUnitsArray       ={p.layerUnitsArray}
          layersGroupedByUnits  ={p.layersGroupedByUnits}
          layersSelected        ={p.layersSelected}
          legendHash            ={p.legendHash}
          indexAbbrev           ={p.indexAbbrev}
          indexDef              ={p.indexDef}

          handleLayerSelection  ={p.handleLayerSelection}
          toggleLayerGroup      ={p.toggleLayerGroup} />
      </div> :
    null ;

  return <div className='rcjspp-selectors-outermost'>
    {rangeFinder}
    {selectors}
  </div>;
}