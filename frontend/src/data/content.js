const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.'

const placeholderPhoto =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0b2a2a"/><circle cx="100" cy="80" r="36" fill="#3a5a5a"/><path d="M30 200c0-44 31-70 70-70s70 26 70 70z" fill="#3a5a5a"/></svg>',
  )

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Mission', to: '/mission' },
  { label: 'Game', to: '/game' },
]

export const footerLinks = [
  { label: 'Email', href: 'mailto:info@example.com' },
  { label: 'Location', href: '#' },
  { label: 'Phone', href: 'tel:+0000000000' },
  { label: 'Facebook', href: '#' },
]

export const homeCards = [
  { key: 'purpose', title: 'Purpose', text: lorem },
  { key: 'target', title: 'Target', text: lorem },
]

export const boxes = [
  { label: 'Box A', text: lorem },
  { label: 'Box B', text: lorem },
]

export const team = [
  { name: 'Sample Name Here', role: 'Role', photo: placeholderPhoto },
  { name: 'Sample Name Here', role: 'Role', photo: placeholderPhoto },
  { name: 'Sample Name Here', role: 'Role', photo: placeholderPhoto },
]