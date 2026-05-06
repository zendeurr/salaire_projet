const TAUX = {
  cdi:        { nonCadre: { salarial: 0.216, patronal: 0.45 }, cadre: { salarial: 0.216, patronal: 0.47 } },
  cdd:        { nonCadre: { salarial: 0.216, patronal: 0.45 }, cadre: { salarial: 0.216, patronal: 0.47 } },
  alternance: { nonCadre: { salarial: 0.00,  patronal: 0.10 }, cadre: { salarial: 0.00,  patronal: 0.10 } },
  stage:      { nonCadre: { salarial: 0.00,  patronal: 0.00 }, cadre: { salarial: 0.00,  patronal: 0.00 } }
};
 
async function calculer() {
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
 
  await sauvegarderResultat({
    brut: brutSaisi,
    periode,
    contrat,
    statut,
    temps: tempsRatio,
    net: salNet,
    chargesSalariales,
    chargesPatronales,
    coutEmployeur
  });
}
 
function formaterEuros(valeur) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(valeur);
}
 
async function sauvegarderResultat(resultat) {
  try {
    const response = await fetch('sauvegarder.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resultat)
    });
 
    const data = await response.json();
    if (!data.succes) {
      console.error('Erreur de sauvegarde :', data.erreur || 'réponse non valide');
    }
  } catch (error) {
    console.error('Impossible de sauvegarder le résultat :', error);
  }
}
 
async function chargerHistorique() {
  const conteneur = document.getElementById('derniers-resultats');
 
  try {
    const response = await fetch('charger_historique.php');
    const data = await response.json();
 
    if (!data.succes) {
      conteneur.innerHTML = '<p class="erreur">Impossible de charger l\'historique.</p>';
      console.error('Erreur historique :', data.erreur);
      return;
    }
 
    afficherHistorique(data.historique || []);
  } catch (error) {
    conteneur.innerHTML = '<p class="erreur">Impossible de charger l\'historique.</p>';
    console.error('Erreur lors du chargement de l\'historique :', error);
  }
}
 
function afficherHistorique(historique) {
  const conteneur = document.getElementById('derniers-resultats');
 
  if (!historique.length) {
    conteneur.innerHTML = '<p>Aucun résultat enregistré.</p>';
    return;
  }
 
  conteneur.innerHTML = historique.map(item => {
    const periodeLabel = item.periode === 'annuel' ? 'Annuel' : 'Mensuel';
    const tempsLabel = item.temps === '1' || item.temps === 1 ? 'Temps plein' : 'Mi-temps (50%)';
    const statutLabel = item.statut === 'cadre' ? 'Cadre' : 'Non-cadre';
    const dateLabel = item.date_creation ? ` - ${item.date_creation}` : '';
 
    return `
      <div class="historique-item">
        <strong>${formaterEuros(parseFloat(item.net))}</strong> (${periodeLabel}, ${item.contrat.toUpperCase()}, ${statutLabel}, ${tempsLabel})${dateLabel}
        <div class="historique-detail">
          Net: ${formaterEuros(parseFloat(item.net))}, charges salariales: ${formaterEuros(parseFloat(item.charges_salariales || item.chargesSalariales || 0))}, charges patronales: ${formaterEuros(parseFloat(item.charges_patronales || item.chargesPatronales || 0))}
        </div>
      </div>`;
  }).join('');
}
 
window.addEventListener('DOMContentLoaded', () => {
  calculer();
  chargerHistorique();
});