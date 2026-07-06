import { createClient } from "@/prismicio";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const client = createClient();
  const footer = await client.getSingle("footer");

  const { title, email_block, logo, footer_links } = footer.data;

  return (
    <FooterClient
      title={title}
      email_block={email_block}
      logo={logo}
      footer_links={footer_links}
    />
  );
}
