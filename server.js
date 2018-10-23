const express = require('express');

/* Import UserHandler File */
let userRouter = require('./users');

/* Import ProductHandler File */

let productRouter = require('./products') 


const app = express();

app.use(express.json());

/* Handle Login through Login Router */
app.use('/user',userRouter);

/* Handle Product API through Product Router */
app.use('/products',productRouter);



/* Assign Static Folders Here */
app.use('/scripts',express.static('./scripts'))

/* Set up View Engine */
app.set('view engine','ejs')



app.get('/',(req,res)=>{
    res.render('')
})


app.listen(3000);

