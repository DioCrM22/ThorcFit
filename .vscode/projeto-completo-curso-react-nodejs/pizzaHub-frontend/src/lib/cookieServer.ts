import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCookieServer(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    redirect('/')
  }

  return token
}