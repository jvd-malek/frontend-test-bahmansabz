import localFont from "next/font/local";

export const Baloo = localFont({
  src: [
    {
      path: "../public/Font/baloo.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-baloo",
  display: "swap",
});

