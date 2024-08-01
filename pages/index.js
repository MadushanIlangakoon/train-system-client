import Head from 'next/head'
import GoogleMapComponent from '../components/GoogleMap'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Train System Client</title>
        <meta name="description" content="Train System Client Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Train System Client</h1>
        <GoogleMapComponent />
      </main>
    </div>
  )
}
