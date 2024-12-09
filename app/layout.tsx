import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Define fonts individually in module scope
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Export fonts object for use in other components
export const fonts = {
  geistSans,
  geistMono,
  // Add more fonts here as needed
};

export const metadata: Metadata = {
  title: "Award Certificate Generator",
  description: "Generate award certificates with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Combine all font variables
  const fontVariables = Object.values(fonts)
    .map((font) => font.variable)
    .join(" ");

  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
