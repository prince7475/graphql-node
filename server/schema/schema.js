
// Mongoose models
const Client = require('../models/Client')
const Project = require('../models/Project')

const {GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql')

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
})


const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        clientId: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},    
        client: {
            type: ClientType,
            resolve(parent,arg){
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent,arg){
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: {id : {type: GraphQLID}},
            resolve(parent,args){
                return Project.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent,arg){
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: {id : {type: GraphQLID}},
            resolve(parent,args){
                return Client.findById(args.id)
            }
        }
    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                let client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        // Delete client
        deleteClient: { 
            type: ClientType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return Client.findByIdAndDelete(args.id)
            }
        },
        // Add a Project
        addProject: {
            type: ProjectType,
            args: {
                clientId: {type: GraphQLNonNull(GraphQLString)},
                name: {type:  GraphQLNonNull(GraphQLString)},
                description: {type:  GraphQLString},
                status: {type:  new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                        'new': {value: "Not Started"},
                        'progress': {value: "In Progress"},
                        "completed": {value: "Completed"}
                        
                    }
                }),
                defaultValue: "Not Started"
            },
            },
            resolve(parent,args){
                const newProject = new Project({
                    clientId: args.clientId,
                    name: args.name,
                    description: args.description,
                    status: args.status
                })
                return newProject.save()
            }
        },

        // Delete Project
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return Project.findByIdAndRemove(args.id)
            }
        }
    
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})