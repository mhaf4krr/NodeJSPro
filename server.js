const express = require('express');

/* Import UserHandler File */
let userRouter = require('./users');

/* Import ProductHandler File */

let productRouter = require('./products') 


const app = express();

app.use(express.json());

/* Assign Static Folders , created virtual relation  */
app.use('/resources',express.static('./assets'))



/* Handle Login through Login Router */
app.use('/user',userRouter);

/* Handle Product API through Product Router */
app.use('/products',productRouter);





/* Set up View Engine */
app.set('view engine','ejs')


/* Landing Page Render */
app.get('/',(req,res)=>{
    res.render('index')
})


/* Categories Render */
app.get('/categories',(req,res)=>{
    res.render('categories')
})

/* Handle Login UI */
app.get('/login',(req,res)=>{
    res.render('login')
})


app.listen(3000);

