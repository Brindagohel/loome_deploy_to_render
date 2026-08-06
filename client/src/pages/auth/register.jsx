import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useToast } from "@/hooks/use-toast";

function AuthRegister() {
  const [formData, setFormData] = useState({
    UserName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} =useToast()

  function onSubmit(event) {
  event.preventDefault();

  dispatch(registerUser(formData))
    .unwrap()
    .then((data) => {
      if(data?.success) {
        toast({ title: data?.message });
        navigate("/auth/login");
      }
      else{ 
      toast({ title: data?.message, variant: 'destructive' });
    }
    })
    .catch((error) => {
      console.log("Register Error:", error);
      toast({
        title: "Registration failed!",
        variant: "destructive"
      });
    });
}

  console.log("Form Data:", formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>

        <p className="mt-2">
          Already have an account?
          <Link
            to="/auth/login"
            className="font-medium ml-2 text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonText="Sign Up"
      />
    </div>
  );
}

export default AuthRegister;