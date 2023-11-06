
export type Setdown = () => void
export type SetupFn = () => Setdown

export type InitResult<R> = [R, Setdown]
export type InitFn<R> = () => InitResult<R>

