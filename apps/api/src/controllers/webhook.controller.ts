import { Request, Response } from 'express'
import { Webhook } from 'svix'
import User from '../models/user.model.js'
import {WebhookEvent} from "@clerk/express";

export const registerWebhook = async (req: Request, res: Response) => {
  const svixId = req.header('svix-id')
  const svixTimestamp = req.header('svix-timestamp')
  const svixSignature = req.header('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: 'Missing svix headers' })
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body)

  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? '')
    const event = webhook.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;

    if (event.type === 'user.created') {
      const {email_addresses,primary_email_address_id,id}=event.data;
      const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id) ?? email_addresses[0];

      if (!primaryEmail) {
        return res.status(400).json({ error: `No email addresses for user ${id}` })
      }

      await User.create({
        id: id,
        email: primaryEmail.email_address,
        credits: 100,
        Tcredits: 100,
      })
    }

    return res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook verification failed', error)
    return res.status(400).json({ error: 'Error verifying payload' })
  }
}
