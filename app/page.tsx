"use client";

import Image from "next/image";
import { SignInButton } from "./Components/buttons/signIn-button";
import Dashboard from "./Components/dashboard";


export default function Home() {
  return (
    <main>
      <Dashboard/>
    </main>
  );
}