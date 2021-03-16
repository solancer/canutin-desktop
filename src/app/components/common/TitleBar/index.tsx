import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Icon } from 'app/assets/icons/CanutinIcon.svg';
import { container, icon } from './styles';

const Container = styled.div`${container}`;
const CanutinIcon = styled(Icon)`${icon}`;

const TitleBar = () => (
  <Container>
    <CanutinIcon />
  </Container>
);

export default TitleBar;
