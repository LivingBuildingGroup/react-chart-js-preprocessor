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
        label.includes('PREDICTED') ? 'rcjspp-sel-predicted-selector' : ''
  
      return <label key={key} className={`rcjspp-sel-label-radio ${displayClass} tooltip`}>
        <input
          name={key}
          type='checkbox'
          className='rcjspp-sel-input-radio'
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
      key={unit} className='rcjspp-sel-checkbox-group-container'>
      <h3 className='rcjspp-sel-checkbox-group-header'
        onClick={()=>props.toggleLayerGroup(unit)}>
        {convertScToSpace(titleCaseWord(unit))}
      </h3>
      {cbs}
    </div> );
  });

  return <div className='rcjspp-sel-inner-container'>
    <div className='rcjspp-sel-checkbox-container'>
      {layerCheckboxes}
    </div>
  </div>

}