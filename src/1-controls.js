import * as icons from 'something-rather-iconic';

const iconStyle = {height: 20, width: 20};

export default function Controls(props){

  const controlsFromProps  = Array.isArray(props.controls)  ? props.controls  : [] ;

  const activePreset = props.presets[`${props.presetIdActive}`] || {};
  const activePresetName = activePreset.namePreset
  
  const controls = props.waitingOnPresetIdFromProps ? null : // to force a re-render
    controlsFromProps.map((c,i)=>{ 
      const activeClass = activePresetName === c.name ?
        'rcjspp-preset-control-active' : 
        `rcjspp-control-over-${props.cssBackground}` ;

      const vPosition = c === 'selector' ? 'bottom' : 'top'

      const iconName = icons[c.iconName] ? c.iconName : 'ExclamationTriangle';
      if(!icons[c.iconName]){
        console.warn('did not find icon', c.iconName,'. Check presets.')
      }
      const Icon = icons[iconName];
      return <div key={i} 
        className={`rcjspp-control tooltip tooltip-${vPosition}-right ${activeClass}`}
        onClick={c.func}>
        <div className='popover'>
          {
            Array.isArray(c.label) ?
            c.label.map((l,i)=><p key={i}>{l}</p>) :
            <p>{c.label}</p>
          }
        </div>
        <Icon style={iconStyle}/>
      </div>
    });
    
  // if only one control, adding one more causes
  // the single control to be positioned lower (more visible)
  if(Array.isArray(controls) && controls.length === 1) {
    controls.unshift(<div key='extra'></div>);
  }

  return <div className='rcjspp-controls-outermost'>
    {controls}
  </div>;
}