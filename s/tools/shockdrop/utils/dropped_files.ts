
export function dropped_files(event: DragEvent) {
	return event.dataTransfer
		? Array.from(event.dataTransfer.files)
		: []
}

