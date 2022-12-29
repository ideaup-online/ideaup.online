import React from "react"
import styled from "styled-components"
import toReactComponent from "svgr.macro"
import SvgInline from "../../../src/components/svg-inline"

const StyledSvg = styled(SvgInline)`
  .graph-vertical-grid-major-label {
    font-size: 0.6em;
    text-anchor: end;
    dominant-baseline: central;
    fill: #a0a0a0;
  }
  .graph-horizontal-grid-major-label {
    font-size: 0.6em;
    text-anchor: middle;
    dominant-baseline: hanging;
    fill: #a0a0a0;
  }
  .graph-horizontal-grid-major {
    stroke: #606060;
  }
  .graph-horizontal-grid-minor {
    stroke: #505050;
  }
  .graph-vertical-grid-major {
    stroke: #606060;
  }
`

const Graph = props => {
  return (
    <StyledSvg
      id={props.id}
      className={props.className}
      component={toReactComponent("./px-graph.svg")}
    />
  )
}

export default Graph
