import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WithHeaderLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}