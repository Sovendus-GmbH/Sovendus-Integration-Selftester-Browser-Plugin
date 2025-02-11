import type { JSX } from "react";
import React from "react";

import NavBar from "../components/NavBar";

export default function EmptyPage(): JSX.Element {
  return (
    <div>
      <main style={{ padding: "40px" }}>
        <NavBar currentPage="/empty-page" />
        <h1 style={{ paddingBottom: "40px" }}>This is a empty example page</h1>
      </main>
    </div>
  );
}
