import { LayoutDashboard, FileBarChart, Users, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Reports', icon: FileBarChart, active: false },
  { label: 'Users', icon: Users, active: false },
  { label: 'Settings', icon: Settings, active: false },
]

export function Sidebar() {
  return (
    <aside
      data-testid="sidebar"
      className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col items-center gap-2 border-r border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800 lg:flex"
    >
      {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          title={label}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            active
              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
        >
          <Icon size={20} />
        </button>
      ))}
    </aside>
  )
}
