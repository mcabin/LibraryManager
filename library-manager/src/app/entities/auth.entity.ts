export interface LoginRequest{
    username:string,
    password:string
}

export interface RegisterRequest{
    username:string,
    email:string,
    password:string
}

export interface AuthResponse{
    token:string
}

export enum AuthErrorType{
    DEFAULT,
    EMAIL,
    USER
}
export class AuthError{
    public type! :AuthErrorType;
    constructor(public msg:string){
        if(msg.includes("email")){
            
            this.type=AuthErrorType.EMAIL
        }
        else if(msg.includes("utilisateur")){
            console.log("user")
            this.type=AuthErrorType.USER;
        }
        else{
            this.type=AuthErrorType.DEFAULT;
        }
    };

}