const { BN } = polkadotUtil;

export function formatConversionOut(amountBN, decPrec) {
  const divisor = new BN(10).pow(new BN(decPrec));
  const wholePart = amountBN.div(divisor).toString(); //Integer part
  const fractionalPart = amountBN.mod(divisor).toString().padStart(decPrec, '0'); //Decimal part with zeros

  return `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ''); //Remove unnecessary zeros
};

