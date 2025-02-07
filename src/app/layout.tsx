import './globals.css'

export const metadata = {
  title: 'Temp-emails - Secure Temporary Email Service',
  description: 'Get instant, secure temporary email addresses with Temp-emails. Protect your privacy and avoid spam with our disposable email service.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
