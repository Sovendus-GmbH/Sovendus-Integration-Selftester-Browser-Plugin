class availableMethodsChecker {
  apiKeys: string[] = [
    "whz2mjdra9s0s0s683zodmidj6mo5d1v3gas3hbglcp73j6e16ufvo8k5i7lofnengl94u",
    // "another-api-key-1",
    // "yet-another-api-key-2",
    // "and-another-one-3",
    // "last-api-key-4",
  ];
  supportedSystems: string[] = [
    "WooCommerce",
    "Shopware",
    "Nuxt.js",
    "Magento",
    "Next.js",
    "Shopify",
    "OXID eSales",
    "PrestaShop",
    "OXID eShop Enterprise Edition",
    "JTL-Shop",
    "OXID eShop Community Edition",
    "OXID eShop Professional Edition",
    "BigCommerce",
  ];
  statusCodes: statusCodes = {
    success: "success",
    fail: "fail",
  };
  constructor() {
    this.createCheckIntegrationMethodsOverlay();
  }

  async getAvailableMethodsMessage(): Promise<string> {
    let availableMethods: string;
    const { data, statusCode, errorMessage } =
      await this.getAvailableMethodsResponse();
    if (statusCode === this.statusCodes.fail) {
      availableMethods = errorMessage;
      return availableMethods;
    }
    const [
      shop_system_name,
      cms_name,
      web_framework_name,
      status_code,
      error_msg,
    ] = this.getAvailableMethodsFromResponse(data);
    availableMethods = `
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">The following integration methods are available</h2>
    `;
    console.log("CMS detection result:", {
      shop_system_name,
      cms_name,
      web_framework_name,
      status_code,
      error_msg,
    });

    return availableMethods;
  }

  async getAvailableMethodsResponse(): Promise<{
    data: availableMethodsResponse;
    statusCode: statusCode;
    errorMessage: string | undefined;
  }> {
    const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
    let statusCode: statusCode;
    let errorMessage: string;
    try {
      const response = await fetch(
        `https://whatcms.org/API/Tech?key=${this.apiKeys[randomIndex]}&url=${window.location.origin}`
      );
      const data = await response.json();
      statusCode = this.statusCodes.success;
      console.log("CMS detection result:", data);
      return { data, statusCode, errorMessage };
    } catch (error) {
      console.error("Error fetching data:", error.message);
      statusCode = this.statusCodes.fail;
      errorMessage = "Error fetching data:" + error.message;
      return { data: {}, statusCode, errorMessage };
    }
  }

  getAvailableMethodsFromResponse(responseJson: availableMethodsResponse) {
    let status_code: statusCode = this.statusCodes.fail;
    let shop_system_name = "";
    let cms_name = "";
    let error_msg = "";
    let web_framework_name = "";

    for (const technology of responseJson.results) {
      if (technology.categories.includes("E-commerce")) {
        status_code = this.statusCodes.success;
        shop_system_name += shop_system_name
          ? `, ${technology.name}`
          : technology.name;
      }
      if (technology.categories.includes("CMS")) {
        cms_name += cms_name ? `, ${technology.name}` : technology.name;
      }
      if (technology.categories.includes("Web Framework")) {
        web_framework_name += web_framework_name
          ? `, ${technology.name}`
          : technology.name;
      }
    }

    if (status_code === this.statusCodes.fail && cms_name === "") {
      error_msg = responseJson.result.msg;
      if (![201, 202].includes(responseJson.result.code)) {
        if (responseJson.result.code === 200) {
          error_msg = "Error, no CMS or Shopsystem detected";
        } else {
          console.error("Error");
        }
      }
    }

    return [
      shop_system_name,
      cms_name,
      web_framework_name,
      status_code,
      error_msg,
    ];
  }

  async createCheckIntegrationMethodsOverlay(): Promise<void> {
    const availableMethodsMessage = await this.getAvailableMethodsMessage();
    var overlay = document.createElement("div");
    overlay.id = "outerSovendusNotDetectedOverlay";
    overlay.innerHTML = `
        ${this.getCheckerOverlayStyle()}
        <div class="sovendus-overlay-font" id="sovendusNotDetectedOverlay">  
          <div style="margin:auto;max-width:500px;">
            <div>
            
              <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Integration Methods Checker Overlay</h1>
            </div>
            ${availableMethodsMessage}
          </div>
        </div>
      `;
    document.getElementsByTagName("body")[0].appendChild(overlay);
  }

  getCheckerOverlayStyle(): string {
    return `
        <style>
          #sovendusNotDetectedOverlay {
            position: fixed;
            border: solid;
            padding: 22px;
            background: #293049;
            z-index: 2147483647;
            overflow-y: auto;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            max-height: 100vh;
          }
          @media only screen and (max-width: 700px) {
            #sovendusNotDetectedOverlay {
              left: 0;
              right: 0;
              width: 500px;
              max-width: 500px;
              top: 50px;
              padding: 22px;
             
            }
          }
          @media only screen and (min-width: 700px) {
            #sovendusNotDetectedOverlay {
              transform: scale(130%);
              transform-origin: top;
            }
          }
          .sovendus-overlay-h1 {
            font-size: 27px !important;
            margin-top: 0 !important;
            margin-bottom: 5px !important;
          }
          .sovendus-overlay-h2 {
            font-size: 20px !important;
            margin-top: 4px !important;
            margin-bottom: 4px !important;
          }
          .sovendus-overlay-font {
            color: white !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
        </style>
      `;
  }
}

var overlay = document.getElementById("outerSovendusNotDetectedOverlay");
if (!overlay) {
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
