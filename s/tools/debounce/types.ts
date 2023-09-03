
export type AnyFunction = (...args: any[]) => any

export type DebounceReturn<xAction extends AnyFunction> =
	(...args: Parameters<xAction>) =>
		ReturnType<xAction> extends Promise<any>
			? ReturnType<xAction>
			: Promise<ReturnType<xAction>>
