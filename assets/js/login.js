


document.querySelector('#loginBtn').addEventListener('click',(e)=>{

    console.log('Heard')

    e.preventDefault();

    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    
    const xhr = new XMLHttpRequest();

    xhr.open('POST','/user/login',true)

    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')

    xhr.send(`email=${email}&password=${password}`)

    xhr.onload = function(){
        
        let result = JSON.parse(xhr.response);
        console.log(result);
        document.querySelector('#status-message').textContent = result.message;
        console.log(result.payloadToken);
        if(result.payloadToken)
        localStorage.setItem('x-auth-token',result.payloadToken);
    }

})