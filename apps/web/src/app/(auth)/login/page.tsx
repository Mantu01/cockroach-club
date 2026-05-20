import AuthForm, { InputFieldTypes } from '@/components/auth/auth-form';

const loginFields: InputFieldTypes[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    label: 'Email Address',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
  },
];

export default function LoginPage() {
  return <AuthForm mode="login" inputFields={loginFields} />;
}
