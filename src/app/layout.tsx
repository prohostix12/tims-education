import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CourseFinderWidget from '@/components/CourseFinderWidget'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TIMSOnline – Learn Without Boundaries',
    template: '%s | TIMSOnline',
  },
  description: "Kerala's trusted centre for online and distance education since 2009. UGC-DEB approved programs from top universities. Enrol in UG, PG, B.Tech, Diploma and Skill courses.",
  keywords: ['TIMS', 'TIMSOnline', 'online education Kerala', 'distance education', 'UGC approved', 'MBA online', 'MCA online', 'distance degree Kerala'],
  openGraph: {
    siteName: 'TIMSOnline',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CourseFinderWidget />
      </body>
    </html>
  )
}
