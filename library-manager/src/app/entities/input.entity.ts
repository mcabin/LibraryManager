export class InputEntity{
    constructor(public content:string='',public hasError:boolean=false,public errorMessage:string=''){
        
    }

    public checkIfHasContent():boolean{
        if(this.content==''){
            this.hasError=true;
            this.errorMessage="Saisie obligatoire.";
            return false;
        }
        return true;
    }

    public resetError(){
        this.hasError=false;
        this.errorMessage='';
    }

    public setError(errorMessage:string){
        this.hasError=true;
        this.errorMessage=errorMessage;
    }
}