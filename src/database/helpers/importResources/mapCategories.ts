// Mappings are sorted alphabetically by their returned category

const mapCategories = (category: string) => {
  switch (category.toLowerCase()) {
    case 'auto & transport':
    case 'auto payment':
    case 'automotive':
      return 'Automotive';

    case 'allowance':
      return 'Allowance';

    case 'alcohol & bars':
    case 'bars':
      return 'Bars';

    case 'advertising':
    case 'printing':
    case 'shipping':
    case 'services':
    case 'business miscellaneous':
    case 'office maintenance':
    case 'online services':
    case 'other bills':
    case 'other expenses':
    case 'business & services':
      return 'Business & services';

    case 'book & supplies':
      return 'Books & supplies';

    case 'charitable giving':
    case 'charity':
      return 'Charity';

    case 'babysitter & daycare':
    case 'childcare':
      return 'Childcare';

    case 'clothing/shoes':
    case 'clothing':
      return 'Clothing';

    case 'coffee':
    case 'coffee shops':
      return 'Coffee shops';

    case 'tuition':
    case 'education':
      return 'Education';

    case 'electronics & software':
    case 'electronics':
      return 'Electronics';

    case 'entertainment':
    case 'arts':
    case 'movies & dvds':
    case 'newspapers & magazines':
    case 'entertainment & recreation':
      return 'Entertainment & recreation';

    case 'health & fitness':
    case 'gym':
    case 'fitness':
      return 'Fitness';

    case 'fees & charges':
    case 'atm fee':
    case 'bank fee':
    case 'finance charge':
    case 'late fee':
    case 'service fee':
    case 'trade comissions':
    case 'service charges/fees':
    case 'fees':
      return 'Fees';

    case 'financial':
    case 'reimbursement':
    case 'returned purchase':
    case 'transfer for cash spending':
    case 'cash & atm':
    case 'atm/cash':
    case 'check':
    case 'checks':
    case 'loans':
    case 'allocated excess cash':
    case 'cash raised':
    case 'diversified transferred-in securities':
    case 'expense reinbursement':
    case 'retirement contributions':
    case 'savings':
    case 'financial & banking':
      return 'Financial & banking';

    case 'financial advisor':
    case 'consulting':
    case 'advisory fee':
    case 'not traded':
    case 'client request':
    case 'general rebalance':
    case 'personal strategy implementation':
    case 'portfolio management':
    case 'securities trades':
    case 'strategy change':
    case 'financial services':
      return 'Financial services';

    case 'food & dining':
    case 'food & drink':
      return 'Food & drink';

    case 'furnishings':
      return 'Furnishings';

    case 'gas & fuel':
    case 'gasoline/fuel':
    case 'gas stations':
      return 'Gas stations';

    case 'gift':
    case 'gifts & donations':
    case 'gifts':
      return 'Gifts';

    case 'groceries':
      return 'Groceries';

    case 'dentist':
    case 'doctor':
    case 'eyecare':
    case 'health insurance':
    case 'healthcare/medical':
    case 'health':
      return 'Health';

    case 'hobbies':
      return 'Hobbies';

    case 'home improvement':
    case 'lawn & garden':
    case 'home maintenance':
      return 'Home maintenance';

    case 'home':
    case 'home services':
    case 'home supplies':
    case 'mortgage & rent':
    case 'mortgage':
    case 'mortgages':
    case 'rent':
    case 'housing':
      return 'Housing';

    case 'rental income':
    case 'investment income':
    case 'deposits':
    case 'dividens received':
    case 'dividens received (tax-advantaged)':
    case 'other income':
    case 'retirement income':
    case 'sales':
    case 'income':
      return 'Income';

    case 'auto insurance':
    case 'life insurance':
    case 'home insurance':
    case 'insurance':
      return 'Insurance';

    case 'interest income':
    case 'interest':
      return 'Interest';

    case 'home phone':
    case 'mobile phone':
    case 'internet':
    case 'telephone':
    case 'internet & phone':
      return 'Internet & phone';

    case 'child support':
    case 'kids activities':
    case 'child/dependent':
    case 'kids':
      return 'Kids';

    case 'baby supplies':
    case 'kids supplies':
      return 'Kids supplies';

    case 'legal':
      return 'Legal';

    case 'hotel':
    case 'loadging':
      return 'Lodging';

    case 'music':
      return 'Music';

    case 'office supplies':
      return 'Office supplies';

    case 'amusement':
    case 'outdoors & parks':
      return 'Outdoors & parks';

    case 'parking':
      return 'Parking';

    case 'credit card payment':
    case 'credit card payments':
    case 'payments':
      return 'Payments';

    case 'bonus':
    case 'paycheck':
    case 'paychecks/salary':
    case 'wages paid':
    case 'payroll & benefits':
      return 'Payroll & benefits';

    case 'hair':
    case 'laundry':
    case 'spa & massage':
    case 'personal care':
      return 'Personal care';

    case 'pets/pet care':
    case 'pet food & supplies':
    case 'pets':
      return 'Pets';

    case 'pet grooming':
    case 'pet services':
      return 'Pet services';

    case 'pharmacy':
    case 'pharmacies':
      return 'Pharmacies';

    case 'postage & shipping':
    case 'postal & shipping':
      return 'Postal & shipping';

    case 'public transportation':
      return 'Public transportation';

    case 'fast food':
    case 'restaurants':
      return 'Restaurants';

    case 'service & parts':
      return 'Service & parts';

    case 'shopping':
    case 'books':
    case 'sporting goods':
    case 'general merchandise':
    case 'shops':
      return 'Shops';

    case 'sports':
      return 'Sports';

    case 'student loan':
      return 'Student loan';

    case 'dues & subscriptions':
    case 'subscriptions':
      return 'Subscriptions';

    case 'federal tax':
    case 'local tax':
    case 'property tax':
    case 'sales tax':
    case 'tax location':
    case 'tax loss harvesting':
    case 'taxes':
      return 'Taxes';

    case 'rental car & taxi':
    case 'taxi & ride sharing':
      return 'Taxi & ride sharing';

    case 'cable/satellite':
    case 'television':
      return 'Television';

    case 'transfer':
    case 'transfers':
      return 'Transfers';

    case 'air travel':
    case 'travel':
      return 'Travel';

    case 'toys':
      return 'Toys';

    case 'bills & utilities':
    case 'utilities':
      return 'Utilities';

    case 'holidays':
    case 'vacation':
      return 'Vacation';

    case 'veterinary':
      return 'Veterinary';

    default:
      return 'Uncategorized';
  }
};

export default mapCategories;
