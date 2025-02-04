
export type Dictionary = Record<string, string[]>
export type Pattern<D extends Dictionary> = (keyof D)[][]

export type PhraseFn = (bytes: Uint8Array) => string
export type PhraseFns = Record<string, PhraseFn>
export type Phrases<P extends PhraseFns> = Record<keyof P, string>
export type GrammarTemplate<P extends PhraseFns> = (phrases: Phrases<P>) => string

