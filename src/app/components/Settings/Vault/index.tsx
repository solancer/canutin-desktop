import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

import { AppContext } from '@app/context/appContext';
import { routesPaths } from '@routes';
import { useForm } from 'react-hook-form';

const Vault = () => {
  const { vaultPath } = useContext(AppContext);
  const { handleSubmit } = useForm();
  const history = useHistory();

  const onSubmit = async () => {
    history.push(routesPaths.setup);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <InputTextField
          label="Current vault"
          name="vault"
          value={vaultPath || 'Not defined'}
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
