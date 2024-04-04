import Content from "../layout/Content";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import "../sass/main.scss";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </body>
    </html>
  );
}