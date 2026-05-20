'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HTMLInputTypeAttribute, useState } from 'react';
import { loginSchema, LoginSchemaType, signupSchema, SignupSchemaType } from '@/lib/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Logo from '../logo/logo';
import Link from 'next/link';
import { InputOTPControlled } from './otp';
import SocialLogins from './social-links';
import { AuthProvider, useAuth } from '@/context/auth-context';

export interface InputFieldTypes {
  name: keyof LoginSchemaType | keyof SignupSchemaType;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  label: string;
}

interface AuthFormProps {
  mode: 'login' | 'signup';
  inputFields: InputFieldTypes[];
}

function FormInput({ mode, inputFields }: AuthFormProps) {
  const schema = mode === 'login' ? loginSchema : signupSchema;

  const form = useForm<LoginSchemaType | SignupSchemaType>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'login'
        ? { email: '', password: '' }
        : { username: '', email: '', password: '', confirmPassword: '' },
  });

  const { handleSubmit, isLoading, verificationPending, showError } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4">
      {verificationPending && (
        <div className="absolute h-[120vh] w-full backdrop-blur-xl z-20">
          <InputOTPControlled />
        </div>
      )}
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden border-0">
        <CardHeader className="space-y-6 px-8 border-b border-border/40">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">
              {mode === 'login'
                ? 'Enter your credentials to access your account'
                : 'Fill in the details to create your account'}
            </CardDescription>
          </div>

          {showError && (
            <div className="flex items-center gap-2 p-3 text-sm border border-destructive/20 bg-destructive/10 text-destructive rounded-lg">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Email not found. Please Signup to create an account.</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {inputFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder={field.placeholder}
                            type={
                              field.name === 'password'
                                ? showPassword
                                  ? 'text'
                                  : 'password'
                                : field.name === 'confirmPassword'
                                  ? showConfirmPassword
                                    ? 'text'
                                    : 'password'
                                  : field.type
                            }
                            {...formField}
                            className="pr-10"
                            disabled={isLoading}
                          />
                          {(field.name === 'password' || field.name === 'confirmPassword') && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={
                                field.name === 'password'
                                  ? togglePasswordVisibility
                                  : toggleConfirmPasswordVisibility
                              }
                              disabled={isLoading}
                            >
                              {field.name === 'password' ? (
                                showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )
                              ) : showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full mt-2" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>
          <SocialLogins mode={mode} providers={['google', 'github']} />
        </CardContent>
        <CardFooter className="flex justify-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" className="p-0 font-medium">
              {mode === 'login' ? (
                <Link href="/signup">Sign Up</Link>
              ) : (
                <Link href="/login">Login</Link>
              )}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthForm({ mode, inputFields }: AuthFormProps) {
  return (
    <AuthProvider mode={mode}>
      <FormInput mode={mode} inputFields={inputFields} />
    </AuthProvider>
  );
}
