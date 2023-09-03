
export const nap = (milliseconds: number = 0) => (
	new Promise(resolve => setTimeout(resolve, milliseconds))
)

