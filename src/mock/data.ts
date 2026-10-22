// Mock data for the UI-only pass. Once the PHP API is wired up, these
// will be replaced by real fetch() calls — see src/api/ (to be added)
// for the endpoints this mirrors: POST /auth/otp-request.php,
// POST /auth/otp-verify.php, POST /photographers/register.php,
// GET /photographers/me.php, POST /photographers/status.php (online toggle),
// POST /bookings/accept.php, POST /bookings/decline.php,
// POST /bookings/update-status.php.

export const SEARCH_RADIUS_KM = 5
export const REQUEST_TIMEOUT_SECONDS = 15

export type KycStatus = 'pending' | 'approved' | 'rejected'

export interface PhotographerProfile {
  name: string
  mobile: string
  address: string
  initials: string
  kycStatus: KycStatus
  rating: number
  bookingsCount: number
}

export const mockProfile: PhotographerProfile = {
  name: 'Rohit Sharma',
  mobile: '+91 98XXXXXX12',
  address: 'Kothrud, Pune',
  initials: 'RS',
  kycStatus: 'approved',
  rating: 4.8,
  bookingsCount: 120,
}

export interface IncomingRequest {
  id: string
  customerName: string
  customerInitials: string
  distanceKm: number
  packageName: string
  photos: number
  durationMins: number
  value: number
}

export const mockIncomingRequest: IncomingRequest = {
  id: '#IP10452',
  customerName: 'Prafull D.',
  customerInitials: 'PD',
  distanceKm: 2.3,
  packageName: 'Basic',
  photos: 10,
  durationMins: 30,
  value: 499,
}

export interface ActiveBooking {
  id: string
  customerName: string
  customerPhoneMasked: string
  address: string
  distanceKm: number
  etaMins: number
  packageName: string
  value: number
  durationMins: number
  status: 'accepted' | 'on_the_way' | 'arrived' | 'completed'
}

export const mockActiveBooking: ActiveBooking = {
  id: '#IP10452',
  customerName: 'Prafull D.',
  customerPhoneMasked: '+91 70XXXXXX45',
  address: 'Kothrud, Pune',
  distanceKm: 1.2,
  etaMins: 8,
  packageName: 'Basic',
  value: 499,
  durationMins: 30,
  status: 'accepted',
}

export interface EarningsSummary {
  today: number
  thisWeek: number
  thisMonth: number
  bookingsToday: number
}

export const mockEarnings: EarningsSummary = {
  today: 1497,
  thisWeek: 6487,
  thisMonth: 24950,
  bookingsToday: 3,
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`
}
