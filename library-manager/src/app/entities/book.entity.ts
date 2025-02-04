export enum BookReadState {
    NOTHING = "NOTHING",
    FINISHED = "FINISHED",
    ONGOING = "ONGOING",
    READLIST = "READLIST",
  }

export class BookCover{
    constructor(public smallCover:string,public cover:string){
    }
}

export class Book{
    constructor(
        public title:string,
        public subtitle:string,
        public authors:string[],
        public apiId:string,
        public coverLink:BookCover,
        public description:string,
        public publishYear:number,
        public nbPage:number,
        public userInfo?:UserInfo,
        public ratingInfo?:RatingInfo

     ){}
}

export class UserInfo{
    constructor(
        public rating:number,
        public readState:BookReadState,
        public date:Date
    ){}
}
export class RatingInfo{
    constructor(
        public rating:number,
        public nbUser:number
    ){}
}

export interface BookResponse {
    apiId: string;
    title: string;
    author: string;
    readPageNb: number;
    state: BookReadState;
    note: number;
    date: Date;
}

export interface BookRequest{
    apiId: string;
    title: string;
    author: string;
    readPageNb: number;
    state: BookReadState;
    note: number;
    date: Date;
    creatorUsername: string;
}