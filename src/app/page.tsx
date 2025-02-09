import type { JSX } from "react";
import React from "react";

import NavBar from "./components/NavBar";
import PageForm from "./components/page/PageForm";
import SovendusLandingPage from "./components/page/SovendusLanding";

export default function Home(): JSX.Element {
  return (
    <div>
      <main style={{ padding: "40px" }}>
        <NavBar currentPage="/" />
        <h1 style={{ paddingBottom: "40px" }}>
          This is a example landing page
        </h1>
        <h2 style={{ paddingBottom: "40px" }}>Try to set some parameters</h2>
        <div>
          <PageForm />
        </div>
        <SovendusLandingPage />
      </main>
    </div>
  );
}
