import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

export async function deleteItemById(params: { TableName: string; Key: { userId: string; todoId: string } }) {
    await docClient.delete(params, function (err, data) {
      if (err) {
        console.error("Unable to delete item", JSON.stringify(err))
      }
      else {
        console.log("DeleteItem succeeded", JSON.stringify(data))
      }
    }).promise()
  }
  