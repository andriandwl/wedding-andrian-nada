import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    
    // Kita asumsikan hanya ada 1 record setting global
    let setting = await Setting.findOne().lean();
    
    if (!setting) {
      // Jika kosong, buat dengan default value
      const newSetting = new Setting();
      await newSetting.save();
      setting = JSON.parse(JSON.stringify(newSetting));
    }
    
    return NextResponse.json({ ok: true, data: setting });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(body);
    } else {
      // Update fields
      Object.assign(setting, body);
    }
    await setting.save();

    return NextResponse.json({ ok: true, data: setting });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
