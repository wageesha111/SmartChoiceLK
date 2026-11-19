import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Signs a direct-to-Cloudinary photo upload for the shop admin.
 * Needs CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the server env
 * (never NEXT_PUBLIC_: the secret must not reach the browser).
 */
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'xdgeoud6';
const FOLDER = 'smartchoice/admin';

const configured = () => Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

/** Lets the admin page know whether background removal is available. */
export async function GET() {
  return configured() ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false }, { status: 501 });
}

export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ error: 'Cloudinary keys are not set' }, { status: 501 });

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !anon) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  // Check the caller is on the shop admin list, using their own login.
  const sb = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: isAdmin, error } = await sb.rpc('is_shop_admin');
  if (error || isAdmin !== true) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');

  return NextResponse.json({
    cloudName: CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: FOLDER,
  });
}
