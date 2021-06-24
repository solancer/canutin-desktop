import React, { useState, useEffect, memo } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Form from '@components/common/Form/Form/formImportWizard';
import Fieldset from '@components/common/Form/Fieldset';
import RadioGroupField from '@components/common/Form/RadioGroupField';
import ChooseFileInput from '@components/common/ChooseFileInput';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';

import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  ANALYZE_SOURCE_FILE_ACK,
  LOAD_FROM_CANUTIN_FILE,
  LOAD_FROM_CANUTIN_FILE_ACK,
  LOAD_FROM_OTHER_CSV_ACK,
} from '@constants/events';
import { sourceExtensionFile, enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { CanutinFileType } from '@appTypes/canutin';
import { ParseMeta } from '@appTypes/parseCsv';

import OtherCSVForm from './OtherCSVForm';

import sourceAlertsLookup from './dataSourceAlerts';

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

export interface AnalyzeSourceMetadataType extends ParseMeta {
  countAccounts?: number;
  countTransactions?: number;
  error?: string;
}

export interface AnalyzeSourceFileType {
  status: StatusEnum;
  sourceData: CanutinFileType;
  metadata: AnalyzeSourceMetadataType;
}

interface ImportWizardFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ImportWizardForm = ({ isLoading, setIsLoading }: ImportWizardFormProps) => {
  const [source, setSource] = useState<enumImportTitleOptions | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [filePathStatus, setFilePathStatus] = useState<StatusEnum>();
  const [sourceMessage, setSourceMessage] = useState<string>();
  const [canutinJson, setCanutinJson] = useState<CanutinFileType | null>(null);
  const [otherCsvData, setOtherCsvData] = useState<unknown | null>(null);
  const [otherCsvMetadata, setOtherCsvMetadata] = useState<AnalyzeSourceMetadataType | null>(null);

  useEffect(() => {
    ipcRenderer.on(
      LOAD_FROM_CANUTIN_FILE_ACK,
      (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
        setIsLoading(false);
      }
    );

    ipcRenderer.on(LOAD_FROM_OTHER_CSV_ACK, (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
      setIsLoading(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(LOAD_FROM_CANUTIN_FILE_ACK);
      ipcRenderer.removeAllListeners(LOAD_FROM_OTHER_CSV_ACK);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on(IMPORT_SOURCE_FILE_ACK, (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
      setFilePath(sourceFilePath);
    });

    ipcRenderer.on(
      ANALYZE_SOURCE_FILE_ACK,
      (_: IpcRendererEvent, analyzeSource: AnalyzeSourceFileType) => {
        setFilePathStatus(analyzeSource.status);

        if (analyzeSource.status === StatusEnum.SUCCESS) {
          if (analyzeSource.metadata?.fields) {
            setOtherCsvData(analyzeSource.sourceData);
            setOtherCsvMetadata(analyzeSource.metadata);
          } else {
            setCanutinJson(analyzeSource.sourceData);
          }

          analyzeSource.metadata?.countAccounts &&
            analyzeSource.metadata?.countTransactions !== undefined &&
            setSourceMessage(
              `Found ${analyzeSource.metadata.countAccounts} accounts and ${analyzeSource.metadata.countTransactions} transactions in the file`
            );
        }

        if (analyzeSource.status === StatusEnum.ERROR) {
          setCanutinJson(null);
          setOtherCsvData(null);

          if (analyzeSource.metadata?.error) {
            setSourceMessage(analyzeSource.metadata.error);
          }
        }
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(IMPORT_SOURCE_FILE_ACK);
      ipcRenderer.removeAllListeners(ANALYZE_SOURCE_FILE_ACK);
    };
  }, [source]);

  useEffect(() => {
    if (filePath) {
      analyzeSourceFile();
    } else {
      setFilePathStatus(undefined);
    }
  }, [filePath]);

  const onSubmit = () => {
    canutinJson && ipcRenderer.send(LOAD_FROM_CANUTIN_FILE, canutinJson);
    setIsLoading(true);
  };

  const analyzeSourceFile = () => {
    ipcRenderer.send(ANALYZE_SOURCE_FILE, { pathFile: filePath, source });
    setFilePathStatus(StatusEnum.LOADING);
  };

  const onChooseFileInput = () => {
    source && ipcRenderer.send(IMPORT_SOURCE_FILE, sourceExtensionFile(source));
    setSourceMessage(undefined);
    setOtherCsvData(null);
    setOtherCsvMetadata(null);
  };

  const isSubmitDisabled =
    source === enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE ||
    canutinJson === null ||
    isLoading;

  return (
    <Form>
      <Fieldset>
        <RadioGroupField
          label="Import from"
          name="importSource"
          values={Object.values(enumImportTitleOptions)}
          onSelectOption={value => {
            setSource(value as enumImportTitleOptions);
            setFilePath(null);
            setOtherCsvData(null);
            setOtherCsvMetadata(null);
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
      </Fieldset>
      {source === enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE &&
        otherCsvData &&
        otherCsvMetadata && <OtherCSVForm data={otherCsvData} metadata={otherCsvMetadata} />}
      {(source !== enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE || !otherCsvData) && (
        <FormFooter>
          <SubmitButton disabled={isSubmitDisabled} onClick={onSubmit}>
            Continue
          </SubmitButton>
        </FormFooter>
      )}
    </Form>
  );
};

export default memo(ImportWizardForm);
