import { Request, Response } from "express";
import admin from "../../config/firebaseConfig";
import { UsersCollection } from "../../modules/users";
import { RestApiErrorCode, RestApiException } from "../../utils";

export class AuthController {
  constructor(private readonly usersCollection: UsersCollection) {
    this.verify = this.verify.bind(this);
    this.register = this.register.bind(this);
  }

  register = async (req: Request, res: Response) => {
    const { id, email } = req.body;

    await this.usersCollection.insert({
      id,
      email,
    });
  };

  verify = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const user = await this.validateToken(token);
  
      return user;
    } catch (error: any) {
      if (error?.code === 'auth/id-token-expired') {
        throw new RestApiException('Token expired', RestApiErrorCode.UNAUTHORIZED);
      } else {
        throw new RestApiException('Invalid token', RestApiErrorCode.UNAUTHORIZED);
      }
    }
  };

  private validateToken = async (token: string) => {
    try {
      // Verify the token
      const decodedToken = await admin.auth().verifyIdToken(token, true);
  
      // Get the user's UID
      const uid = decodedToken.uid;
  
      // Fetch the user's details from Firebase
      const userRecord = await admin.auth().getUser(uid);
  
      return userRecord;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }

  public static validateRequestAuth = async (token: string) => {
    try {
      // Verify the token
      const decodedToken = await admin.auth().verifyIdToken(token, true);
      
      return decodedToken;
    } catch (error: any) {
      return false;
    }
  }
}

