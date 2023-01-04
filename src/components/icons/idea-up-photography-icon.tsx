import React from 'react';
import styled from '@emotion/styled';
import PhotographyIcon from '../../../content/assets/icons/photography-category-icon.svg';
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

const IdeaUpPhotographyIcon = (props: any): JSX.Element => {
  return (
    <StyledSvg
      className={props.className}
      id={props.id}
      component={<PhotographyIcon />}
    />
  );
};

export default IdeaUpPhotographyIcon;
