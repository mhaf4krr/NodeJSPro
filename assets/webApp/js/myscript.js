
    console.log('in script')
    if(localStorage.getItem('x-auth-token')){
       const token = localStorage.getItem('x-auth-token')
        let xhr = new XMLHttpRequest();
        xhr.open('POST','/user/loginAuth',true);
        xhr.setRequestHeader('x-auth-token',token)
        xhr.send()
        xhr.onload = function(){
            console.log(xhr.response)
            document.querySelector('#accountName').textContent = xhr.responseText;
            document.querySelector('#userNameMobile').textContent = xhr.responseText;
            document.querySelector('#register').style.display='none';
            document.querySelector('#sign-in').style.display='none';
            document.querySelector('#getAccount').style.display='block'
            
        }
    }
        else {
            document.querySelector('#getAccount').style.display='none';
        }
    
// Apply cart processing logic

let cart = [];

document.querySelector("#cartCatcher").addEventListener('click',(e)=>{
    console.log(e.target.firstElementChild.nodeName == 'INPUT')
    if(e.target.firstElementChild.nodeName == 'INPUT'){
        let target = e.target.firstElementChild;
        console.log(target);
        console.log(target.value)


        if(cart.length === 0)
        {
        cart.push({
         _id:target.value,
            quantity:1
        } ) }

        else {

            let index = cart.findIndex((element) =>{
                return element._id === target.value
            } )

            if(index === -1)

            cart.push({
                _id:target.value,
                   quantity:1
               })

               else console.log('Already Added')
        }
        
        console.log(cart)
    }
    
})