import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import RadioGroupField from '@components/common/Form/RadioGroupField';
import ChooseFileInput from '@components/common/ChooseFileInput';
import FormFooter from '@components/common/Form/FormFooter';

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
  formSubmitButton,
} from './styles';
import sourceAlertsLookup from './dataSourceAlerts';

const FormContainer = styled.div`
  ${formContainer}
`;
const FormSubmitButton = styled.button`
  ${formSubmitButton}
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
          setSourceMessage(analyzeSource.metadata && `Found ${analyzeSource.metadata.countAccounts} accounts`);
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
    } else {
      setFilePathStatus(undefined);
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
      <RadioGroupField
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
