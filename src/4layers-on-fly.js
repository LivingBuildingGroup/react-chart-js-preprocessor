import React from 'react';
import { 
  convertScToSpace , 
  titleCaseWord } from 'conjunction-junction';

export default function LayersOnFly (props){

  const groupBy =
    !props.groupTrue && props.groupAllow ?
    <label className='gw-sel-row-form-label'>
      Group By
      <select className='gw-sel-input'
        onChange={e=>props.handleGroupBy(e)} >
        {props.layerGroupByJSXOptions}
      </select>
    </label> : null ;

  const rangeFinder = <div className='gw-sel-row-form'>
    <label className='gw-sel-row-form-label'>
      Start of Range
      <input
        type='number'
        name='start-of-range'
        step={1}
        className='gw-sel-input'
        onChange={e=>props.handleRangeChange(e, 'xStart')} 
        value={props.xStart} />
    </label>
    <label className='gw-sel-row-form-label'>
      End of Range
      <input
        type='number'
        step={1}
        className='gw-sel-input'
        onChange={e=>props.handleRangeChange(e, 'xEnd')} 
        value={props.xEnd} />
    </label>
    <label className='gw-sel-row-form-label'>
      Increment Size
      <input
        type='number'
        step={1}
        className='gw-sel-input'
        onChange={e=>props.handleTickChange(e)} 
        value={props.xIdealTickSpacing} />
    </label>
    {groupBy}
  </div> ;

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
    {rangeFinder}
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
      .gw-sel-row-form-label {
        display: flex;
        margin-right: 20px;
        align-items: baseline;
      }
      .gw-sel-row-form .gw-sel-input {
        font-size: 16px;
        display: flex;
        min-height: 14px;
        padding: 3px;
        width: 4em;
      }
      .gw-sel-row-form {
        justify-content: space-between;
      }
      .gw-sel-row.gw-sel-input-radio {
        width: 5%;
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