const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require("../../models/products");
const Coupon = require("../../models/Coupon");



const createOrder = async(req,res)=>{
    try{
      const {
                userId  , userName , cartItems , 
                addressInfo , 
                orderStatus ,
                paymentMethod , 
                paymentStatus ,
                totalAmount  ,
                orderDate  ,
                orderUpdateDate  ,
                paymentId  ,
                payerId ,
                cartId ,
                couponCode ,
                discountAmount
            } = req.body;

    const numericDiscount = Number(discountAmount) || 0;
    const numericTotal = Number(totalAmount) || 0;

    const paypalItems = cartItems.map(item =>({
        name : item.title,
        sku : item.productId,
        price : item.price.toFixed(2),
        currency : 'USD',
        quantity : item.quantity
   }));

    // PayPal requires sum(item price * quantity) to exactly equal amount.total.
    // Since totalAmount here is already discounted but individual item prices
    // are not, we represent the coupon as a negative line item so the math
    // still balances out - otherwise PayPal rejects the request with a
    // VALIDATION_ERROR (400).
    if (numericDiscount > 0) {
        paypalItems.push({
            name: `Discount${couponCode ? ` (${couponCode})` : ''}`,
            sku: 'DISCOUNT',
            price: (-numericDiscount).toFixed(2),
            currency: 'USD',
            quantity: 1
        });
    }

    const create_payment_json ={
        intent : 'sale',
        payer : {
            payment_method : 'paypal'
        },
        redirect_urls : {
            return_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
            cancel_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
        },
        transactions : [
            {
                item_list : {
                    items : paypalItems
                },
                amount : {
                    currency : 'USD',
                    total : numericTotal.toFixed(2)
                },
                description : ''
            }
        ]

    };
   
    paypal.payment.create(create_payment_json , async(error , paymentInfo)=>{
        if(error){
            console.log(error);

            return res.status(500).json({
                success : false,
                message : 'Error while creating paypal payment'
            })
        }else{
            const newlyCreatedOrder = new Order({
                userId,
                userName,
                cartItems , 
                addressInfo , 
                orderStatus ,
                paymentMethod , 
                paymentStatus ,
                totalAmount  ,
                orderDate  ,
                orderUpdateDate  ,
                paymentId  ,
                payerId ,
                cartId ,
                couponCode ,
                discountAmount

            })

            await newlyCreatedOrder.save();

            const approvalURL = paymentInfo.links.find(link=> link.rel === 'approval_url').href;

            res.status(201).json({
                success : true,
                approvalURL,
                orderId : newlyCreatedOrder._id,
            })


        }
    })



    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : 'Some Error Occured!'
        });
    }
};

const capturePayment = async(req,res)=>{
    try{

        const {paymentId , payerId , orderId } = req.body;

        let order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({
                success : false ,
                message : 'order can not br found'
            })
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId);

            if(!product){
                return res.status(404).json({
                    success : false,
                    message : `Not enough stock for this product ${product.title}`
                })
            }
            
            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId)

        if(order.couponCode){
            await Coupon.findOneAndUpdate(
                { code: order.couponCode },
                { $inc: { usedCount: 1 } }
            );
        }

        await order.save();

        res.status(200).json({
            success : true,
            message : 'Order Confirmed',
            data : order,
        })




    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : 'Some Error Occured!'
        });
    }
};

const getAllOrdersByUser = async(req,res)=>{
    try{
        const {userId} = req.params;

        const orders = await Order.find({userId});

        if(!orders.length){
            return res.status(404).json({
                success :  false,
                message : 'no orders found'
            })
        }

        res.status(200).json({
            success : true,
            data : orders
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : 'Some Error Occured!'
        });

    }
}

const getOrderDetails = async(req,res)=>{
    try{
         const {id} = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success :  false,
                message : 'Order not found'
            })
        }

         res.status(200).json({
            success : true,
            data : order
        })



    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : 'Some Error Occured!'
        });

    }
}

module.exports  = {createOrder , capturePayment , getAllOrdersByUser , getOrderDetails};