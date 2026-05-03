import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { success } from "zod";


const JWT_SECRET= process.env.JWT_SECRET

if (!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}

type JwtPayload ={
    userId: number;
    role: string;
}

export const authMiddleware =(req:Request, res:Response, next: NextFunction)=>{
    const token = req.cookies?.acces_token;

    if(!token){
        return res.status(401).json({
            success:false,
            message: "Unhautorized: token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;

        req.userId =  decoded.userId;
        req.userRole = decoded.role;

        next()
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Unauthorized: invalid token",
          });
    }
}


export const authorizeRoles = (...allowedRoles:Role[])=>{
    return (req:Request, res: Response, next: NextFunction)=>{
        if(!req.userRole){
            return res.status(401).json({
                success:false,
                message:"Unhautorized role missing"
            })
        }

        if(!allowedRoles.includes(req.userRole as Role)){
            return res.status(403).json({
                success:false,
                message:"Forbidden: unsifficiente permisions"
            })
        }

        next();
    }
}