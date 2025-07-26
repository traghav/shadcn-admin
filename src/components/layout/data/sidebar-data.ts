import {
  IconNotification,
  IconPalette,
  IconSettings,
  IconUserCog,
  IconPackage,
  IconCoin,
  IconEye,
  IconBrain,
} from '@tabler/icons-react'
import { BlinkitIcon, SwiggyInstamartIcon, ZeptoIcon } from '@/components/icons/platform-icons'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  platforms: [
    {
      name: 'Blinkit',
      logo: BlinkitIcon,
      description: 'Grocery & Essentials',
    },
    {
      name: 'Swiggy Instamart',
      logo: SwiggyInstamartIcon,
      description: 'Instant Delivery',
    },
    {
      name: 'Zepto',
      logo: ZeptoIcon,
      description: '10-Minute Delivery',
    },
  ],
  navGroups: [
    {
      title: 'Analytics',
      items: [
        {
          title: 'Availability',
          url: '/',
          icon: IconPackage,
        },
        {
          title: 'Pricing',
          url: '/pricing',
          icon: IconCoin,
        },
        {
          title: 'Visibility',
          url: '/visibility',
          icon: IconEye,
        },
        {
          title: 'Analyse with AI',
          url: '/ai-analysis',
          icon: IconBrain,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
      ],
    },
  ],
}
