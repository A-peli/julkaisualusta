export interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  author: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
