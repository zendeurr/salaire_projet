const TAUX = {
  cdi:        { salarial: 0.22, patronal: 0.42 },
  cdd:        { salarial: 0.22, patronal: 0.42 },
  alternance: { salarial: 0.12, patronal: 0.20 }, // charges réduites
  stage:      { salarial: 0.00, patronal: 0.00 }  // pas de charges
};

let monChart = null;

function calculer() {

  //Lire les valeurs du formulaire
  const brutSaisi  = parseFloat(document.getElementById('brut').value);
  const periode    = document.querySelector('input[name="periode"]:checked').value;
  const contrat    = document.getElementById('contrat').value;
  const statut     = document.querySelector('input[name="statut"]:checked').value;
  const tempsRatio = parseFloat(document.querySelector('input[name="temps"]:checked').value);

  //Validation : on vérifie que le salaire est un nombre positif
  if (isNaN(brutSaisi) || brutSaisi <= 0) {
    alert('Veuillez entrer un salaire brut valide (nombre positif).');
    return; // on arrête la fonction ici
  }

  //Convertir en mensuel si l'utilisateur a saisi un salaire annuel
  let brutMensuel = brutSaisi;
  if (periode === 'annuel') {
    brutMensuel = brutSaisi / 12;
  }

  //Appliquer le ratio de temps partiel
  //    Temps plein = 1  →  brutMensuel × 1 = inchangé
  //    Mi-temps    = 0.5 → brutMensuel × 0.5 = divisé par 2
  brutMensuel = brutMensuel * tempsRatio;

  //Récupérer les taux du contrat choisi
  let txSalarial = TAUX[contrat].salarial;
  let txPatronal = TAUX[contrat].patronal;

  //Bonus cadre : +2% de cotisation retraite supplémentaire
  if (statut === 'cadre') {
    txSalarial += 0.02;
    txPatronal += 0.02;
  }

  //Calculs principaux
  const chargesSalariales = brutMensuel * txSalarial;   // part salarié
  const chargesPatronales = brutMensuel * txPatronal;   // part employeur
  const salNet            = brutMensuel - chargesSalariales; // ce que le salarié perçoit
  const coutEmployeur     = brutMensuel + chargesPatronales; // ce que l'entreprise paie
}

function formaterEuros(valeur) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0  // pas de centimes
  }).format(valeur);
}

// Calcul automatique au chargement de la page
calculer();