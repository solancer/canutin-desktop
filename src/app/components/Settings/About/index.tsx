import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import { APP_INFO } from '@constants/events';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

const About = () => {
  const [appVersion, setAppVersion] = useState<null | string>();

  const getAppInfo = async () => {
    const { version } = await ipcRenderer.invoke(APP_INFO);
    setAppVersion(version);
  };

  useEffect(() => {
    getAppInfo();
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
