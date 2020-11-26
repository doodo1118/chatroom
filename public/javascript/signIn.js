
const baseUrl = 'http://localhost:80';

document.addEventListener("DOMContentLoaded", ()=>{

   document.querySelector(".account__signIn").addEventListener('click', signInClickHandler);
   
});
let user; 
let xhr = new XMLHttpRequest();
xhr.onreadystatechange  = ()=>{
    if(xhr.readyState === xhr.LOADING){
        // state indicator animation 
    }else if(xhr.readyState === xhr.DONE ){
        let response = xhr.responseText;
        
        if(response === 'success'){
            alert('로그인이 완료되었습니다.');
            window.localStorage.setItem('myId', user);
            window.location.href = '/';
        }else{
            alert(response + ' 다시 시도해주세요.');
        }
        
    }else{
        console.error(xhr.responseText);
    }
}

function signInClickHandler(){
    let userInfo = getInputValues();
    signIn(userInfo);
}
function getInputValues(){
    let id = document.querySelector("input[name=userId]").value;
    let password = document.querySelector("input[name=password]").value;
    
    // store
    user = id; 
    return {id, password};
}
function signIn(userInfo) {
    let dataToSend = userInfo;
    
    xhr.open('POST', baseUrl+'/auth/signin');
    // 없으면 파싱안됨.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dataToSend));
}