import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { JSX } from "react";
import React from "react";

pdfMake.vfs = pdfFonts.vfs;

import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

import type { OverlayState } from "../tester-ui/hooks/use-overlay-state";
import type { TestRun } from "../tester-ui/testing-storage";
import type { TestResult } from "../tester-ui/testing-storage";

export function DownloadIntegrationTestReport({
  currentTestRun,
  overlayState,
}: {
  currentTestRun: TestRun;
  overlayState: OverlayState;
}): JSX.Element {
  const generatePDF = async (): Promise<void> => {
    const content: Content = [];
    content.push({ text: "Integration Test Report", style: "header" });
    content.push({
      text: `Test Start Time: ${new Date(currentTestRun.startTime).toLocaleString()}`,
      style: "normal",
    });
    content.push({
      text: `With Consent: ${currentTestRun.withConsent ? "Yes" : "No"}`,
      style: "normal",
    });
    content.push({
      text: `Current Host: ${overlayState.currentHost}`,
      style: "normal",
    });

    const gatherTestResultLines = (
      result: TestResult,
      sectionTitle: string,
    ): void => {
      content.push({ text: sectionTitle, style: "subheader" });
      if (result.integrationTester) {
        const fields = [
          `Salutation: ${result.integrationTester.consumerSalutation?.elementValue}`,
          `First Name: ${result.integrationTester.consumerFirstName?.elementValue}`,
          `Last Name: ${result.integrationTester.consumerLastName?.elementValue}`,
          `Year of Birth: ${result.integrationTester.consumerYearOfBirth?.elementValue}`,
          `Date of Birth: ${result.integrationTester.consumerDateOfBirth?.elementValue}`,
          `Email: ${result.integrationTester.consumerEmail?.elementValue}`,
          `Email Hash: ${result.integrationTester.consumerEmailHash?.elementValue}`,
          `Phone: ${result.integrationTester.consumerPhone?.elementValue}`,
          `Street: ${result.integrationTester.consumerStreet?.elementValue}`,
          `Street Number: ${result.integrationTester.consumerStreetNumber?.elementValue}`,
          `Zip Code: ${result.integrationTester.consumerZipCode?.elementValue}`,
          `City: ${result.integrationTester.consumerCity?.elementValue}`,
          `Country: ${result.integrationTester.consumerCountry?.elementValue}`,
          `Order Currency: ${result.integrationTester.orderCurrency?.elementValue}`,
          `Order ID: ${result.integrationTester.orderId?.elementValue}`,
          `Order Value: ${result.integrationTester.orderValue?.elementValue}`,
          `Session ID: ${result.integrationTester.sessionId?.elementValue}`,
          `Timestamp: ${result.integrationTester.timestamp?.elementValue}`,
          `Used Coupon Code: ${result.integrationTester.usedCouponCode?.elementValue}`,
          `Traffic Source Number: ${result.integrationTester.trafficSourceNumber?.elementValue}`,
          `Traffic Medium Number: ${result.integrationTester.trafficMediumNumber?.elementValue}`,
          `iFrame Container ID: ${result.integrationTester.iFrameContainerId?.elementValue}`,
        ];
        fields.forEach((field) => {
          content.push({ text: field, style: "normal" });
        });
      }
    };

    gatherTestResultLines(
      currentTestRun.landingPageResult,
      "Landing Page Result",
    );
    gatherTestResultLines(
      currentTestRun.successPageResult,
      "Success Page Result",
    );

    const loadImage = (src: string): Promise<number> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = (): void => resolve(img.width);
        img.onerror = (): void => resolve(0);
      });
    };

    const landingPageImageWidth = currentTestRun.landingPageResult.screenshotUri
      ? await loadImage(currentTestRun.landingPageResult.screenshotUri)
      : 0;

    const successPageImageWidth = currentTestRun.successPageResult.screenshotUri
      ? await loadImage(currentTestRun.successPageResult.screenshotUri)
      : 0;

    const pageWidth =
      Math.max(landingPageImageWidth, successPageImageWidth, 900) + 100;

    if (currentTestRun.landingPageResult.screenshotUri) {
      content.push({ text: "Landing Page Screenshot:", style: "subheader" });
      content.push({
        image: currentTestRun.landingPageResult.screenshotUri,
        width: pageWidth,
        margin: [-50, 10, -50, 20],
      });
    }

    if (currentTestRun.successPageResult.screenshotUri) {
      content.push({ text: "Success Page Screenshot:", style: "subheader" });
      content.push({
        image: currentTestRun.successPageResult.screenshotUri,
        width: pageWidth - 100,
        margin: [-50, 10, -50, 20],
      });
    }

    const docDefinition: TDocumentDefinitions = {
      pageSize: {
        width: pageWidth,
        height: "auto",
      },
      pageMargins: [50, 50, 50, 50],
      content: content,
      styles: {
        header: {
          fontSize: 25,
          bold: true,
          margin: [0, 10, 0, 10],
        },
        subheader: {
          fontSize: 22,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        normal: {
          fontSize: 18,
          margin: [0, 5, 0, 5],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("IntegrationTestReport.pdf");
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <button onClick={generatePDF}>Download Integration Test Report</button>
  );
}

export default DownloadIntegrationTestReport;
