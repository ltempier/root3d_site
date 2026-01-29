// app/page.js
import React from 'react';

import Logo from './components/logo3d';  // Assure-toi que le chemin est correct pour ton composant Logo

export default function HomePage() {
  return (
    <div>
      <h2>Bienvenue sur la page d'accueil !</h2>
      <p>C'est ici que tu peux commencer à coder !</p>


       <Logo />



    </div>
  );
}
