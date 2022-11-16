import { 
  convertScToSpace , 
  titleCaseWord } from 'conjunction-junction';

export default function LayersOnFly (props){

  const handleLayerSelection = typeof props.handleLayerSelection === 'function' ?
    props.handleLayerSelection : ()=>{} ;
  // how can we prevent this from having to loop on every render?
  const layerCheckboxes = [];

  const legendHash = props.legendHash || {};
    
  props.layerUnitsArray.forEach(unit => {
  
    const cbs = props.layersGroupedByUnits[unit].map(key=>{
  
      const checked = !Array.isArray(props.layersSelected) ?
        false : 
        props.layersSelected.includes(key) ?
        true : 
        false ;
  
      const thisLegend = legendHash[key] || {};
      const label = thisLegend.l || key;
      const def   = thisLegend.d || key;

      const displayClass = typeof label === 'string' && 
        label.includes('PREDICTED') ? 'rcjspp-sel-predicted-selector' : ''
  
      return <label key={key} className={`rcjspp-sel-label-radio ${displayClass} tooltip`}>
        <input
          name={key}
          type     ='checkbox'
          className='rcjspp-sel-input-radio'
          onChange ={e=>handleLayerSelection(e)} 
          checked  ={checked}
          value    ={key} />
        {label}
        <div className='popover'>
          <p>{def}</p>
        </div>
      </label>
    });
  
    layerCheckboxes.push( <div
      key={unit} className='rcjspp-sel-checkbox-group-container'>
      <h3 className='rcjspp-sel-checkbox-group-header'
        onClick={()=>props.toggleLayerGroup(unit)}>
        {convertScToSpace(titleCaseWord(unit))}
      </h3>
      {cbs}
    </div> );
  });

  const noneAreChecked = Array.isArray(props.layersSelected) &&
    props.layersSelected.length === 0;

  const uncheckAll = <label className='rcjspp-sel-label-radio'>
    <input
      type='checkbox'
      className='rcjspp-sel-input-radio'
      onChange={e=>props.handleLayerSelection(e)} 
      checked={noneAreChecked}
      value='de-select-all' />
    Deselect all layers
  </label>

  return <div className='rcjspp-sel-inner-container'>
    {uncheckAll}
    <div className='rcjspp-sel-checkbox-container'>
      {layerCheckboxes}
    </div>
  </div>

}