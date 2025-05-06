# 📊 Dashboard Collaboratif - Visualisation & Analyse de Données

Ce projet est une application web interactive permettant d'importer, visualiser, analyser et exporter des jeux de données via une interface claire et réactive.

## 🔧 Composants Frontend

Tous les composants sont écrits en **React.js** avec intégration de bibliothèques open-source pour le traitement et l'affichage des données.

---

### 🗂️ `DataImporter.jsx`

> 📌 **Importation de fichiers CSV/XLSX** avec aperçu dynamique.

- Lecture de fichiers avec `xlsx`
- Nettoyage simple : suppression des lignes vides
- Aperçu interactif via `react-table`
- Envoi des données au backend via `axios`

---

### 📈 `DataVisualizer.jsx`

> 📌 **Visualisation graphique des données filtrées**

- Affiche des **barres**, **courbes**, **camemberts** avec `recharts`
- Filtres temporels (`date`) et catégoriels (`type`, `groupe`, etc.)
- Tableau interactif synchronisé avec les filtres
- Visualisation réactive et responsive

---

### 🧠 `DataAnalysis.jsx`

> 📌 **Analyse statistique et détection d'anomalies**

- Calcul de :
  - Moyenne
  - Médiane
  - Écart-type
- Analyse de **corrélation entre variables**
- Détection d’anomalies via `IsolationForest` (côté backend)
- Résultats affichés sous forme lisible (JSON formatté)

---

### 📄 `ReportExport.jsx`

> 📌 **Export des données et génération de rapports**

- Téléchargement :
  - Rapport PDF (`/api/report/pdf/`)
  - Fichier CSV (`/api/export/csv/`)
  - Fichier Excel (`/api/export/xlsx/`)
- Génération possible via `html2canvas` (export de graphiques en PNG)
- Communication avec l’API par `axios`

---

## 📁 Arborescence recommandée
