import { NextRequest, NextResponse } from 'next/server'
import { ratesQuerySchema } from '@/validators/rates'
import { getLatestRates } from '@/lib/frankfurter'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const base = searchParams.get('base') ?? 'USD'

  const parsed = ratesQuerySchema.safeParse({ base })
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  try {
    const data = await getLatestRates(parsed.data.base)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' }
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch rates. Try again later.' },
      { status: 502 }
    )
  }
}