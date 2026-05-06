<?php
header('Content-Type: application/json');

$serveur = 'localhost';
$utilisateur = 'root';
$motdepasse = '';
$base = 'salaire_calc';

try {
  $connexion = new mysqli($serveur, $utilisateur, $motdepasse, $base);
  
  if ($connexion->connect_error) {
    throw new Exception('Erreur de connexion : ' . $connexion->connect_error);
  }

  $donnees = json_decode(file_get_contents('php://input'), true);

  $stmt = $connexion->prepare('INSERT INTO resultats (brut, periode, contrat, statut, temps, net, charges_salariales, charges_patronales, cout_employeur) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  $stmt->bind_param(
    'dsssddddd',
    $donnees['brut'],
    $donnees['periode'],
    $donnees['contrat'],
    $donnees['statut'],
    $donnees['temps'],
    $donnees['net'],
    $donnees['chargesSalariales'],
    $donnees['chargesPatronales'],
    $donnees['coutEmployeur']
  );

  if ($stmt->execute()) {
    echo json_encode(['succes' => true, 'message' => 'Résultat sauvegardé']);
  } else {
    throw new Exception('Erreur lors de l\'insertion');
  }

  $stmt->close();
  $connexion->close();
} catch (Exception $e) {
  echo json_encode(['succes' => false, 'erreur' => $e->getMessage()]);
}
?>