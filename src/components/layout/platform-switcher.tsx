import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useFilterStore, useCurrentPlatform } from '@/stores/filterStore'
import { platforms } from '@/data/mock-kpi-data'

export function PlatformSwitcher({
  platforms: sidebarPlatforms,
}: {
  platforms: {
    name: string
    logo: React.ElementType
    description: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const currentPlatform = useCurrentPlatform()
  const { setCurrentPlatform } = useFilterStore()
  
  // Find the active platform based on current platform ID
  const activePlatform = React.useMemo(() => {
    const platformData = platforms.find(p => p.id === currentPlatform)
    const sidebarPlatform = sidebarPlatforms.find(sp => sp.name === platformData?.name)
    return sidebarPlatform || sidebarPlatforms[0]
  }, [currentPlatform, sidebarPlatforms])
  
  const handlePlatformChange = (selectedSidebarPlatform: typeof sidebarPlatforms[0]) => {
    // Find the corresponding platform ID from mock data
    const platformData = platforms.find(p => p.name === selectedSidebarPlatform.name)
    if (platformData) {
      setCurrentPlatform(platformData.id)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <activePlatform.logo className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activePlatform.name}
                </span>
                <span className='truncate text-xs'>{activePlatform.description}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Platforms
            </DropdownMenuLabel>
            {sidebarPlatforms.map((platform, index) => (
              <DropdownMenuItem
                key={platform.name}
                onClick={() => handlePlatformChange(platform)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <platform.logo className='size-4 shrink-0' />
                </div>
                {platform.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
