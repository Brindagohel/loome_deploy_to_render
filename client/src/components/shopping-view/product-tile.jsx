import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { brandOptionMap, categoryOptionMap } from "@/config";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, deleteWishlistItem, fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { useToast } from "@/hooks/use-toast";


function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart }) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { user } = useSelector((state) => state.auth);
    const { wishlistItems } = useSelector((state) => state.shopWishlist);

    const isInWishlist = wishlistItems?.items?.some(
        (item) => item.productId === product?._id
    );

    function handleToggleWishlist(event) {
        event.stopPropagation();

        if (!user?.id) return;

        if (isInWishlist) {
            dispatch(deleteWishlistItem({ userId: user.id, productId: product?._id })).then((data) => {
                if (data?.payload?.success) {
                    toast({ title: "Removed from wishlist" });
                }
            });
        } else {
            dispatch(addToWishlist({ userId: user.id, productId: product?._id })).then((data) => {
                if (data?.payload?.success) {
                    toast({ title: "Added to wishlist" });
                }
            });
        }
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img src={product?.image}
                         alt={product?.title}
                         className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    <button
                        onClick={handleToggleWishlist}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
                    >
                        <Heart
                            className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                    </button>
                    {   
                        product?.totalStock === 0 ?(
                            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-card-red-600">Out of Stock</Badge> 
                        ) : product?.totalStock < 10 ? (
                            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-card-red-600">{`Only ${product?.totalStock} items left`}</Badge>
                        ) :  product?.salePrice > 0 ?
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-card-red-600">Sale</Badge> : null
                    }
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[16px] text-muted-foreground">{categoryOptionMap[product?.category]}</span>
                        <span className="text-[16px] text-muted-foreground">{brandOptionMap[product?.brand]}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-primary`}>${product?.price}</span>
                        {
                            product?.salePrice > 0 ?
                            <span className="text-lg font-semibold text-primary">${product?.salePrice}</span>
                            : null
                        }
                    </div>
                </CardContent>
            </div>
            <CardFooter className="p-4">
                {
                    product?.totalStock === 0 ?
                      (<Button
                    className="w-full bg-black text-white opacity-65 cursor-not-allowed "
                   
                >
                    Out of Stock
                </Button>) : (
                    <Button
                    className="w-full bg-black text-white"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleAddToCart(product?._id , product?.totalStock);
                    }}
                >
                    Add to cart
                </Button>
                )
                }
                
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;