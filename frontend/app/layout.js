import '../styles/globals.css'

export const metadata = {
  title: 'MediTwin',
  description: 'AI-powered health companion for personalized insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
