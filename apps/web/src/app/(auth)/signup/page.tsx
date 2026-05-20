import AuthForm, { InputFieldTypes } from "@/components/auth/auth-form";

const signupFields: InputFieldTypes[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    label: 'Email Address'
  },
  {
    name:'username',
    type:'text',
    placeholder:'Enter username',
    label:'username'
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password'
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
    label: 'Confirm Password'
  },
];

export default function SignupPage() {

  return (
    <AuthForm 
      mode="signup" 
      inputFields={signupFields} 
    />
  );
}