import React from 'react';
import styled from 'styled-components';

import { StatusEnum } from '@appConstants/misc';

import {
  container,
  label,
  labelWrapper,
  fileExtensionLabel,
  filePathContainer,
  chooseBtn,
  filePathText,
  fileContainer,
  filePathStatus,
} from './styles';

const Container = styled.div`
  ${container}
`;
const LabelWrapper = styled.div`
  ${labelWrapper}
`;
const Label = styled.label`
  ${label}
`;
const FileContainer = styled.div`
${fileContainer}`
const FileExtensionLabel = styled.div`
  ${fileExtensionLabel}
`;
const FilePathStatus = styled.div`
  ${filePathStatus}
`;
const FilePathText = styled.div`
  ${filePathText}
`;
const FilePathContainer = styled.div`
  ${filePathContainer}
`;
const ChooseButton = styled.button`
  ${chooseBtn}
`;

const MAX_LENGTH_PATH = 40;

export interface ChooseFileInputProps {
  label: string;
  extensionType: string | null;
  onSelect: () => void;
  filePath?: string | null;
  statusMessage?: string;
  status?: StatusEnum;
}

const ChooseFileInput = ({
  label,
  extensionType,
  onSelect,
  filePath,
  status,
  statusMessage,
}: ChooseFileInputProps) => {
  return (
    <Container>
      <LabelWrapper>
        <Label>{label}</Label>
        {extensionType && <FileExtensionLabel>{extensionType.toUpperCase()}</FileExtensionLabel>}
      </LabelWrapper>
      <FileContainer>
        <FilePathContainer onClick={onSelect} status={status}>
          <FilePathText>
            {filePath &&
              (filePath.length < MAX_LENGTH_PATH
                ? filePath
                : `${filePath?.substring(0, MAX_LENGTH_PATH)}...`)}
          </FilePathText>
          <ChooseButton>Choose</ChooseButton>
        </FilePathContainer>
        {status && <FilePathStatus status={status}>{statusMessage}</FilePathStatus>}
      </FileContainer>
    </Container>
  );
};

export default ChooseFileInput;
