export type Role = 'owner' | 'insider' | 'guest'

export interface UserRole {
  role: Role
  dailyLimit: number
  canViewPro: boolean
  usedToday: number
}

const GUEST_ROLE: UserRole = { role: 'guest', dailyLimit: 0, canViewPro: true, usedToday: 0 }

const TOKEN_MAP: Record<string, { role: Role; daily_limit: number; can_view_pro: boolean }> = {
  'idoiawang1027': { role: 'owner', daily_limit: 999, can_view_pro: true },
  'insider001': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider002': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider003': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider004': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider005': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider006': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider007': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider008': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider009': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider010': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider011': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider012': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider013': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider014': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider015': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider016': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider017': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider018': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider019': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider020': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider021': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider022': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider023': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider024': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider025': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider026': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider027': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider028': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider029': { role: 'insider', daily_limit: 2, can_view_pro: true },
  'insider030': { role: 'insider', daily_limit: 2, can_view_pro: true },
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

  const config = TOKEN_MAP[token]
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
