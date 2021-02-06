import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function modifyImage(todoId: string) {
    const todoObject =  await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()

    if(todoObject.Count == 1) { //then we found a single unique object like we expected
        if( todoObject.Items[0].attachmentUrl) { //then we found a URL associated with the todo so we can try to modify it
            console.log("Found URl for image", todoObject.Items[0].attachmentUrl)

        } else {
            console.log("no URL associated with todo, exiting modifyImage function")
        }
    } else {
        console.log("failed to find todoID object")
    }
  }