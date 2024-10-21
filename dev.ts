import { GraphQLClient } from "graphql-request"
import { getStarHistory, getStarsEarnedPerDay, getAllStargazers } from "."
import { getSdk } from "./src/generated/req"

const cumulativeStarCounts = await getAllStargazers(
	"kunkunsh",
	"kunkun",
	Bun.env.GITHUB_TOKEN!
)
console.log(cumulativeStarCounts)

// console.log(cumulativeStarCounts.length)

// const client = new GraphQLClient("https://api.github.com/graphql", {
// 	headers: {
// 		authorization: `Bearer ${Bun.env.GITHUB_TOKEN!}`,
// 		"User-Agent": "github-graphql package"
// 	}
// })
// const sdk = getSdk(client)
// const latestReleases = await sdk.LatestReleases({
// 	owner: "kunkunsh",
// 	name: "kunkun"
// })
// console.log(latestReleases.data.repository?.releases.)
