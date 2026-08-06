import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewAddress,
    fetchAllAddresses,
    editaAddress,
    deleteAddress
} from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./address-card"; // adjust path to match your file structure


const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
};

function Address({ setcurrentSelectedAddress, currentSelectedAddress }) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const { toast } = useToast();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchAllAddresses(user.id));
        }
    }, [dispatch, user]);

    function handleManageAddress(event) {
        event.preventDefault();

        if (currentEditedId === null && addressList.length >= 3) {
            setFormData(initialAddressFormData);
            toast({
                title: "You can add max 3 addresses",
                variant: "destructive",
            });
            return;
        }

        if (currentEditedId !== null) {
            dispatch(editaAddress({
                userId: user?.id,
                addressId: currentEditedId,
                formData
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address updated successfully",
                    });
                }
            });
        } else {
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address added successfully",
                    });
                }
            });
        }
    }

    function handleEditAddress(item) {
        setCurrentEditedId(item._id);
        setFormData({
            address: item.address,
            city: item.city,
            phone: item.phone,
            pincode: item.pincode,
            notes: item.notes
        });
    }

    function handleDeleteAddress(item) {
        dispatch(deleteAddress({
            userId: user?.id,
            addressId: item._id
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully",
                });
            }
        });
    }

    function isFormValid() {
        return Object.keys(formData)
            .map((key) => formData[key].trim() !== "")
            .every((item) => item);
    }

    return (
        <Card>
            <CardContent className="grid grid-cols-2 gap-3 mt-3">
                {addressList && addressList.length > 0
                    ? addressList.map((item) => (
                        <AddressCard
                            key={item._id}
                            addressInfo={item}
                            setcurrentSelectedAddress={setcurrentSelectedAddress}
                            selectedId={currentSelectedAddress?._id}
                            handleEditAddress={handleEditAddress}
                            handleDeleteAddress={handleDeleteAddress}
                        />
                    ))
                    : <p>No addresses found</p>}
            </CardContent>

            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? "Edit Address" : "Add New Address"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? "Update" : "Add"}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    );
}

export default Address;