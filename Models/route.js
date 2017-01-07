class Route{
    constructor(type,way,status){
        this.Type = type;
        this.Way = way;
        this.Status = status;
    }
    get status(){
        return this.Status;
    }
    set status(value){
        this.Status = value;
    }
    get way(){
        return this.Way;
    }
    get type(){
        return this.Type;
    }

}