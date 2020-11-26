const baseUrl = 'http://3.34.255.237/';

document.addEventListener("DOMContentLoaded", ()=>{

   document.querySelector(".account__signUp").addEventListener('click', signUpClickHandler);
   
});

let xhr = new XMLHttpRequest();
xhr.onreadystatechange  = ()=>{
    if(xhr.readyState === xhr.LOADING){
        // state indicator animation 
    }else if(xhr.readyState === xhr.DONE ){
        let response = xhr.responseText;
        console.log(response);
        if(response === 'success'){
            alert('가입이 완료되었습니다. 로그인 해 주세요');
            window.location.href = '/auth/signin';
        }else{
            alert(response + ' 다시 시도해주세요.');
        }
        
    }else{
        console.error(xhr.responseText);
    }
}

function signUpClickHandler(){
    let userInfo = getInputValues();
    console.log('ui', userInfo);
    signUp(userInfo);
}
function getInputValues(){
    let id = document.querySelector("input[name=userId]").value;
    let password = document.querySelector("input[name=password]").value;
    
    return {id, password};
}
function signUp(userInfo) {
    let dataToSend = userInfo;
    
    xhr.open('POST', baseUrl+'/auth/signup');
    // 없으면 파싱안됨.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dataToSend));
}

function logoutClickHandler(){}