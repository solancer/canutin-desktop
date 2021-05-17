// TODO: Complete this, https://github.com/Canutin/desktop/issues/49
const mapCategories = (category: string) => {
  switch (category) {
    case 'Auto & Transport':
    case 'Auto Payment':
      return 'Automotive';

    case 'Auto Insurance':
      return 'Insurance';

    case 'Gas & Fuel':
      return 'Gas stations';

    case 'Parking':
      return 'Parking';

    case 'Public Transportation':
      return 'Public Transportation';

    case 'Service & parts':
      return 'Service & parts';

    case 'Bills & Utilities':
    case 'Utilities':
      return 'Utilities';

    case 'Home Phone':
    case 'Mobile Phone':
    case 'Internet':
      return 'Internet & phone';

    case 'Television':
      return 'Television';

    case 'Business & services':
    case 'Advertising':
      return 'Business & services';

    default:
      return 'Uncategorized';
  }
};

export default mapCategories;
