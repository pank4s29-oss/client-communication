import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };
export async function middleware(request:NextRequest){
  let response=NextResponse.next({request});
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)return response;
  const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll:()=>request.cookies.getAll(),setAll:(toSet:CookieToSet[])=>{toSet.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});toSet.forEach(({name,value,options})=>response.cookies.set(name,value,{...options,sameSite:'none',secure:true}))}}});
  const {data:{user}}=await supabase.auth.getUser();
  if(!user&&!request.nextUrl.pathname.startsWith('/login')&&!request.nextUrl.pathname.startsWith('/api/health')&&!request.nextUrl.pathname.startsWith('/api/line'))return NextResponse.redirect(new URL('/login',request.url));
  return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|manus-routes.json).*)']};
