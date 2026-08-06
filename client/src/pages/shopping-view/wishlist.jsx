import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistItems, deleteWishlistItem } from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function ShoppingWishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useSelector((state) => state.auth);
    const { wishlistItems, isLoading } = useSelector((state) => state.shopWishlist);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchWishlistItems({ userId: user.id }));
        }
    }, [dispatch, user?.id]);

    function handleRemove(productId) {
        dispatch(deleteWishlistItem({ userId: user.id, productId })).then((data) => {
            if (data?.payload?.success) {
                toast({ title: "Removed from wishlist" });
            }
        });
    }

    function handleAddToCart(productId, totalStock) {
        if (totalStock === 0) {
            toast({ title: "This item is out of stock", variant: "destructive" });
            return;
        }

        dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems({ userId: user?.id }));
                toast({ title: "Added to cart" });
            }
        });
    }

    const items = wishlistItems?.items || [];

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-2xl font-black tracking-tight text-neutral-900">
                Your Wishlist
            </h1>

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center">
                    <p className="text-sm text-gray-500">
                        Nothing saved yet. Tap the heart icon on any product to add it here.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/shop/listing")}>
                        Browse products
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-48 w-full rounded-xl object-cover"
                            />
                            <div className="mt-3 flex-1">
                                <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className={`font-semibold text-gray-900 ${item.salePrice > 0 ? "line-through text-gray-400" : ""}`}>
                                        ${item.price}
                                    </span>
                                    {item.salePrice > 0 && (
                                        <span className="font-semibold text-gray-900">${item.salePrice}</span>
                                    )}
                                </div>
                                {item.totalStock === 0 && (
                                    <span className="mt-1 inline-block text-xs font-medium text-red-500">Out of stock</span>
                                )}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <Button
                                    className="flex-1 bg-black text-white"
                                    disabled={item.totalStock === 0}
                                    onClick={() => handleAddToCart(item.productId, item.totalStock)}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemove(item.productId)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShoppingWishlist;
