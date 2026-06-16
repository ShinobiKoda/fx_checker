import { z } from 'zod'
import { ALLOWED_CURRENCIES } from '@/constants/currencies'

export const ratesQuerySchema = z.object({
  base: z.string().toUpperCase().refine(
    val => ALLOWED_CURRENCIES.includes(val),
    { message: 'Invalid or unsupported currency code' }
  )
})