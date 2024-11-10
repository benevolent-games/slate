
declare const Deno: any

export function isDeno() {
	return typeof Deno !== "undefined" && typeof Deno.version !== "undefined"
}

export function isNode() {
	return (
		typeof process !== "undefined" &&
		process.versions &&
		process.versions.node
	)
}

export function isColorSupported() {
	if (isNode())
		return (process.env.FORCE_COLOR) || (
			process.stdout.isTTY &&
			process.env.TERM !== "dumb"
		)

	else if (isDeno())
		return (Deno.env.get("FORCE_COLOR")) || (
			Deno.isatty(Deno.stdout.rid) &&
			Deno.env.get("TERM") !== "dumb"
		)

	else
		return false
}

