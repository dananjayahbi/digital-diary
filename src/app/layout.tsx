import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Diary - Your Mindful Daily Companion",
  description: "A calming digital diary to manage your daily tasks, routines, and reflections with a beautiful, mind-relaxing interface.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {/* Global Background Image */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg')`,
          }}
        >
          {/* Light overlay for readability */}
          <div className="absolute inset-0 bg-white/10" />
        </div>
        {children}
      </body>
    </html>
  );
}
