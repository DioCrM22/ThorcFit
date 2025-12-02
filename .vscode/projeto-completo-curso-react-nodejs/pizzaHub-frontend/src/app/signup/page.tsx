import styles from '../page.module.scss'
import logoImg from '../../../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/service/api'
import { redirect } from 'next/navigation'   

async function handleRegister(formData: FormData) {
    'use server'

    const name = formData.get('name')?.valueOf()
    const email = formData.get('email')?.valueOf()
    const password = formData.get('password')?.valueOf()

    if( name === "" || email === "" || password === "") {
        console.log('Preencha todos os campos')
        return;
    }
    try{
        await api.post('/users', {
            name,
            email,
            password
        })

    }catch(err){
        console.log('Erro ao cadastrar usuário')
        console.log(err)
    }

    redirect('/')
}    

export default function Signup() {
    return (
        <>
          <div className={styles.containerCenter}>
                <Image
                src={logoImg}
                alt="Logo da pizzaria"
                />

                <section className={styles.login}>
                <h1>Criando sua conta</h1>
                <form action={handleRegister}>
                    <input 
                    type="text"
                    required
                    name="name"
                    placeholder="Digite seu nome..."
                    className={styles.input}
                    />

                    <input 
                    type="email"
                    required
                    name="email"
                    placeholder="Digite seu email..."
                    className={styles.input}
                    />

                    <input 
                    type="password"
                    required
                    name="password"
                    placeholder="***********"
                    className={styles.input}
                    />

                    <button type="submit" className={styles.button}>
                    Cadastrar
                    </button>
                </form>

                <Link href="/" className={styles.text}>
                    Já possui uma conta? Faça seu login
                </Link>

                </section>

            </div>
        </>
    );
}