import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import logo from "../../assets/logo.png";

function AuthLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData))
      .unwrap()
      .then((data) => {
        if (data?.success) {
          toast({
            title: data?.message,
          });

          // ✅ redirect based on role
          if (data?.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }

        } else {
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: error?.message || "Login failed!",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Login to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            to="/auth/register"
            className="font-medium ml-2 text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonText="Login"
      />
    </div>
  );
}

export default AuthLogin;