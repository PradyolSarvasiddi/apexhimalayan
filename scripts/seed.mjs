/**
 * seed.mjs — Apex Himalayan Rides
 * ─────────────────────────────────────────────────────────────────
 * Reads toursData.json and upserts all stays + tours into Supabase.
 *
 * Usage (from project root):
 *   node scripts/seed.mjs
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   (read automatically from .env.local via dotenv)
 *
 * NOTE: This script uses the service-role key so it bypasses RLS.
 *       Run only in development. Never expose the service-role key client-side.
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local manually (no dotenv dependency needed) ─────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')

function loadEnv() {
  try {
    const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim()
      }
    }
  } catch {
    // .env.local not found — rely on environment variables being set externally
  }
}

loadEnv()

// ── Supabase admin client (service-role, bypasses RLS) ─────────────
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('    Make sure .env.local is present in the project root.\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Load master data ────────────────────────────────────────────────
const DATA_PATH = resolve(ROOT, 'toursData.json')
const raw       = readFileSync(DATA_PATH, 'utf8')
const data      = JSON.parse(raw)

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Normalise a category string from toursData.json to the DB enum value.
 * DB accepts: 'motorcycle' | 'trekking' | 'camping'
 */
function normaliseTourCategory(raw) {
  const s = (raw || '').toLowerCase()
  if (s.includes('motorcycle') || s.includes('bike') || s.includes('ride')) return 'motorcycle'
  if (s.includes('trek'))  return 'trekking'
  if (s.includes('camp') || s.includes('safari')) return 'camping'
  // Fallback — keep as-is so Supabase returns a clear constraint error
  return s
}

/**
 * Normalise difficulty to DB enum: 'easy' | 'moderate' | 'hard'
 */
function normaliseDifficulty(raw) {
  const s = (raw || '').toLowerCase()
  if (s === 'easy')     return 'easy'
  if (s === 'hard' || s === 'difficult') return 'hard'
  return 'moderate'   // default
}

/**
 * Parse a duration string like "12 Days" → 12
 */
function parseDurationDays(raw) {
  if (!raw) return null
  const match = String(raw).match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Normalise a stay type to the DB enum value.
 * DB accepts: 'camping' | 'guesthouse' | 'hotel' | 'homestay'
 */
function normaliseStayType(raw) {
  return (raw || '').toLowerCase()
}

/**
 * Map a JSON itinerary item to the shape expected by the DB / ItineraryDay type.
 * JSON shape:   { day, title, description }
 * DB shape:     { day_number, title, description }
 */
function mapItineraryDay(item) {
  return {
    day_number:  item.day,
    title:       item.title       || '',
    description: item.description || '',
  }
}

// ── Seed Stays ───────────────────────────────────────────────────────
async function seedStays() {
  const stays = data.stays || []
  if (stays.length === 0) {
    console.log('⚠️  No stays found in toursData.json — skipping.')
    return
  }

  console.log(`\n📦  Seeding ${stays.length} stay(s)…`)

  for (const [i, s] of stays.entries()) {
    const payload = {
      // ── Basic Information ──────────────────────────────────────────
      name:              s.name,
      slug:              s.slug,
      location:          s.location || '',
      type:              normaliseStayType(s.type),

      // ── Descriptions ──────────────────────────────────────────────
      short_description: s.short_description  || null,
      description:       s.full_description   || null,   // full_description → description

      // ── Amenities ─────────────────────────────────────────────────
      amenities:         Array.isArray(s.amenities) ? s.amenities : [],

      // ── Status ────────────────────────────────────────────────────
      is_available:      s.status?.available  ?? true,
      is_featured:       s.status?.featured   ?? false,

      // ── Contact ───────────────────────────────────────────────────
      contact_info:      s.contact_info || null,

      // ── Display order (preserve JSON order) ───────────────────────
      display_order:     i,
    }

    // Upsert on slug so re-runs are safe
    const { error } = await supabase
      .from('stays')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`   ❌  Stay "${s.name}" failed:`, error.message)
    } else {
      console.log(`   ✅  Stay "${s.name}" upserted.`)
    }
  }
}

// ── Seed Tours ───────────────────────────────────────────────────────
async function seedTours() {
  const tours = data.tours || []
  if (tours.length === 0) {
    console.log('⚠️  No tours found in toursData.json — skipping.')
    return
  }

  console.log(`\n🗺️   Seeding ${tours.length} tour(s)…`)

  for (const [i, t] of tours.entries()) {
    const payload = {
      // ── Basic Information ──────────────────────────────────────────
      title:             t.title,
      slug:              t.slug,
      category:          normaliseTourCategory(t.category),

      // ── Descriptions ──────────────────────────────────────────────
      short_description: t.short_description  || null,
      description:       t.full_description   || null,   // full_description → description

      // ── Trip Details ──────────────────────────────────────────────
      duration_days:     parseDurationDays(t.trip_details?.duration),
      best_season:       t.trip_details?.best_season      || null,
      difficulty:        normaliseDifficulty(t.trip_details?.difficulty),
      group_size_min:    t.trip_details?.min_group_size   ?? 1,
      group_size_max:    t.trip_details?.max_group_size   ?? 12,

      // ── Status ────────────────────────────────────────────────────
      is_available:      t.status?.available  ?? true,
      is_featured:       t.status?.featured   ?? false,
      is_popular:        t.status?.popular    ?? false,
      is_limited_spots:  false,                           // not in JSON — sensible default

      // ── Itinerary (day → day_number rename) ───────────────────────
      itinerary: Array.isArray(t.itinerary)
        ? t.itinerary.map(mapItineraryDay)
        : [],

      // ── Inclusions & Exclusions ────────────────────────────────────
      inclusions: Array.isArray(t.inclusions_exclusions?.included)
        ? t.inclusions_exclusions.included
        : [],
      exclusions: Array.isArray(t.inclusions_exclusions?.not_included)
        ? t.inclusions_exclusions.not_included
        : [],

      // ── Contact ───────────────────────────────────────────────────
      contact_info:      t.contact_info || null,

      // ── Display order ─────────────────────────────────────────────
      display_order:     i,
    }

    const { error } = await supabase
      .from('tours')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`   ❌  Tour "${t.title}" failed:`, error.message)
    } else {
      console.log(`   ✅  Tour "${t.title}" upserted.`)
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('\n════════════════════════════════════════════')
  console.log('  Apex Himalayan Rides — Database Seeder')
  console.log('════════════════════════════════════════════')
  console.log(`  Source : toursData.json`)
  console.log(`  Target : ${SUPABASE_URL}`)

  await seedStays()
  await seedTours()

  console.log('\n════════════════════════════════════════════')
  console.log('  ✅  Seeding complete.')
  console.log('  Open /admin/stays and /admin/tours to verify.')
  console.log('════════════════════════════════════════════\n')
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err)
  process.exit(1)
})
