import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req)

    if(evt.type === "user.created" || evt.type === "user.updated") {
      const user = await User.findOne({clerkId: evt.data.id})

      const userData = {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address,
        name: [evt.data?.first_name, evt.data?.last_name].filter(val => val && val !== "null").join(" ").trim() || "User",
        image: evt.data?.image_url,
      }

      if(user) {
        await User.findOneAndUpdate({clerkId: evt.data.id}, userData)
      } else {
        await User.create(userData)
      }

      return res.json({success: true, message: "Webhook received"})
    }

    if(evt.type === "user.deleted") {
      
    }
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
}