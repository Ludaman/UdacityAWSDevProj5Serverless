import * as AWS  from 'aws-sdk'
import Jimp from 'jimp/';
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const s3 = new AWS.S3()
import { createLogger } from '../../utils/logger'


export async function modifyImage(todoId: string, userId: string) {
  const logger = createLogger('modifyimagehandler')

    const params1 = {
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    console.log("Looking for Image by params", params1)

    const todoObject =  await docClient.get(params1, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
  }).promise()

    console.log("Found todo", todoObject)
    if(todoObject) { //then we found a single unique object like we expected
        if( todoObject.Item.attachmentUrl) { //then we found a URL associated with the todo so we can try to modify it
            
            var imageSize
              
            await s3.headObject({Key: todoId, Bucket: bucketName}).promise().then(res=>res.ContentLength).then(size =>imageSize=size)
            
            console.log("IMAGESIZE ", imageSize)
            if (imageSize>250000) {
              logger.info(`IMAGE TOO LARGE - WILL NOT INVERT`)
            } else {

              var image = await Jimp.read(todoObject.Item.attachmentUrl)
              logger.info("downloaded image", image)
              image.invert()
              logger.info("INVERTED IMAGE")
  
              const convertedBuffer = await image.getBufferAsync(Jimp.MIME_PNG)
  
              logger.info(`Writing image back to S3 bucket: ${bucketName}`)
 
              await s3
              .putObject({
                Bucket: bucketName,
                Key: `${todoId}`,
                Body: convertedBuffer
              })
              .promise()
            }
        } else {
            console.log("no URL associated with todo, exiting modifyImage function")
        }
    } else {
        console.log("failed to find todoID object")
    }
  }