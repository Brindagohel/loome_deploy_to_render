import React, { Fragment, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config';
import CommonForm from '@/components/common/form';
import ProductImageUpload from '@/components/admin-view/imageUp';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '@/store/admin/products-slice';
import { useToast } from '@/hooks/use-toast';
import AdminProductTile from '@/components/admin-view/product-tile';

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: '',
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editProduct({
        id: currentEditedId,
        formData,
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl('');
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({ title: 'Product updated successfully' });
        } else {
          toast({ title: 'Failed to update product', variant: 'destructive' });
        }
      });
    } else {
      dispatch(addNewProduct({
        ...formData,
        image: uploadedImageUrl,  // ✅ attach image URL on submit
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setUploadedImageUrl('');
          setFormData(initialFormData);
          toast({ title: 'Product added successfully' });
        } else {
          toast({ title: 'Failed to add product', variant: 'destructive' });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: 'Product deleted successfully' });
      } else {
        toast({ title: 'Failed to delete product', variant: 'destructive' });
      }
    });
  }

  // ✅ FIXED: exclude 'image' from formData check, check uploadedImageUrl instead
  function isFormValid() {
    const allFieldsFilled = Object.keys(formData)
      .filter((key) => key !== 'salePrice' && key !== 'image')
      .map((key) => formData[key] !== '' && formData[key] !== null)
      .every((item) => item);

    return allFieldsFilled && uploadedImageUrl !== '';
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="bg-black text-white hover:bg-gray-800"
        >
          Add New Products
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                product={productItem}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}  // ✅ pass setter
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl('');
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? 'Edit product' : 'Add product'}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            file={imageFile}
            setFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}  // ✅ also block during upload
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;