import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import RadioInputGroup from '@components/common/RadioInputGroup';
import ChooseFileInput from '@components/common/ChooseFileInput';

import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  ANALYZE_SOURCE_FILE_ACK,
  LOAD_FROM_CANUTIN_FILE
} from '@constants/events';
import { sourceExtensionFile, enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { CanutinJsonType } from '@appTypes/canutin';

import {
  formContainer,
  form,
  formFooter,
  formSubmitButton,
  balanceContainer,
  balanceSubContainer,
  customInputContainer,
  checkboxContainer,
  checkbox,
  checkboxLabel,
  customInputLabel,
  hrDivider,
} from './styles';
import sourceAlertsLookup from './dataSourceAlerts';

const FormContainer = styled.div`
  ${formContainer}
`;
const Form = styled.form`
  ${form}
`;
const FormFooter = styled.div`
  ${formFooter}
`;
const FormSubmitButton = styled.button`
  ${formSubmitButton}
`;
const BalanceContainer = styled.div`
  ${balanceContainer}
`;
const BalanceSubContainer = styled.div`
  ${balanceSubContainer}
`;
const CustomInputLabel = styled.label`
  ${customInputLabel}
`;
const CustomInputContainer = styled.div`
  ${customInputContainer}
`;
const CheckboxContainer = styled.div`
  ${checkboxContainer}
`;
const Checkbox = styled.input`
  ${checkbox}
`;
const CheckboxLabel = styled.label`
  ${checkboxLabel}
`;

const Hr = styled.hr`
  ${hrDivider}
`;

const filePathStatusMessage = (status: StatusEnum, message?: string) => {
  if (message) {
    return message;
  }

  switch (status) {
    case StatusEnum.LOADING:
      return 'Analyzing file...';
    case StatusEnum.ERROR:
      return "Couldn't interpret the chosen file";
    case StatusEnum.SUCCESS:
      return 'Successful analysis';
  }
};

interface AnalyzeSourceFileType {
  status: StatusEnum;
  sourceData: CanutinJsonType;
  metadata: {
    countAccounts?: number;
    error?: string;
  };
}

const ImportWizardForm = () => {
  const [source, setSource] = useState<enumImportTitleOptions | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [filePathStatus, setFilePathStatus] = useState<StatusEnum>();
  const [sourceMessage, setSourceMessage] = useState<string>();
  const [canutinJson, setCanutinJson] = useState<CanutinJsonType | null>(null);

  useEffect(() => {
    ipcRenderer.on(IMPORT_SOURCE_FILE_ACK, (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
      setFilePath(sourceFilePath);
    });

    ipcRenderer.on(
      ANALYZE_SOURCE_FILE_ACK,
      (_: IpcRendererEvent, analyzeSource: AnalyzeSourceFileType) => {
        setFilePathStatus(analyzeSource.status);

        if (analyzeSource.status === StatusEnum.SUCCESS) {
          setCanutinJson(analyzeSource.sourceData);
          setSourceMessage(`Found ${analyzeSource.metadata.countAccounts} accounts`);
        }

        if (analyzeSource.status === StatusEnum.ERROR) {
          setCanutinJson(null);
          
          if (analyzeSource.metadata) {
            setSourceMessage(analyzeSource.metadata.error);
          }
        }
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(IMPORT_SOURCE_FILE_ACK);
      ipcRenderer.removeAllListeners(ANALYZE_SOURCE_FILE_ACK);
    };
  }, []);

  useEffect(() => {
    if (filePath) {
      analyzeSourceFile();
    }
  }, [filePath]);

  const onSubmit = () => {
    canutinJson && ipcRenderer.send(LOAD_FROM_CANUTIN_FILE, canutinJson);
  }

  const analyzeSourceFile = () => {
    ipcRenderer.send(ANALYZE_SOURCE_FILE, { pathFile: filePath, source });
  };

  const onChooseFileInput = () => {
    source && ipcRenderer.send(IMPORT_SOURCE_FILE, sourceExtensionFile(source));
    setSourceMessage(undefined);
    setFilePathStatus(StatusEnum.LOADING);
  };

  return (
    <FormContainer>
      <RadioInputGroup
        label="Import from"
        name="importSource"
        values={Object.values(enumImportTitleOptions)}
        onSelectOption={value => {
          setSource(value as enumImportTitleOptions);
          setFilePath(null);
        }}
      />
      {sourceAlertsLookup(source)}
      {source && (
        <ChooseFileInput
          label="Choose source file"
          extensionType={sourceExtensionFile(source)}
          onSelect={onChooseFileInput}
          filePath={filePath}
          status={filePathStatus}
          statusMessage={filePathStatus && filePathStatusMessage(filePathStatus, sourceMessage)}
        />
      )}
      <FormFooter>
        <FormSubmitButton disabled={canutinJson === null} onClick={onSubmit}>
          Continue
        </FormSubmitButton>
      </FormFooter>
    </FormContainer>
  );
};

export default ImportWizardForm;
