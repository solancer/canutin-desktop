import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

import { container, text } from './styles';

const Container = styled(Link)`
  ${container}
`;
const Text = styled.p`
  ${text}
`;

export interface NavItemProps {
  icon: ReactNode;
  text: string;
  toggled: boolean;
  to: string;
}

const NavItem = ({ icon, text, toggled, to }: NavItemProps) => {
  const { pathname } = useLocation();

  return (
    <Container active={pathname === to} toggled={toggled} to={to}>
      {icon}
      <Text toggled={toggled}>{text}</Text>
    </Container>
  );
};

export default NavItem;
