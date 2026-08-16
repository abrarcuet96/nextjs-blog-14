import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";

export const metadata = {
  title: {
    default: "NextBlog",
    template: "%s | NextBlog",
  },
  description: "A friendly place to learn, write, and share useful ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-base-200 text-base-content">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
