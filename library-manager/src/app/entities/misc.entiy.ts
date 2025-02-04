export enum SearchType{
    TITLE="title",
    AUTHOR="author"
}

export function detectYear(dateString: string): number | null {
    // Définir une regex pour capturer une année (2 à 4 chiffres)
    const yearRegex = /(\b\d{2,4}\b)/;

    // Rechercher l'année dans la chaîne de caractères
    const match = dateString.match(yearRegex);

    // Si une année est trouvée, la convertir en nombre et la retourner
    if (match && match[1]) {
        const year = parseInt(match[1], 10);

        // Optionnel : Valider que l'année est dans une plage raisonnable
        if (year >= 1000 && year <= 2100) {
            return year;
        } else if (year >= 0 && year <= 99) {
            // Gestion des années à 2 chiffres (par exemple, "23" pour 2023)
            return 2000 + year; // ou 1900 + year, selon le contexte
        }
    }

    // Si aucune année valide n'est trouvée, retourner null
    return null;
}