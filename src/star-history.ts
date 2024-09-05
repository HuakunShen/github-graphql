/**
 * Get the star history of a GitHub repository.
 */
import { GraphQLClient } from "graphql-request"
import { getSdk } from "./generated/req"

/**
 * Get number of stars earned per day for a GitHub repository, since a given date.
 * If `since` is null, it retrieves the entire star history.
 * @param owner
 * @param name
 * @param githubToken
 * @param since
 * @returns
 */
export async function getStarsEarnedPerDay(
	owner: string,
	name: string,
	githubToken: string,
	since: Date | null = null
): Promise<{ date: Date; count: number }[]> {
	const client = new GraphQLClient("https://api.github.com/graphql", {
		headers: {
			authorization: `Bearer ${githubToken}`,
			"User-Agent": "github-graphql package"
		}
	})
	const sdk = getSdk(client)
	
	let hasPreviousPage = true
	let startCursor: string | null = null
	let allDates: Date[] = []
	while (hasPreviousPage) {
		const rawData = await sdk.StarHistory({
			owner,
			name,
			last: 100,
			before: startCursor
		})
		const pageInfo = rawData.data.repository?.stargazers.pageInfo
		startCursor = pageInfo?.startCursor ?? null
		hasPreviousPage = pageInfo?.hasPreviousPage ?? false
		const dates: Date[] =
			rawData.data.repository?.stargazers.edges
				?.map((edge) => edge?.starredAt)
				.filter((x) => x)
				.map((d) => new Date(d)) ?? []
		allDates.push(...dates)
		if (since) {
			if (dates.length === 0 || dates[dates.length - 1] < since) {
				allDates = allDates.filter((date) => date >= since)
				break
			}
		}
	}
	allDates.sort((a, b) => a.getTime() - b.getTime())
	const starCounts = allDates.reduce(
		(acc, date) => {
			const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
			const last = acc[acc.length - 1]
			if (last && +last.date === +day) {
				last.count++
			} else {
				acc.push({ date: day, count: 1 })
			}
			return acc
		},
		[] as { date: Date; count: number }[]
	)
	return starCounts
}

/**
 * This function retrieves the cumulative star count of a GitHub repository since a given date.
 * If `since` is null, it retrieves the entire star history.
 * If you want the star count per day, use `getStarsEarnedPerDay()` instead.
 *
 * This function work better with a cache if you need to get the star history of a popular with thousands of stars. (You need to implement the cache yourself)
 * If you have cache of star history since 2024-08-16, then you only need to retrieve star history since that date.
 *
 * GitHub doesn't provide an API to retrieve the entire star history of a repository.
 * It only provides the dates of each star event.
 * This function retrieves all star events and computes the cumulative count of stars for each day.
 * Each GitHub GraphQL API request returns at most 100 star records.
 * For a repo with more than 100 stars, this function sends multiple requests to get all star history.
 * For a repo with lots of stars (e.g. 200k) this function may send 2000+ requests.
 * GitHub API rate limit is 5000 requests per hour even if a token is provided.
 *
 * ## Important Note
 *
 * It is crucial to note that the cumulative star count starts from the date provided.
 * Suppose the repo has 100 stars on 2024-01-01 and 105 stars on 2024-01-02.
 * You may expect the first entry returned to be 100 stars on 2024-01-01, but it will actually be 0 stars on 2024-01-01, and 5 stars on 2024-01-02.
 * This is because without scraping the entire star history, we cannot know the star count on 2024-01-01.
 * So you either need to
 * - write you own code to add the offset to the star counts
 * - pass in the cached base stars (stars on the date provided) as the `baseStars` parameter, so that the function can add the offset for you.
 *
 * @example
 * ```ts
 * const starHistory = await getStarHistorySince(
 * 	new Date("2024-01-01"),
 * 	"CrossCopy",
 * 	"tauri-plugin-clipboard",
 * 	process.env.GITHUB_TOKEN! as string
 * )
 * ```
 * @param since set this to null to get the entire star history
 * @param owner repo owner name
 * @param name repo name
 * @param githubToken Access Token
 * @param options
 * @returns
 */
export async function getStarHistory(
	owner: string,
	name: string,
	githubToken: string,
	options?: {
		since: Date | null
		baseStars: number
	}
): Promise<{ date: Date; count: number }[]> {
	options ??= {
		since: null,
		baseStars: 0
	}

	const starCounts = await getStarsEarnedPerDay(owner, name, githubToken, options.since)

	let cumulativeStarCounts = starCounts.reduce(
		(acc, { date, count }) => {
			const last = acc[acc.length - 1]
			const lastCount = last?.count ?? 0
			acc.push({ date, count: lastCount + count })
			return acc
		},
		[] as { date: Date; count: number }[]
	)
	if (options.baseStars > 0) {
		cumulativeStarCounts = cumulativeStarCounts.map(({ date, count }) => ({
			date,
			count: count + options.baseStars
		}))
	}
	return cumulativeStarCounts
}
