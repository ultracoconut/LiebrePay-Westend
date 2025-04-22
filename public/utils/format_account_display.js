export function formatAccountDisplay(account, nameLimit = 8) {
  try {
    
    //Validate account
    if (!account || !account.meta || !account.address){
      throw new Error('Error in account');
    }

   //Validate nameLimit is a positive number
   if (typeof nameLimit !== 'number' || nameLimit < 0 || !Number.isInteger(nameLimit)) {
    throw new Error('nameLimit must be a non-negative integer');
    }

    let name = account.meta.name || 'Unknown';
    const address = account.address;

    //Shorten the name if longer than the limit
    if (name.length > nameLimit) {
      name = name.substr(0, nameLimit) + '...';
    }

    return `${name} (${address.substr(0, 6)}...${address.substr(-6)})`;

  } catch (error) {
    console.error('Error formatting account display:', error);
    throw error;
  }
}
