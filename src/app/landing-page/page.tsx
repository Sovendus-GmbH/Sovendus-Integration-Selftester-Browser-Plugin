import type { JSX } from "react";

import PageForm from "./PageForm";
import SovendusLandingPage from "./SovendusLanding";

export default function Home(): JSX.Element {
  return (
    <div>
      <h1 style={{ paddingBottom: "40px" }}>This is a example landing page</h1>
      <div>
        <PageForm />
      </div>
      <SovendusLandingPage />
    </div>
  );
}
