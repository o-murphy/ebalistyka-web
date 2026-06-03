import { useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Target, Cloud, Table2, Repeat2, Settings, BarChart2, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCalculator, useProfile, useCurrentConditions } from '@/context'

const mobileRoutes = [
  { to: '/',          icon: Target,            label: 'Home' },
  { to: '/weather',   icon: Cloud,             label: 'Weather' },
  { to: '/tables',    icon: Table2,            label: 'Tables' },
  { to: '/convertor', icon: Repeat2,           label: 'Convertor' },
  { to: '/settings',  icon: Settings,          label: 'Settings' },
]

const desktopRoutes = [
  { to: '/',          icon: Target,            label: 'Home' },
  { to: '/tables',    icon: Table2,            label: 'Tables' },
  { to: '/charts',    icon: BarChart2,         label: 'Charts' },
  { to: '/profile',   icon: SlidersHorizontal, label: 'Profile' },
  { to: '/settings',  icon: Settings,          label: 'Settings' },
]

const NavItem = ({ to, icon: Icon, label, collapsed = false }: {
  to: string, icon: React.ElementType, label: string, collapsed?: boolean
}) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) => cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
      'hover:bg-accent hover:text-accent-foreground',
      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
      collapsed && 'justify-center px-2',
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!collapsed && <span>{label}</span>}
  </NavLink>
)

function AutoFireEffect() {
  const { fire } = useCalculator()
  const profileCtx = useProfile()
  const cond = useCurrentConditions()
  const fireRef = useRef(fire)
  useEffect(() => { fireRef.current = fire }, [fire])

  useEffect(() => {
    if (!profileCtx.isLoaded) return
    const timer = setTimeout(() => fireRef.current(), 80)
    return () => clearTimeout(timer)
  }, [
    profileCtx.isLoaded,
    profileCtx.scHeight.asDef,
    profileCtx.rTwist.asDef,
    profileCtx.cZeroWPitch.asDef,
    profileCtx.zeroDistance.asDef,
    profileCtx.cMuzzleVelocity.asDef,
    profileCtx.cZeroTemperature.asDef,
    profileCtx.cTCoeff.value,
    profileCtx.bDiameter.asDef,
    profileCtx.bLength.asDef,
    profileCtx.bWeight.asDef,
    profileCtx.cZeroAirTemperature.asDef,
    profileCtx.cZeroAirPressure.asDef,
    profileCtx.cZeroAirHumidity.value,
    cond.temperature.asDef,
    cond.pressure.asDef,
    cond.humidity.value,
    cond.windSpeed.asDef,
    cond.windDirection.asDef,
    cond.lookAngle.asDef,
    cond.targetDistance.asDef,
    cond.flags.usePowderSens,
    cond.flags.useDifferentPowderTemperature,
    cond.powderTemperature.asDef,
  ])

  return null
}

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <AutoFireEffect />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-56 border-r border-border shrink-0 p-2 gap-1">
        <div className="flex items-center gap-2 px-3 py-4 mb-2">
          <Target className="w-6 h-6 text-primary shrink-0" />
          <span className="hidden lg:block font-bold text-base">eBalistyka</span>
        </div>
        {desktopRoutes.map(r => (
          <NavItem key={r.to} {...r} collapsed={false} />
        ))}
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-2 px-4 h-14 border-b border-border shrink-0">
          <Target className="w-5 h-5 text-primary" />
          <span className="font-bold">eBalistyka</span>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>

        {/* Mobile bottom bar */}
        <nav className="md:hidden flex border-t border-border shrink-0">
          {mobileRoutes.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center flex-1 py-2 gap-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
