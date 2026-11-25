import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The home page ships pre-rendered HTML (see scripts/prerender.mjs): take it
// over in place instead of throwing it away. Every other route starts empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, app, {
    // The below-the-fold sections are lazy, so the prerender ships their
    // placeholder and React renders them on the client (error #419). That is
    // by design - don't report it; report anything else.
    onRecoverableError(error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (/#419|could not finish this Suspense boundary/i.test(msg)) return
      console.error(error)
    },
  })
} else {
  createRoot(container).render(app)
}
