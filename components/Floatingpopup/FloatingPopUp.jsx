import { createClient } from "@/prismicio";
import FloatingPopupClient from "./FloatingPopUpClient";

export default async function FloatingPopup() {
  const client = createClient();
  const floatingpopup = await client.getSingle("floatingpopup").catch(() => null);

  const popups = floatingpopup?.data.popups ?? [];
  const showPopup = floatingpopup?.data.show_hide_toggle ?? false;

  if (!showPopup || popups.length === 0) return null;

  return <FloatingPopupClient popups={popups} />;
}