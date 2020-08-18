import React from 'react';
import { 
  convertScToSpace , 
  titleCaseWord } from 'conjunction-junction';

export default function LayersOnFly (props){

  // how can we prevent this from having to loop on every render?
  const layerCheckboxes = [];

  const legendObject = props.legendObject || {};
    
  props.layerUnitsArray.forEach(unit => {
  
    const cbs = props.layersGroupedByUnits[unit].map(key=>{
  
      const checked = !Array.isArray(props.layersSelected) ?
        false : 
        props.layersSelected.includes(key) ?
        true : 
        false ;
  
      const legendArr = Array.isArray(legendObject[key]) ? legendObject[key] : [];
      const label = legendArr[props.indexAbbrev] || key;
      const def   = legendArr[props.indexDef] || key;

      const displayClass = typeof label === 'string' && 
        label.includes('PREDICTED') ? 'gw-sel-predicted-selector' : ''
  
      return <label key={key} className={`gw-sel-label-radio ${displayClass} tooltip`}>
        <input
          name={key}
          type='checkbox'
          className='gw-sel-input-radio'
          onChange={e=>props.handleLayerSelection(e)} 
          checked={checked}
          value={key} />
        {label}
        <div className='popover'>
          <p>{def}</p>
        </div>
      </label>
    });
  
    layerCheckboxes.push( <div
      key={unit} className='gw-sel-checkbox-group-container'>
      <h3 className='gw-sel-checkbox-group-header'
        onClick={()=>props.toggleLayerGroup(unit)}>
        {convertScToSpace(titleCaseWord(unit))}
      </h3>
      {cbs}
    </div> );
  });

  return <div className='gw-sel-inner-container'>
    {/* {rangeFinder} */}
    <div className='gw-sel-checkbox-container'>
      {layerCheckboxes}
    </div>
    <style>{`
      .gw-sel-inner-container {
        padding: 5px;
        flex-direction: column;
      }
      .gw-sel-checkbox-container {
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
        justify-content: space-around;
      }
      @media(min-width: 800px){
        .gw-sel-checkbox-container {
          overflow-y: scroll;
        }
      }
      .gw-sel-checkbox-group-container {
        flex-direction: column; 
        margin-bottom: 10px;
        margin-right: 20px;
      }
      .gw-sel-checkbox-group-container .gw-sel-checkbox-group-header {
        margin-top: 10px;
        margin-bottom: 5px;
      }
      .gw-sel-checkbox-group .gw-sel-label-radio {
        display: flex;
      }
      .gw-sel-label-radio {
        cursor: pointer;
      }
      .gw-sel-label-radio:hover {
        background-color: rgba(125, 157, 165, 0.1);
      }
      .gw-sel-predicted-selector {
        color: red;
      }
    `}</style>
  </div>

}