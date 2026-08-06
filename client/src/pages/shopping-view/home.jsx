import women from '../../assets/women.png';
import mens from '../../assets/mens.png';
import acce from '../../assets/acce.png';
import kids from '../../assets/kids.png';


import  womencat from '../../assets/womencat.jpg';
import mencategory from '../../assets/mencategory.jpg';
import kidscategory from '../../assets/kidscategory.jpg';
import accecategory from '../../assets/accecategory.jpg';
import footwearcategory from '../../assets/footwearcategory.jpeg';


import  nike from '../../assets/brand/nike.jpg';
import  addidas from '../../assets/brand/addidas.webp';
import  puma from '../../assets/brand/puma.jpg';
import  lavis from '../../assets/brand/lavis.jpg';
import  zara from '../../assets/brand/zara.webp';
import  hm from '../../assets/brand/hm.jpg';




import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpRightIcon, HeartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';

import { getFeatureImages } from '@/store/common-slice';

const categoriesWithIcon = [
  { id: "men", label: "Men", count: "128 items", image:  mencategory},
  { id: "women", label: "Women", count: "204 items", image: womencat },
  { id: "kids", label: "Kids", count: "86 items", image: kidscategory },
  { id: "accessories", label: "Accessories", count: "57 items", image: accecategory },
  { id: "footwear", label: "Footwear", count: "73 items", image: footwearcategory },
];

// Real trademarked logos (Nike, Adidas, etc.) can't be bundled here —
// drop your own licensed SVG/PNG logo assets in and swap `label` rendering
// for an <img src={brandItem.logo} /> when you have them.
const brandsWithIcons = [
  { id: "nike", label: "Nike", image: nike },
  { id: "adidas", label: "Adidas", image: addidas },
  { id: "puma", label: "Puma", image: puma },
  { id: "levi", label: "Levi's", image: lavis },
  { id: "zara", label: "Zara", image: zara },
  { id: "h&m", label: "H&M", image: hm },
];

function ShoppingHome() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(state => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {featureImageList} = useSelector(state=> state.commonFeature);


  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section]: [getCurrentItem.id]
    };

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast({
          title: "Product added to cart",
        })
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  // Guard against an empty/not-yet-loaded featureImageList, and re-run
  // this effect whenever the list changes so the interval always uses
  // the current length instead of a stale closure from mount.
  useEffect(() => {
    if (!featureImageList || featureImageList.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % featureImageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
  }, [dispatch])

  useEffect(()=>{
    dispatch(getFeatureImages());
  },[dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 transition-colors">

      {/* HERO SLIDER */}
      <div className="relative w-full aspect-[1920/800] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {
          featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={slide?._id || index}
                alt={`Slide ${index}`}
                className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                  } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
            </div>
          )
        }

        <Button variant="outline" size="icon"
          onClick={() =>
            setCurrentSlide(prevSlide =>
              featureImageList && featureImageList.length
                ? (prevSlide - 1 + featureImageList.length) % featureImageList.length
                : 0
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full">
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() =>
            setCurrentSlide(prevSlide =>
              featureImageList && featureImageList.length
                ? (prevSlide + 1) % featureImageList.length
                : 0
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full">
          <ChevronRightIcon className='w-4 h-4' />
        </Button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {featureImageList?.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY — image cards instead of icon tiles */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 mb-2">
            Browse
          </p>
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">Shop By Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
              categoriesWithIcon.map((categoryItem) => (
                <div
                  onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                  key={categoryItem.id}
                  className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={categoryItem.image}
                    alt={categoryItem.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <ArrowUpRightIcon className="w-4 h-4 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold text-lg leading-tight">{categoryItem.label}</p>
                    <p className="text-xs text-white/75 mt-0.5">{categoryItem.count}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND — single bordered strip, styled wordmarks instead of icons */}

      <section className="py-16 bg-neutral-50 dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 mb-2">
           Trusted labels
          </p>
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">Shop By brand</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {
              brandsWithIcons.map((brandItem) => (
                <div
                  onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                  key={brandItem.id}
                  className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={brandItem.image}
                    alt={brandItem.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <ArrowUpRightIcon className="w-4 h-4 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold text-lg leading-tight">{brandItem.label}</p>
                    <p className="text-xs text-white/75 mt-0.5">{brandItem.count}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
      
      {/* FEATURE PRODUCTS */}
      <section className='py-16 bg-neutral-50 dark:bg-neutral-900 transition-colors'>
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 mb-2">
            Curated
          </p>
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">Feature Products</h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {
                    productList && productList.length > 0 ?
                      productList.slice(0, 8).map(productItem => (
                        <ShoppingProductTile
                          handleGetProductDetails={handleGetProductDetails}
                          handleAddToCart={handleAddToCart}
                          key={productItem._id || productItem.id} product={productItem} />
                      )) : null
                  }
                </div>

                {productList && productList.length > 8 && (
                  <div className="flex justify-center mt-10">
                    <Button
                      onClick={() => navigate("/shop/listing")}
                      className="rounded-full bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 px-8"
                    >
                      View All Products
                    </Button>
                  </div>
                )}
        </div>
      </section>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />

    </div>
  )
}
export default ShoppingHome;