export const getObservation = (solde: number): string => {
  if (solde < 1000) return 'insuffisant';
  if (solde <= 5000) return 'moyen';
  return 'élevé';
};

export const formatBalance = (balance: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance);
};