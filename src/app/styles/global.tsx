import { css, createGlobalStyle } from 'styled-components';

import { sansSerifRegular } from '@appConstants/fonts';
import { grey5 } from '@appConstants/colors';

import InterRegularWoff from '@assets/fonts/Inter-Regular.woff';
import InterRegularWoff2 from '@assets/fonts/Inter-Regular.woff2';
import InterSemiBoldrWoff from '@assets/fonts/Inter-SemiBold.woff';
import InterSemiBoldrWoff2 from '@assets/fonts/Inter-SemiBold.woff2';
import DecimaMonoProRegularWoff from '@assets/fonts/DecimaMonoPro-Regular.woff';
import DecimaMonoProRegularWoff2 from '@assets/fonts/DecimaMonoPro-Regular.woff2';

const globalStyle = css`
  // Fonts
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: local('Inter'), url(${InterRegularWoff2}) format('woff2'), local('Inter'),
      url(${InterRegularWoff}) format('woff');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    src: local('Inter'), url(${InterSemiBoldrWoff2}) format('woff2'), local('Inter'),
      url(${InterSemiBoldrWoff}) format('woff');
  }

  /* Decima Mono Pro */
  @font-face {
    font-family: 'Decima Mono Pro';
    font-weight: 400;
    font-style: normal;
    src: local('Decima Mono Pro'), url(${DecimaMonoProRegularWoff2}) format('woff2'),
      local('Decima Mono Pro'), url(${DecimaMonoProRegularWoff}) format('woff');
  }

  html,
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  ul,
  li,
  hr,
  #root {
    margin: 0;
  }
  ul,
  li {
    list-style: none;
  }

  body {
    ${sansSerifRegular};
    background-color: ${grey5};
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

const GlobalStyle = createGlobalStyle`${globalStyle}`;

export default GlobalStyle;
