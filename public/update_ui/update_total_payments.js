export function updateTotalPayments(transferCount) {
  const totalPayments = document.getElementById('total-payments-display');
  if (!totalPayments) return;

  if (transferCount !== undefined && transferCount !== null) {
    totalPayments.textContent = `Total Payments: ${transferCount}`;
  } else {
    totalPayments.textContent = 'Total Payments: Not available';
  }
}
