import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Final Project Deep Learning | Hand Gesture Detection",
  description: "Hand Gesture Detection",
  icons: {icon: '/ily.ico'}
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
