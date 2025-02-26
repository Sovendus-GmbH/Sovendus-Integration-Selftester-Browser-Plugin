"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

import { ClearTesterStorageButton } from "./SelfTester";

export default function NavBar(): JSX.Element {
  const currentPage = usePathname();
  return (
    <div
      style={{
        display: "flex",
        paddingBottom: "20px",
        gap: "30px",
      }}
    >
      <Link href={"/"}>
        <button disabled={currentPage === "/"} style={{ padding: "5px" }}>
          empty-page
        </button>
      </Link>
      <Link href={"/settings"}>
        <button
          disabled={currentPage === "/settings"}
          style={{ padding: "5px" }}
        >
          Settings Page
        </button>
      </Link>
      <Link href={"/landing-page"}>
        <button
          disabled={currentPage === "/landing-page"}
          style={{ padding: "5px" }}
        >
          Landing Page
        </button>
      </Link>
      <Link href={"/thank-you"}>
        <button
          disabled={currentPage === "/thank-you"}
          style={{ padding: "5px" }}
        >
          go to thank you page
        </button>
      </Link>
      <ClearTesterStorageButton />
    </div>
  );
}
