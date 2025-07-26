export function BlinkitIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="8" width="5" height="8" rx="1" />
      <rect x="10" y="5" width="5" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
      <circle cx="5.5" cy="5" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function SwiggyInstamartIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  )
}

export function ZeptoIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6h18l-2 12H5L3 6zm0-2h20l-3 18H3L0 4z"/>
      <path d="M8 10l8 4-8 4V10z"/>
    </svg>
  )
}