import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-white/20 font-heading mb-2">404</div>
        <h1 className="text-3xl font-bold text-white font-heading mb-3">Page Not Found</h1>
        <p className="text-white/70 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  )
}
