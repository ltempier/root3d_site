import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Chargement des polices avec variables
const geistSans = Geist({
  variable: "--font-geist-sans",  // Définition de la variable pour la police Geist sans
  subsets: ["latin"],            // Subset de caractères (latin ici)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Définition de la variable pour la police Geist Mono
  subsets: ["latin"],            // Subset de caractères (latin ici)
});

// Métadonnées pour le site (utilisation cohérente)
export const metadata = {
  title: "root3d",  // Titre de la page
  description: "A creative studio specializing in web development, 3D design, and 3D printing, bringing your ideas to life in the digital and physical worlds",  // Description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
