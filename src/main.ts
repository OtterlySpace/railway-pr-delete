import core from "@actions/core"
import { gql, GraphQLClient } from "graphql-request"
import { Environment, GraphQLEdges } from "~/railway.interface"

// Railway Required Inputs
const RAILWAY_API_TOKEN = core.getInput("RAILWAY_API_TOKEN")
const PROJECT_ID = core.getInput("PROJECT_ID")
const DEST_ENV_NAME = core.getInput("DEST_ENV_NAME")
const ENDPOINT = "https://backboard.railway.app/graphql/v2"

// #region Railway GraphQL Client

async function railwayGraphQLRequest<T>(query: string, variables: Record<string, unknown>) {
	const client = new GraphQLClient(ENDPOINT, {
		headers: {
			Authorization: `Bearer ${RAILWAY_API_TOKEN}`
		}
	})
	try {
		return await client.request<T>({ document: query, variables })
	} catch (error) {
		core.setFailed(`Action failed with error: ${error}`)
		throw error
	}
}

async function getEnvironments() {
	let query = `query environments($projectId: String!) {
			environments(projectId: $projectId) {
				edges {
					node {
						id
						name
						serviceInstances {
							edges {
								node {
									domains {
										serviceDomains {
											domain
											id
										}
									}
									serviceId
									startCommand
								}
							}
						}
					}
				}
			}
		}`

	const variables = {
		projectId: PROJECT_ID
	}

	return await railwayGraphQLRequest<{
		environments: GraphQLEdges<Environment>
	}>(query, variables)
}

async function deleteEnvironment(environmentId: string) {
	try {
		let query = gql`
			mutation environmentDelete($id: String!) {
				environmentDelete(id: $id)
			}
		`

		let variables = {
			id: environmentId
		}

		return await railwayGraphQLRequest(query, variables)
	} catch (error) {
		core.setFailed(`Action failed with error: ${error}`)
		throw error
	}
}

// #endregion

async function checkIfEnvironmentExists() {
	let response = await getEnvironments()
	const filteredEdges = response.environments.edges.find((edge) => edge.node.name === DEST_ENV_NAME)
	return filteredEdges ? { environmentId: filteredEdges.node.id } : null
}

async function run() {
	try {
		const environmentIfExists = await checkIfEnvironmentExists()
		if (!environmentIfExists) {
			throw new Error("Environment does not exist. It may have already been deleted or it was never created")
		}

		const envrionmentDeleted = await deleteEnvironment(environmentIfExists?.environmentId)

		if (envrionmentDeleted) {
			console.log(`Environment ${DEST_ENV_NAME} deleted successfully.`)
		} else {
			throw new Error(`Environment ${DEST_ENV_NAME} could not be deleted.`)
		}
	} catch (error) {
		console.log(error)
		// Handle the error, e.g., fail the action
		core.setFailed("API calls failed")
	}
}

run()
