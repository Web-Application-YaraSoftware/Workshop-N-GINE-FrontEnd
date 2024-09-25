export const formatDate = (date, formatOptions = {}) => {
    if (!date) return '';
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        ...formatOptions,
    };
    return new Date(date).toLocaleDateString('es-ES', options);
};