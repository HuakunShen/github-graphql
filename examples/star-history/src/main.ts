import "./style.css"
import { getStarHistory } from "github-graphql"
import Plotly from "plotly.js-dist-min"

if (!import.meta.env.VITE_GITHUB_TOKEN) {
	alert("Please set VITE_GITHUB_TOKEN in .env file of this example")
}

const cumulativeStarCounts = await getStarHistory(
	"CrossCopy",
	"tauri-plugin-clipboard",
	import.meta.env.VITE_GITHUB_TOKEN
)

Plotly.newPlot(
	"star-history",
	[
		{
			x: cumulativeStarCounts.map((x) => x.date),
			y: cumulativeStarCounts.map((x) => x.count)
		}
	],
	{
		title: "Star History of CrossCopy/tauri-plugin-clipboard",
		xaxis: {
			title: "Date"
		},
		yaxis: {
			title: "Cumulative Stars"
		}
	}
).then((starHistoryPlot) => {
	document.body.appendChild(starHistoryPlot)
})
