import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import IdeaUpSiteLogo from '../components/icons/idea-up-site-logo';
import IdeaUpTextLogo from '../components/icons/idea-up-text-logo';

const Banner = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: thin;
  border-bottom-color: rgb(160, 160, 160);
  padding-bottom: 0.2em;
  padding-left: 0.2em;
`;

const SiteLogo = styled(IdeaUpSiteLogo)`
  order: 1;
  width: 3em;
  height: 3em;
`;

const TextLogo = styled(IdeaUpTextLogo)`
  order: 2;
  padding-left: 0.5em;
  svg {
    height: 2em;
  }
`;

const LayoutBannerCompact = () => {
  return (
    <Banner>
      <Link href="/">
        <SiteLogo id="site-icon" />
      </Link>
      <Link href="/">
        <TextLogo id="site-logo" />
      </Link>
    </Banner>
  );
};

export default LayoutBannerCompact;
