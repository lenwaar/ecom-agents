# Ce qui interrompt la boucle

Les agents travaillent seuls tant que rien ne sort de la boutique. Ces cas remontent **toujours** à l'humain, dans la table `validations` de `donnees/entreprise.db` et dans la section « En attente de vous » de la page du lundi.

| Situation | Fiche qui la détecte | Ce que vous faites |
|---|---|---|
| Un client demande à parler à une personne | C19 | Vous reprenez la conversation. |
| Un acheteur demande une remise | V13 | Vous décidez ; la remise ne passe jamais sous 10 € de marge. |
| Un accord ne répond plus depuis 7 jours | P03 | Vous choisissez : relancer ou abandonner. |
| Une clause de contrat est inhabituelle | P17 | Vous décidez de signer ou non. |
| Une commande risque de dépasser 14 jours | O03 | Vous choisissez : prévenir, rembourser ou attendre. |
| Un avis négatif est publié | C10 | Vous publiez la réponse. |
| Une facture professionnelle a plus de 30 jours | A03 | Vous envoyez la relance. |
| Un paiement, une commande fournisseur ou une publication est prêt | tous | Rien ne part sans votre accord. |

## Validation humaine (« You approve »)

- **Vous** : toute publication, tout envoi, tout paiement, tout remboursement, toute commande fournisseur.
- **Votre équipe** : aucune pour l'instant ; la fiche A04 prépare une annonce le jour où il en faut une.
- **Les clients** : ils ne parlent jamais à un agent sans que vous ayez validé le modèle de réponse.

Canal à 0 € : la file `validations` + la page du lundi. Une alerte Telegram (bot gratuit) pourra être ajoutée plus tard, sur votre accord.
