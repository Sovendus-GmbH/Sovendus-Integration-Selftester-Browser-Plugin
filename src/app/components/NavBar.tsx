import type { JSX } from "react";
import React from "react";

import { ClearTesterStorageButton } from "./SelfTester";

export default function NavBar({
  currentPage,
}: {
  currentPage: "/" | "/empty-page" | "/thank-you";
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        // paddingTop: "40px",
        paddingBottom: "40px",
        gap: "30px",
      }}
    >
      <a href={"/"}>
        <button disabled={currentPage === "/"} style={{ padding: "5px" }}>
          Landing Page
        </button>
      </a>
      <a href={"/empty-page"}>
        <button
          disabled={currentPage === "/empty-page"}
          style={{ padding: "5px" }}
        >
          empty-page
        </button>
      </a>
      <a href={"/thank-you"}>
        <button
          disabled={currentPage === "/thank-you"}
          style={{ padding: "5px" }}
        >
          go to thank you page
        </button>
      </a>
      <ClearTesterStorageButton />
    </div>
  );
}
