"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTimeLeft = calculateTimeLeft;
function calculateTimeLeft(endTime) {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0)
        return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    if (days > 0)
        return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
}
//# sourceMappingURL=time.js.map