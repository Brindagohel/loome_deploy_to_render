const Product = require('../../models/products')

const getFilteredProducts = async (req , res) => {
    try{

        const { category, brand, sortBy = "price-lowtohigh" } = req.query;

        let filters = {};

        if(category && category.length){
            filters.category = {$in: category.split(',')}
        }

         if(brand && brand.length){
            filters.brand = {$in: brand.split(',')}
        }

        let sort = {}

        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1

                break;

            case 'price-hightolow':
                sort.price = -1

                break;

            case 'title-atoz':
                sort.title = 1

                break;
            
            case 'title-ztoa':
                sort.title = -1

                break;

                default:
                    sort.price = 1
                    break;
            


        }


        const products = await Product.find(filters).sort(sort);

        res.status(200).json({
            success : true,
            data : products,
        });

    }catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Eroor Occurred",

        });
    }
};

const mongoose = require('mongoose');

const getProductDetails = async(req,res)=>{
    try{

        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product id'
            });
        }


        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            success : false ,
            message : 'product not found!'
        })

        res.status(200).json({
            success : true ,
            data : product
        });


    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Eroor Occurred",

        });
    }
}

module.exports = {getFilteredProducts , getProductDetails};