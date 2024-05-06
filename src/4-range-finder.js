import React, { useState } from "react";

export default function RangeFinder(props) {
  const selectedLanguage = props.selectedLanguage;
  return (
    <div className="rcjspp-sel-row-form">
      <label className="rcjspp-sel-row-form-label">
        {selectedLanguage === 0 ? "Start of Range" : "Beginn des Bereichs"}
        <input
          type="number"
          name="start-of-range"
          step={1}
          className="rcjspp-sel-input"
          onChange={(e) => props.handleXStartChange(e)}
          value={props.xStart}
        />
      </label>
      <label className="rcjspp-sel-row-form-label">
        {selectedLanguage === 0 ? "End of Range" : "Ende des Bereichs"}
        <input
          type="number"
          step={1}
          className="rcjspp-sel-input"
          onChange={(e) => props.handleXEndChange(e)}
          value={props.xEnd}
        />
      </label>
      <label className="rcjspp-sel-row-form-label">
        {selectedLanguage === 0 ? "Increment Size" : "Inkrement Größe"}
        <input
          type="number"
          step={1}
          className="rcjspp-sel-input"
          onChange={(e) => props.handleXIdealTickSpacingChange(e)}
          value={props.xIdealTickSpacing}
        />
      </label>
      {!props.isGrouped && props.groupAllow ? (
        <label className="rcjspp-sel-row-form-label">
          {selectedLanguage === 0 ? "Group By" : "Gruppieren nach"}
          <select
            className="rcjspp-sel-input"
            onChange={(e) => props.handleGroupBy(e)}
          >
            {props.layerGroupByJSXOptions}
          </select>
        </label>
      ) : null}
    </div>
  );
}
