/**
 * Auracord Security Suite
 * High-performance sanitization and protection utilities.
 */

export const sanitize = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\//g, '&#x2F;')
        .replace(/javascript:/gi, 'blocked:')
        .replace(/on\w+=/gi, 'blocked=');
};

export const validateUsername = (name) => {
    // Alphanumeric, spaces, underscores, dots, 2-20 chars
    const regex = /^[a-zA-Z0-9 _\.]{2,20}$/;
    return regex.test(name);
};

export const detectInjection = (str) => {
    const maliciousPatterns = [
        /<script/i,
        /document\./i,
        /window\./i,
        /eval\(/i,
        /innerHTML/i,
        /fetch\(/i,
        /XMLHttpRequest/i
    ];
    return maliciousPatterns.some(pattern => pattern.test(str));
};
