import Head from 'next/head';

import styled from '@emotion/styled';
import LayoutBannerFull from '../components/layout-banner-full';
import LayoutBannerCompact from '../components/layout-banner-compact';
import LayoutFooter from '../components/layout-footer';
// import 'normalize.css';

// This file sets up the main layout areas of the site
// in a grid as shown below. Each area is delegated to
// a component that manages it. The grid will stretch
// vertically (align) to fill the browser window if it
// is not tall enough. The grid will center in the
// browser window horizontally (justify) if it is not
// wide enough.
//
//  |          |                           |           |
//  ====================================================
//  |                 H E A D E R                      |
//  ====================================================
//  |          |                           |           |
//  |    SB    |                           |    SB     |
//  |   LEFT   |     C O N T E N T         |   RIGHT   |
//  |          |                           |           |
//  |          |                           |           |
//  ====================================================
//  |                 F O O T E R                      |
//  ====================================================
//  |          |                           |           |
//
// Delegates for direct children of Layout's grid
// will be prefixed with "Layout"

const Grid = styled.div`
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: stretch;
  align-items: stretch;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'header header header'
    'sb_left content sb_right'
    'footer footer footer';
`;
// Creates space for the header.
const HeaderArea = styled.div`
  grid-area: header;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  justify-items: stretch;
`;

// Creates space for the left side bar. Someday...
const SBLeftArea = styled.div`
  grid-area: sb_left;
`;
// Creates space for the content
const ContentArea = styled.div`
  grid-area: content;
  justify-self: center;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  justify-items: stretch;
`;

// Creates space for the right side bar. Someday...
const SBRightArea = styled.div`
  grid-area: sb_right;
`;

// Creates space for the footer
const FooterArea = styled.div`
  grid-area: footer;
`;

// The Main Event..er..Function
const Layout = ({ title, showStyle, sbLeft, content, sbRight }) => {
  let pageTitle = 'Idea Up';
  if (title) {
    pageTitle = pageTitle + ' | ' + title;
  }

  // Set the header height and select the proper banner
  // layout based on the showStyle prop
  let Banner;
  if ('full' === showStyle) {
    Banner = LayoutBannerFull;
  } else if ('compact' === showStyle) {
    Banner = LayoutBannerCompact;
  } else {
    console.log('Unknown showStyle: ' + showStyle);
  }

  return (
    <Grid>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderArea id="header-area">
        <Banner />
      </HeaderArea>

      <SBLeftArea>{sbLeft}</SBLeftArea>

      <ContentArea id="content-area">{content}</ContentArea>

      <SBRightArea>{sbRight}</SBRightArea>

      <FooterArea>
        <LayoutFooter />
      </FooterArea>
    </Grid>
  );
};

Layout.defaultProps = {
  showStyle: 'full',
};

export default Layout;
