import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import {
  IntegrationType,
  OverlaySize,
} from "../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";

export function OverlayContent({
  overlayDimensions,
  setUiState,
  uiState,
  integrationState,
}: {
  overlayDimensions: OverlayDimensions;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  console.log(uiState);
  if (uiState.overlaySize === OverlaySize.SMALL) {
    return (
      <div style={{ height: "100%", width: "100%", display: "block" }}>
        small
      </div>
    );
  } else if (uiState.overlaySize === OverlaySize.MEDIUM) {
    return (
      <div style={{ height: "100%", width: "100%", display: "block" }}>
        medium
      </div>
    );
  }
  return (
    <div style={{ height: "95%", width: "100%", display: "block" }}>
      {uiState.integrationType === IntegrationType.CB_VN ? (
        <CBVNContent integrationState={integrationState} />
      ) : uiState.integrationType === IntegrationType.CHECKOUT_PRODUCTS ? (
        <CheckoutProductsContent integrationState={integrationState} />
      ) : (
        <OptimizeContent integrationState={integrationState} />
      )}
    </div>
  );
}

function CBVNContent({
  integrationState,
}: {
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return integrationState.selfTester ? (
    <div style={styles.contentContainer}>
      <h2 style={styles.sectionTitle}>Sovendus Partner Numbers:</h2>
      <p style={styles.text}>
        trafficSourceNumber:{" "}
        {integrationState.selfTester.trafficSourceNumber.elementValue}
      </p>
      <p style={styles.text}>
        trafficMediumNumber:{" "}
        {integrationState.selfTester.trafficMediumNumber.elementValue}
      </p>

      <h2 style={styles.sectionTitle}>Sovendus Container:</h2>
      <p style={styles.text}>
        iframeContainerId:{" "}
        {integrationState.selfTester.iFrameContainerId.elementValue}
      </p>

      <h2 style={styles.sectionTitle}>Order Data:</h2>
      <p style={styles.text}>
        orderCurrency: {integrationState.selfTester.orderCurrency.elementValue}
      </p>
      <p style={styles.text}>
        orderId: {integrationState.selfTester.orderId.elementValue}
      </p>
      <p style={styles.text}>
        orderValue: {integrationState.selfTester.orderValue.elementValue}
      </p>
      <p style={styles.text}>
        sessionId: {integrationState.selfTester.sessionId.elementValue}
      </p>
      <p style={styles.text}>
        timestamp: {integrationState.selfTester.timestamp.elementValue}
      </p>
      <p style={styles.text}>
        usedCouponCode:{" "}
        {integrationState.selfTester.usedCouponCode.elementValue}
      </p>

      <h2 style={styles.sectionTitle}>Customer Data:</h2>
      <p style={styles.text}>
        consumerSalutation:{" "}
        {integrationState.selfTester.consumerSalutation.elementValue}
      </p>
      <p style={styles.text}>
        consumerFirstName:{" "}
        {integrationState.selfTester.consumerFirstName.elementValue}
      </p>
      <p style={styles.text}>
        consumerLastName:{" "}
        {integrationState.selfTester.consumerLastName.elementValue}
      </p>
      <p style={styles.text}>
        consumerYearOfBirth:{" "}
        {integrationState.selfTester.consumerYearOfBirth.elementValue}
      </p>
      <p style={styles.text}>
        consumerDateOfBirth:{" "}
        {integrationState.selfTester.consumerDateOfBirth.elementValue}
      </p>
      <p style={styles.text}>
        consumerEmail: {integrationState.selfTester.consumerEmail.elementValue}
      </p>
      <p style={styles.text}>
        consumerEmailHash:{" "}
        {integrationState.selfTester.consumerEmailHash.elementValue}
      </p>
      <p style={styles.text}>
        consumerPhone: {integrationState.selfTester.consumerPhone.elementValue}
      </p>
      <p style={styles.text}>
        consumerStreet:{" "}
        {integrationState.selfTester.consumerStreet.elementValue}
      </p>
      <p style={styles.text}>
        consumerStreetNumber:{" "}
        {integrationState.selfTester.consumerStreetNumber.elementValue}
      </p>
      <p style={styles.text}>
        consumerZipcode:{" "}
        {integrationState.selfTester.consumerZipCode.elementValue}
      </p>
      <p style={styles.text}>
        consumerCity: {integrationState.selfTester.consumerCity.elementValue}
      </p>
      <p style={styles.text}>
        consumerCountry:{" "}
        {integrationState.selfTester.consumerCountry.elementValue}
      </p>
    </div>
  ) : (
    <></>
  );
}

function CheckoutProductsContent({
  integrationState,
}: {
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return integrationState.selfTester ? (
    <div style={styles.contentContainer}>
      <h2 style={styles.sectionTitle}>Checkout Products Data:</h2>
      <p style={styles.text}>checkoutProductsToken: {""}</p>
      <p style={styles.text}>checkoutProductsId: {""}</p>
    </div>
  ) : (
    <></>
  );
}

function OptimizeContent({
  integrationState,
}: {
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return integrationState.selfTester ? (
    <div style={styles.contentContainer}>
      <h2 style={styles.sectionTitle}>Optimize Data:</h2>
      <p style={styles.text}>optimizeId: {""}</p>
      <p style={styles.text}>checkoutProductsToken: {""}</p>
      <p style={styles.text}>checkoutProductsId: {""}</p>
      <p style={styles.text}>legacy_profityId: {""}</p>
      <p style={styles.text}>
        couponCode: {integrationState.selfTester.usedCouponCode.elementValue}
      </p>
    </div>
  ) : (
    <></>
  );
}

const styles: {
  contentContainer: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  text: React.CSSProperties;
} = {
  contentContainer: {
    padding: "20px",
    paddingTop: "0px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    overflowY: "auto",
    maxHeight: "calc(100% - 50px)",
  },
  sectionTitle: {
    color: "#333",
    fontSize: "18px",
    marginBottom: "10px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "5px",
  },
  text: {
    color: "#000",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
};
