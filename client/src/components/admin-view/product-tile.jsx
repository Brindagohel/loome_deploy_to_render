import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  setUploadedImageUrl,  // ✅ new prop
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image || '/placeholder.png'}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = '/placeholder.png';  // ✅ fallback for broken images
            }}
          />
        </div>

        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            {/* ✅ fixed strikethrough logic */}
            <span className={`text-lg font-semibold ${
              product?.salePrice > 0
                ? 'line-through text-gray-400'
                : 'text-primary'
            }`}>
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button className= "bg-black text-white" onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
            setUploadedImageUrl(product?.image);  // ✅ fix edit image state
          }}>
            Edit
          </Button>
          <Button  className= "bg-black text-white" onClick={() => handleDelete(product?._id)}>
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;