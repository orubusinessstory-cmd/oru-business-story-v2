import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runDailyGeneration } from "@/lib/automation/runDailyGeneration";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Vercel automatically sends "Authorization: Bearer <CRON_SECRET>" for its
  // own cron invocations when CRON_SECRET is set as an env var on the
  // project. This stops anyone else from hitting the route and triggering
  // (or spamming) article generation.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runDailyGeneration(false);

  if (result.status === "success") {
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath(`/category/${result.categorySlug}`);
  }

  const httpStatus = result.status === "failed" ? 500 : 200;
  return NextResponse.json(result, { status: httpStatus });
}
