import { createClient } from "@/prismicio";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const client = createClient();
  const header = await client.getSingle("header");

  return (
    <HeaderClient
      brand_logo={header.data.brand_logo}
      nav_links={header.data.nav_links}
      nav_cta={header.data.nav_cta}
    />
  );
}
