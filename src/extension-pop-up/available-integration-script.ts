import {
  sovendusOverlayErrorClass,
  sovendusOverlayFontClass,
  sovendusOverlayH1Class,
  sovendusOverlayH2Class,
  sovendusOverlayH3Class,
} from "@src/integration-tester-ui/integration-test-overlay-css-vars.js";

import { transmitIntegrationError } from "../integration-tester/integrationTester.js";

const overlay = document.getElementById(
  "outerSovendusIntegrationMethodCheckerOverlay",
);
if (!overlay) {
  class availableMethodsChecker {
    apiKeys: string[] = [
      "whz2mjdra9s0s0s683zodmidj6mo5d1v3gas3hbglcp73j6e16ufvo8k5i7lofnengl94u",
      "wr9wyithqrnw9nnxuja2yjw2gpcr83cytckmjzcjbxzobm57wjcs0c82aazqm9aufog6v2",
    ];
    supportedSystems: {
      [key in SupportedSystemsKeyType]: SupportedSystemType;
    } = {
      "WooCommerce": {
        name: "WooCommerce",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Wordpress-WooCommerce-Plugin",
      },
      "Shopware": {
        name: "Shopware",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Shopware-Plugin",
      },
      "Nuxt.js": {
        name: "Nuxt.js / Vue",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Vue-Component",
      },
      "Magento": {
        name: "Magento",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Magento-Plugin",
      },
      "Next.js": {
        name: "Next.js / React",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/React-Component",
      },
      "Shopify": {
        name: "New Shopify Checkout Page Version",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Shopify-App-(new-Version)",
        nameAlternative: "Old Shopify Checkout Page Version",
        docsLinkAlternative:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Shopify-Integration-(old-version)",
      },
      // "New Shopify": {
      //   name: "New Shopify Checkout Page Version",
      //   docsLink:
      //     "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Shopify-App-(new-Version)",
      // },
      "OXID eSales": {
        name: "OXID eShop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Oxid-eShop-Plugin",
      },
      "OXID eShop Enterprise Edition": {
        name: "OXID eShop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Oxid-eShop-Plugin",
      },
      "OXID eShop Community Edition": {
        name: "OXID eShop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Oxid-eShop-Plugin",
      },
      "OXID eShop Professional Edition": {
        name: "OXID eShop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Oxid-eShop-Plugin",
      },
      "PrestaShop": {
        name: "PrestaShop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Prestashop-Plugin",
      },
      "JTL-Shop": {
        name: "JTL-Shop",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/JTL-Plugin",
      },
      "BigCommerce": {
        name: "BigCommerce",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/BigCommerce-Integration",
      },
      "gtm": {
        name: "Google Tag Manager",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Google-Tagmanager-Integration",
      },
      "generic": {
        name: "Generic",
        docsLink:
          "https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Generic-Web-Integration",
      },
    };
    statusCodes: StatusCodesType = {
      success: "success",
      fail: "fail",
    };

    async getAvailableMethodsMessage(): Promise<string> {
      let availableMethodsText: string;
      const { data, responseStatusCode, responseErrorMessage } =
        await this.getAvailableMethodsResponse();
      if (responseStatusCode === this.statusCodes.fail) {
        availableMethodsText = responseErrorMessage;
        return availableMethodsText;
      }
      const {
        shopSystemName,
        cmsName,
        webFrameworkName,
        statusCode,
        errorMessage,
      } = this.getAvailableMethodsFromResponse(data);
      let availableMethods: string = "";
      if (shopSystemName && this.supportedSystems[shopSystemName]) {
        availableMethods = this.formatIntegrationOption(
          this.supportedSystems[shopSystemName],
        );
      } else if (cmsName && this.supportedSystems[cmsName]) {
        availableMethods = this.formatIntegrationOption(
          this.supportedSystems[cmsName],
        );
      } else if (webFrameworkName && this.supportedSystems[webFrameworkName]) {
        availableMethods = this.formatIntegrationOption(
          this.supportedSystems[webFrameworkName],
        );
      }
      const gtmAvailable = this.checkIfGtmIsIntegrated();
      // ${this.formatIntegrationOption(
      //   this.supportedSystems.generic,
      //   null,
      //   " Integration"
      // )}
      availableMethodsText = `
  <h3 class='${sovendusOverlayFontClass} ${sovendusOverlayH3Class}' style="border: 1px solid; border-radius: 8px; padding: 8px; text-align: center;">
    Note that the detection can be wrong and incomplete!
  </h3>
  <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">The following integration methods are available:</h2>
  <h3 class='${sovendusOverlayFontClass} ${sovendusOverlayH3Class}'>
    Generic Integration
  </h3>
  <a href='${this.supportedSystems.generic.docsLink}' target='_blank'>
  ${this.supportedSystems.generic.name} Integration Documentation
  </a>
  ${availableMethods}
  ${gtmAvailable ? this.formatIntegrationOption(this.supportedSystems.gtm) : ""}
`;
      console.log("CMS detection result:", {
        shopSystemName,
        cmsName,
        webFrameworkName,
        statusCode,
        errorMessage,
      });

      return availableMethodsText;
    }
    formatIntegrationOption(
      supportedSystem: SupportedSystemType,
      titlePrefix: string | null = "Integration via ",
      titleSuffix: string | null = null,
    ): string {
      return `
<h3 class='${sovendusOverlayFontClass} ${sovendusOverlayH3Class}'>
  ${titlePrefix ? titlePrefix : ""}${supportedSystem.name.startsWith("New Shopify") ? "Shopify" : supportedSystem.name}${
    titleSuffix ? titleSuffix : ""
  }
</h3>
<a href='${supportedSystem.docsLink}' target='_blank'>
  ${supportedSystem.name} Integration Documentation
</a>
${
  supportedSystem.nameAlternative
    ? `<br />
  <a href="${supportedSystem.docsLinkAlternative}" target="_blank">
    ${supportedSystem.nameAlternative} Integration Documentation
  </a>
`
    : ""
}
`;
    }

    checkIfGtmIsIntegrated(): boolean {
      return Boolean(
        document.querySelectorAll(
          '[src*="https://www.googletagmanager.com/gtm.js?id="]',
        ).length,
      );
    }

    async getAvailableMethodsResponse(): Promise<{
      data: AvailableMethodsResponseType;
      responseStatusCode: StatusCodeType;
      responseErrorMessage: string;
    }> {
      const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
      let responseStatusCode: StatusCodeType;
      let responseErrorMessage: string = "";
      try {
        const response = await fetch(
          `https://whatcms.org/API/Tech?key=${this.apiKeys[randomIndex]}&url=${window.location.origin}`,
        );
        const data = await response.json();
        responseStatusCode = this.statusCodes.success;
        return { data, responseStatusCode, responseErrorMessage };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-console
        console.error("Error fetching data:", error?.message || error);
        void transmitIntegrationError(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Error fetching data: ${error?.message || error}`,
          { windowParameter: window },
        );
        responseStatusCode = this.statusCodes.fail;
        responseErrorMessage = this.formatErrorMessage(
          "Error fetching data:",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          error?.message || error,
        );
        return { data: {}, responseStatusCode, responseErrorMessage };
      }
    }
    formatErrorMessage(errorTitle: string, errorMessage: string): string {
      return `
  <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class} ${sovendusOverlayErrorClass}">${errorTitle}</h2>
  <h3 class="${sovendusOverlayFontClass} ${sovendusOverlayH3Class} ${sovendusOverlayErrorClass}">${errorMessage}</h3>
`;
    }

    getAvailableMethodsFromResponse(
      responseJson: AvailableMethodsResponseType,
    ): {
      shopSystemName: SupportedSystemsKeyType;
      cmsName: SupportedSystemsKeyType;
      webFrameworkName: SupportedSystemsKeyType;
      statusCode: StatusCodeType;
      errorMessage: string;
    } {
      let statusCode: StatusCodeType = this.statusCodes.fail;
      let shopSystemName = "";
      let cmsName = "";
      let errorMessage = "";
      let webFrameworkName = "";
      if (responseJson.results && responseJson.result) {
        for (const technology of responseJson.results) {
          if (technology.categories.includes("E-commerce")) {
            statusCode = this.statusCodes.success;
            shopSystemName += shopSystemName
              ? `, ${technology.name}`
              : technology.name;
          }
          if (technology.categories.includes("CMS")) {
            cmsName += cmsName ? `, ${technology.name}` : technology.name;
          }
          if (technology.categories.includes("Web Framework")) {
            webFrameworkName += webFrameworkName
              ? `, ${technology.name}`
              : technology.name;
          }
        }

        if (statusCode === this.statusCodes.fail && cmsName === "") {
          errorMessage = responseJson.result.msg;
          if (![201, 202].includes(responseJson.result.code)) {
            if (responseJson.result.code === 200) {
              errorMessage = "Error, no CMS or Shopsystem detected";
            } else {
              // eslint-disable-next-line no-console
              console.error("Error in function checkAvailableIntegrations");
              void transmitIntegrationError(
                "Error in function checkAvailableIntegrations",
                { windowParameter: window },
              );
            }
          }
        }
      } else {
        errorMessage = "Failed to get detection result - unknown error";
      }
      if (errorMessage) {
        void transmitIntegrationError(errorMessage, {
          windowParameter: window,
        });
      }

      return {
        shopSystemName: shopSystemName as SupportedSystemsKeyType,
        cmsName: cmsName as SupportedSystemsKeyType,
        webFrameworkName: webFrameworkName as SupportedSystemsKeyType,
        statusCode,
        errorMessage,
      };
    }

    async createCheckIntegrationMethodsOverlay(): Promise<void> {
      const overlay = document.createElement("div");
      overlay.id = "outerSovendusIntegrationMethodCheckerOverlay";
      overlay.innerHTML = `
${this.getCheckerOverlayStyle()}
<div class="${sovendusOverlayFontClass}" id="sovendusIntegrationMethodCheckerOverlay">  
  <div style="margin:auto;max-width:500px;">
    <div>
    <h1 class="${sovendusOverlayFontClass} ${sovendusOverlayH1Class}">Sovendus Integration Methods Checker</h1>
    </div>
    <div id="sovendusDetectionResult">
      <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">Detection in progress, this can take up to 20 seconds</h2>
    </div>
  </div>
</div>
`;
      document.body.appendChild(overlay);
      const availableMethodsMessage = await this.getAvailableMethodsMessage();
      const sovendusDetectionResultDiv = document.getElementById(
        "sovendusDetectionResult",
      );
      if (sovendusDetectionResultDiv) {
        sovendusDetectionResultDiv.innerHTML = availableMethodsMessage;
      }
    }

    getCheckerOverlayStyle(): string {
      return `
    <style>
      #sovendusIntegrationMethodCheckerOverlay {
        position: fixed !important;
        left: calc(50% - 300px) !important;
        right: calc(50% - 300px) !important;  
        width: 500px !important;
        max-width: calc(100vw - 44px) !important;
        top: 50px !important;
        padding: 22px !important;
        background: #293049 !important;
        z-index: 2147483647 !important;
        overflow-y: auto !important;
        max-height: calc(100vh - 100px) !important;
        border-radius: 8px !important;    
        line-height: normal !important;  
      }
      @media only screen and (max-width: 700px) {
        #sovendusIntegrationMethodCheckerOverlay {
          left: 0 !important;
          right: 0 !important;
        }
      }
      .${sovendusOverlayH1Class} {
        font-size: 27px !important;
        margin-top: 0 !important;
        margin-bottom: 5px !important;
      }
      .${sovendusOverlayH2Class} {
        font-size: 22px !important;
        margin-top: 10px !important;
        margin-bottom: 4px !important;
      }
      .${sovendusOverlayH3Class} {
        font-size: 19px !important;
        margin-top: 10px !important;
        margin-bottom: 3px !important;
      }
      .${sovendusOverlayFontClass} a {
        color: rgb(60, 139, 253);
      }
      .${sovendusOverlayFontClass} a:hover {
        color: rgb(0 94 230);;
      }
      .${sovendusOverlayFontClass} {
        color: white !important;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      .${sovendusOverlayErrorClass} {
        color: red !important;
      }
    </style>
  `;
    }
  }
  const availableMethodsInstance = new availableMethodsChecker();
  void availableMethodsInstance.createCheckIntegrationMethodsOverlay();
}

type StatusCodeType = "fail" | "success";

interface StatusCodesType {
  success: StatusCodeType;
  fail: StatusCodeType;
}

interface AvailableMethodsResponseType {
  results?: AvailableMethodsResponseResultsType[];
  result?: { msg: string; code: 200 };
}

interface AvailableMethodsResponseResultsType {
  categories: string[];
  name: string;
}

interface SupportedSystemType {
  name: string;
  docsLink: string;
  nameAlternative?: string;
  docsLinkAlternative?: string;
}

type SupportedSystemsKeyType =
  | "WooCommerce"
  | "Shopware"
  | "Nuxt.js"
  | "Magento"
  | "Next.js"
  | "Shopify"
  | "OXID eSales"
  | "OXID eShop Enterprise Edition"
  | "OXID eShop Community Edition"
  | "OXID eShop Professional Edition"
  | "PrestaShop"
  | "JTL-Shop"
  | "BigCommerce"
  | "gtm"
  | "generic";
