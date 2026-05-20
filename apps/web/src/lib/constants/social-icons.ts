import { AppleIcon, FacebookIcon, GithubIcon, GoogleIcon, InstagramIcon, LinkedinIcon, MicrosoftIcon, XIcon } from "@/components/auth/icons";

export type Provider = 'google' | 'github' | 'apple' | 'microsoft' | 'facebook' | 'x' | 'linkedin' | 'instagram';

export interface ProviderProps {
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  bgColor: string;
  borderColor: string;
}

export const socialProviders: Record<Provider, ProviderProps> = {
  google: {
    name: 'Google',
    icon: GoogleIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-400'
  },
  github: {
    name: 'GitHub',
    icon: GithubIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  apple: {
    name: 'Apple',
    icon: AppleIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  microsoft: {
    name: 'Microsoft',
    icon: MicrosoftIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-400'
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-600'
  },
  x: {
    name: 'X',
    icon: XIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-700'
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    bgColor: 'hover:bg-pink-50',
    borderColor: 'border-gray-300 hover:border-pink-400'
  }
};