const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError  = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js"); 

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

// create a function  for validate moongose
const validateListing = (req,res,err) =>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
};

//   get all the listing 
app.get("/listings",wrapAsync(async (req,res) =>{
   const allListings = await  Listing.find({});
   res.render("listing/index.ejs",{allListings});
}));
//   new route before show request because it is treating new as id
app.get("/listings/new",(req,res) =>{
     res.render("listing/new.ejs");
})

// show request
app.get("/listings/:id",wrapAsync( async(req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
}));


//    create route
app.post("/listings" , validateListing, wrapAsync(async(req,res) =>{
      
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
//   edit route
app.get("/listings/:id/edit", wrapAsync (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing})

}));
//   update route
app.put("/listings/:id",validateListing,wrapAsync (async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
    }  
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
      
    res.redirect(`/listings/${id}`);
}));

//  do one listing
// app.get("/testlisting",async (req,res) =>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute , Goa",
//         country : "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("great success ")

// })

// delete route
app.delete("/listings/:id", wrapAsync (async (req,res) =>{
    let{id} = req.params;
    const del = await Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listings")
}));


app.get("/",(req,res) =>{
    res.send("hi i am root");
})
//  agar koi bhi page pe gaye error batya toh ek universal err bana denge
// Universal 404 handler

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});



// handle async method

app.use((err,req,res,next) =>{
    let {statusCode = 500 , message="Somethoing Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})


app.listen(8080,() =>{
    console.log("server is listening to port 8080")
})