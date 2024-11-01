
export function escapeRegex(subject: string) {
	return subject.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

