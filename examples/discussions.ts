import { DiscussionCategoriesQuery, getSdk } from "github-graphql/req"
import { GraphQLClient } from "graphql-request"

const sdk = getSdk(new GraphQLClient("https://api.github.com/graphql", {
	headers: {
		authorization: `Bearer ${Bun.env.GITHUB_TOKEN!}`
	}
}))

const { data } = await sdk.DiscussionCategories({
	owner: "kunkunsh",
	repo: "kunkun"
})

console.log(JSON.stringify(data, null, 2))

function findCategoryBySlug(data: DiscussionCategoriesQuery, slug: string) {
	return data.repository?.discussionCategories.nodes?.find(
		(node) => node?.slug === slug
	)
}

const category = findCategoryBySlug(data, "extension-requests")

console.log(category)
if (!category ) {
	throw new Error("Category not found")
}
const { data: discussions } = await sdk.GetDiscussionsByCategory({
	owner: "kunkunsh",
	repo: "kunkun",
	categoryId: category?.id
})

console.log(JSON.stringify(discussions, null, 2))