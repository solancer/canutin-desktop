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
      return 'Bars';

    case 'business & services':
    case 'advertising':
    case 'printing':
    case 'shipping':
    case 'services':
    case 'business miscellaneous':
    case 'office maintenance':
    case 'online services':
    case 'other bills':
    case 'other expenses':
      return 'Business & services';

    case 'book & suppies':
      return 'Books & supplies';

    case 'charity':
    case 'charitable giving':
      return 'Charity';

    case 'babysitter & daycare':
      return 'Childcare';

    case 'clothing':
    case 'clothing/shoes':
      return 'Clothing';

    case 'coffee shops':
      return 'Coffee shops';

    case 'education':
    case 'tuition':
      return 'Education';

    case 'electronics':
    case 'electronics & software':
      return 'Electronics';

    case 'entertainment':
    case 'arts':
    case 'movies & dvds':
    case 'newspapers & magazines':
      return 'Entertainment & recreation';

    case 'health & fitness':
    case 'gym':
      return 'Fitness';

    case 'fees & charges':
    case 'atm fee':
    case 'bank fee':
    case 'finance charge':
    case 'late fee':
    case 'service fee':
    case 'trade comissions':
    case 'service charges/fees':
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
      return 'Financial services';

    case 'food & dining':
      return 'Food & drink';

    case 'furnishings':
      return 'Furnishings';

    case 'gas & fuel':
    case 'gasoline/fuel':
      return 'Gas stations';

    case 'gift':
    case 'gifts':
    case 'gifts & donations':
      return 'Gifts';

    case 'groceries':
      return 'Groceries';

    case 'dentist':
    case 'doctor':
    case 'dyecare':
    case 'health insurance':
    case 'healthcare/medical':
      return 'Health';

    case 'hobbies':
      return 'Hobbies';

    case 'home improvement':
    case 'home maintenance':
    case 'Lawn & Garden':
      return 'Home maintenance';

    case 'home':
    case 'home services':
    case 'home supplies':
    case 'mortgage & rent':
    case 'mortgage':
    case 'mortgages':
    case 'rent':
      return 'Housing';

    case 'income':
    case 'rental income':
    case 'investment income':
    case 'deposits':
    case 'dividens received':
    case 'dividens received (tax-advantaged)':
    case 'other income':
    case 'retirement income':
    case 'sales':
      return 'Income';

    case 'insurance':
    case 'auto insurance':
    case 'life insurance':
    case 'home insurance':
      return 'Insurance';

    case 'interest':
    case 'interest income':
      return 'Interest';

    case 'home phone':
    case 'mobile phone':
    case 'internet':
    case 'telephone':
      return 'Internet & phone';

    case 'kids':
    case 'child support':
    case 'kids activities':
    case 'child/dependent':
      return 'Kids';

    case 'baby supplies':
      return 'Kids supplies';

    case 'legal':
      return 'Legal';

    case 'hotel':
      return 'Lodging';

    case 'music':
      return 'Music';

    case 'office supplies':
      return 'Office suppies';

    case 'amusement':
      return 'Outdoors & parks';

    case 'parking':
      return 'Parking';

    case 'credit card payment':
    case 'credit card payments':
      return 'Payments';

    case 'bonus':
    case 'paycheck':
    case 'paychecks/salary':
    case 'wages paid':
      return 'Payroll & benefits';

    case 'personal care':
    case 'hair':
    case 'laundry':
    case 'spa & massage':
      return 'Personal care';

    case 'pets':
    case 'pets/pet care':
    case 'pet food & supplies':
      return 'Pets';

    case 'pet grooming':
      return 'Pet services';

    case 'pharmacy':
      return 'Pharmacies';

    case 'postage & shipping':
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
      return 'Shops';

    case 'sports':
      return 'Sports';

    case 'student loan':
      return 'Student loan';

    case 'dues & subscriptions':
      return 'Subscriptions';

    case 'taxes':
    case 'federal tax':
    case 'local tax':
    case 'property tax':
    case 'sales tax':
    case 'tax location':
    case 'tax loss harvesting':
      return 'Taxes';

    case 'rental car & taxi':
      return 'Taxi & ride sharing';

    case 'television':
    case 'cable/satellite':
      return 'Television';

    case 'transfer':
    case 'transfers':
      return 'Transfers';

    case 'travel':
    case 'air travel':
      return 'Travel';

    case 'toys':
      return 'Toys';

    case 'utilities':
    case 'bills & utilities':
      return 'Utilities';

    case 'vacation':
    case 'holidays':
      return 'Vacation';

    case 'veterinary':
      return 'Veterinary';

    default:
      return 'Uncategorized';
  }
};

export default mapCategories;
