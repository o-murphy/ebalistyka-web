import { useState, useEffect } from 'react'

const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return isMobile ? 'phone' : 'desktop'
}

export default useDeviceType
