import { getStarHistory, getStarsEarnedPerDay } from "."

const cumulativeStarCounts = await getStarHistory(
	"CrossCopy",
	"tauri-plugin-clipboard",
	Bun.env.GITHUB_TOKEN!,
	{
		since: new Date("2024-08-01"),
		baseStars: 100
	}
)

console.log(cumulativeStarCounts)

const x = await getStarsEarnedPerDay(
	"CrossCopy",
	"tauri-plugin-clipboard",
	Bun.env.GITHUB_TOKEN!,
	new Date("2024-08-01")
)
console.log(x)
