import { asClass, asFunction, asValue, createContainer, InjectionMode } from 'awilix';
import App from './app';
import mainRouter from './root.router';
import apiRouter from './api.router';
import { AuthController, authRouter } from '../modules/auth';
import { UsersCollection, UsersController, usersRouter } from '../modules/users';

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

export function setupDIContainer (): void {
  container.register({
    app: asFunction(App),
    mainRouter: asFunction(mainRouter),
    apiRouter: asFunction(apiRouter),
    
    authRouter: asFunction(authRouter),
    authController: asClass(AuthController),

    usersRouter: asFunction(usersRouter),
    usersController: asClass(UsersController),
    usersCollection: asClass(UsersCollection),
  });
}
