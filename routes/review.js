const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError  = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewcontroller = require("../controllers/review.js")

let {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")


//   reviews route
// post route
router.post("/" ,isLoggedIn,validateReview, wrapAsync(reviewcontroller.creatrReview));


// //  Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewcontroller.destroyReview))

module.exports = router