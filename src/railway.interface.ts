export interface GraphQLEdges<T> {
	edges: {
		node: T
	}[]
}

export interface Environment {
	id: string
	name: string
	serviceInstances: GraphQLEdges<ServiceInstance>
}

export interface ServiceInstance {
	id: string
	domains: {
		serviceDomains: {
			domain: string
			id: string
		}[]
	}
	serviceId: string
	startCommand: string
}
