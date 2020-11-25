// TODO
// singleton
class Store{
    constructor(){
        this._user;
    }
    logIn(userId){
        this._user = userId;
    }
}

const store = new Store(); 
