import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

function AddressCard({
    addressInfo,
    setcurrentSelectedAddress,
    selectedId,
    handleEditAddress,
    handleDeleteAddress
}) {
    return (
        <Card
            onClick={() => setcurrentSelectedAddress?.(addressInfo)}
            className={`cursor-pointer border p-3 h-48 flex flex-col justify-between overflow-hidden ${
                selectedId === addressInfo._id ? "border-red-900 border-2" : "border-black"
            }`}
        >
            <CardContent className="grid gap-1 p-0 text-sm overflow-hidden">
                <Label className="truncate">Address: {addressInfo?.address}</Label>
                <Label className="truncate">City: {addressInfo?.city}</Label>
                <Label className="truncate">Pincode: {addressInfo?.pincode}</Label>
                <Label className="truncate">Phone: {addressInfo?.phone}</Label>
                <Label className="truncate">Notes: {addressInfo?.notes}</Label>
            </CardContent>

            <div className="flex justify-between items-center mt-2">
                <Button
                    size="sm"
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addressInfo);
                    }}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addressInfo);
                    }}
                >
                    Delete
                </Button>
            </div>
        </Card>
    );
}

export default AddressCard;