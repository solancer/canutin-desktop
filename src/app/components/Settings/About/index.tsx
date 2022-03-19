import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import { APP_VERSION_ACK } from '@constants/app';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';
import AppIpc from '@app/data/app.ipc';

const About = () => {
  const [appVersion, setAppVersion] = useState('Unknown version');

  useEffect(() => {
    ipcRenderer.on(APP_VERSION_ACK, (_, appVersion: string) => {
      setAppVersion(appVersion);
    });

    setTimeout(() => {
      AppIpc.getAppVersion();
    }, 100);

    return () => {
      ipcRenderer.removeAllListeners(APP_VERSION_ACK);
    };
  }, []);

  return (
    <Form onSubmit={() => {}}>
      <Fieldset>
        {appVersion && (
          <InputTextField label="Version" name="version" value={appVersion} disabled />
        )}
      </Fieldset>
    </Form>
  );
};

export default About;
