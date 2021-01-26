import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function parseAuthorization(authorization: string): string {
  console.log('authorization object: ', authorization)//indicate I got into the method

  const split = authorization.split(' ')
  console.log('split up authorization: ', split)//indicate I got into the method

  const jwtToken = split[1]
  console.log('jwttoken chosen: ', jwtToken)//indicate I got into the method

  return parseUserId(jwtToken) 
}

