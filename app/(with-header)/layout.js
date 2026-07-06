import FloatingPopup from "@/components/Floatingpopup/FloatingPopUp";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/SmoothScroll";

export default function WithHeaderLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <FloatingPopup />
      <Footer />
    </>
  );
}
