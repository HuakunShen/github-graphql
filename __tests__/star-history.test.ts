import { expect, test, describe } from "bun:test"
import { getStarHistory, getStarsEarnedPerDay } from "../src/star-history"

describe("Star History", () => {
	test("Star Earned Per Day", async () => {
		const starsEarned = await getStarsEarnedPerDay(
			"CrossCopy",
			"tauri-plugin-clipboard",
			Bun.env.GITHUB_TOKEN!,
			new Date("2024-08-01")
		)
		expect(starsEarned[0].count).toBe(2)
		expect(starsEarned[1].count).toBe(1)
		expect(starsEarned[2].count).toBe(1)
	})

	test("Cummulative Star History", async () => {
		const cumulativeStarCounts = await getStarHistory(
			"CrossCopy",
			"tauri-plugin-clipboard",
			Bun.env.GITHUB_TOKEN!,
			{
				since: new Date("2024-08-01"),
				baseStars: 1000
			}
		)
		expect(cumulativeStarCounts[0].count).toBe(1002)
		expect(cumulativeStarCounts[1].count).toBe(1003)
		expect(cumulativeStarCounts[2].count).toBe(1004)
	})
})
