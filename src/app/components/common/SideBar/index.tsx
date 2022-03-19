import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';

import { ReactComponent as BurgerIcon } from '@assets/icons/Burger.svg';
import { ReactComponent as BigPicture } from '@assets/icons/BigPicture.svg';
import { ReactComponent as BalanceSheet } from '@assets/icons/BalanceSheet.svg';
import { ReactComponent as Settings } from '@assets/icons/Settings.svg';
import { ReactComponent as Budget } from '@assets/icons/Budget.svg';
import { ReactComponent as Transactions } from '@assets/icons/Transactions.svg';
import { ReactComponent as Trends } from '@assets/icons/Trends.svg';
import { ReactComponent as AddIcon } from '@assets/icons/Add.svg';

import { container, burgerButton, nav, navItems } from './styles';
import NavItem from './NavItem';
import { VaultStatusEnum } from '@enums/vault.enum';

const Container = styled.nav`
  ${container}
`;
const BurgerButton = styled.button`
  ${burgerButton}
`;
const NavItems = styled.div`
  ${navItems}
`;
const Nav = styled.nav`
  ${nav}
`;

const SideBar = () => {
  const [toggled, setToggled] = useState(true);
  const { vaultStatus } = useContext(AppContext);
  const isNavDisabled = vaultStatus !== VaultStatusEnum.INDEXED_WITH_DATA;

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
            to={routesPaths.bigpicture}
            disabled={isNavDisabled}
            dataTestId="sidebar-big-picture"
          />

          <NavItem
            icon={<BalanceSheet />}
            text="Balance sheet"
            toggled={toggled}
            to={routesPaths.balance}
            disabled={isNavDisabled}
            dataTestId="sidebar-balance-sheet"
          />

          <NavItem
            icon={<Budget />}
            text="Budget"
            toggled={toggled}
            to={routesPaths.budget}
            disabled={isNavDisabled}
            dataTestId="sidebar-budget"
          />

          <NavItem
            icon={<Transactions />}
            text="Transactions"
            toggled={toggled}
            to={routesPaths.transactions}
            disabled={isNavDisabled}
            dataTestId="sidebar-transactions"
          />

          <NavItem
            icon={<Trends />}
            text="Trends"
            toggled={toggled}
            to={routesPaths.trends}
            disabled={isNavDisabled}
          />
        </NavItems>
      </Nav>

      <NavItem icon={<Settings />} text="Settings" toggled={toggled} to={routesPaths.settings} />
      <NavItem
        icon={<AddIcon />}
        text="Add or update data"
        toggled={toggled}
        to={routesPaths.addOrUpdateData}
        dataTestId="sidebar-add-or-update-data"
      />
    </Container>
  );
};

export default SideBar;
