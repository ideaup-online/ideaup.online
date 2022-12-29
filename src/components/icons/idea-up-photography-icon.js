import React from 'react';
import styled from 'styled-components';
import toReactComponent from 'svgr.macro';
import SvgInline from '../svg-inline';

const StyledSvg = styled(SvgInline)`
  .idea-up-photography-icon-camera-body {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24px;
  }
  .idea-up-photography-icon-lens {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 20px;
  }
  .idea-up-photography-icon-shine {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 12px;
  }
  .idea-up-photography-border-circle {
    fill: none;
    stroke: coral;
    stroke-miterlimit: 10;
    stroke-width: 54px;
  }
`;

class IdeaUpPhotographyIcon extends React.Component {
  render() {
    return (
      <StyledSvg
        className={this.props.className}
        id={this.props.id}
        component={toReactComponent(
          '../../../content/assets/icons/photography-category-icon.svg',
        )}
      />
    );
  }
}

export default IdeaUpPhotographyIcon;
