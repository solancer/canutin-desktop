import React, { ReactNode, SetStateAction, Dispatch } from 'react';
import styled from 'styled-components';

import { container, section } from './styles';

const Container = styled.div`
  ${container}
`;

const Section = styled.div`
  ${section}
`;

export type SectionType = {
  label: string;
  component: ReactNode;
};

interface SectionTabProps {
  sections: SectionType[];
  selectedSection: string;
  setSelectedSection: Dispatch<SetStateAction<string | undefined>>;
}

const SectionTab = ({ selectedSection, setSelectedSection, sections }: SectionTabProps) => (
  <Container>
    {sections.map(({ label }) => (
      <Section
        key={label}
        onClick={() => setSelectedSection(label)}
        isSelected={selectedSection === label}
      >
        {label}
      </Section>
    ))}
  </Container>
);

export default SectionTab;
