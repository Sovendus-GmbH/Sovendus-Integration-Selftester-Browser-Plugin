import { PDFDocument, rgb } from "pdf-lib";
import type { JSX } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../detector/integration-detector";
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
    const pdfDoc = await PDFDocument.create();

    const fontSize = 18;
    const lineHeight = 20;

    // Calculate the required height
    const calculateHeight = (): number => {
      let height = 4 * fontSize + 40; // Initial height for the title and spacing

      const addHeightForTestResult = (result: TestResult): void => {
        height += 16 + lineHeight; // Title and status
        if (result.details) {
          height += lineHeight;
        }
        if (result.integrationTester) {
          const fields = [
            result.integrationTester.consumerSalutation?.elementValue,
            result.integrationTester.consumerFirstName?.elementValue,
            result.integrationTester.consumerLastName?.elementValue,
            result.integrationTester.consumerYearOfBirth?.elementValue,
            result.integrationTester.consumerDateOfBirth?.elementValue,
            result.integrationTester.consumerEmail?.elementValue,
            result.integrationTester.consumerEmailHash?.elementValue,
            result.integrationTester.consumerPhone?.elementValue,
            result.integrationTester.consumerStreet?.elementValue,
            result.integrationTester.consumerStreetNumber?.elementValue,
            result.integrationTester.consumerZipCode?.elementValue,
            result.integrationTester.consumerCity?.elementValue,
            result.integrationTester.consumerCountry?.elementValue,
            result.integrationTester.orderCurrency?.elementValue,
            result.integrationTester.orderId?.elementValue,
            result.integrationTester.orderValue?.elementValue,
            result.integrationTester.sessionId?.elementValue,
            result.integrationTester.timestamp?.elementValue,
            result.integrationTester.usedCouponCode?.elementValue,
            result.integrationTester.trafficSourceNumber?.elementValue,
            result.integrationTester.trafficMediumNumber?.elementValue,
            result.integrationTester.iFrameContainerId?.elementValue,
          ];
          fields.forEach((field) => {
            if (field) {
              height += lineHeight;
            }
          });
        }
      };

      addHeightForTestResult(currentTestRun.landingPageResult);
      addHeightForTestResult(currentTestRun.successPageResult);

      height += lineHeight * 3; // For overlayState details

      return height + 100; // Additional spacing
    };

    const pageHeight = calculateHeight();
    const page = pdfDoc.addPage([1000, pageHeight]); // A4 size width, dynamic height

    let yOffset = pageHeight - 3 * fontSize;
    page.drawText("Integration Test Report", {
      x: 50,
      y: yOffset,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yOffset -= fontSize * 2;

    const renderTestResult = (
      result: TestResult,
      title: string,
      yOffset: number,
    ): number => {
      let y = yOffset;
      page.drawText(title, { x: 50, y, size: 16, color: rgb(0, 0, 0) });
      y -= lineHeight;
      page.drawText(`Status: ${result.status}`, {
        x: 50,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      if (result.details) {
        page.drawText(`Details: ${result.details}`, {
          x: 50,
          y,
          size: 12,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
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
          if (field) {
            page.drawText(field, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
            y -= lineHeight;
          }
        });
      }
      return y;
    };

    const renderIntegrationState = (
      integrationState: IntegrationDetectorData,
      yOffset: number,
    ): number => {
      let y = yOffset;
      page.drawText("Integration State", {
        x: 50,
        y,
        size: 16,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      page.drawText(
        `Detection State: ${integrationState.status.detectionState}`,
        {
          x: 50,
          y,
          size: 12,
          color: rgb(0, 0, 0),
        },
      );
      y -= lineHeight;
      page.drawText(`Testing State: ${integrationState.status.testingState}`, {
        x: 50,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      return y;
    };

    page.drawText(
      `Test Start Time: ${new Date(currentTestRun.startTime).toLocaleString()}`,
      {
        x: 50,
        y: yOffset,
        size: 12,
        color: rgb(0, 0, 0),
      },
    );
    yOffset -= lineHeight;
    page.drawText(
      `With Consent: ${currentTestRun.withConsent ? "Yes" : "No"}`,
      {
        x: 50,
        y: yOffset,
        size: 12,
        color: rgb(0, 0, 0),
      },
    );
    yOffset -= lineHeight;

    yOffset = renderTestResult(
      currentTestRun.landingPageResult,
      "Landing Page Result",
      yOffset,
    );
    yOffset = renderTestResult(
      currentTestRun.successPageResult,
      "Success Page Result",
      yOffset,
    );

    const overlayStateDetails = [
      `Current Host: ${overlayState.currentHost}`,
      `Integration State: ${overlayState.integrationState.status.detectionState}`,
      `Prompt Visible: ${overlayState.isPromptVisible}`,
    ];
    overlayStateDetails.forEach((detail) => {
      page.drawText(detail, {
        x: 50,
        y: yOffset,
        size: 12,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineHeight;
    });

    yOffset = renderIntegrationState(overlayState.integrationState, yOffset);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "IntegrationTestReport.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={void generatePDF}>Download Integration Test Report</button>
  );
}
