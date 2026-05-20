"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function InputOTPControlled() {
  const [value, setValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router=useRouter();

  const {signUp,isLoaded,setActive}=useSignUp();

  useEffect(() => {
    if (value.length === 6) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [value]);

  const handleVerify =async () => {
    if(!isLoaded){
      return;
    }
    setIsLoading(true);
    try {
      const signupAttent=await signUp.attemptEmailAddressVerification({code:value});
      if(signupAttent.status==='complete'){
        await setActive({
          session:signupAttent.createdSessionId
        });
        toast.success('Verified Successfully');
        setTimeout(()=>router.push('/credits'),300);
      }else if(signupAttent.status==='abandoned'){
        toast.error("Signup process was abandoned. Please try again.");
      }
    } catch (err:unknown) {
      const error=err as ClerkError;
      toast.error(error.errors[0].longMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit verification code sent to your email ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
              disabled={isLoading}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index} 
                    className="w-12 h-12 text-lg border-2 rounded-lg transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={!isComplete || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <p>For your security, we require two-factor authentication</p>
            <p className="mt-1">Haven&apos;t received the code? Check your spam folder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}