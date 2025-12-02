// app/dashboard/page.tsx - ATUALIZADO
import { Orders } from "./components/orders";
import { api } from '@/service/api'
import { getCookieServer } from '@/lib/cookieServer'
import { OrderProps } from '@/lib/order.type'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function getOrders(): Promise<OrderProps[]> {
  try {
    const token = await getCookieServer();

    const response = await api.get("/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data;

  } catch (err: any) {
    console.log('❌ ERRO em getOrders:', {
      status: err.response?.status,
      message: err.response?.data?.message || err.message
    });

    if (err.response?.status === 401) {
      console.log('🔄 Redirecionando para login...');
      
      const cookieStore = await cookies();
      cookieStore.delete('session');
      
      redirect('/');
    }

    return [];
  }
}

export default async function Dashboard() {
  const orders = await getOrders();
  const token = await getCookieServer();

  return <Orders orders={orders} token={token} />
}