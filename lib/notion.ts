import { Client } from "@notionhq/client";
import Guest, { IGuest } from "@/models/Guest";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
const datasourceId = process.env.NOTION_DATASOURCE_ID;

// Helper to map Guest to Notion properties
function buildNotionProperties(guest: Partial<IGuest>) {
  const properties: any = {};

  if (guest.name !== undefined) {
    properties["Guest Name"] = {
      title: [{ text: { content: guest.name } }],
    };
  }

  if (guest.phone) {
    properties["Phone"] = {
      phone_number: guest.phone,
    };
  }

  if (guest.maxPax !== undefined) {
    properties["Jumlah Pax"] = {
      number: guest.maxPax,
    };
  }

  if (guest.category !== undefined) {
    properties["Jenis Undangan"] = {
      select: { name: guest.category },
    };
  }

  if (guest.rsvp && guest.rsvp.status !== undefined) {
    properties["RSVP Status"] = {
      status: { name: guest.rsvp.status },
    };
  } else if (guest.status !== undefined) {
    properties["RSVP Status"] = {
      status: { name: guest.status },
    };
  }

  // RSVP Sub-properties
  if (guest.rsvp) {
    if (guest.rsvp.attending !== null && guest.rsvp.attending !== undefined) {
      properties["Hadir / Tidak"] = {
        select: { name: guest.rsvp.attending ? "Hadir" : "Tidak" },
      };
    }

    if (guest.rsvp.pax !== undefined) {
      properties["Pax Hadir"] = {
        number: guest.rsvp.pax || 0,
      };
    }
  } else if (guest.status === "CONFIRMED" || guest.status === "DECLINED") {
    // Fallback if rsvp object is missing but status is known
    properties["Hadir / Tidak"] = {
      select: { name: guest.status === "CONFIRMED" ? "Hadir" : "Tidak" },
    };
  }

  return properties;
}

export async function createNotionGuest(guest: IGuest): Promise<string | null> {
  if (!databaseId || !process.env.NOTION_API_KEY) return null;

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: buildNotionProperties(guest),
    });

    console.log("[Notion] Guest created:", response);
    return response.id;
  } catch (error) {
    console.error("[Notion] Error creating guest:", error);
    return null; // Fail gracefully so app still works
  }
}

export async function updateNotionGuest(
  pageId: string,
  guestUpdates: Partial<IGuest>,
): Promise<void> {
  if (!databaseId || !process.env.NOTION_API_KEY) return;

  console.log("[Notion] Updating guest:", guestUpdates);

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: buildNotionProperties(guestUpdates),
    });
  } catch (error) {
    console.error("[Notion] Error updating guest:", error);
  }
}

export async function deleteNotionGuest(pageId: string): Promise<void> {
  if (!databaseId || !process.env.NOTION_API_KEY) return;

  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true, // Soft-delete in Notion
    });
  } catch (error) {
    console.error("[Notion] Error deleting guest:", error);
  }
}

export async function syncNotionToMongo() {
  try {
    // 1. Connect ke MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("✅ Terhubung ke MongoDB");
    }

    // 2. Ambil data dari Notion Database
    console.log("Mengambil data dari Notion...");
    const response = await notion.dataSources.query({
      data_source_id: datasourceId as string,
    });

    const notionPages = response.results;
    console.log(`Menemukan ${notionPages.length} baris data di Notion.`);

    // 3. Looping dan simpan/update ke MongoDB
    for (const page of notionPages) {
      const notionId = page.id;
      const props = (page as any).properties;

      // Extract properties based on your Notion schema
      const nameObj = props["Guest Name"]?.title?.[0];
      const name = nameObj ? nameObj.plain_text : "No Name";

      const phone = props["Phone"]?.phone_number || "";
      const maxPax = props["Jumlah Pax"]?.number || 1;
      const category = props["Jenis Undangan"]?.select?.name || "Both";
      // Map Notion RSVP Status → Guest model status enum
      const notionStatus = props["RSVP Status"]?.status?.name || "";
      let status: "INVITED" | "CONFIRMED" | "DECLINED" = "INVITED";
      if (
        notionStatus === "Confirmed" ||
        notionStatus === "CONFIRMED" ||
        notionStatus === "Accepted"
      ) {
        status = "CONFIRMED";
      } else if (notionStatus === "Declined" || notionStatus === "DECLINED") {
        status = "DECLINED";
      }

      const hadirTidak = props["Hadir / Tidak"]?.select?.name;
      const paxHadir = props["Pax Hadir"]?.number || null;

      let rsvpStatus: "Invited" | "Not Invited" | "Accepted" | "Declined" =
        "Not Invited";
      let attending: boolean | null = null;
      if (hadirTidak === "Hadir") {
        rsvpStatus = "Accepted";
        attending = true;
      } else if (hadirTidak === "Tidak") {
        rsvpStatus = "Declined";
        attending = false;
      }

      // Check if guest exists by Notion ID
      let guest = await Guest.findOne({ notionPageId: notionId });

      if (!guest) {
        // Generate unique invitation code for brand new guests from Notion
        let invitationCode = "";
        for (let i = 0; i < 3; i++) {
          const candidate = nanoid(10);
          const exists = await Guest.exists({ invitationCode: candidate });
          if (!exists) {
            invitationCode = candidate;
            break;
          }
        }

        guest = new Guest({ notionPageId: notionId, invitationCode });
      }

      // Update fields
      guest.name = name;
      guest.phone = phone;
      guest.maxPax = maxPax;
      guest.category = category as any;
      guest.status = status as any;

      // Update RSVP
      if (!guest.rsvp) guest.rsvp = {} as any;

      if (attending !== null) {
        guest.rsvp.attending = attending;
        guest.rsvp.status = rsvpStatus;
        guest.rsvp.pax = paxHadir;
      }

      await guest.save();
    }

    console.log("🎉 Sinkronisasi Notion ke MongoDB Selesai!");
  } catch (error: any) {
    console.error("❌ Terjadi kesalahan sinkronisasi:", error.message);
  }
}
