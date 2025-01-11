import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export const metadata = {
  title: "LudoStats",
  description: "Simplify the gestion of your sport team",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="bg-[#fffbef]">
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}