import { Toaster as Sonner } from 'sonner'

function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '20px'
        }
      }}
    />
  )
}

export { Toaster }
