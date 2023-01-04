import React from 'react';
import styled from '@emotion/styled';
import AstronomyIcon from '../../../content/assets/icons/astronomy-category-icon.svg';
import SvgInline from '../svg-inline';

const StyledSvg = styled(SvgInline)`
  .idea-up-astronomy-icon-tripod {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24px;
  }
  .idea-up-astronomy-icon-telescope {
    fill: none;
    stroke: coral;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 18px;
  }
  .idea-up-astronomy-icon-shine {
    fill: none;
    stroke: #000;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 12px;
  }
  .idea-up-astronomy-border-circle {
    fill: none;
    stroke: coral;
    stroke-miterlimit: 10;
    stroke-width: 54px;
  }
`;

const IdeaUpAstronomyIcon = (props: any): JSX.Element => {
  return (
    <StyledSvg
      className={props.className}
      id={props.id}
      component={<AstronomyIcon />}
    />
  );
};

export default IdeaUpAstronomyIcon;
