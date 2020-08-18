export default function RangeFinder (props){

  const groupBy =
    !props.groupTrue && props.groupAllow ?
    <label className='gw-sel-row-form-label'>
      Group By
      <select className='gw-sel-input'
        onChange={e=>props.handleGroupBy(e)} >
        {props.layerGroupByJSXOptions}
      </select>
    </label> : null ;

  return <div className='gw-sel-row-form'>
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
    <style>{`
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
    `}</style>
  </div>

}