/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type StorageType = 'local' | 'session'
export interface IStorageService {
  getString: (key: string) => string | null;
  setString: (key: string, value: string) => void;
  getObject: <T>(key: string) => T | null;
  setObject: (key: string, value: any) => void;
  remove: (key: string) => void;
}

const storageService = (type: StorageType): IStorageService => {
  const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'local'}Storage`;
  return {
    setString: (key: string, value: string): void => window[storageType].setItem(key, value),
    getString: (key: string): string | null => window[storageType].getItem(key),
    setObject: (key: string, value: any): void => {
      window[storageType].setItem(key, JSON.stringify(value));
    },
    getObject: <T>(key: string): T | null => {
      try {
        const value = window[storageType].getItem(key);
        if (!value) {
          return null;
        }

        return JSON.parse(value) as T;
      } catch (err) {
        return null;
      }
    },
    remove: (key: string): void => {
      window[storageType].removeItem(key);
    }
  };
};

export default storageService;
