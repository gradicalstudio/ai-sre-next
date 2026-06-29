import { createClient } from "@/prismicio";
import MinimalHeaderClient from "./MinimalHeaderClient";


export default async function MinimalHeader() {
  const client = createClient();
  const header = await client.getSingle("header");

  return (
    <MinimalHeaderClient
      brand_logo={header.data.brand_logo}
      nav_cta={header.data.nav_cta}
    />
  );
}