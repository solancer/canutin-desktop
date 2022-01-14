import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { routesPaths } from '@routes';
import { StatusBarContext } from '@app/context/statusBarContext';
import Breadcrumbs from '@components/common/Breadcrumbs';
import { ReactComponent as Loading } from '@assets/icons/Loading.svg';
import { container } from './styles';

const Container = styled.div`
  ${container};
`;

const loadingBreadcrumbs = [{ breadcrumb: 'Canutin', path: '/' }];

const NotReady = () => {
  const { setBreadcrumbs } = useContext(StatusBarContext);
  const breadcrumbItems = useBreadcrumbs(loadingBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  useEffect(() => {
    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      setBreadcrumbs(undefined);
    };
  }, []);

  return (
    <Container>
      <Loading />
    </Container>
  );
};
export default NotReady;
