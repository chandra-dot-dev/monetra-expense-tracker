import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
  };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. No authorization token provided." 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "super_secret_monetra_key_54321";
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    
    req.userId = decoded.id;
    req.user = { id: decoded.id };
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ 
      success: false, 
      message: "Authorization token is invalid or expired." 
    });
  }
};

export default authMiddleware;
