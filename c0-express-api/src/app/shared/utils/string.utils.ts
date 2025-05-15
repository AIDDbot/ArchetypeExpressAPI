/**
 * Gets a time string from a date.
 * @param date - The date to get the time string from.
 * @returns The time string.
 */
export function getTimeString(date: Date = new Date()): string {
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

/**
 * Gets a date string from a date.
 * @param date - The date to get the date string from.
 * @returns The date string.
 */
export function getDateString(date: Date = new Date()): string {
	return date.toLocaleDateString([], {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

/**
 * Converts a string to milliseconds.
 * @example
 * stringToMs("1d") // 86400000
 * stringToMs("1h") // 3600000
 * stringToMs("1m") // 60000
 * stringToMs("1s") // 1000
 * stringToMs("1000") // 1000
 * stringToMs("not a number") // 0
 * @param source - The string to convert to milliseconds.
 * @returns The milliseconds.
 */
export function stringToMs(source: string | number): number {
	if (typeof source === "number") return source;
	// 1d, 1h, 1m, 1s
	const value = Number.parseInt(source[0]);
	if (Number.isNaN(value)) {
		return Number(0);
	}
	const unit = source[1]?.toLowerCase() ?? "s";
	switch (unit) {
		case "d":
			return value * 1000 * 60 * 60 * 24;
		case "h":
			return value * 1000 * 60 * 60;
		case "m":
			return value * 1000 * 60;
		case "s":
			return value * 1000;
		default:
			return value;
	}
}
