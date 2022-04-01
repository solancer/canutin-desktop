import React, { useState, useEffect, memo, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import { EntitiesContext } from '@app/context/entitiesContext';
import { StatusBarContext } from '@app/context/statusBarContext';
import Form from '@components/common/Form/Form/formImportWizard';
import Fieldset from '@components/common/Form/Fieldset';
import RadioGroupField from '@components/common/Form/RadioGroupField';
import ChooseFileInput from '@components/common/ChooseFileInput';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';

import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  ANALYZE_SOURCE_FILE_ACK,
  LOAD_FROM_CANUTIN_FILE,
  LOAD_DATA_ACK,
} from '@constants/imports';
import { sourceExtensionFile, enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { CanutinFileType } from '@appTypes/canutinFile.type';
import { ParseMeta } from '@appTypes/parseCsv';
import AccountIpc from '@app/data/account.ipc';
import AssetIpc from '@app/data/asset.ipc';
import { routesPaths } from '@app/routes';

import OtherCSVForm from './OtherCSVForm';
import { generateSourceMessage } from './importWizardUtils';
import sourceAlertsLookup from './dataSourceAlerts';
import { AppContext } from '@app/context/appContext';
import { VaultStatusEnum } from '@enums/vault.enum';

const filePathStatusMessage = (status: StatusEnum, message?: string) => {
  if (message) {
    return message;
  }

  switch (status) {
    case StatusEnum.NEUTRAL:
      return 'Analyzing source file';
    case StatusEnum.NEGATIVE:
      return "Couldn't interpret the chosen file";
    case StatusEnum.POSITIVE:
      return 'The source file was analyzed succesfully';
  }
};

export interface AnalyzeSourceMetadataType extends ParseMeta {
  countAccounts?: number;
  countTransactions?: number;
  countAssets?: number;
  error?: string;
}

export interface AnalyzeSourceFileType {
  status: StatusEnum;
  sourceData: CanutinFileType;
  metadata: AnalyzeSourceMetadataType;
}

const ImportWizardForm = () => {
  const history = useHistory();
  const { setVaultStatus } = useContext(AppContext);
  const { accountsIndex, assetsIndex } = useContext(EntitiesContext);
  const { statusMessage, setStatusMessage } = useContext(StatusBarContext);
  const [source, setSource] = useState<enumImportTitleOptions | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [filePathStatus, setFilePathStatus] = useState<StatusEnum>();
  const [sourceMessage, setSourceMessage] = useState<string>();
  const [canutinJson, setCanutinJson] = useState<CanutinFileType | null>(null);
  const [otherCsvData, setOtherCsvData] = useState<unknown | null>(null);
  const [otherCsvMetadata, setOtherCsvMetadata] = useState<AnalyzeSourceMetadataType | null>(null);

  useEffect(() => {
    ipcRenderer.on(IMPORT_SOURCE_FILE_ACK, (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
      setFilePath(sourceFilePath);
    });

    ipcRenderer.on(
      ANALYZE_SOURCE_FILE_ACK,
      (_: IpcRendererEvent, analyzeSource: AnalyzeSourceFileType) => {
        setFilePathStatus(analyzeSource.status);

        if (analyzeSource.status === StatusEnum.POSITIVE) {
          if (analyzeSource.metadata?.fields) {
            setOtherCsvData(analyzeSource.sourceData);
            setOtherCsvMetadata(analyzeSource.metadata);
          } else {
            setCanutinJson(analyzeSource.sourceData);
            analyzeSource.metadata &&
              setSourceMessage(generateSourceMessage(analyzeSource.metadata));
          }
        }

        if (analyzeSource.status === StatusEnum.NEGATIVE) {
          setCanutinJson(null);
          setOtherCsvData(null);

          if (analyzeSource.metadata?.error) {
            setSourceMessage(analyzeSource.metadata.error);
          }
        }
      }
    );

    ipcRenderer.on(LOAD_DATA_ACK, (_: IpcRendererEvent, { status }) => {
      if (status === StatusEnum.POSITIVE) {
        AccountIpc.getAccounts();
        AssetIpc.getAssets();
      } else {
        setStatusMessage({
          sentiment: StatusEnum.NEGATIVE,
          message: `There was a problem importing the data from the source file`,
          isLoading: false,
        });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(IMPORT_SOURCE_FILE_ACK);
      ipcRenderer.removeAllListeners(ANALYZE_SOURCE_FILE_ACK);
      ipcRenderer.removeAllListeners(LOAD_DATA_ACK);
    };
  }, [source]);

  useEffect(() => {
    if (statusMessage.isLoading) {
      setVaultStatus(VaultStatusEnum.INDEXED_WITH_DATA);
      setStatusMessage({
        sentiment: StatusEnum.POSITIVE,
        message: 'The data was imported successfully',
        isLoading: false,
      });
      history.push(routesPaths.balance);
    }
  }, [accountsIndex, assetsIndex]);

  useEffect(() => {
    if (filePath) {
      analyzeSourceFile();
    } else {
      setFilePathStatus(undefined);
    }
  }, [filePath]);

  const onSubmit = () => {
    setStatusMessage({
      sentiment: StatusEnum.NEUTRAL,
      message: 'Importing data',
      isLoading: true,
    });
    canutinJson && ipcRenderer.send(LOAD_FROM_CANUTIN_FILE, canutinJson);
  };

  const analyzeSourceFile = () => {
    ipcRenderer.send(ANALYZE_SOURCE_FILE, { pathFile: filePath, source });
    setFilePathStatus(StatusEnum.NEUTRAL);
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
    statusMessage.isLoading;

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
