import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/app'

export default function DashboardRedirect() {
  redirect(ROUTES.dashboard)
}
