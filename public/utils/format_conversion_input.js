const { BN } = polkadotUtil;

export function formatConversionIn(amount, decPrec) {
  
  const amountStr = amount.toString(); //Convert to string for safety

  if (!amountStr.includes(".")) {
    return new BN(amountStr).mul(new BN(10).pow(new BN(decPrec)));
  }

  const [whole, fraction = ""] = amountStr.split(".");
  const fractionLength = fraction.length;

  if (fractionLength > decPrec) {
    throw new Error(`Too many decimals`);
  }

  //Convert the amount to an integer by removing the decimal point
  const normalizedAmount = whole + fraction.padEnd(decPrec, "0");

  return new BN(normalizedAmount);
};
