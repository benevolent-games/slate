
export interface ActionRecord<P extends any[] = any[]> {
	id: number
	purpose: string[]
	params: P
	time: number
}

