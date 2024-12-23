import { Request, Response } from "express";
import { HttpStatusCode, RestApiException } from "cexpress-utils/lib";
import { UsersCollection } from "../../repository/userCollection";

export class UsersController {
  constructor(private readonly usersCollection: UsersCollection) {
    this.usersCollection = usersCollection;

    this.updateUserData = this.updateUserData.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }

  updateUserData = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    await this.usersCollection.updateUser(id, data);
    
    return "User updated successfully";
  };
  
  fetchUserData = async (req: Request): Promise<any> => {
    const { id } = req.params;
    const user = await this.usersCollection.fetchUser(id);
    if (!user) {
      throw new RestApiException('User not found', HttpStatusCode.NotFound);
    }
    
    return user;
  };
}

