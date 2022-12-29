import React from 'react';
import styled from 'styled-components';
import toReactComponent from 'svgr.macro';
import SvgInline from '../../components/svg-inline';

const StyledSvg = styled(SvgInline)`
  .idea-up-text-logo-lettering {
    fill: var(--base-color);
  }
  .idea-up-text-logo-bar {
    fill: var(--accent-color);
  }
`;

const IdeaUpTextLogo = (props) => {
  return (
    <StyledSvg
      id={props.id}
      className={props.className}
      component={toReactComponent(
        '../../../content/assets/icons/text-logo.svg',
      )}
    />
  );
};

export default IdeaUpTextLogo;
