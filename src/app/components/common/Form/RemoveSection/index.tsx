import React, { ReactNode} from 'react';
import styled from 'styled-components';

import Section from '@components/common/Section';
import Button from '@components/common/Button';

import { message, messageContainer, messageDanger, container } from './styles';

const Container = styled.div`
  ${container}
`;
const Message = styled.div`
  ${message}
`;
const MessageContainer = styled.div`
  ${messageContainer}
`;
const MessageDanger = styled.div`
  ${messageDanger}
`;

interface RemoveSectionProps {
  onRemove: () => void;
  removeMessage: ReactNode;
  confirmationMessage: string;
}

const RemoveSection = ({ onRemove, removeMessage, confirmationMessage }: RemoveSectionProps) => {
  const onClickMessage = () => {
    const confirmDeletion = window.confirm(confirmationMessage);
    confirmDeletion && onRemove();
  };

  return (
    <Section title="Danger zone">
      <Container>
        <MessageContainer>
          <Message>
            {removeMessage}
          </Message>
          <MessageDanger>This action can't be un-done.</MessageDanger>
        </MessageContainer>
        <Button onClick={onClickMessage}>Remove</Button>
      </Container>
    </Section>
  );
}

export default RemoveSection;
