import FloatingPopup from "@/components/Floatingpopup/FloatingPopUp";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/SmoothScroll";

export default function WithHeaderLayout({ children }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <FloatingPopup />
      <Footer />
    </>
  );
}
