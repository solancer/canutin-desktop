import { css } from 'styled-components';

import { grey5 } from 'app/constants/colors';
import InterRegularWoff from 'app/assets/fonts/Inter-Regular.woff';
import InterRegularWoff2 from 'app/assets/fonts/Inter-Regular.woff2';
import InterSemiBoldrWoff from 'app/assets/fonts/Inter-SemiBold.woff';
import InterSemiBoldrWoff2 from 'app/assets/fonts/Inter-SemiBold.woff2';

import DecimaMonoProRegularWoff from 'app/assets/fonts/DecimaMonoPro-Regular.woff';
import DecimaMonoProRegularWoff2 from 'app/assets/fonts/DecimaMonoPro-Regular.woff2';
import DecimaMonoProBoldWoff from 'app/assets/fonts/DecimaMonoPro-Bold.woff';
import DecimaMonoProBoldWoff2 from 'app/assets/fonts/DecimaMonoPro-Bold.woff2';
import { sansSerifRegular } from 'app/constants/fonts';

export const container = css`
  background-color: ${grey5};
  display: grid;
  grid-template-columns: max-content auto;
  grid-template-rows: 48px auto;
  grid-template-areas:
    "title-bar title-bar"
    "side-bar body";
  height: 100vh;
`;

export const globalStyle = css`
  // Fonts
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 400;
    src: local('Inter'), url(${InterRegularWoff2}) format("woff2"),
      local('Inter'), url(${InterRegularWoff}) format("woff");
  }
  
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 600;
    src: local('Inter'), url(${InterSemiBoldrWoff2}) format("woff2"),
      local('Inter'), url(${InterSemiBoldrWoff}) format("woff");
  }
  
  /* Decima Mono Pro */
  @font-face {
    font-family: 'Decima Mono Pro';
    font-weight: 400;
    font-style: normal;
    src: local('Decima Mono Pro'), url(${DecimaMonoProRegularWoff2}) format("woff2"),
      local('Decima Mono Pro'), url(${DecimaMonoProRegularWoff}) format("woff");
  }
  
  @font-face {
    font-family: 'Decima Mono Pro';
    font-weight: 600;
    font-style: normal;
    src: local('Decima Mono Pro'), url(${DecimaMonoProBoldWoff2}) format("woff2"),
      local('Decima Mono Pro'), url(${DecimaMonoProBoldWoff}) format("woff");
  }
  
  html, body, h1, h2, h3, h4, h5, p, ul, li, hr { margin: 0; }
  ul, li {
    list-style: none;
  }
  
  body {
    ${sansSerifRegular}
  }
`;
