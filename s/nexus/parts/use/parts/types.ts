
export type Unmount = () => void
export type Mount = () => Unmount

export type InitResult<R> = [R, Unmount]
export type Init<R> = () => InitResult<R>

export type InitReturn<I extends Init<any>> = (
	I extends Init<infer R>
		? R
		: never
)

