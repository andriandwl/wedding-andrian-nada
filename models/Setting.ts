import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISetting extends Document {
  // Pengantin
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;
  groomInstagram: string;
  brideInstagram: string;

  // Acara (Event)
  weddingDate: string;
  akadTime: string;
  resepsiTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  mapsLink: string;

  // Pesan & Quote
  openingQuote: string;
  closingMessage: string;

  // Hadiah & Rekening
  bank1Name: string;
  bank1AccountName: string;
  bank1AccountNumber: string;
  
  bank2Name: string;
  bank2AccountName: string;
  bank2AccountNumber: string;

  ewalletName: string;
  ewalletAccountName: string;
  ewalletAccountNumber: string;

  giftAddressNames: string;
  giftAddressFull: string;
}

const SettingSchema = new Schema<ISetting>({
  groomName: { type: String, default: "Andrian" },
  brideName: { type: String, default: "Nada" },
  groomFullName: { type: String, default: "Andrian Dwi Haryanto" },
  brideFullName: { type: String, default: "Denada Putri" },
  groomParents: { type: String, default: "Bapak Dal Haryanto & Ibu Sukimah" },
  brideParents: { type: String, default: "Bapak Hendra Wijaya & Ibu Sari Dewi" },
  groomInstagram: { type: String, default: "https://instagram.com" },
  brideInstagram: { type: String, default: "https://instagram.com" },

  weddingDate: { type: String, default: "2026-09-14" },
  akadTime: { type: String, default: "10:00" },
  resepsiTime: { type: String, default: "16:00" },
  venueName: { type: String, default: "Tanah Lot" },
  venueCity: { type: String, default: "Bali, Indonesia" },
  venueAddress: { type: String, default: "Jl. Raya Tanah Lot, Beraban, Kec. Kediri, Tabanan, Bali 82121" },
  mapsLink: { type: String, default: "https://www.google.com/maps/search/?api=1&query=Tanah+Lot+Temple+Bali+Indonesia" },

  openingQuote: { type: String, default: "\"Two souls, one heart — and a lifetime of adventures ahead.\"" },
  closingMessage: { type: String, default: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu." },

  bank1Name: { type: String, default: "BCA" },
  bank1AccountName: { type: String, default: "Denada Putri" },
  bank1AccountNumber: { type: String, default: "1234567890" },
  
  bank2Name: { type: String, default: "Mandiri" },
  bank2AccountName: { type: String, default: "Andrian Dwi Haryanto" },
  bank2AccountNumber: { type: String, default: "1370024475667" },

  ewalletName: { type: String, default: "GoPay / OVO / Dana" },
  ewalletAccountName: { type: String, default: "Denada Putri" },
  ewalletAccountNumber: { type: String, default: "0812-3456-7890" },

  giftAddressNames: { type: String, default: "Nada & Andrian" },
  giftAddressFull: { type: String, default: "Jl. Melati Indah No. 12, Perumahan Harmoni\nKelurahan Sukamaju, Kec. Cimanggis\nDepok, Jawa Barat 16451" },
}, { timestamps: true });

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
