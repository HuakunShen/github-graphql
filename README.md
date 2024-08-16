# github-graphql

![JSR Version](https://img.shields.io/jsr/v/hk/github-graphql)

This project is a codegen wrapper around GitHub's GraphQL API, with some queries I needed for my own projects.

As rest API doesn't provide types, I prefer to use GraphQL for type safety and intellisense.
I found myself duplicating this codegen setup in multiple projects, so I decided to extract it into a standalone package.

If you managed to find this project and think it's useful, feel free to use it in your own projects.
If you want to add some common queries you find yourself using, feel free to open a PR. Add the query files to `./src/operations` folder.

If the queries you need is very specific to your project, you can fork this project and modify it to your needs.

## Installation

Since the main purpose of this project is to get the benefits of types, I recommend using it with TypeScript and the package doesn't provide bundled JS files.

## Usage

Sample code is the best way to learn. Look at tests in [`__tests__`](./__tests__/) folder for examples. It's quite simple.

Note that to use GitHub's GraphQL API, you need to provide a token.

## Flavors

There are two flavors of this API. `graphql-request` and `@apollo/client`.

You can find sample code for both in the tests.

<details>
<summary>Click to see sample code</summary>

### `graphql-request`

Exported under `/req` subpackage.

```ts
import { GraphQLClient } from "graphql-request"
import { getSdk } from "@hk/github-graphql/req"

const client = new GraphQLClient("https://api.github.com/graphql", {
	headers: {
		authorization: `Bearer ${Bun.env.GITHUB_TOKEN}`,
		"User-Agent": "github-graphql package"
	}
})
const sdk = getSdk(client)

const data = await sdk.Repository({
	owner: "tauri-apps",
	name: "tauri"
})

expect(data.data.repository?.stargazerCount).toBeGreaterThan(100)
```

### `@apollo/client`

```ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { DefaultGitHubContributionDocument } from "@hk/github-graphql"

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

const result = await client.query({
	query: RepositoryDocument,
	variables: {
		owner: "tauri-apps",
		name: "tauri"
	}
})
const stargazerCount = result.data.repository?.stargazerCount
```

</details>

## Development

To build this project

Add GitHub Token to `.env` file

```
GITHUB_TOKEN=github_pat_xxx
```

```bash
bun install
bun run build
bun run test
```
