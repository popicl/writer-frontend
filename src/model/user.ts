export  interface User {
    id?: number;
    userName?: string;
    email?: string;

}

export const defaultValueUser: Readonly<User> = {
    id: 0,
    userName: '',
    email: ''
}
