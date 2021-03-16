import React, { useState } from 'react';
import styled from 'styled-components';

import NavItem from './NavItem';
import { ReactComponent as BurgerIcon } from 'app/assets/icons/Burger.svg';
import { ReactComponent as BigPicture } from 'app/assets/icons/BigPicture.svg';
import { ReactComponent as BalanceSheet } from 'app/assets/icons/BalanceSheet.svg';
import { ReactComponent as Budget } from 'app/assets/icons/Budget.svg';
import { ReactComponent as Transactions } from 'app/assets/icons/Transactions.svg';
import { ReactComponent as Trends } from 'app/assets/icons/Trends.svg';
import { container, burgerButton, nav, navItems } from './styles';
import { routesPaths } from '../../../routes';

const Container = styled.nav`${container}`;
const BurgerButton = styled.div`${burgerButton}`;
const NavItems = styled.div`${navItems}`;
const Nav = styled.nav`${nav}`;

const SideBar = () => {
  const [toggled, setToggled] = useState(true);

  return (
    <Container>
      <Nav>
        <BurgerButton onClick={() => setToggled(!toggled)}>
          <BurgerIcon />
        </BurgerButton>

        <NavItems>
          <NavItem
            icon={<BigPicture />}
            text="The big picture"
            toggled={toggled}
            to={routesPaths.index}
          />

          <NavItem
            icon={<BalanceSheet />}
            text="Balance sheet"
            toggled={toggled}
            to={routesPaths.balance}
          />

          <NavItem
            icon={<Budget />}
            text="Budget"
            toggled={toggled}
            to={routesPaths.budget}
          />

          <NavItem
            icon={<Transactions />}
            text="Transactions"
            toggled={toggled}
            to={routesPaths.transactions}
          />

          <NavItem
            icon={<Trends />}
            text="Trends"
            toggled={toggled}
            to={routesPaths.trends}
          />
        </NavItems>
      </Nav>
    </Container>
  );
}

export default SideBar;
