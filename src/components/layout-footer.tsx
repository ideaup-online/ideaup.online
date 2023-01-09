import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Footie = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  padding-top: 1.5em;
  padding-bottom: 0.4em;
`;

const FootieContent = styled.div`
  order: 1;
  font-size: 0.75em;
  max-width: 50vw;
  text-align: center;
  padding: 0.25em;
`;

const LayoutFooter = (): JSX.Element => {
  const yearSpanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const year = new Date().getFullYear();
    if (year > 2019) {
      if (yearSpanRef.current != null) {
        yearSpanRef.current.textContent = `-${year}`;
      }
    }
  }, []);

  return (
    <Footie>
      <FootieContent>
        © 2019<span ref={yearSpanRef}></span> Rich Seiffert
      </FootieContent>
      <FootieContent>
        All text, bad puns, images, deep insights, videos, terrible jokes,
        mathematical formulas, half–assed ideas and icons on this site are my
        own work — they may not be reproduced in any form without my permission
      </FootieContent>
    </Footie>
  );
};

export default LayoutFooter;
