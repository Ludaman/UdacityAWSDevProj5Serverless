import 'source-map-support/register'
import { decode } from 'jsonwebtoken'

import { JwtToken } from './JwtToken'
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
    const authorization = event.headers.Authorization
    console.log('authorization object: ', authorization)//indicate I got into the method

    const split = authorization.split(' ')
    console.log('split up authorization: ', split)//indicate I got into the method

    const jwtToken = split[1]
    console.log('jwttoken chosen: ', jwtToken)//indicate I got into the method

    const userId = getUserId(jwtToken) 
    console.log('userID found: ', userId)//indicate I got into the method

    //create JSON of data to be uploaded to dynamo DB
    const newItem = { 
        todoId: itemId,
        createdAt: timestamp,
        userId: userId,
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

function getUserId(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtToken
    return decodedJwt.sub
  }
