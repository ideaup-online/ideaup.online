import React from 'react';
import styled from '@emotion/styled';
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

const IdeaUpElectronicsIcon = (props: any): JSX.Element => {
  return (
    <StyledSvg
      className={props.className}
      id={props.id}
      component={toReactComponent(
        '../../../content/assets/icons/electronics-category-icon.svg',
      )}
    />
  );
};

export default IdeaUpElectronicsIcon;
