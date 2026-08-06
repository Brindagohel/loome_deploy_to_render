const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/products");

const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const alreadyExists = wishlist.items.some(
            (item) => item.productId.toString() === productId
        );

        if (!alreadyExists) {
            wishlist.items.push({ productId });
            await wishlist.save();
        }

        await wishlist.populate({
            path: "items.productId",
            select: "image title price salePrice totalStock",
        });

        const populatedItems = wishlist.items
            .filter((item) => item.productId)
            .map((item) => ({
                productId: item.productId._id,
                title: item.productId.title,
                image: item.productId.image,
                price: item.productId.price,
                salePrice: item.productId.salePrice,
                totalStock: item.productId.totalStock,
            }));

        res.status(200).json({
            success: true,
            message: alreadyExists ? "Item already in wishlist" : "Item added to wishlist",
            data: {
                ...wishlist._doc,
                items: populatedItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

const fetchWishlistItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "id is mandatory",
            });
        }

        const wishlist = await Wishlist.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice totalStock",
        });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist is empty",
                data: { items: [] },
            });
        }

        const validItems = wishlist.items.filter((item) => item.productId);
        if (validItems.length < wishlist.items.length) {
            wishlist.items = validItems;
            await wishlist.save();
        }

        const populatedItems = validItems.map((item) => ({
            productId: item.productId._id,
            title: item.productId.title,
            image: item.productId.image,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            totalStock: item.productId.totalStock,
        }));

        res.status(200).json({
            success: true,
            message: "Wishlist items fetched successfully",
            data: {
                ...wishlist._doc,
                items: populatedItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

const deleteWishlistItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            });
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.items = wishlist.items.filter(
            (item) => item.productId.toString() !== productId
        );
        await wishlist.save();

        await wishlist.populate({
            path: "items.productId",
            select: "image title price salePrice totalStock",
        });

        const populatedItems = wishlist.items
            .filter((item) => item.productId)
            .map((item) => ({
                productId: item.productId._id,
                title: item.productId.title,
                image: item.productId.image,
                price: item.productId.price,
                salePrice: item.productId.salePrice,
                totalStock: item.productId.totalStock,
            }));

        res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
            data: {
                ...wishlist._doc,
                items: populatedItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

module.exports = { addToWishlist, fetchWishlistItems, deleteWishlistItem };
