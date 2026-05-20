'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs/legacy'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Loader from '@/components/ui/loader'

export default function Page() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return <Loader />
  }

  if (!signUp.id) {
    router.push('/login')
    return null
  }

  const status = signUp?.status
  const missingFields = signUp?.missingFields ?? []

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await signUp?.update(formData)
      if (res?.status === 'complete') {
        await setActive({
          session: res.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              router.push('/dashboard')
              return
            }
            router.push('/dashboard')
          },
        })
      }
    } catch (err: unknown) {
      const error = err as ClerkError
      toast.error(error.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'missing_requirements') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border border-border/30 bg-background/95 shadow-xl">
          <CardHeader className="space-y-4 px-8 py-8">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
              <CardDescription className="text-sm text-muted-foreground/90">
                Please provide the required information to finish signing up.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {missingFields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-sm font-medium capitalize">
                    {field.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={field}
                    type="text"
                    value={formData[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              ))}
              <div id="clerk-captcha" className="my-4" />
              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Continue
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div id="clerk-captcha" className="w-full max-w-md rounded-3xl border border-border/30 bg-muted/10 p-10 text-center text-muted-foreground" />
    </div>
  )
}
