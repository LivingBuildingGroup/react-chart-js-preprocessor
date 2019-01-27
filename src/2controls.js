import React from 'react';

export default function Controls (props){

  const controlNames  = Array.isArray(props.controlNames)  ? props.controlNames  : [] ;
  const controlIcons  = Array.isArray(props.controlIcons)  ? props.controlIcons  : [] ;
  const controlFuncs  = Array.isArray(props.controlFuncs ) ? props.controlFuncs  : [] ;
  const controlLabels = Array.isArray(props.controlLabels) ? props.controlLabels : [] ;

  const controls = props.waitingOnPreSetIdFromProps ? null : // to force a re-render
    controlNames.map((c,i)=>{ 
      const controlNameAsArr = c.split(' ');
      const controlNameAsId = controlNameAsArr.join('-');
      const activeClass = 
        props.preSets[props.preSetIdActive] &&
        props.preSets[props.preSetIdActive].name === c ?
        'gw-pre-set-control-active' : 
        `gw-control-over-${props.cssBackground}` ;
      const popover = c === 'selector' && props.selectorsPopover ?
        <div className='popover popover-constant popover-bottom-right'>
          <p className='gw-sel-popover' onClick={()=>props.toggleSelectorsInFocus('none')}>Hide selectors</p>
          <p className='gw-sel-popover' onClick={()=>props.toggleSelectorsInFocus('layers')}>Layer selectors</p>
          <p className='gw-sel-popover' onClick={()=>props.toggleSelectorsInFocus('edit-selected')}>Graphic selectors (current layers)</p>
          <p className='gw-sel-popover' onClick={()=>props.toggleSelectorsInFocus('edit-all')}>Graphic selectors (all layers)</p>
        </div> :
        <div className='popover'>
          <p>{controlLabels[i]}</p>
        </div>
      const vPosition = c === 'selector' ? 'bottom' : 'top'
      const ControlIcon = typeof controlIcons[i] === 'function' ? controlIcons[i] : null ;
      const controlIcon = ControlIcon ? <ControlIcon style={{height: 16}}/> : null ;
      const googleTagManagerClass = `graph-control ${controlNameAsId} true1 true2`;
      return <div key={i} 
        className={`gw-control tooltip tooltip-${vPosition}-right ${activeClass} ${googleTagManagerClass}`}
        onClick={controlFuncs[i]}>
        {popover}
        {controlIcon}
      </div>
    });
  if(Array.isArray(controls)){
    if(controls.length === 1) {
      controls.unshift(<div key='extra'></div>);
    }
  }

  return <div className='gw-controls-outermost'>
    {controls}
    <style>{`
    .gw-controls-outermost {
      top: 0px;
      height: 100%;
      padding-top: 45px;
      width: 30px;
      padding-right: 0;
      margin-right: 20px;
      flex-direction: column;
      justify-content: space-around;
      z-index: 9999;
    }
    .tooltip .popover p.gw-sel-popover:hover {
      color: rgb(103, 175, 103) !important;
    }
    .gw-control {
      cursor: pointer;
    }
    .gw-control.gw-control-over-white{
      color: #333;
    }
    .gw-control.gw-control-over-gray {
      color: white;
    }
    .gw-control.gw-pre-set-control-active {
      color: orange;
    }
    @media print {
      .gw-control {
        display: none !important;
      }
    }
    .gw-control.gw-control-print {
      display: none;
    }
    @media (min-width: 800px) {
      .gw-control.gw-control-print {
        display: flex;
      }
    }
    `}</style>
  </div>;

}