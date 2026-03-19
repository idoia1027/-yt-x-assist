export type Role = 'owner' | 'insider' | 'guest'

export interface UserRole {
  role: Role
  dailyLimit: number
  canViewPro: boolean
  usedToday: number
}

const GUEST_ROLE: UserRole = { role: 'guest', dailyLimit: 0, canViewPro: true, usedToday: 0 }

function getTokenMap(): Record<string, { role: Role; daily_limit: number; can_view_pro: boolean }> {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_TOKEN_MAP ?? '{}')
  } catch {
    return {}
  }
}

function getUsedToday(): number {
  if (typeof window === 'undefined') return 0
  const today = new Date().toISOString().slice(0, 10)
  return parseInt(localStorage.getItem(`usage_${today}`) ?? '0', 10)
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return
  const today = new Date().toISOString().slice(0, 10)
  localStorage.setItem(`usage_${today}`, String(getUsedToday() + 1))
}

export function resolveRole(): UserRole {
  if (typeof window === 'undefined') return GUEST_ROLE

  const urlToken = new URLSearchParams(window.location.search).get('token')
  if (urlToken) localStorage.setItem('auth_token', urlToken)

  const token = localStorage.getItem('auth_token')
  if (!token) return { ...GUEST_ROLE, usedToday: getUsedToday() }

  const config = getTokenMap()[token]
  if (!config) return { ...GUEST_ROLE, usedToday: getUsedToday() }

  return {
    role: config.role,
    dailyLimit: config.daily_limit,
    canViewPro: config.can_view_pro,
    usedToday: getUsedToday(),
  }
}

export function canAnalyze(role: UserRole): boolean {
  if (role.role === 'guest') return false
  if (role.role === 'owner') return true
  return role.usedToday < role.dailyLimit
}
