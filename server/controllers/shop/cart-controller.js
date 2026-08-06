const Cart = require("../../models/Cart");
const Product = require("../../models/products");


const addToCart = async (req, res) => {
    try{
        const { userId, productId, quantity } = req.body;


//check invalid input
        if(!userId || !productId || !quantity){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            })
        }

// product not present in the database then we retryn product not found

     const product = await Product.findById(productId);
     if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found",
        })
     }   

// find the cart
     let cart = await Cart.findOne({ userId });
     if(!cart){
        cart = new Cart({
            userId,
            items: []
        });
     }
//if cart not present then create a new cart and add the product to the cart
     const findCurrentProductIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    console.log("cart.items:", cart.items);
    console.log("findCurrentProductIndex:", findCurrentProductIndex);

// if already present then update the quantity
    if(findCurrentProductIndex === -1){
         cart.items.push({ productId, quantity });

    }else{
        cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: cart
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error"
        })
    }


}

const fetchCartItems = async (req, res) => {
    try{

        const { userId } = req.params;

// check if userId is present or not
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "id is madondatory",
            });
        }
//find cart

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice"
        })
//if cart not present
       //if cart not present, return an empty cart instead of an error
        if(!cart){
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                data: { items: [] },
            });
        }

// validate cart

       const validItems = cart.items.filter(productItem=> productItem.productId);
       if(validItems.length < cart.items.length){
        cart.items = validItems;
        await cart.save();
       }

       const populateCartItems = validItems.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title, 
        image: item.productId.image,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity
       }));

       res.status(200).json({
        success: true,
        message: "Cart items fetched successfully",
        data: {
            ...cart._doc,
            items: populateCartItems,
        }
       })



    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error"
        })
    }


}

const updateCartItemQty = async (req, res) => {
    try{

        const { userId, productId } = req.params;
        const { quantity } = req.body;


//check invalid input
        if(!userId || !productId || !quantity){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            })
        }

//find cart
        const cart = await Cart.findOne({ userId });
 
// if ccart not present
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

// get item index
        const findCurrentProductIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );
        
// check if item is present in the cart or not
        if(findCurrentProductIndex === -1){
            return res.status(404).json({
                success: false,
                message: "cart items not present",
            });
        }

// update the quantity
        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();  
        
        await cart.populate({  
            path: "items.productId",
            select: "image title price salePrice"
        });
        
        const populateCartItems = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        title: item.productId ? item.productId.title : null,
        image: item.productId ? item.productId.image : null,
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity
       }));

       res.status(200).json({       
        success: true,
        message: "Cart item quantity updated successfully",
        data: {
            ...cart._doc,
            items: populateCartItems,
        }
       })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error"
        })
    }


}
const deleteCartItem = async (req, res) => {
    try{

        const { userId, productId } = req.params;

//check invalid input
        if(!userId || !productId){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            })
        }

        const cart = await Cart.findOne({ userId }).populate({  
                path: "items.productId",
                select: "image title price salePrice"
        });

      
// if cart not present
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter((item) =>
             item.productId && item.productId._id.toString() !== productId
            );
        await cart.save();

        await cart.populate({   
                path: "items.productId",
                select: "image title price salePrice"
        });

        const populateCartItems = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        title: item.productId ? item.productId.title : null, 
        image: item.productId ? item.productId.image : null,
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity
       }));

       res.status(200).json({       
        success: true,
        message: "Cart item deleted successfully",
        data: {
            ...cart._doc,
            items: populateCartItems,
        }
       })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error"
        })
    }


}

module.exports = { addToCart, fetchCartItems, updateCartItemQty, deleteCartItem }