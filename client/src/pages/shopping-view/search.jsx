import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getSearchResults, resetSearchResult } from "@/store/shop/search-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/hooks/use-toast";
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim().length >= 3) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResult());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive", // fixed typo: 'desructive' -> 'destructive'
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const hasSearched = keyword.trim().length >= 3;

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword} // now a controlled input
            className="py-6"
            placeholder="Search Products..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      </div>

      {hasSearched && !searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No Result found!</h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
            key={item._id}
            product={item}
          />
        ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      
      />
    </div>
  );
}

export default SearchProducts;