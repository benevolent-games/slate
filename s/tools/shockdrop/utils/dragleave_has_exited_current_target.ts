
export function dragleave_has_exited_current_target(event: DragEvent) {
	const mouse_is_outside_viewport = !event.relatedTarget || (
		event.clientX === 0 &&
		event.clientY === 0
	)

	if (mouse_is_outside_viewport)
		return true

	const rect = (event.currentTarget as any).getBoundingClientRect()
	const withinX = event.clientX >= rect.left && event.clientX <= rect.right
	const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom
	const mouse_is_outside_current_target = !(withinX && withinY)

	return mouse_is_outside_current_target
}

