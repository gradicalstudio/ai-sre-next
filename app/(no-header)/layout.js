import Footer from "@/components/Footer";
import MinimalHeader from "@/components/MinimalHeader";

export default function NoHeaderLayout({ children }) {
  return <>
   <MinimalHeader />
  {children}
  <Footer/>
  </>;
}