import { redirect } from "next/navigation";
import { getCurrentCaptain } from "@/lib/actions/auth";
import { RequestForm } from "@/components/RequestForm";

export default async function RequestPage() {
  const captain = await getCurrentCaptain();

  if (!captain) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-lg">
      <RequestForm shipName={captain.ship_name} />
    </div>
  );
}
