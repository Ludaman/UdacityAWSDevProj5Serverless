import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('createTodo.ts Processing event: ', event)//indicate I got into the method

    const itemId = uuid.v4()
    const timestamp = new Date().toISOString()
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
//TBD for checking if valid user was provided
    //const authorization = event.headers.Authorization
    //const split = authorization.split(' ')
    //const jwtToken = split[1]

    //for when I have a user being passed in
    // const newItem = { 
    //     id: itemId,
    //     userId: getUserId(jwtToken),
    //     ...parsedBody
    // }

    //create JSON of data to be uploaded to dynamo DB
    const newItem = { 
        todoId: itemId,
        createdAt: timestamp,
        userId: "Jeff",
        done: false,
        ...newTodo//includes name and duedate
    }//assume that attachmentURL will come via update only

    //actually write it to the dynamoDB
    await docClient.put({
        TableName: todoTable,
        Item: newItem
      }).promise()
  
      //return to client application that write succeeded
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
