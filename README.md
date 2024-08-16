# github-graphql

![JSR Version](https://img.shields.io/jsr/v/hk/github-graphql)
![NPM Version](https://img.shields.io/npm/v/github-graphql)
[![CI Build & Test](https://github.com/HuakunShen/github-graphql/actions/workflows/ci.yml/badge.svg)](https://github.com/HuakunShen/github-graphql/actions/workflows/ci.yml)
[![Generate and Deploy Docs](https://github.com/HuakunShen/github-graphql/actions/workflows/docs.yml/badge.svg)](https://github.com/HuakunShen/github-graphql/actions/workflows/docs.yml)

## Documentation:

- https://huakunshen.github.io/github-graphql/
- https://jsr.io/@hk/github-graphql/doc

This project is a codegen wrapper around GitHub's GraphQL API, with some queries I needed for my own projects.

As rest API doesn't provide types, I prefer to use GraphQL for type safety and intellisense.
I found myself duplicating this codegen setup in multiple projects, so I decided to extract it into a standalone package.

If you managed to find this project and think it's useful, feel free to use it in your own projects.
If you want to add some common queries you find yourself using, feel free to open a PR. Add the query files to `./src/operations` folder.

If the queries you need is very specific to your project, you can fork this project and modify it to your needs.

## Installation

Since the main purpose of this project is to get the benefits of types, I recommend using it with TypeScript and the package doesn't provide bundled JS files.

This package is published to both npm and jsr. The package name is slightly different on jsr as it requires a scoped package name.

```bash
# npm
npm install github-graphql
pnpm install github-graphql


# check https://jsr.io/@hk/github-graphql for more info
# JSR
pnpm dlx jsr add @hk/github-graphql
npx jsr add @hk/github-graphql
```

## Usage

Sample code is the best way to learn. Look at tests in [`__tests__`](./__tests__/) folder for examples. It's quite simple.

Note that to use GitHub's GraphQL API, you need to provide a token.

If you install from jsr, make sure `@hk/github-graphql` is used as the package name.

A star history example is provided at [`./examples/star-history`](./examples/star-history/README.md).

```ts
// If you install from npm
import { getSdk } from "github-graphql/req"

// If you install from jsr
import { getSdk } from "@hk/github-graphql/req"
```

See [operations](./src/operations/) folder for available queries.

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

This project is built with [Bun](https://bun.sh).
No Node or npm or pnpm is required to develop/build this project.

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

This is a pure TypeScript project, no JS code will be generated.
