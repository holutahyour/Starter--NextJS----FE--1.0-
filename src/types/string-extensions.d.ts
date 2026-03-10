declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = function (this: string): string {
    return this.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};