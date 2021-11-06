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
  disabled?: boolean;
  dataTestId?: string;
}

const NavItem = ({ icon, text, toggled, to, dataTestId, disabled = false }: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to ? 1 : 0;

  return (
    <Container
      active={isActive}
      toggled={toggled ? 1 : 0}
      to={to}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {icon}
      <Text toggled={toggled}>{text}</Text>
    </Container>
  );
};

export default NavItem;
