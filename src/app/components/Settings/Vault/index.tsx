import React, { useContext } from 'react';

import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import ButtonSubmit from '@components/common/Form/ButtonSubmit';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

import { AppContext } from '@app/context/appContext';

const Vault = () => {
  const { filePath } = useContext(AppContext);

  return (
    <Form onSubmit={() => {}}>
      <Fieldset>
        <InputTextField label="Current vault" name="vault" value={filePath || 'Not defined'} disabled />
      </Fieldset>
      <FormFooter>
        <ButtonSubmit>Switch vault</ButtonSubmit>
      </FormFooter>
    </Form>
  );
};

export default Vault;
