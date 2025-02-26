"use client";

import type { JSX } from "react";
import { useState } from "react";

export default function PageForm(): JSX.Element {
  const [testForm, setTestForm] = useState(initialForm);
  function onchange(value: string, elementKey: string): void {
    setTestForm((prevForm) => {
      const newForm = { ...prevForm };
      (
        (newForm as { [key: string]: { value: string } })[elementKey] as {
          value: string;
        }
      ).value = value;
      return newForm;
    });
  }
  return (
    <>
      <div style={{ display: "flex", gap: "40px", flexDirection: "row" }}>
        <div>
          <h2>Apply URL params to test some features</h2>
          {Object.entries(testForm).map(([elementKey, elementData]) => {
            return (
              <div key={elementKey}>
                <h3>{elementData.key}</h3>
                <input
                  onChange={(event) =>
                    onchange(event.currentTarget.value, elementKey)
                  }
                  value={elementData.value}
                />
              </div>
            );
          })}
        </div>
      </div>

      <ApplyFormButton testForm={testForm} />
    </>
  );
}

export type InitialFormType = {
  [paramKey in
    | "checkoutProductsToken"
    | "legacy_profityId"
    | "debug"
    | "couponCode"]: {
    value: string | undefined;
    key: string;
  };
};

export const initialForm: InitialFormType = {
  checkoutProductsToken: {
    value: "test-checkoutProductsToken",
    key: "sovReqToken",
  },
  legacy_profityId: { value: "test-profityId", key: "puid" },
  couponCode: { value: "test-couponCode", key: "sovCouponCode" },
  debug: { value: "debug", key: "sovDebugLevel" },
};

function ApplyFormButton({
  testForm,
}: {
  testForm: InitialFormType;
}): JSX.Element {
  function createTargetUrl(): string {
    const params = new URLSearchParams();
    Object.values(testForm).forEach((valueData) => {
      if (valueData.value) {
        params.append(valueData.key, valueData.value);
      }
    });
    return `/?${params.toString()}`;
  }

  const targetUrl = createTargetUrl();
  return (
    <div style={{ paddingTop: "20px" }}>
      <a href={targetUrl}>
        <button>Apply values</button>
      </a>
    </div>
  );
}
