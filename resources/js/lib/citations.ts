/**
 * Procesa el texto del manual para convertir citas en superíndices
 * Formato: [cite_start]texto[cite: 155, 161]
 * Resultado: texto¹⁵⁵'¹⁶¹
 */
export function processManualCitations(content: string): string {
    if (!content) return '';

    // Eliminar [cite_start] ya que solo marca el inicio
    let processed = content.replace(/\[cite_start\]/g, '');

    // Convertir [cite: número(s)] en superíndices
    processed = processed.replace(/\[cite:\s*([^\]]+)\]/g, (match, citations) => {
        // Separar números por comas
        const numbers = citations.split(',').map((n: string) => n.trim());
        
        // Convertir cada número a superíndice
        const superscripts = numbers.map((num: string) => {
            return `<sup class="cite-number">${num}</sup>`;
        }).join(',');
        
        return superscripts;
    });

    return processed;
}

/**
 * Extrae todas las citas del contenido para mostrar referencias
 */
export function extractCitations(content: string): string[] {
    const citations: string[] = [];
    const regex = /\[cite:\s*([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const numbers = match[1].split(',').map(n => n.trim());
        citations.push(...numbers);
    }

    // Eliminar duplicados y ordenar
    return [...new Set(citations)].sort((a, b) => parseInt(a) - parseInt(b));
}

