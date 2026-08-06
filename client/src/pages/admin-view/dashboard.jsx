import React, { useEffect, useState } from 'react';
import ProductImageUpload from '@/components/admin-view/imageUp';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFeatureImages,
  getFeatureImages,
  deleteFeatureImage,
} from '@/store/common-slice';
import { Trash2 } from 'lucide-react';

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const dispatch = useDispatch();

  function handleUploadFeatureImage() {
    // don't allow adding if no image has been uploaded
    if (!uploadedImageUrl) {
      alert('Please select and upload an image first!');
      return;
    }

    dispatch(addFeatureImages(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setUploadedImageUrl('');
        setImageFile(null);
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Upload feature images
          </h1>
          <p className="text-sm text-slate-500">
            These images are used for the storefront's feature banners.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProductImageUpload
            file={imageFile}
            setFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="mt-5 w-full"
            disabled={!uploadedImageUrl || imageLoadingState}
          >
            Upload
          </Button>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureImageList
              ?.filter((item) => item.image)
              .map((item) => (
                <div key={item._id} className="relative group">
                  <img
                    src={item.image}
                    alt="Feature"
                    className="w-full h-[300px] object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                  <Button
                    onClick={() => handleDeleteFeatureImage(item._id)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-90 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;