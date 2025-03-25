const { BN } = polkadotUtil;

export function formatConversionIn(amount, decPrec) {
  
  if (typeof amount !== "string") {
  amount = amount.toString(); //Convert to string for safety
  }

  amount = amount.trim().replace(",", "."); //Normalize decimal separator to a dot
  
  if (!amount.includes(".")) {
    return new BN(amount).mul(new BN(10).pow(new BN(decPrec)));
  }

  const [whole, fraction = ""] = amount.split(".");
  const fractionLength = fraction.length;

  if (fractionLength > decPrec) {
    throw new Error(`Too many decimals`);
  }

  //Convert the amount to an integer by removing the decimal point
  const normalizedAmount = whole + fraction.padEnd(decPrec, "0");

  return new BN(normalizedAmount);
};
