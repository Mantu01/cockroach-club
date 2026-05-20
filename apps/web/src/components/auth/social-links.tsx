'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Provider, socialProviders } from '@/lib/constants/social-icons';
import { useAuth } from '@/context/auth-context';

interface SocialLoginsProps {
  providers?: Provider[];
  mode: 'login' | 'signup';
}

export default function SocialLogins({
  providers = ['google', 'github', 'x', 'facebook'],
}: SocialLoginsProps) {
  const { loadingStates, handleSocialLogin } = useAuth();

  const getGridCols = () => {
    if (providers.length <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (providers.length <= 4) return 'grid-cols-2';
    if (providers.length <= 6) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className={`grid ${getGridCols()} gap-3`}>
        {providers.map((providerKey) => {
          const provider = socialProviders[providerKey];
          if (!provider) return null;

          const IconComponent = provider.icon;
          const isProviderLoading = loadingStates[providerKey];

          return (
            <Button
              key={providerKey}
              variant="outline"
              type="button"
              disabled={isProviderLoading}
              onClick={() => handleSocialLogin(providerKey)}
              className={`flex cursor-pointer items-center justify-center gap-2 h-11 px-4 transition-all duration-300 hover:shadow-md ${provider.borderColor} ${provider.bgColor} disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden `}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              {isProviderLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <IconComponent size={20} className="shrink-0" />
              )}

              <span className="font-medium text-sm truncate">{provider.name}</span>
            </Button>
          );
        })}
      </div>

      {providers.length > 4 && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Choose your preferred sign-in method</p>
        </div>
      )}
    </div>
  );
}
