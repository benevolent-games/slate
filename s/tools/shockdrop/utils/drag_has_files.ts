
export function drag_has_files(event: DragEvent) {
	return !!(
		event.dataTransfer &&
		event.dataTransfer.types.includes("Files")
	)
}

