'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UI_SIZES } from '@/lib/constants/theme';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  const { user } = useUser();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Your message has been sent successfully');
    setSubject('');
    setMessage('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className={UI_SIZES.pageTitle} style={{ fontFamily: "'Syne', sans-serif" }}>
          Contact Us
        </h1>
        <p className={UI_SIZES.pageSubtitle}>
          Send us a message and we will get back to you.
        </p>
      </div>

      <Card className="border border-border/40 bg-muted/5">
        <CardHeader className="px-4 py-3">
          <span className={UI_SIZES.sectionLabel}>Get in Touch</span>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Name</Label>
              <Input
                type="text"
                disabled
                value={user?.fullName ?? user?.username ?? ''}
                className="h-8 text-xs bg-muted/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Email</Label>
              <Input
                type="email"
                disabled
                value={user?.primaryEmailAddress?.emailAddress ?? ''}
                className="h-8 text-xs bg-muted/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Subject</Label>
              <Input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help you?"
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Message</Label>
              <Textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or feedback in detail..."
                className="text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="w-fit h-8 text-[10px] tracking-widest uppercase font-bold"
            >
              <Mail className="size-3.5 mr-2" />
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
