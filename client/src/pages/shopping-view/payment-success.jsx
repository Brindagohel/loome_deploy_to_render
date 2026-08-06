import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-white px-4">
      <Card className="w-full max-w-md rounded-2xl border-emerald-100 shadow-xl shadow-emerald-950/5">
        <CardHeader className="flex flex-col items-center text-center gap-4 pt-10 pb-2">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-emerald-100 animate-ping opacity-75" />
            <span className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500">
              <CheckCircle2 className="h-11 w-11 text-white" strokeWidth={2} />
            </span>
          </div>

          <div className="space-y-1.5">
            <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900">
              Payment successful
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Your order has been confirmed and a receipt is on its way to your inbox.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pb-10 pt-4">
          <Button
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate("/shop/account")}
          >
            View orders
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-slate-500 hover:text-slate-900"
            onClick={() => navigate("/shop")}
          >
            Continue shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;