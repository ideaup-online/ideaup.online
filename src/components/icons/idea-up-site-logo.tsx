import React from 'react';
import styled from '@emotion/styled';
import SiteLogo from '../../../content/assets/icons/site-logo.svg';
import SvgInline from '../svg-inline';

const StyledSvg = styled(SvgInline)`
  .idea-up-site-icon-arrow {
    fill: none;
    stroke: var(--accent-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24px;
  }
  .idea-up-site-icon-threads {
    fill: none;
    stroke: var(--accent-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24px;
  }
  .idea-up-site-icon-shine {
    fill: none;
    stroke: var(--accent-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 12px;
  }
  .idea-up-site-icon-rays {
    fill: none;
    stroke: var(--accent-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 20px;
  }
  .idea-up-site-icon-border-circle {
    fill: none;
    stroke: var(--base-color);
    stroke-miterlimit: 10;
    stroke-width: 54px;
  }
`;

const IdeaUpSiteLogo = (props: any): JSX.Element => {
  return (
    <StyledSvg
      className={props.className}
      id={props.id}
      component={<SiteLogo />}
    />
  );
};

export default IdeaUpSiteLogo;
