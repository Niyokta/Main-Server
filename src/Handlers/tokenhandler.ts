import fs from 'fs'
import jwt,{Jwt} from 'jsonwebtoken'

const privatekey=fs.readFileSync("./private.key","utf8")
const publickey=fs.readFileSync("./public.key","utf8")


export function signAccessToken(payload:object){
    const token=jwt.sign(payload,privatekey,{
        algorithm:'RS256',
        expiresIn:'1h'
    })
    return token
}
export function verifyToken(token:string){
    const verifytoken=jwt.verify(token,publickey)
    return verifytoken
}