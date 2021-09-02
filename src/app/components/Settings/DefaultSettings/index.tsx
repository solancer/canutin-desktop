import React from 'react';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

const DefaultSettings = () => (
  <Form onSubmit={() => {}}>
    <Fieldset>
      <InputTextField label="Language" name="language" value="English" disabled />
      <InputTextField label="Currency" name="currency" value="USD $" disabled />
      <InputTextField label="Date format" name="dateFormat" value="YYYY/MM/DD" disabled />
      <InputTextField label="Number format" name="numberFormat" value="$111,222.33" disabled />
      <InputTextField label="First day of the week" name="weekStartsOn" value="Monday" disabled />
    </Fieldset>
  </Form>
);

export default DefaultSettings;
