
export type Setdown = () => void
export type SetupFn = () => Setdown

export type InitResult<R> = [R, Setdown]
export type InitFn<R> = () => InitResult<R>

export type InitReturn<I extends InitFn<any>> = (
	I extends InitFn<infer R>
		? R
		: never
)

