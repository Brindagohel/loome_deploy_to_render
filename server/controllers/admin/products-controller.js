

const {imageUploadUtils } = require("../../helpers/cloudinary");
const product = require("../../models/products");




const handleImageUpload = async(req,res)=>{
    try{
        const b64= Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtils(url);
        
        res.json({
            success : true,
            result
        })
    }catch(error){
        console.log(error);
        res.json({
            success : false,
            message : "Error occured",
        });

    }

};

//add new product
const addNewProduct = async(req,res)=>{
    try{
        const{
            image,
            title,
            description,
            category,
            gender,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;
        const newlyCreatedProduct = new product({
            image,
            title,
            description,
            category,
            gender,
            brand,
            price,
            salePrice,
            totalStock,
        })

        await newlyCreatedProduct.save();

        res.status(201).json({
            success : true,
            data : newlyCreatedProduct,
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message :"Error occures",
        });
    }
};


//fetch all products
const fetchAllProducts = async(req,res)=>{
     try{

        const listOfProducts = await product.find({});
        res.status(200).json({
            success : true,
            data: listOfProducts,
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message :"Error occures",
        });
    }

}

//edit product
const editProduct = async(req,res)=>{
     try{
        const {id} = req.params;
        const{
            image,
            title,
            description,
            category,
            gender,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        const findProduct = await product.findById(id);
        if(!findProduct)
             return res.status(404).json({
             success : false,
             message : "product not found",
            });
            
            findProduct.image = image || findProduct.image;
            findProduct.title = title || findProduct.title;
            findProduct.description = description || findProduct.description;
            findProduct.category = category || findProduct.category;
            findProduct.gender = gender || findProduct.gender;
            findProduct.brand = brand || findProduct.brand;
            findProduct.price = price || findProduct.price;
            findProduct.salePrice = salePrice || findProduct.salePrice;
            findProduct.totalStock = totalStock || findProduct.totalStock;

        await findProduct.save();

        res.status(200).json({
            success : true,
            data : findProduct,
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message :"Error occures",
        });
    }

}

//delete products
const deleteProduct = async(req,res)=>{
     try{
         const {id} = req.params;
         const deletedProduct = await product.findByIdAndDelete(id);
         if(!deletedProduct)
             return res.status(404).json({
                 success : false,
                 message : "product not found",
             });

             res.status(200).json({
                success : true,
                message: 'product deleted successfully',
             });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message :"Error occures",
        });
    }

}



module.exports={handleImageUpload , addNewProduct , fetchAllProducts, editProduct , deleteProduct};