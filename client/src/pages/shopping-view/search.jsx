import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getSearchResults,
  resetSearchResult,
} from "@/store/shop/search-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCartItems,
  addToCart,
} from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const { searchResults } = useSelector(
    (state) => state.shopSearch
  );

  const { productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const { cartItems } = useSelector(
    (state) => state.shopCart
  );

  const { toast } = useToast();

  // Get keyword from URL when page loads
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");

    if (urlKeyword) {
      setKeyword(urlKeyword);
    }
  }, []);

  // Search products
  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length >= 3) {
      const timer = setTimeout(() => {
        // Update URL
        setSearchParams({ keyword: trimmedKeyword });

        // Get search results
        dispatch(getSearchResults(trimmedKeyword));
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSearchParams({ keyword: trimmedKeyword });
      dispatch(resetSearchResult());
    }
  }, [keyword, dispatch, setSearchParams]);

  // Add product to cart
  function handleAddToCart(
    getCurrentProductId,
    getTotalStock
  ) {
    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) =>
          item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          fetchCartItems({
            userId: user?.id,
          })
        );

        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  // Open product details
  function handleGetProductDetails(
    getCurrentProductId
  ) {
    dispatch(
      fetchProductDetails(getCurrentProductId)
    );
  }

  // Open product details dialog when product details are available
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  const hasSearched = keyword.trim().length >= 3;

  /*
    ------------------------------------------------
    FIX FOR MEN'S / WOMEN'S SEARCH
    ------------------------------------------------

    "men" exists inside "women".

    Example:

    women
      ↑
    contains "men"

    Therefore, when the user searches:
      men
      men's

    we check the PRODUCT CATEGORY instead of
    checking only the product title.
  */

  const filteredSearchResults = searchResults.filter(
    (product) => {
      const searchKeyword =
        keyword.trim().toLowerCase();

      // Men's search
      if (
        searchKeyword === "men" ||
        searchKeyword === "men's"
      ) {
        return (
          product.category?.trim().toLowerCase() ===
          "men"
        );
      }

      // Women's search
      if (
        searchKeyword === "women" ||
        searchKeyword === "women's"
      ) {
        return (
          product.category?.trim().toLowerCase() ===
          "women"
        );
      }

      // For all other searches,
      // keep backend search results unchanged.
      return true;
    }
  );

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            className="py-6"
            placeholder="Search Products..."
            onChange={(event) =>
              setKeyword(event.target.value)
            }
          />
        </div>
      </div>

      {/* No Results */}
      {hasSearched &&
      !filteredSearchResults.length ? (
        <h1 className="text-5xl font-extrabold">
          No Result found!
        </h1>
      ) : null}

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {filteredSearchResults.map((item) => (
          <ShoppingProductTile
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={
              handleGetProductDetails
            }
            key={item._id}
            product={item}
          />
        ))}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;