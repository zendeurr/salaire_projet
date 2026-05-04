const TAUX = {
  cdi:        { nonCadre: { salarial: 0.216, patronal: 0.45 }, cadre: { salarial: 0.216, patronal: 0.47 } },
  cdd:        { nonCadre: { salarial: 0.216, patronal: 0.45 }, cadre: { salarial: 0.216, patronal: 0.47 } },
  alternance: { nonCadre: { salarial: 0.00,  patronal: 0.10 }, cadre: { salarial: 0.00,  patronal: 0.10 } },
  stage:      { nonCadre: { salarial: 0.00,  patronal: 0.00 }, cadre: { salarial: 0.00,  patronal: 0.00 } }
};
 
function calculer() {
  const brutSaisi  = parseFloat(document.getElementById('brut').value);
  const periode    = document.querySelector('input[name="periode"]:checked').value;
  const contrat    = document.getElementById('contrat').value;
  const statut     = document.querySelector('input[name="statut"]:checked').value;
  const tempsRatio = parseFloat(document.querySelector('input[name="temps"]:checked').value);
 
  if (isNaN(brutSaisi) || brutSaisi <= 0) {
    alert('Veuillez entrer un salaire brut valide (nombre positif).');
    return;
  }
 
  let brutMensuel = (periode === 'annuel') ? brutSaisi / 12 : brutSaisi;
  brutMensuel = brutMensuel * tempsRatio;
 
  const cleStatut         = (statut === 'cadre') ? 'cadre' : 'nonCadre';
  const txSalarial        = TAUX[contrat][cleStatut].salarial;
  const txPatronal        = TAUX[contrat][cleStatut].patronal;
 
  const chargesSalariales = brutMensuel * txSalarial;
  const chargesPatronales = brutMensuel * txPatronal;
  const salNet            = brutMensuel - chargesSalariales;
  const coutEmployeur     = brutMensuel + chargesPatronales;
 
  document.getElementById('net').textContent         = formaterEuros(salNet);
  document.getElementById('charges-sal').textContent = formaterEuros(chargesSalariales);
  document.getElementById('charges-pat').textContent = formaterEuros(chargesPatronales);
  document.getElementById('cout').textContent        = formaterEuros(coutEmployeur);
}
 
function formaterEuros(valeur) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(valeur);
}
 
calculer();