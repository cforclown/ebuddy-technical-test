import { db } from "../../config/firebaseConfig";
import { User } from './users.entity';
import { RestApiErrorCode, RestApiException } from '../../utils/exceptions';

const USERS_COLLECTION = "users";

export class UsersCollection {
  async fetchAllUsers() {
    try {
      return await db.collection(USERS_COLLECTION).get();
    } catch (error: any) {
      if(error.code === 5) {
        throw new RestApiException('User not found', RestApiErrorCode.USER_NOT_FOUND);
      }
      
      // unknown error, log it
      console.error(error);
    }
  }

  async fetchUser(id: string): Promise<User | null> {
    const doc = await db.collection(USERS_COLLECTION).doc(id).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  async insert({ id, email }: { id: string, email: string }): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(id).set({
      email,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      await db.collection(USERS_COLLECTION).doc(id).update(data);
    } catch (error: any) {
      if(error.code === 5) {
        throw new RestApiException('User not found', RestApiErrorCode.USER_NOT_FOUND);
      }
      
      // unknown error, log it
      console.error(error);
    }
  }
}
