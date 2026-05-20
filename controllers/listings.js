const Tourist = require("../models/tourist");

// INDEX PAGE

module.exports.index = async (req, res) => {

    const { search, category, state } = req.query;

    let filter = {};

    // SEARCH
    if (search) {

        filter.$or = [

            { title: { $regex: search, $options: "i" } },

            { state: { $regex: search, $options: "i" } },

            { city: { $regex: search, $options: "i" } },

        ];
    }

    // CATEGORY FILTER
    if (category) {
        filter.category = category;
    }

    // STATE FILTER
    if (state) {
        filter.state = state;
    }

    const allListings = await Tourist.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        search,
        category,
        state,
    });
};

// NEW FORM

module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs");

};



// SHOW PAGE

module.exports.showListing = async (req, res) => {

  let { id } = req.params;

  const listing = await Tourist.findById(id);

  if (!listing) {

    return res.redirect("/listings");

  }

  res.render("listings/show.ejs", { listing });

};



// CREATE

// CREATE
// CREATE

module.exports.createListing = async (req, res) => {

  console.log(req.body);
  console.log(req.file);

  const newListing = new Tourist({
    title: req.body.listing.title,
    description: req.body.listing.description,
    image: "/" + req.file.path.replace(/\\/g, "/"),
    state: req.body.listing.state,
    city: req.body.listing.city,
    category: req.body.listing.category,
    bestTime: req.body.listing.bestTime,
    entryFee: req.body.listing.entryFee,
    timings: req.body.listing.timings,
    nearbyAttractions: req.body.listing.nearbyAttractions,
    mapLink: req.body.listing.mapLink,
  });

  await newListing.save();

  res.redirect("/listings");

};


// EDIT FORM

module.exports.renderEditForm = async (req, res) => {

  let { id } = req.params;

  const listing = await Tourist.findById(id);

  if (!listing) {

    return res.redirect("/listings");

  }

  res.render("listings/edit.ejs", { listing });

};



// UPDATE

module.exports.updateListing = async (req, res) => {

  let { id } = req.params;

  let listing = await Tourist.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {

    listing.image = req.file.path;

    await listing.save();

  }

  res.redirect(`/listings/${id}`);

};



// DELETE

module.exports.destroyListing = async (req, res) => {

  let { id } = req.params;

  await Tourist.findByIdAndDelete(id);

  res.redirect("/listings");

};