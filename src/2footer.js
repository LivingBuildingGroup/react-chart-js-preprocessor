import React                    from 'react';
import { isObjectLiteral }      from 'conjunction-junction';
import { 
  calcMinimumWindowDimensions } from 'browser-helpers';
import {
  CaretLeft,
  CaretRight }                 from 'something-rather-iconic';

const Dummy = function(){
  return null;
}

export default function Footer (props){

  const formatTitle = (titleText, groupDotColors) => {
    // this is a method, vs helper function, ONLY because it uses JSX
  
    const titleArray = [];
    for (let id in titleText) {
      const dot = typeof groupDotColors[id] === 'string' ? <div
        className='rcjspp-title-color-dot' key={id}
        style={{backgroundColor: `rgb(${groupDotColors[id]})`}}>
      </div> : null ;
      const theTitle = <div key={id} className={`rcjspp-title-inner-container ${titleText[id].tooltip ? 'tooltip' : ''}`}>
        {
          typeof titleText[id].link === 'string' ?
            <a href={titleText[id].link} target='_blank'>{dot}</a> :
          dot
        }
        <h3 className='rcjspp-title rcjspp-title-major'>
          {titleText[id].tMajor}
        </h3>
        <h3 className='rcjspp-title rcjspp-title-minor'>
          {titleText[id].tMinor}
        </h3>
        {
          titleText[id].tooltip ? 
            <div className='popover'><p>{titleText[id].tooltip}</p></div> :
          null
        }
      </div>
      titleArray.push(theTitle);
    }
    
    const titleTextJSX = isObjectLiteral(titleText) ?
      <div className='rcjspp-title-wrap-container'>
        {titleArray}
      </div> : null ;
  
    return titleTextJSX;
  };
    
  // const graphTitle      = props.titleTextJSX ? props.titleTextJSX :
  //   typeof props.titleText === 'string' ?
  //   <h3 className={`rcjspp-title`}>{props.titleText}</h3> :
  //   <h3 className={`rcjspp-title`}>graph!</h3>
   
  const graphTitle = formatTitle(
    props.titleText, 
    props.groupDotColors,
  );

  const graphSubTitle   = null; // <h3 className={`rcjspp-title rcjspp-subtitle`}>Displaying: ????</h3>

  const spinnerRight = !props.advanceAllow ?
    null :
    !props.waitingOnDataFromProps ?
    null : 
    <div className='rcjspp-advance-waiting rcjspp-advance-waiting-right'>
      <div/>
    </div> ;

  const spinnerLeft = !props.retreatAllow ?
    null :
    !props.waitingOnDataFromProps ?
    null : 
    <div className='rcjspp-advance-waiting rcjspp-advance-waiting-left'>
      <div/>
    </div> ;
      
  const hideAdvanceButtonClass = 
    props.waitingOnDataFromProps ? 
    'transparent' : 
    '' ;

  const win = typeof window !== 'undefined' ? window : {} ;
  const { cssWidthOuter } = calcMinimumWindowDimensions(win);
  const popoverRightClass = cssWidthOuter > props.bp ? 'tooltip-bottom-right' : 'tooltip-bottom-left';

  const googleTagManagerClassLeft = 'rcjspp-event-button left true1 true2';
  const googleTagManagerClassRight = 'rcjspp-event-button right true1 true2';

  const buttonAdvanceLeft = 
    props.retreatAllow ?
    <div className={`rcjspp-advance-button rcjspp-advance-button-left rcjspp-control tooltip tooltip-bottom-left ${hideAdvanceButtonClass} ${googleTagManagerClassLeft}`} 
      onClick={()=>props.graphAdvance(-1)}>
      <div className='popover'>
        <p>retreat the graph to the prior event</p>
      </div>
      <CaretLeft style={{height: 36}} />
    </div> :
    <div className='rcjspp-advance-button rcjspp-control'/> ;

  const buttonAdvanceRight = 
    props.advanceAllow ?
    <div className={`rcjspp-advance-button rcjspp-advance-button-right rcjspp-control tooltip ${popoverRightClass} ${hideAdvanceButtonClass} ${googleTagManagerClassRight}`} 
      onClick={()=>props.graphAdvance(1)}>
      <div className='popover'>
        <p>advance the graph to the next event</p>
      </div>
      <CaretRight style={{height: 36}} />
    </div> :
    <div className='rcjspp-advance-button rcjspp-control'/> ;

  return <div className='rcjspp-footer'
    style={props.cssDivFooter}>
    <div className='rcjspp-footer-top'>
      {buttonAdvanceLeft}
      {spinnerLeft}
      {graphTitle}
      {graphSubTitle}
      {spinnerRight}
      {buttonAdvanceRight}
    </div>
    <div className='rcjspp-footer-bottom'>
      <p className='rcjspp-footer-description'>
        {typeof props.legendDescription === 'string' ? props.legendDescription : ''}
      </p>
    </div>
  </div>

}