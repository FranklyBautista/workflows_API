import { Request, Response } from "express";
import { loginSchema,registerSchema } from "./schema";
import { registerUser,loginUser,getCurrentUser } from "./service";
import { success } from "zod";
import { error } from "node:console";

export const registerController = async (req: Request, res: Response)=>{
    const result = registerSchema.safeParse(req.body)

    if (!result.success){
        return res.status(400).json({
            success:false,
            message:"Validation error",
            errors: result.error.flatten().fieldErrors
        })
    }

    try{
        const user = await registerUser(result.data)

        return res.status(201).json({
            success:true,
            messagge: "User registered succesfully",
            data: user
        });
    }catch(error){
        const message = 
        error instanceof Error ? error.message:"Unexpected error"

        return res.status(400).json({
            success:false,
            message,
        })
    }

    
}

export const loginController = async (req:Request,res:Response)=>{
    const result = loginSchema.safeParse(req.body)

    if(!result.success){
        return res.status(400).json({
            success:false,
            message:"Validation Error",
            error: result.error.flatten().fieldErrors
        })
    }

    try{
        const {token,user} = await loginUser(result.data)

        res.cookie("acces_token", token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"lax",
            maxAge:24*60*60*1000

        })

        return res.status(200).json({
            success:true,
            message:"Login successful",
            data:user
        })
    }catch(error){
        const message=
            error instanceof Error ? error.message:"Unexpected error"
    }

    return res.status(401).json({
        success:false,
        message:""
    })
}

export const logoutController=(req:Request,res:Response)=>{
    res.clearCookie("acces_token");

    return res.status(200).json({
        success:true,
        message:"logout successful"
    })
}

export const meController= async (req:Request, res:Response)=>{
    try{
        const userId = req.userId;

        if(userId === undefined){
            return res.status(401).json({
                success:false,
                message: "Unhauthorized"
            })
        }

        const user = await getCurrentUser(userId)

        return res.status(200).json({
            success:true,
            message:"Current user",
            data:user
        })
    }catch(error){
        const message = error instanceof Error ? error.message:"Unexpectede Error"

        return res.status(401).json({
            success:false,
            message
        })
    }
}
