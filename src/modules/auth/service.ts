import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../../config/prisma"
import { LoginInput,RegisterInput } from "./schema"
import { email } from "zod"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined")
}

export const registerUser =  async (data:RegisterInput)=>{
    const existingUser = await prisma.user.findUnique({
        where:{
            email:data.email
        }
    })

    if(existingUser){
        throw new Error("Email already in use")
    }

    const hashedPassword = await bcrypt.hash(data.password,10);

    const user = await prisma.user.create({
        data:{
            name:data.name,
            email:data.email,
            passwordHash:hashedPassword
        },
        select:{
            id:true,
            name:true,
            email:true,
            role:true,
            createdAt:true
        }
    })

    return user;
}

export const loginUser = async (data:LoginInput)=>{
    const user = await prisma.user.findUnique({
        where:{
            email:data.email
        }
    })

    if(!user){
        throw new Error("Invalid Credentials")
    }


    const isPasswordValid = await bcrypt.compare(data.password,user.passwordHash)

    if(!isPasswordValid){
        throw new Error("Invalid Credentials")
    }

    const token = jwt.sign({
        userId:user.id,
        role:user.role
    },JWT_SECRET,{
        expiresIn:"1d" // 1 day
    })

    return{
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            createdAt:user.createdAt,
        }
    }
}

export const getCurrentUser = async (userId:number)=>{
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        }
    })

    if(!user){
        throw new Error("User not found or unauthorized")
    }

    return user;
}