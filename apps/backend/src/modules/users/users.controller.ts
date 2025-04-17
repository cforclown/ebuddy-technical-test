/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';
import { NotFoundException, RestApiErrorCode } from '../../utils/exceptions';
import { UsersCollection } from './users.collection';

export class UsersController {
  constructor(private readonly usersCollection: UsersCollection) {
    this.usersCollection = usersCollection;
  }

  fetchAllUsers = async (req: Request): Promise<any> => {
    const users = await this.usersCollection.fetchAllUsers();
    if (!users) {
      throw new NotFoundException('No users found', RestApiErrorCode.USER_NOT_FOUND);
    }
    
    return users;
  };
  
  fetchUserData = async (req: Request): Promise<any> => {
    const { id } = req.params;
    const user = await this.usersCollection.fetchUser(id);
    if (!user) {
      throw new NotFoundException('User not found', RestApiErrorCode.USER_NOT_FOUND);
    }
    
    return user;
  };
  
  updateUserData = async (req: Request): Promise<any> => {
    const { id, ...data } = req.body;
    await this.usersCollection.updateUser(id, data);
    
    return "User updated successfully";
  };
}
