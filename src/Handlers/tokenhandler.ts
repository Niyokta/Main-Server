import fs from 'fs'
import jwt from 'jsonwebtoken'

const privatekey=fs.readFileSync("./private.key","utf8")
const publickey=fs.readFileSync("./public.key","utf8")


export function signAccessToken(payload:object){
    const token=jwt.sign(payload,privatekey,{
        algorithm:'RS256',
        expiresIn:'20m'
    })
    return token
}
export function verifyToken(token:string){
    const verifytoken=jwt.verify(token,publickey)
    return verifytoken
}

export function signRefreshToken(payload:object){
    const token=jwt.sign(payload,privatekey,{
        algorithm:'RS256',
        expiresIn:'7d'
    })
    return token
}

export function reSignAccessToken(refreshToken:string){
    const decodedToken=jwt.decode(refreshToken)
    if(decodedToken && typeof decodedToken==='object'){
        const payload:object={
            createdAt:decodedToken.createdAt,
            username:decodedToken.username,
            email:decodedToken.email,
            phone:decodedToken.phone
        }
        const token=signAccessToken(payload)
        return token
    }
    return null
}