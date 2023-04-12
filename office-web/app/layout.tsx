import './globals.css'

export const metadata = {
  title: 'Office',
  description: 'Office Web',
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
