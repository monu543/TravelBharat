const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const wrapAsync = require("../utils/wrapAsync.js");


const {
  isLoggedIn,
  isOwner,
} = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

// INDEX + CREATE

router
  .route("/")
  .get(wrapAsync(listingsController.index))

  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingsController.createListing)
  );

// NEW ROUTE

router.get(
  "/new",
  isLoggedIn,
  listingsController.renderNewForm
);

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))

  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingsController.updateListing)
  )

  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.destroyListing)
  );



module.exports = router;