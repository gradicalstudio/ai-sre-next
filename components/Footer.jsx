import { createClient } from "@/prismicio";
import { PrismicRichText, PrismicText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

export default async function Footer() {
  const client = createClient();
  const footer = await client.getSingle("footer");

  const { title, email_block, logo, footer_links } = footer.data;

  return (
    <footer className="bg-[#FF6A50] text-black px-3 lg:px-6 lg:pt-25 pb-5  lg:pb-10">
      <div className="max-w-[1920px] mx-auto flex flex-col gap-5 lg:gap-16">
        {/* Top: Title + Logo */}
        <div className="flex pt-20 flex-wrap items-end gap-3 text-[26.73px] md:text-[30px] lg:text-[50px] xl:text-[72px] 2xl:text-[110px] font-normal leading-none w-[80%] md:w-[47%] lg:w-[60%] 2xl:w-[80%] 4xl:w-[70%] ">
          <div className="[&_p]:inline ">
            <PrismicRichText field={title} />
            <span className="ml-2 lg:ml-4 2xl:ml-6 ">
              <PrismicNextImage
                field={logo}
                className="h-7 md:h-8 lg:h-12.5 xl:h-17 2xl:h-26 4xl:h-26.25 w-auto inline lg:mb-1 2xl:mb-2"
              />
            </span>
          </div>
        </div>

        {/* Divider
        <hr className="border-black/20" /> */}

        {/* Bottom row: email + footer links */}
        <div className="flex border-t pt-3 lg:pt-5 font-medium flex-col md:flex-row lg:items-center justify-between gap-6">
          <div className="text-sm">
            <PrismicRichText
              field={email_block}
              components={{
                hyperlink: ({ node, children }) => (
                  <a
                    href={node.data.url}
                    target={node.data.target}
                    rel={
                      node.data.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="underline-offset-2 hover:underline transition-all"
                  >
                    {children}
                  </a>
                ),
              }}
            />
          </div>

          <div className="flex gap-6 lg:gap-10">
            {footer_links?.map((item, index) => (
              <PrismicNextLink
                key={item.key ?? index}
                field={item}
                className="text-sm md:self-end  hover:opacity-70 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
