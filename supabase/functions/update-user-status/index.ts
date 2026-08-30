import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type StatusPayload = {
  user_id?: string
  status?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const input = new TextEncoder().encode(`${salt}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const ipSalt = Deno.env.get('IP_HASH_SALT')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')

  if (!serviceRoleKey || !ipSalt || !supabaseUrl) {
    return new Response(JSON.stringify({ error: 'Function is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let payload: StatusPayload
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const userId = typeof payload.user_id === 'string' ? payload.user_id.trim() : ''
  const status = typeof payload.status === 'string' ? payload.status.trim() : ''
  if (!userId || !status || !['online', 'offline', 'active'].includes(status)) {
    return new Response(JSON.stringify({ error: 'user_id and a valid status are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const userClient = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: authData, error: authError } = await userClient.auth.getUser()
  if (authError || !authData.user || authData.user.id !== userId) {
    return new Response(JSON.stringify({ error: 'User identity could not be verified' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const clientIp = forwardedFor.split(',')[0].trim() || 'unknown'
  const ipHash = await hashIp(clientIp, ipSalt)
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const now = new Date().toISOString()
  const { error } = await admin
    .from('user_data')
    .upsert({
      user_id: userId,
      status,
      last_seen: now,
      ip_hash: ipHash,
      created_at: now,
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('user_data upsert failed', error)
    return new Response(JSON.stringify({ error: 'Could not update user status' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
