
export const nap = (milliseconds: number = 0) => (
	new Promise<void>(resolve => setTimeout(resolve, milliseconds))
)

