const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : process.env.CLOUDIANRY_CLOUD_NAME,
    api_key : process.env.CLOUDIANRY_KEY,
    api_secret : process.env.CLOUDIANRY_SECRET

});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder : "YelCamp",
        allowedFormats : ["jpg","png","jpeg"]
    }
   
});

module.exports = {
    cloudinary,
    storage
}