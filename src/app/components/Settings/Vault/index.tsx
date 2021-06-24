import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

import { AppContext } from '@app/context/appContext';
import { routesPaths } from '@routes';

const Vault = () => {
  const { filePath } = useContext(AppContext);
  const history = useHistory();

  return (
    <Form
      onSubmit={() => {
        history.push(routesPaths.canutinSetup);
      }}
    >
      <Fieldset>
        <InputTextField
          label="Current vault"
          name="vault"
          value={filePath || 'Not defined'}
          disabled
        />
      </Fieldset>
      <FormFooter>
        <SubmitButton>Switch vault</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default Vault;
