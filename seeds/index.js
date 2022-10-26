const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mongoose = require("mongoose");
const connectMongo = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/YelCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
connectMongo()
  .then(() => {
    console.log("Yes I can establish the connection");
  })
  .catch((error) => {
    console.log("OH NO WHAT I MAKE MISTAKE MONGOOES IS NOT WORKING");
    console.log(error);
  });
const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 2; i++) {
    var randNumber = Math.floor(Math.random() * 500);
    const camp = new Campground({
      author: "614e86c915f3a9618d70ff53",
      location: `${cities[randNumber].city}   ${cities[randNumber].state}`,
      title: `${sample(descriptors)}   ${sample(places)}`,
      price: randNumber,
      images: [
        {
          url: "https://res.cloudinary.com/dmve1wqru/image/upload/v1632928525/Shaadi_Mein_Zaroor_Aana-1280x1024_gqkspt.jpg",
          filename: "YelCamp/aby1jljef6bnsw1gwrxw",
        },
        {
          url: "https://res.cloudinary.com/dmve1wqru/image/upload/v1632928525/Shaadi_Mein_Zaroor_Aana-1280x1024_gqkspt.jpg",
          filename: "YelCamp/tg8fhv5cmcftswms1eyn",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, sint ullam. Commodi ut quibusdam cum fugiat non perspiciatis, nam animi sapiente error quis fugit quasi, voluptas laboriosam obcaecati minus! Quod?",
    });
    await camp.save();
  }
};

seedDB().then((data) => {
  console.log("All DOne");
  console.log("Now Database is close");
  mongoose.connection.close();
});
