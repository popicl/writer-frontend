import { defaultValueUser, User } from "./user";

export interface Post{
    id?: number;
    postName?: string;
    content?: string;
    private?: boolean;
    createdDate?: string;
    user?: User;
}

export const defaultValuePost: Readonly<Post> = {
    id: 0,
    postName: '',
    content: '',
    private: true,
    createdDate: '',
    user: defaultValueUser
}