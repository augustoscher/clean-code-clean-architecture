import Base from 'templates/Base'
import './globals.css'
import { Suspense } from 'react'
import Loading from './loading'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Base>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Base>
      </body>
    </html>
  )
}
