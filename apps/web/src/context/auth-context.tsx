'use client'

import { LoginSchemaType, SignupSchemaType } from "@/lib/validation";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";
import Loader from '@/components/ui/loader'
import { toast } from "sonner";
import { Provider } from "@/lib/constants/social-icons";

interface AuthContext{
  isLoading:boolean,
  verificationPending:boolean,
  showError:boolean,
  handleSubmit:(data: LoginSchemaType | SignupSchemaType)=>void,

  loadingStates:Record<string, boolean>,
  handleSocialLogin: (provider: Provider) => void,
}

const AuthContext=createContext<AuthContext | undefined>(undefined);

export const AuthProvider=({children,mode}:{children:ReactNode,mode:'login' | 'signup'})=>{

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationPending,setVerificationPending]=useState<boolean>(false);
  const {isLoaded: isSignInLoaded,signIn,setActive} = useSignIn();
  const {isLoaded: isSignUpLoaded,signUp} = useSignUp();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const router=useRouter();

  const handleSocialLogin = async (provider: Provider) => {
    setLoadingStates(prev => ({ ...prev, [provider]: true }));
    try {
      if (mode === 'login') {
        if (!isSignInLoaded) {
          toast.error("Login is not ready yet.");
          return;
        }
        await signIn.authenticateWithRedirect({
          strategy: `oauth_${provider}`,
          redirectUrl: '/login',
          redirectUrlComplete: '/dashboard',
        });
        toast.success("Redirecting to login...");
      } else {
        if (!isSignUpLoaded) {
          toast.error("Signup is not ready yet.");
          return;
        }
        await signUp.authenticateWithRedirect({
          strategy: `oauth_${provider}`,
          redirectUrl: '/signup/continue',
          redirectUrlComplete: '/dashboard',
        });
        toast.success("Redirecting to signup...");
      }
    } catch{
      toast.error("Something went wrong during authentication.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [provider]: false }));
    }
  };

  async function handleSubmit(data: LoginSchemaType | SignupSchemaType) {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        if(!isSignInLoaded){
          toast.error("Login is not ready yet.");
          return;
        }
        const loginData=data as LoginSchemaType;
        const loginAttempt=await signIn.create({
          identifier:loginData.email,
          password:loginData.password
        });
        if(loginAttempt.status==='complete'){
          await setActive({
            session:loginAttempt.createdSessionId,
          });
          toast.success('Logged In successful');
          setTimeout(()=>router.push('/'),300);
        }
      } else {
        if(!isSignUpLoaded){
          toast.error("Signup is not ready yet.");
          return;
        }
        const signupData=data as SignupSchemaType;
        await signUp.create({
          username:signupData.username,
          emailAddress:signupData.email,
          password:signupData.password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy:'email_code'
        });
        setVerificationPending(true);
      }
    } catch (err:unknown) {
      const error = err as { errors?: Array<{ message: string }>; message?: string };
      toast.error(error.errors?.[0]?.message ?? error.message ?? "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  if(!isSignInLoaded || !isSignUpLoaded){
    return <Loader/>
  }

  return (
    <AuthContext.Provider value={{
      handleSubmit,
      isLoading,
      verificationPending,
      showError: false,
      handleSocialLogin,
      loadingStates
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(){
  const context=useContext(AuthContext);
   if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context
};