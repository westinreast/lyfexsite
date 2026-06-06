import { AuroraBackdrop } from './components/AuroraBackdrop'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { PlayableEngine } from './components/PlayableEngine'
import { SignalNoise } from './components/SignalNoise'
import { Features, Footer } from './components/Features'

export default function App() {
  return (
    <>
      <AuroraBackdrop />
      <Nav />
      <main>
        <Hero />
        <PlayableEngine />
        <SignalNoise />
        <Features />
      </main>
      <Footer />
    </>
  )
}
