/* Products Handler root is  "/products" */


const express = require('express');

const router = new express.Router();

router.use(express.json())


/* Auth Middleware to Secure Priveleged Routes */

const auth = require('./middleware/auth');


/* Set up Mongoose here */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Project',{useNewUrlParser:true})
.then(console.log('DB connected'))
.catch((err) =>{
    console.log(' Prooducts Database is not Connected Exiting ...')
    process.exit(1);
});

mongoose.set('useCreateIndex', true);


/* Product Review Schema  Products are mapped to reviews in a way that when a product is created its Review Docuemnt is created in corresponding Collection
and both share the same product UID for referencing 

Review Contains an array which is supposed to store the objects -> reviews having username and review

*/

const ProductReviews = mongoose.model('productreviews',new mongoose.Schema({
    uid : {
        type : String,
        unique : true
    },
    reviews : Array
}))


/* Mongoose Product Schema  */

const productSchema = mongoose.Schema({
    name : String,
    uid : {
        type:String,
        unique:true
    },
    price : Number,
    category : String,
    availStock : Number
})

/* Modelling the Product Schema */

const Product = mongoose.model('products',productSchema)





/*  Insert a product into database requires Auth middleware success to be processed*/

router.post('/add',auth, async(req,res)=>{
    const product = new Product({
        name : req.body.name,
        uid : req.body.uid,
        price : req.body.price,
        category : req.body.category,
        availStock : req.body.availStock
    })

    /* saves product to the database */

    product.save()
    .then( ()=>{
        console.log(`Product ${product.name} has been added to Database`);
        res.status(200).send(`Product ${product.name} has been added to Database`)
    })
    .catch((err)=>{
        console.log(err.message)
        res.status(400).send('Some Error has Occured')
    })

    /* corresponding document for product in productsReview Collection */
    const review = new ProductReviews({
        uid : req.body.uid,
        reviews : []
    })

    review.save()
    .then( console.log('Corresponding Reviews Section has been saved'))
    .catch(err => console.log(err.message));
})


/*=================================================* Get Categorized Products *============================================================/

/* Query Products from DB according to a Category */

router.get('/category',(req,res)=>{
    getProducts(res,req.query.category);
})

/* Function : gets Categorized Products */
async function getProducts(res,value) {
    let results;
     results = await Product.find({category:value}) 
     .select('name price')
     if(results.length === 0)
     {
         res.send('No Product Available')
     }
     else{
    //  res.send(JSON.stringify(results));
     res.render('categories',{data:results})
     }
} 


/* Update a Product  authorize before performing */

router.patch('/',auth,(req, res) => {

  Product.updateOne({uid:req.query.uid},{
      $set : {
        name:req.query.name,
        price:req.query.price,
    }
  }).exec()
  .then( ()=>{
      console.log('Success')
      res.send('Product edited')}
  )
  .catch(err => console.log(err))
})

/* Delete a Product authorize before performing  */

router.delete('/',auth,(req,res)=>{
console.log(req.query)
  DeleteProduct(req.query.uid,res);
  
})
    
async function DeleteProduct(uid,res) {
    let result = await Product.deleteOne({uid:uid});
    if(result.n === 0)
    {res.send('Nothing Deleted')}
    else res.send('Item has been Deleted')
    
}

module.exports = router;