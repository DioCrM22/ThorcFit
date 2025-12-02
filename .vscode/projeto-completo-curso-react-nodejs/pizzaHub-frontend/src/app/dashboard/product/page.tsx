// app/dashboard/product/page.tsx
import { Form } from './components/form'
import { api } from '@/service/api'
import { getCookieServer } from '@/lib/cookieServer'

export default async function Product(){
  const token = await getCookieServer();

  const response = await api.get("/category", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return(
    <Form categories={response.data} initialToken={token} />
  )
}