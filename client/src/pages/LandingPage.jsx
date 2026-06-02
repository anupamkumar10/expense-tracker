import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageSpinner } from '../components/ui/Spinner'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingHero } from '../components/landing/LandingHero'
import {
  LandingCTA,
  LandingFAQ,
  LandingFeatures,
  LandingFooter,
  LandingProduct,
  LandingTestimonials,
  LandingWhyUs,
} from '../components/landing/LandingSections'

export function LandingPage() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) return <FullPageSpinner />
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingProduct />
        <LandingWhyUs />
        <LandingTestimonials />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
