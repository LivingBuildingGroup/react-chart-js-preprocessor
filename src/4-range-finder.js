import React, { useState } from 'react';

export default function RangeFinder (props){

  return <div className='rcjspp-sel-row-form'>
    <label className='rcjspp-sel-row-form-label'>
      Start of Range
      <input
        type='number'
        name='start-of-range'
        step={1}
        className='rcjspp-sel-input'
        onChange={e=>props.handleRangeChange(e, 'xStart')} 
        value={props.xStart} />
    </label>
    <label className='rcjspp-sel-row-form-label'>
      End of Range
      <input
        type='number'
        step={1}
        className='rcjspp-sel-input'
        onChange={e=>props.handleRangeChange(e, 'xEnd')} 
        value={props.xEnd} />
    </label>
    <label className='rcjspp-sel-row-form-label'>
      Increment Size
      <input
        type='number'
        step={1}
        className='rcjspp-sel-input'
        onChange={e=>props.handleTickChange(e)} 
        value={props.xIdealTickSpacing} />
    </label>
    {
      !props.isGrouped && props.groupAllow ?
        <label className='rcjspp-sel-row-form-label'>
          Group By
          <select className='rcjspp-sel-input'
            onChange={e=>props.handleGroupBy(e)} >
            {props.layerGroupByJSXOptions}
          </select>
       </label> : 
       null 
    }
  </div>

}