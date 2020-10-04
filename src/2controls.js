import * as icons from 'something-rather-iconic';
import React from 'react';

const iconStyle = {height: 20, width: 20};

export default function Controls(props){

  const controlsFromProps  = Array.isArray(props.controls)  ? props.controls  : [] ;

  const controls = props.waitingOnPreSetIdFromProps ? null : // to force a re-render
    controlsFromProps.map((c,i)=>{ 
      const controlNameAsArr = typeof c.name === 'string' ? c.name.split(' '): [] ;
      const controlNameAsId = controlNameAsArr.join('-');
      const activeClass = 
        props.preSets[props.preSetIdActive] &&
        props.preSets[props.preSetIdActive].name === c.name ?
        'rcjspp-pre-set-control-active' : 
        `rcjspp-control-over-${props.cssBackground}` ;

      const popover = c.name === 'selector' && props.selectorsPopover ?
        <div className='popover popover-constant popover-bottom-right'>
          <p className='rcjspp-sel-popover' onClick={()=>props.toggleSelectorsInFocus('none')}>Hide selectors</p>
          <p className='rcjspp-sel-popover' onClick={()=>props.toggleSelectorsInFocus('layers')}>Layer selectors</p>
          <p className='rcjspp-sel-popover' onClick={()=>props.toggleSelectorsInFocus('edit-selected')}>Graphic selectors (current layers)</p>
          <p className='rcjspp-sel-popover' onClick={()=>props.toggleSelectorsInFocus('edit-all')}>Graphic selectors (all layers)</p>
        </div> :
        <div className='popover'>
          <p>{c.label}</p>
        </div>

      const vPosition = c === 'selector' ? 'bottom' : 'top'
      const googleTagManagerClass = `graph-control ${controlNameAsId} true1 true2`;

      const iconName = icons[c.iconName] ? c.iconName : 'ExclamationTriangle';
      if(!icons[c.iconName]){
        console.log('did not find icon', c.iconName)
      }
      const Icon = icons[iconName];
      return <div key={i} 
        className={`rcjspp-control tooltip tooltip-${vPosition}-right ${activeClass} ${googleTagManagerClass}`}
        onClick={c.func}>
        {popover}
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