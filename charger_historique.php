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

  $resultat = $connexion->query('SELECT * FROM resultats ORDER BY date_creation DESC LIMIT 3');
  
  if (!$resultat) {
    throw new Exception('Erreur de requête : ' . $connexion->error);
  }

  $historique = [];
  while ($row = $resultat->fetch_assoc()) {
    $historique[] = $row;
  }

  echo json_encode(['succes' => true, 'historique' => $historique]);

  $connexion->close();
} catch (Exception $e) {
  echo json_encode(['succes' => false, 'erreur' => $e->getMessage()]);
}
?>