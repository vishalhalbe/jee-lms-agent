import { headers } from "next/headers"
import { Webhook } from "svix"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface ClerkUserEvent {
  type: string
  data: {
    id: string
    email_addresses: { email_address: string; id: string }[]
    first_name: string | null
    last_name: string | null
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 })
  }

  const headersList = await headers()
  const svix_id = headersList.get("svix-id")
  const svix_timestamp = headersList.get("svix-timestamp")
  const svix_signature = headersList.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: ClerkUserEvent
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserEvent
  } catch {
    return new Response("Invalid webhook signature", { status: 400 })
  }

  const { type, data } = event

  if (type === "user.created") {
    const email = data.email_addresses[0]?.email_address ?? ""
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null

    await db
      .insert(users)
      .values({ clerkId: data.id, email, name })
      .onConflictDoNothing()
  }

  if (type === "user.updated") {
    const email = data.email_addresses[0]?.email_address ?? ""
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null

    await db
      .update(users)
      .set({ email, name })
      .where(eq(users.clerkId, data.id))
  }

  if (type === "user.deleted") {
    await db.delete(users).where(eq(users.clerkId, data.id))
  }

  return new Response("OK", { status: 200 })
}
