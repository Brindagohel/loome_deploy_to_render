import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar.jsx";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StartRatingComponent from "../common/start-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useEffect, useState } from "react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    const [reviewMsg, setReviewMsg] = useState('');
    const [rating, setRating] = useState(0);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews } = useSelector((state) => state.shopReview);
    const { toast } = useToast();

    // Compute the average rating from all reviews (falls back to 0)
    const averageReview =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, item) => sum + (item.reviewValue || 0), 0) / reviews.length
            : 0;

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    function handleAddReview() {
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        })).then(data => {
            if (data?.payload?.success) {
                dispatch(getReviews(productDetails?._id));
                toast({
                    title: 'Review added successfully'
                });
                setRating(0);
                setReviewMsg('');
            }
        });
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        const getCartItems = cartItems?.items || [];

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: 'destructive'
                    });
                    return;
                }
            }
        }

        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems({ userId: user?.id }));
                toast({ title: "Product added to cart" });
            }
        });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg('');
    }

    useEffect(() => {
        if (productDetails !== null && productDetails?._id) {
            dispatch(getReviews(productDetails._id));
        }
    }, [productDetails]);

   

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white text-black">
                {/* LEFT: image */}
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>

                {/* RIGHT: everything else, single column */}
                <div className="flex flex-col">
                    <div className="grid gap-1">
                        <DialogTitle className="text-3xl font-extrabold">
                            {productDetails?.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {productDetails?.description}
                        </DialogDescription>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${productDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                   
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(averageReview) ? 'fill-primary' : 'fill-none text-muted-foreground'}`}
                                />
                            ))}
                        </div>
                        <span className="text-muted-foreground">
                            ({averageReview.toFixed(1)})
                        </span>
                    </div>

                    <div className="mt-5 mb-5">
                        {
                            productDetails?.totalStock === 0 ?
                                <Button className="w-full bg-black text-white opacity-60 cursor-not-allowed">Out of Stock</Button> :
                                <Button onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)} className="w-full bg-black text-white">Add to Cart</Button>
                        }
                    </div>

                    <Separator />

                    <div className="mt-5">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>

                        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-2">
                            {
                                reviews && reviews.length > 0 ?
                                    reviews.map(reviewItem =>
                                        <div className="flex gap-4" key={reviewItem?._id}>
                                            <Avatar className="w-10 h-10 border bg-gray-200 shrink-0">
                                                <AvatarFallback>
                                                    {reviewItem?.userName?.[0]?.toUpperCase() || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <h3 className="font-bold">{reviewItem?.userName}</h3>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            className={`w-4 h-4 ${i < (reviewItem?.reviewValue || 0) ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                            </div>
                                        </div>
                                    ) : <h1>No review</h1>
                            }
                        </div>

                        <div className="mt-10 flex-col gap-2">
                            <Label>Write a review</Label>
                            <div className="flex gap-2">
                                <StartRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                            </div>
                            <Input
                                name="reviewMsg"
                                value={reviewMsg}
                                onChange={(event) => setReviewMsg(event.target.value)}
                                placeholder="write a review..."
                            />
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === "" || rating === 0}
                                className="bg-black text-white"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;