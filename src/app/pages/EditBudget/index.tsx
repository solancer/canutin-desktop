import { format } from 'date-fns';

import ScrollView from '@app/components/common/ScrollView';
import EditBudgetGroups from '@app/components/Budget/EditBudgetGroups';
import TransactionCategories from '@app/components/Budget/TransactionCategories';

const EditBudget = () => {
  const editBudgetSections = [
    {
      label: 'Budget groups',
      component: <EditBudgetGroups />,
    },
    {
      label: 'Transaction categories',
      component: <TransactionCategories />,
    },
  ];

  return (
    <ScrollView
      title="Edit budget"
      subTitle={format(new Date(), 'MMMM yyyy')}
      sections={editBudgetSections}
    />
  );
};

export default EditBudget;
