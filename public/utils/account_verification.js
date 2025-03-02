const { decodeAddress, encodeAddress } = polkadotKeyring;
const { hexToU8a, isHex } = polkadotUtil;

//Function to validate account
export function validateAccount(account) {
    try {
     encodeAddress(
        isHex(account)
          ? hexToU8a(account)
          : decodeAddress(account)
      );
      return true;  //If no error, valid address
    } catch (error) {
      return false;
    }
  }