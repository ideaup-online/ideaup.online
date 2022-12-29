import React, { useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import IdeaUpSiteLogo from '../components/icons/idea-up-site-logo';
import IdeaUpTextLogo from '../components/icons/idea-up-text-logo';

// This file creates a full size banner for the header

const Banner = styled.div`
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: stretch;
  align-items: center;
  grid-template-columns: min-content auto;
  grid-template-rows: auto;
  grid-template-areas: 'icon hulk';
  border-bottom-style: solid;
  border-bottom-width: thin;
  border-bottom-color: rgb(160, 160, 160);
  padding-bottom: 0.4em;
  padding-top: 0.2em;
  padding-left: 0.4em;
`;

const SiteLogo = styled(IdeaUpSiteLogo)`
  grid-area: icon;
  width: 7em;
  height: 7em;
  .idea-up-site-icon-rays {
    stroke: rgba(0, 0, 0, 0);
    transition: stroke 0.75s ease-in-out;
  }
`;

const TextLogo = styled(IdeaUpTextLogo)`
  order: 1;
  svg {
    height: 4em;
  }
`;

const Hulk = styled.div`
  grid-area: hulk;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 1.3em;
`;

const StyledLink = styled(Link)`
  align-self: flex-start;
`;

const SmallText = styled.div`
  order: 2;
  color: var(--accent-color);
  font-family: Solway, sans-serif;
  font-size: 1.3em;
`;

const LayoutBannerFull = () => {
  // useEffect(() => {
  //   const rays = document.getElementsByClassName('idea-up-site-icon-rays');

  //   Array.from(rays).forEach((ray, idx) => {
  //     ray.style.stroke = 'var(--accent-color)';
  //   });
  // }, []);
  return (
    <Banner>
      <Link href="/">
        <SiteLogo id="site-logo" />
      </Link>
      <Hulk>
        <StyledLink href="/">
          <TextLogo />
        </StyledLink>
        <SmallText>
          <Link href="/">Rich’s Design &amp; Creativity Sandbox</Link>
        </SmallText>
      </Hulk>
    </Banner>
  );
};

export default LayoutBannerFull;
