var overlay = document.getElementById(
  "outerSovedusIntegrationMethodCheckerOverlay"
);
if (!overlay) {
  class availableMethodsChecker {
    apiKeys: string[] = [
      "whz2mjdra9s0s0s683zodmidj6mo5d1v3gas3hbglcp73j6e16ufvo8k5i7lofnengl94u",
      "wr9wyithqrnw9nnxuja2yjw2gpcr83cytckmjzcjbxzobm57wjcs0c82aazqm9aufog6v2",
    ];
    supportedSystems: { [key in SupportedSystemKeyType]: supportedSystem } = {
      WooCommerce: {
        name: "WooCommerce",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Wordpress-WooCommerce-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-plugin-for-wordpress-woocommerce",
      },
      Shopware: {
        name: "Shopware",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Shopware-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-plugin-for-shopware",
      },
      "Nuxt.js": {
        name: "Nuxt.js / Vue",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-Component-for-Vue?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-component-for-vue",
      },
      Magento: {
        name: "Magento",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Magento-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-magento",
      },
      "Next.js": {
        name: "Next.js / React",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-Component-for-React?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-component-for-react",
      },
      Shopify: {
        name: "Shopify",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Shopify-Voucher-Network-and-Checkout-Benefits-Documentation?tab=readme-ov-file#shopify-sovendus-voucher-network--checkout-benefits-integration-documentation",
      },
      "OXID eSales": {
        name: "OXID eShop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Oxid-eShop-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-oxid-eshop",
      },
      "OXID eShop Enterprise Edition": {
        name: "OXID eShop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Oxid-eShop-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-oxid-eshop",
      },
      "OXID eShop Community Edition": {
        name: "OXID eShop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Oxid-eShop-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-oxid-eshop",
      },
      "OXID eShop Professional Edition": {
        name: "OXID eShop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Oxid-eShop-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-oxid-eshop",
      },
      PrestaShop: {
        name: "PrestaShop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-Prestashop-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-prestashop",
      },
      "JTL-Shop": {
        name: "JTL-Shop",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-JTL-Voucher-Network-and-Checkout-Benefits-Plugin?tab=readme-ov-file#sovendus-voucher-network--checkout-benefits-module-for-jtl",
      },
      BigCommerce: {
        name: "BigCommerce",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-BigCommerce-Voucher-Network-and-Checkout-Benefits-Documentation?tab=readme-ov-file#sovendus-bigcommerce-voucher-network-and-checkout-benefits-documentation",
      },
      gtm: {
        name: "Google Tag Manager",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-GTM-v2?tab=readme-ov-file#sovendus-google-tag-manager-template-for-voucher-network-and-checkout-benefits-integration",
      },
      generic: {
        name: "Generic",
        docsLink:
          "https://github.com/Sovendus-GmbH/Sovendus-generic-documentation-for-Voucher-Network-and-Checkout-Benefits?tab=readme-ov-file",
      },
    };
    statusCodes: statusCodes = {
      success: "success",
      fail: "fail",
    };
    constructor() {
      this.createCheckIntegrationMethodsOverlay();
    }

    async getAvailableMethodsMessage(): Promise<string> {
      const { data, responseStatusCode, responseErrorMessage } =
        await this.getAvailableMethodsResponse();
      if (responseStatusCode === this.statusCodes.fail) {
        return responseErrorMessage || "";
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
          this.supportedSystems[shopSystemName]
        );
      } else if (cmsName && this.supportedSystems[cmsName]) {
        availableMethods = this.formatIntegrationOption(
          this.supportedSystems[cmsName]
        );
      } else if (webFrameworkName && this.supportedSystems[webFrameworkName]) {
        availableMethods = this.formatIntegrationOption(
          this.supportedSystems[webFrameworkName]
        );
      }
      const gtmAvailable = this.checkIfGtmIsIntegrated();
      const availableMethodsText = `
        <h3 class='sovendus-overlay-font sovendus-overlay-h3' style="border: 1px solid; border-radius: 8px; padding: 8px; text-align: center;">
          Note that the detection can be wrong and incomplete!
        </h3>
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">The following integration methods are available:</h2>
        <h3 class='sovendus-overlay-font sovendus-overlay-h3'>
          Generic Integration
        </h3>
        <p>
          You can get the generic documentation from your account manager
        </p>
        ${availableMethods}
        ${
          gtmAvailable
            ? this.formatIntegrationOption(this.supportedSystems.gtm)
            : ""
        }
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
      supportedSystem: supportedSystem,
      titlePrefix: string | null = "Integration via ",
      titleSuffix: string | null = null
    ): string {
      return `
      <h3 class='sovendus-overlay-font sovendus-overlay-h3'>
        ${titlePrefix ? titlePrefix : ""}${supportedSystem.name}${
        titleSuffix ? titleSuffix : ""
      }
      </h3>
      <a href='${supportedSystem.docsLink}' target='_blank'>
        ${supportedSystem.name} Integration Documentation
      </a>
    `;
    }

    checkIfGtmIsIntegrated(): boolean {
      return Boolean(
        document.querySelectorAll(
          '[src*="https://www.googletagmanager.com/gtm.js?id="]'
        ).length
      );
    }

    async getAvailableMethodsResponse(): Promise<{
      data: availableMethodsResponse;
      responseStatusCode: statusCode;
      responseErrorMessage: string | undefined;
    }> {
      const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
      let responseStatusCode: statusCode;
      try {
        const response = await fetch(
          `https://whatcms.org/API/Tech?key=${this.apiKeys[randomIndex]}&url=${window.location.origin}`
        );
        const data = await response.json();
        responseStatusCode = this.statusCodes.success;
        return { data, responseStatusCode, responseErrorMessage: undefined };
      } catch (error) {
        console.error(
          "Error fetching data:",
          `${(error as any)?.message || error}`
        );
        responseStatusCode = this.statusCodes.fail;
        const responseErrorMessage = this.formatErrorMessage(
          "Error fetching data:",
          String((error as any)?.message || error)
        );
        return { data: {}, responseStatusCode, responseErrorMessage };
      }
    }

    formatErrorMessage(errorTitle: string, errorMessage: string): string {
      return `
        <h2 class="sovendus-overlay-font sovendus-overlay-h2 sovendus-overlay-error">${errorTitle}</h2>
        <h3 class="sovendus-overlay-font sovendus-overlay-h3 sovendus-overlay-error">${errorMessage}</h3>
      `;
    }

    getAvailableMethodsFromResponse(responseJson: availableMethodsResponse): {
      shopSystemName: SupportedSystemKeyType | undefined;
      cmsName: SupportedSystemKeyType | undefined;
      webFrameworkName: SupportedSystemKeyType | undefined;
      statusCode: statusCode;
      errorMessage: string | undefined;
    } {
      let statusCode: statusCode = this.statusCodes.fail;
      let shopSystemName: SupportedSystemKeyType | undefined;
      let cmsName: SupportedSystemKeyType | undefined;
      let errorMessage: string | undefined;
      let webFrameworkName: SupportedSystemKeyType | undefined;
      if (responseJson?.results) {
        for (const technology of responseJson.results) {
          if (technology.categories.includes("E-commerce")) {
            statusCode = this.statusCodes.success;
            const _shopSystemName = this.getNameIfValidPlugin(technology.name);
            if (_shopSystemName) {
              shopSystemName = _shopSystemName;
            }
          }
          if (technology.categories.includes("CMS")) {
            statusCode = this.statusCodes.success;
            const _cmsName = this.getNameIfValidPlugin(technology.name);
            if (_cmsName) {
              cmsName = _cmsName;
            }
          }
          if (technology.categories.includes("Web Framework")) {
            statusCode = this.statusCodes.success;
            const _webFrameworkName = this.getNameIfValidPlugin(
              technology.name
            );
            if (_webFrameworkName) {
              webFrameworkName = _webFrameworkName;
            }
          }
        }
      }

      if (statusCode === this.statusCodes.fail) {
        errorMessage =
          responseJson?.result?.msg || "Error, no CMS or Shopsystem detected";
      }

      return {
        shopSystemName,
        cmsName,
        webFrameworkName,
        statusCode,
        errorMessage,
      };
    }

    getNameIfValidPlugin(
      shopSystemName: string
    ): SupportedSystemKeyType | undefined {
      return shopSystemName in this.supportedSystems
        ? (shopSystemName as SupportedSystemKeyType)
        : undefined;
    }

    async createCheckIntegrationMethodsOverlay(): Promise<void> {
      var overlay = document.createElement("div");
      overlay.id = "outerSovedusIntegrationMethodCheckerOverlay";
      overlay.innerHTML = `
      ${this.getCheckerOverlayStyle()}
      <div class="sovendus-overlay-font" id="sovedusIntegrationMethodCheckerOverlay">  
        <div style="margin:auto;max-width:500px;">
          <div>
          <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Integration Methods Checker</h1>
          </div>
          <div id="sovendusDetectionResult">
            <h2 class="sovendus-overlay-font sovendus-overlay-h2">Detection in progress, this can take up to 20 seconds</h2>
          </div>
        </div>
      </div>
      `;
      document.body.appendChild(overlay);
      const availableMethodsMessage = await this.getAvailableMethodsMessage();
      const sovendusDetectionResultDiv = document.getElementById(
        "sovendusDetectionResult"
      );
      if (sovendusDetectionResultDiv) {
        sovendusDetectionResultDiv.innerHTML = availableMethodsMessage;
      }
    }

    getCheckerOverlayStyle(): string {
      return `
          <style>
            #sovedusIntegrationMethodCheckerOverlay {
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
              #sovedusIntegrationMethodCheckerOverlay {
                left: 0 !important;
                right: 0 !important;
              }
            }
            .sovendus-overlay-h1 {
              font-size: 27px !important;
              margin-top: 0 !important;
              margin-bottom: 5px !important;
            }
            .sovendus-overlay-h2 {
              font-size: 22px !important;
              margin-top: 10px !important;
              margin-bottom: 4px !important;
            }
            .sovendus-overlay-h3 {
              font-size: 19px !important;
              margin-top: 10px !important;
              margin-bottom: 3px !important;
            }
            .sovendus-overlay-font a {
              color: rgb(60, 139, 253);
            }
            .sovendus-overlay-font a:hover {
              color: rgb(0 94 230);;
            }
            .sovendus-overlay-font {
              color: white !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }
            .sovendus-overlay-error {
              color: red !important;
            }
          </style>
        `;
    }
  }
  new availableMethodsChecker();
}

type statusCode = "fail" | "success";

interface statusCodes {
  success: statusCode;
  fail: statusCode;
}

interface availableMethodsResponse {
  results?: availableMethodsResponseResults[];
  result?: { msg: string; code: 200 };
}

interface availableMethodsResponseResults {
  categories: string[];
  name: string;
}

type SupportedSystemKeyType =
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

interface supportedSystem {
  name: string;
  docsLink: string;
}
