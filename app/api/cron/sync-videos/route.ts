import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncYouTubeVideos } from "@/lib/automation/syncVideos";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await syncYouTubeVideos();

  if (result.added > 0) {
    revalidatePath("/videos");
    revalidatePath("/admin/videos");
  }

  return NextResponse.json(result, { status: result.error ? 500 : 200 });
}
