import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function updateTodosURL(newUrl, todoId: string,userId: string) {
    console.log('attempting to set URL in existing TODOID: ', todoId)
    console.log('attempting to set URL in existing newURL: ', newUrl)

    return await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ExpressionAttributeNames: {"#A": "attachmentUrl"},
        UpdateExpression: "set #A = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": newUrl
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()
}