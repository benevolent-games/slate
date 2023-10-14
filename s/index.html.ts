
import {easypage, html, startup_scripts_with_dev_mode, template} from "@benev/turtle"

export default template(async basics => {
	const path = basics.path(import.meta.url)
	return easypage({
		path: basics.path(import.meta.url),
		title: "@benev/frog",
		head: html`
			<link rel="stylesheet" href="${path.version.root('index.css')}"/>
			<link rel="icon" href="${path.root('assets/s.webp')}"/>
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<div class=zone>
				<img class=logo alt="" src="${path.root('assets/s.webp')}"/>
				<div class=plate>
					<h1><span>@benev/</span><span>slate</span></h1>
					<p><a href="https://github.com/benevolent-games/slate">github.com/benevolent-games/slate</a></p>
				</div>
				<div class=plate>
					<slate-gold></slate-gold>
					<br/>
					<slate-carbon></slate-carbon>
					<slate-oxygen></slate-oxygen>
					<br/>
					<slate-silver></slate-silver>
				</div>
			</div>
		`,
	})
})

