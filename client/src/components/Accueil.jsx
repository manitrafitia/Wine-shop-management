import React from 'react'
import Intro from './Intro';
import Bilan from './Bilan';
import VinPopulaires from './VinPopulaires';
import About from './About';
import Contact from './Contact';

export default function Accueil() {
  return (
    <>
    <div className="dark:bg-black">
      <Intro id="intro" />
      <Bilan id="bilan" />
      <VinPopulaires id="vinPopulaires" />
      <About id="about" />
      <Contact id="contact" />
    </div>
    </>
  )
}
