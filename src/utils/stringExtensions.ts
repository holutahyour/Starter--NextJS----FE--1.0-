export function capitalizeText(text: string) {
    return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function text_to_icon(text: string) {
    return text.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}