import React, { ReactNode, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { ReactComponent as BackIcon } from '@assets/icons/Back.svg';
import { rootRoutesPaths } from '@routes';

import SectionTab, { SectionType } from '@components/common/SectionTabs';

import { container, header, title, main, subTitle, backButton, headerContainer } from './styles';

export const Container = styled.div`
  ${container}
`;
export const Header = styled.header`
  ${header}
`;
export const TitleContainer = styled.div`
  overflow: hidden;
`;
export const Title = styled.h1`
  ${title}
`;
export const SubTitle = styled.h3`
  ${subTitle}
`;
export const Main = styled.main`
  ${main}
`;
export const BackButton = styled(BackIcon)`
  ${backButton}
`;
export const HeaderContainer = styled.div`
  ${headerContainer}
`;

export interface ScrollViewProps {
  title: string;
  subTitle?: string;
  headerNav?: ReactNode;
  children?: ReactNode;
  wizard?: boolean;
  sections?: SectionType[];
}

const ScrollView = ({
  title,
  subTitle,
  headerNav,
  wizard,
  sections,
  children,
}: ScrollViewProps) => {
  const history = useHistory();
  const [selectedSection, setSelectedSection] = useState(sections?.[0].label);

  return (
    <Container>
      <Header isSectionIncluded={!!selectedSection}>
        {history.length > 1 && !Object.values(rootRoutesPaths).includes(history.location.pathname) && (
          <BackButton
            onClick={() => {
              history.goBack();
            }}
          />
        )}
        <HeaderContainer>
          <TitleContainer>
            <Title title={title}>{title}</Title>
            {subTitle && <SubTitle title={subTitle}>{subTitle}</SubTitle>}
          </TitleContainer>
          {headerNav && <nav>{headerNav}</nav>}
        </HeaderContainer>
        {sections && selectedSection && setSelectedSection ? (
          <SectionTab
            setSelectedSection={setSelectedSection}
            sections={sections}
            selectedSection={selectedSection}
          />
        ) : null}
      </Header>
      <Main wizard={wizard}>
        {selectedSection
          ? sections?.find(({ label }) => label === selectedSection)?.component
          : children}
      </Main>
    </Container>
  );
};

export default ScrollView;
