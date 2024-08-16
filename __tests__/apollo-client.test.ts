import { expect, test } from "bun:test"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { DefaultGitHubContributionDocument, RateLimitDocument, RepositoryDocument } from "../index"

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: "https://api.github.com/graphql",
		headers: {
			authorization: `Bearer ${Bun.env.GITHUB_TOKEN}`,
			"User-Agent": "github-graphql package"
		}
	})
})

test("Get Rate Limit Info", async () => {
	const result = await client.query({
		query: RateLimitDocument
	})
	const rateLimit = result.data.rateLimit
	expect(rateLimit).toBeDefined()
})

test("Get Repo Info", async () => {
	const result = await client.query({
		query: RepositoryDocument,
		variables: {
			owner: "tauri-apps",
			name: "tauri"
		}
	})
	const stargazerCount = result.data.repository?.stargazerCount
	expect(stargazerCount).toBeGreaterThan(100)
})

test("Get repo info", async () => {
	const result = await client.query({
		query: DefaultGitHubContributionDocument,
		variables: {
			username: "HuakunShen"
		}
	})
	const weeks = result.data.user?.contributionsCollection.contributionCalendar.weeks
	expect(weeks).toBeDefined()
	expect(weeks!.length).toBe(53)
})
