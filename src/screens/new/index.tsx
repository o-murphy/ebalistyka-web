import { Target, Cloud, Table2, Repeat2, Info, Settings, BarChart2, SlidersHorizontal } from 'lucide-react'

const Placeholder = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
    <Icon className="w-12 h-12 opacity-40" />
    <span className="text-lg font-medium">{title}</span>
    <span className="text-sm opacity-60">Migration in progress…</span>
  </div>
)

export const HomeScreen       = () => <Placeholder icon={Target}           title="Home" />
export const WeatherScreen    = () => <Placeholder icon={Cloud}            title="Weather" />
export const TablesScreen     = () => <Placeholder icon={Table2}           title="Tables" />
export const ConvertorScreen  = () => <Placeholder icon={Repeat2}          title="Convertor" />
export const ShotInfoScreen   = () => <Placeholder icon={Info}             title="Shot Info" />
export const SettingsScreen   = () => <Placeholder icon={Settings}         title="Settings" />
export const ChartsScreen     = () => <Placeholder icon={BarChart2}        title="Charts" />
export const ProfileScreen    = () => <Placeholder icon={SlidersHorizontal} title="Profile" />
