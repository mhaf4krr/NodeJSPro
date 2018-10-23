/* Auth middleware for privileged routes like updating , deleting or posting new products , checking is done as

* Check if token exists in header
* Check if token exists , try its decrytion which if successfull will run try block and if fails goes to exception block
* if token is valid check if current user has admin rights in his user Schema , if has proceed to next middleware
* if not send error 401 unauthorized.

*/

const jwt = require('jsonwebtoken');

function auth(req,res,next) {

    console.log('Authenticating ....')
    const token = req.header('x-auth-token');
    if(!token)
    {
       res.status(400).send('You dont have Login Token.')
    }

    if(token)
    {
        try {
            
            const decodedInfo = jwt.verify(token,'ourSecretPrivateKey');
            if(decodedInfo.isAdmin === true)
            {console.log('Accessing Priveleged Routes : '+ decodedInfo.name + ' url :' + req.url);
            next();}
            else {
                console.log('Accessing Priveleged Routes Failed for : '+ decodedInfo.name);
                res.status(401).send('You dont have proper Permissions , You are not Admin')
            }

        } catch (error) {
            console.log('Auth Failed')
            res.status(401).send('You dont have proper Permissions , token is messed up')
        }
    }

}

module.exports = auth;