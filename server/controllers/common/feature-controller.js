const Feature = require('../../models/features');


const addFeatureImage = async(req , res)=>{
    try{
          const {image} = req.body;

          const featureImages = new Feature({
            image
          })
          await featureImages.save();

          res.status(201).json({
            success : true,
            data : featureImages
          })
    }catch(e){
    console.error(e);

    return res.status(500).json({
        success:false,
        message:e.message
    });
}
}

const getFeatureImages = async(req , res)=>{
    try{

        const images = await Feature.find({})

         res.status(200).json({
            success : true,
            data : images
          })

    }catch(e){
    console.error(e);

    return res.status(500).json({
        success:false,
        message:e.message
    });
}
}

const deleteFeatureImage = async(req , res)=>{
    try{

        const {id} = req.params;

        const deletedImage = await Feature.findByIdAndDelete(id);

        if(!deletedImage){
            return res.status(404).json({
                success:false,
                message:"Image not found"
            });
        }

         res.status(200).json({
            success : true,
            message : "Feature image deleted successfully",
            data : deletedImage
          })

    }catch(e){
    console.error(e);

    return res.status(500).json({
        success:false,
        message:e.message
    });
}
}

module.exports = {addFeatureImage ,getFeatureImages, deleteFeatureImage};