import Head from 'next/head'
import Main from "../components/FormikValidation/Main"

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Main/>
      
    </div>
  )
}

export default Home
