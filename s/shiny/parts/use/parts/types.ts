
export type Setdown = () => void
export type Setup = () => Setdown

export type InitResult<R> = [R, Setdown]
export type InitFunction<R> = () => InitResult<R>

