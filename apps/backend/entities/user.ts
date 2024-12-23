import Joi from "joi";

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}
