import React from 'react';
import styled from 'styled-components';
import toReactComponent from 'svgr.macro';
import SvgInline from '../svg-inline';

const StyledSvg = styled(SvgInline)`
  .idea-up-electronics-icon-battery {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24px;
  }
  .idea-up-electronics-icon-charge {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 20px;
  }
  .idea-up-electronics-icon-shine {
    fill: none;
    stroke: #000;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 12px;
  }
  .idea-up-electronics-icon-border-circle {
    fill: none;
    stroke: coral;
    stroke-miterlimit: 10;
    stroke-width: 54px;
  }
`;

class IdeaUpElectronicsIcon extends React.Component {
  render() {
    return (
      <StyledSvg
        className={this.props.className}
        id={this.props.id}
        component={toReactComponent(
          '../../../content/assets/icons/electronics-category-icon.svg',
        )}
      />
    );
  }
}

export default IdeaUpElectronicsIcon;
