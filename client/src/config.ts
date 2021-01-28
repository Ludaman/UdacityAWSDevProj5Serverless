// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '54ri7f4uqh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-79vk81-c.us.auth0.com',            // Auth0 domain
  clientId: 'BHCpPhgwuhhowP6qYP9EKiUqoLHsXskx',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
