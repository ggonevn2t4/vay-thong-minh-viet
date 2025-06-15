
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@3.4.0'
import { renderAsync } from 'npm:@react-email/render'
import ConfirmationEmail from './_templates/ConfirmationEmail.tsx'
import ResetPasswordEmail from './_templates/ResetPasswordEmail.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)
const hookSecret = Deno.env.get('EMAIL_HOOK_SECRET')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const wh = new Webhook(hookSecret)
  const payload = await req.json()
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  }

  try {
    const { type, data } = wh.verify(JSON.stringify(payload), svixHeaders) as any

    const { email, data: emailData } = data
    const { confirmation_url, recovery_url } = emailData

    let subject = ''
    let emailComponent

    switch (type) {
      case 'auth.signup':
        subject = 'Xác nhận tài khoản VayThôngMinh'
        emailComponent = React.createElement(ConfirmationEmail, { confirmationUrl: confirmation_url })
        break
      case 'auth.recovery_requested':
        subject = 'Khôi phục mật khẩu VayThôngMinh'
        emailComponent = React.createElement(ResetPasswordEmail, { recoveryUrl: recovery_url })
        break
      default:
        console.warn(`Unhandled webhook event type: ${type}`)
        return new Response('Unhandled event type', { status: 200, headers: corsHeaders })
    }
    
    const html = await renderAsync(emailComponent)

    const { error } = await resend.emails.send({
      from: 'VayThôngMinh <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(JSON.stringify(error), { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ message: 'Email sent' }), { status: 200, headers: corsHeaders })
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400, headers: corsHeaders })
  }
})

