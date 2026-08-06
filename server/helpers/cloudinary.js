const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dhnvvvmch',
    api_key : '835871124838573',
    api_secret: '7z3TMeFEL7CRGmYoe2uVkdmPlOE'
});

const storage =  multer.memoryStorage();


async function imageUploadUtils(file){
    const result = await cloudinary.uploader.upload(file,{
        resource_type : 'auto',
    });

    return result;

}

const upload =  multer({storage});

module.exports={upload , imageUploadUtils};
