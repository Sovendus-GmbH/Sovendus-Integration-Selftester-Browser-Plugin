"use client";

import type { JSX } from "react";
import React, { useState } from "react";

export default function PageForm(): JSX.Element {
  const [testForm, setTestForm] = useState(initialForm);
  function onchange(
    value: string,
    interfaceKey: string,
    elementKey: string,
  ): void {
    setTestForm((prevForm) => {
      const newForm = { ...prevForm };
      (
        (newForm[interfaceKey] as { [key: string]: { value: string } })[
          elementKey
        ] as { value: string }
      ).value = value;
      return newForm;
    });
  }
  return (
    <>
      <div style={{ display: "flex", gap: "40px", flexDirection: "row" }}>
        {Object.entries(testForm).map(([interfaceKey, interfaceData]) => {
          return (
            <div key={interfaceKey}>
              <h2>{interfaceKey}</h2>
              {Object.entries(interfaceData).map(
                ([elementKey, elementData]) => {
                  return (
                    <div key={elementKey}>
                      <h3>{elementData.key}</h3>
                      <input
                        onChange={(event) =>
                          onchange(
                            event.currentTarget.value,
                            interfaceKey,
                            elementKey,
                          )
                        }
                        value={elementData.value}
                      />
                    </div>
                  );
                },
              )}
            </div>
          );
        })}
      </div>

      <ApplyFormButton testForm={testForm} />
    </>
  );
}

export type InitialFormType = {
  [paramTypeKey in "urlParamsData" | "scriptParamsData"]: {
    [paramKey in
      | "optimizeId"
      | "checkoutProductsToken"
      | "checkoutProductsId"
      | "legacy_profityId"
      | "debug"
      | "couponCode"]: {
      value: string | undefined;
      key: string;
    };
  };
};

export const initialForm: InitialFormType = {
  urlParamsData: {
    optimizeId: { value: "test-optimizeId", key: "sovOptimizeId" },
    checkoutProductsToken: {
      value: "test-checkoutProductsToken",
      key: "sovReqToken",
    },
    checkoutProductsId: {
      value: "test-checkoutProductsId",
      key: "sovReqProductId",
    },
    legacy_profityId: { value: "test-legacy_profityId", key: "puid" },
    couponCode: { value: "test-couponCode", key: "sovCouponCode" },
    debug: { value: "debug", key: "sovDebugLevel" },
  },
  scriptParamsData: {
    optimizeId: { value: "test-optimizeId", key: "sovOptimizeId" },
    checkoutProductsToken: { value: undefined, key: "sovReqToken" },
    checkoutProductsId: { value: undefined, key: "sovReqProductId" },
    legacy_profityId: { value: undefined, key: "puid" },
    couponCode: { value: undefined, key: "sovCouponCode" },
    debug: { value: "debug", key: "sovDebugLevel" },
  },
};

function ApplyFormButton({
  testForm,
}: {
  testForm: InitialFormType;
}): JSX.Element {
  function createTargetUrl(): string {
    const params = new URLSearchParams();
    Object.values(testForm.urlParamsData).forEach((valueData) => {
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
