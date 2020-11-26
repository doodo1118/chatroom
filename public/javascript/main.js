// TODO
// 4. 클릭전에 content 미리 로드하기


const baseUrl = 'http://3.34.255.237';

document.addEventListener("DOMContentLoaded", ()=>{

    const lnb = document.querySelector(".main__lnb");     
    new LNB(lnb);

    const contentLnb = document.querySelector(".content__lnb");
    new ContentLnb(contentLnb);

    const itemListContainer = document.querySelector(".content__main");
    new ItemListContainer(itemListContainer);
});
    

class Ajax {
    constructor(){
        this._baseUrl = "localhost:8001/"
        this._xhr = new XMLHttpRequest();
        this._url;
        this._method;
        this._data;
    }
    config(config){
        let {method, url, data, callback} = config;
        this._method = method;
        this._url = url;
        this._data = data;
        this.setCallBack(callback); 
    }
    setCallBack(callback){
        this._xhr.onreadystatechange = callback;
    }
    setUrl(url){
        this._url = url;
    }
    setMethod(method){
        this._method = method;
    }
    setData(data){
        this._data = data;
    }
    requestByGet(){
        this._xhr.open(this._method, this._url);
        this._xhr.send();
    } 
    requestByPost(){
        this._xhr.open(this._method, this._url);
        this._xhr.setRequestHeader('Content-Type', 'application/json');
        this._xhr.send(JSON.stringify( {friendId: this._data}) );
    } 
    requestByDelete(){
        this._xhr.open(this._method, this._url);
        this._xhr.send();
    } 
    open(){
        this._xhr.open(this._method, this.url);
    }
}
class Store{
    constructor({lnb, contentLnb}){
    }
    refreshContent(){
    }
}
class LNB{
    constructor(elem){
        this._elem = elem;
        elem.onclick = this.onClick.bind(this);
        
        this._elem = elem; 
        
        this._ajax = new Ajax();

        this._cuurentAction; 
    }
    room(){
        let ajaxConfig = {
            method : 'GET', 
            url: '/chat/room', 
            callback(event){
                let target = event.target; 
                document.querySelector(".content__main").innerHTML = target.responseText;
                document.querySelector(".content__lnb").innerHTML = "";
            }
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByGet();
    }
    user(){
        let ajaxConfig = {
            method : 'GET', 
            url: '/social/user', 
            callback(event){
                let target = event.target; 
                document.querySelector(".content__main").innerHTML = target.responseText;
                document.querySelector(".content__lnb").innerHTML = "";
            }
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByGet();
    }
    friend(){
        document.querySelector(".content__main").innerHTML = "";
        let friendLnb = '<div class="friend__tabs">'+
                            '<div class="friend__tab friend__friendRequest" data-action="getFriendRequestList">' +
                                '<div class="icon icon_envelope"><i class="fas fa-envelope"></i></div>'+
                                '<div>수신함</div>'+
                            '</div>'+
                            '<div class="friend__tab friend__friendRequest" data-action="getFriendList">' +
                                '<div class="icon"><i class="fas fa-user-friends"></i></div>'+
                                '<div>목록</div>'+
                            '</div>'+
                        '</div>';
        document.querySelector(".content__lnb").innerHTML = friendLnb;

    }
    logout(){
        window.location.href = '/auth/logout';
    }
    onClick(event){
        let action = event.target.dataset.action;
        if(action){
            this[action]();
            this._currentAction = action;
        }
    }
}
class ContentLnb{
    constructor(elem){
        this._elem = elem;
        elem.onclick = this.onClick.bind(this);
        this._ajax = new Ajax();

        this._currentAction;
    }
    getFriendList(){
        let ajaxConfig = {
            method : 'GET', 
            url: '/social/friend', 
            callback(event){
                let target = event.target; 
                document.querySelector(".content__main").innerHTML = target.responseText;
            }
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByGet();
    }
    getFriendRequestList(){
        let ajaxConfig = {
            method : 'GET', 
            url: '/social/friend-request', 
            callback(event){
                let target = event.target; 
                document.querySelector(".content__main").innerHTML = target.responseText;
            }
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByGet();
    }
    onClick(event){
        let action = event.target.dataset.action;
        
        if(action){
            this[action]();
            this._currentAction = action;
        }
    }
}
class ItemListContainer {
    constructor(elem){
        this._elem = elem; 
        elem.onclick = this.onClick.bind(this); 

        this._ajax = new Ajax();
    }
    
    sendFriendRequest(friendId){
        let ajaxConfig = {
            method : 'POST', 
            url: '/social/friend-request', 
            data: friendId,
            callback : ()=>document.querySelector(".lnb__user").click(), 
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByPost();
    }
    admitFriendRequest(friendId){
        let ajaxConfig = {
            method : 'POST',
            url: '/social/friend', 
            data: friendId, 
            callback : ()=>document.querySelector(".friend__friendRequest").click(), 
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByPost();
    }
    declineFriendRequest(friendId){
        let ajaxConfig = {
            method : 'DELETE', 
            url: '/social/friend-request/'+friendId, 
            callback : ()=>document.querySelector(".friend__friendRequest").click(), 
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByDelete();
    }
    friendDelete(friendId){
        let ajaxConfig = {
            method : 'DELETE', 
            url: '/social/friend/'+friendId, 
            callback : ()=>document.querySelector(".friend__friend").click(), 
        }
        this._ajax.config( ajaxConfig );
        this._ajax.requestByDelete();
    }
    joinChatRoom(id){
        this.renderChatRoom(); 

        const chatRoom = new ChatRoom();
        chatRoom.connect(id);
    }
    renderChatRoom(){
        // let ajaxConfig = {
        //     method : 'DELETE', 
        //     url: '/chat/room-layout/'+friendId, 
        //     callback : ()=>document.querySelector(".friend__friend").click(), 
        // }
        // this._ajax.config( ajaxConfig );
        // this._ajax.requestByDelete();
        document.querySelector(".content__main").innerHTML = `
             <div class="chatRoom">
                <div class="chatRoom__body">
                    <div class="chatRoom__title">
                        <div class="chatRoom__roomNumberLabel">
                            방 번호 : 
                        </div>
                        <div class="chatRoom__roomNumber">
                        </div>
                    </div>
                    <div class="chatRoom__chatLogsContainerWrap>
                        <div class="chatRoom__chatLogsContainer">
                        </div>
                    </div>
                    <div class="chatRoom__inputMessage">
                        <input type="text" placeholder="채팅 내용을 입력해주세요.">
                    </div>
                </div>
                <div class="chatRoom__header">
                    <div class="chatRoom__informationContainer">
                        <div class="chatRoom__countAttendees">
                            <div class="chatRoom__countAttendeesLabel">
                                현재인원 : 
                            </div>
                            <div class="chatRoom__countAttendeesData">
                            </div>
                        </div>
                        <div class="chatRoom__attendees">
                        </div>
                    </div>
                    <div class="chatRoom__buttons">
                        <div class="chatRoom__exit" data-action="exit">
                            나가기
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    directMessage(friendId){
        this.renderDirectMessage(friendId);
        const directMessage = new DirectMessage();
        directMessage.connect(friendId);
    }
    renderDirectMessage(friendId){
        document.querySelector(".content__main").innerHTML = `
            <div class="chatRoom">
                <div class="chatRoom__body">
                    <div class="chatRoom__title directMessage__title">
                        <div class="chatRoom__roomNumber">
                            ${friendId}
                        </div>
                    </div>
                    <div class="chatRoom__chatLogsContainerWrap">
                        <div class="chatRoom__chatLogsContainer">
                        </div>
                    </div>
                    <div class="chatRoom__inputMessage">
                        <input type="text" placeholder="채팅 내용을 입력해주세요.">
                    </div>
                </div>
            </div>`;
    }
    onClick(event){
        let {action, id} = event.target.dataset;
        if(action)
            this[action](id);
    }
}
