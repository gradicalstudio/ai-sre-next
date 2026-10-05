import Footer from "@/components/Footer/Footer";
import MinimalHeader from "@/components/MinimalHeader/MinimalHeader";

export default function NoHeaderLayout({ children }) {
  return (
    <>
      <MinimalHeader />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
