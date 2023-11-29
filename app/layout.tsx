import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import MenuIcon from "@/components/icons/menu";

export const metadata: Metadata = {
  title: "RapidRead",
  description:
    "Empower your reading with AI! Instantly summarize articles for quick insights at RapidRead AI. Streamlined knowledge, effortlessly delivered.",
  icons: [
    {
      rel: "icon",
      url: "/images/favicon.ico",
    },
  ],
  openGraph: {
    images: [
      {
        url: "https://chemarbraithwaite.s3.amazonaws.com/logo.png",
        width: 1600,
        height: 446,
        alt: "RapidRead",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex w-full absolute top-0 z-[1] items-center gap-4 h-14 p-2 shadow-md">
          <MenuIcon className="absolute md:relative left-0 h-6 w-6 cursor-pointer text-gray-500 ml-2" />
          <div className="flex w-full justify-center md:justify-start md:w-28">
            <Image
              src="/images/logo.png"
              height={32}
              width={107}
              alt="RapidRead"
              className="h-8"
              priority
            />
          </div>
        </nav>
        <main
          className="flex flex-col w-full overflow-auto mt-14"
          style={{
            height: "calc(100vh - 56px)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
