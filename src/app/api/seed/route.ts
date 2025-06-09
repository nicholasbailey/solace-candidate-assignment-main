import { createAdvocates } from "../../../services/advocates";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const records = await createAdvocates(advocateData);

  return Response.json({ advocates: records });
}
