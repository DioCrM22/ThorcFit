// providers/order.tsx - SIMPLES E FUNCIONAL
"use client"
import { createContext, ReactNode, useState } from 'react'
import { api } from '@/service/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export interface OrderItemProps{
  id: string;
  amount: number;
  created_at: string;
  order_id: string;
  product_id: string;
  product:{
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
  };
  order:{
    id: string;
    table: number;
    name: string | null;
    draft: boolean;
    status: boolean;
  }
}

type OrderContextData = {
  isOpen: boolean;
  onRequestOpen: (order_id: string, token: string) => Promise<void>;
  onRequestClose: () => void;
  order: OrderItemProps[];
  finishOrder: (order_id: string, token: string) => Promise<void>;
}

type OrderProviderProps = {
  children: ReactNode;
}

export const OrderContext = createContext({} as OrderContextData)

export function OrderProvider({ children }: OrderProviderProps){
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<OrderItemProps[]>([])
  const router = useRouter();

  async function onRequestOpen(order_id: string, token: string){
    try {
      const response = await api.get("/order/detail", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          order_id
        }
      })

      setOrder(response.data);
      setIsOpen(true);

    } catch (error: any) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do pedido');
    }
  }

  function onRequestClose(){
    setIsOpen(false);
  }

  async function finishOrder(order_id: string, token: string){
    try {
      const requestData = {
        order_id: order_id,
        status: true
      };

      await api.put("/order/finish", requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Pedido finalizado com sucesso!");
      onRequestClose();
      router.refresh();
      
    } catch (err: any) {
      console.error('Erro ao finalizar:', err);
      
      if (err.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
      } else {
        toast.error("Falha ao finalizar este pedido!");
      }
    }
  }

  return(
    <OrderContext.Provider 
      value={{ 
        isOpen,
        onRequestOpen,
        onRequestClose,
        order,
        finishOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}