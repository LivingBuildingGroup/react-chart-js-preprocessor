import React from 'react';
import { isObjectLiteral } from 'conjunction-junction';

export default function Footer (props){

  const formatTitle = (titleText, groupDotColors, cssBackground) => {
    // this is a method, vs helper function, ONLY because it uses JSX
    const graphTitleClass = cssBackground === 'white' ? 'gw-title-black' : '' ;
  
    const titleArray = [];
    for (let id in titleText) {
      titleArray.push(
        <div key={id} className='gw-title-inner-container'>
          <div
            className='gw-title-color-dot' key={id}
            style={{backgroundColor: `rgb(${groupDotColors[id]})`}}>
          </div>
          <h3 className={`gw-title ${graphTitleClass} gw-title-major`}>
            {titleText[id].tMajor}
          </h3>
          <h3 className={`gw-title ${graphTitleClass} gw-title-minor`}>
            {titleText[id].tMinor}
          </h3>
        </div>
      );
    }
    
    const titleTextJSX = isObjectLiteral(titleText) ?
      <div className='gw-title-wrap-container'>
        {titleArray}
        <style>{`
          .gw-title-inner-container {
            justify-content: center;
            align-items: center;
            margin-right: 25px;
            margin-left: 25px;
          }
          .gw-title-color-dot {
            border-radius: 50%;
            height: 15px;
            width: 15px;
            background-color: white;
          }
          .gw-title {
            color: white;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 10px;
            flex-grow: 1;
          }
          .gw-title.gw-title-black {
            color: #333;
          }
          .gw-title.gw-subtitle {
            display: none;
          
          }
          @media print{
            .gw-title.gw-subtitle {
              display: block;
            }
          }
          .gw-title-wrap-container {
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
          }
          .gw-title-major {
            margin-left: 3px;
          }
          .gw-title-minor {
            font-weight: 100;
            font-size: 67%;
            opacity: 0.75;
            margin-left: 3px;
          }
          .gw-title-inner-container {
            justify-content: center;
            align-items: center;
            margin-right: 25px;
            margin-left: 25px;
          }
          .gw-title-color-dot {
            border-radius: 50%;
            height: 15px;
            width: 15px;
            background-color: white;
          }
        `}</style>
      </div> : null ;
  
    return titleTextJSX;
  };

  // const graphTitleClass = props.cssBackground === 'white' ? 'gw-title-black' : '' ;
    
  // const graphTitle      = props.titleTextJSX ? props.titleTextJSX :
  //   typeof props.titleText === 'string' ?
  //   <h3 className={`gw-title ${graphTitleClass}`}>{props.titleText}</h3> :
  //   <h3 className={`gw-title ${graphTitleClass}`}>graph!</h3>
   
  const graphTitle = formatTitle(
    props.titleText, 
    props.groupDotColors,
    props.cssBackground
  );

  const graphSubTitle   = null; // <h3 className={`gw-title gw-subtitle ${graphTitleClass}`}>Displaying: ????</h3>

  const spinnerRight = !props.advanceAllow ?
    null :
    !props.waitingOnDataFromProps ?
    null : 
    <div className='gw-advance-waiting gw-advance-waiting-right'>
      <div/>
    </div> ;

  const spinnerLeft = !props.advanceAllow ?
    null :
    !props.waitingOnDataFromProps ?
    null : 
    <div className='gw-advance-waiting gw-advance-waiting-left'>
      <div/>
    </div> ;
      
  const hideAdvanceButtonClass = 
    props.waitingOnDataFromProps ? 
    'transparent' : 
    '' ;

  const i = props.icons || {} ;
  const IconLeft  = i.caret_left;
  const IconRight = i.caret_right;

  const buttonAdvanceLeft = 
    props.retreatAllow ?
    <div className={`gw-advance-button gw-control gw-control-over-${props.cssBackground} tooltip tooltip-bottom-left ${hideAdvanceButtonClass}`} 
      onClick={()=>props.graphAdvance(-1)}>
      <div className='popover'>
        <p>retreat the graph to the prior event</p>
      </div>
      <IconLeft style={{height: 36}} />
    </div> :
    <div className='gw-advance-button gw-control'/> ;

  const buttonAdvanceRight = 
    props.advanceAllow ?
    <div className={`gw-advance-button gw-control gw-control-over-${props.cssBackground} tooltip tooltip-bottom-right ${hideAdvanceButtonClass}`} 
      onClick={()=>props.graphAdvance(1)}>
      <div className='popover'>
        <p>advance the graph to the next event</p>
      </div>
      <IconRight style={{height: 36}} />
    </div> :
    <div className='gw-advance-button gw-control'/> ;

  return <div className='gw-footer'
    style={props.cssDivFooter}>
    <div className='gw-footer-top'>
      {buttonAdvanceLeft}
      {spinner}
      {graphTitle}
      {graphSubTitle}
      {spinner}
      {buttonAdvanceRight}
    </div>
    <div className='gw-footer-bottom'>
      <p className='gw-footer-description'>
        {props.legendDescription}
      </p>
    </div>

    <style>{`
    .gw-footer {
      flex-direction: column;
    }
    .gw-title {
      color: white;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      flex-grow: 1;
    }
    .gw-advance-spinner-container {
      height: 36px;
      overflow: hidden;
    }
    .gw-advance-spinner-container .line-scale-pulse-out-rapid > div {
      background-color: white ;
    }
    .gw-advance-button {
      width: 36px;
      justify-content: center;
      align-items: center;
    }
    @media(min-width: 520px){
      .gw-advance-button {
        font-size: 36px;
      }
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
    @media print {
      .gw-control {
        display: none !important;
      }
    }
    .gw-footer-top {
      width: 100%;
      justify-content: space-between;
      min-height: 36px;
    }
    .gw-footer-bottom {
      width: 100%;
      height: 42px;
      overflow: scroll;
    }
    .gw-footer-description {
      font-size: 12px;
      line-height: 14px;
      max-height: 42px; /* 3 lines */
      font-weight: 100;
      opacity: 0.85;
      text-align: left;
      color: white;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
    }

    .gw-advance-waiting {
      position: absolute;
      top: 50%;
      margin-top: -30px;
    }
    .gw-advance-waiting-left {
      left: 60px;
    }
    .gw-advance-waiting-right {
      right: 60px;
    }
    .gw-advance-waiting > div {
      width: 60px;
      height: 60px;
      background-color: yellow;
      border-radius: 100%;
      -webkit-animation: blinking 1.0s infinite ease-in-out;
      animation: blinking 1.0s infinite ease-in-out;
    }
    @-webkit-keyframes blinking {
      0% { -webkit-transform: scale(0.0) }
      100% {
        -webkit-transform: scale(1.0);
        opacity: 0;
      }
    }
    
    @keyframes blinking {
      0% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
      } 100% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
        opacity: 0;
      }
    }
    `}</style>
  </div>

}