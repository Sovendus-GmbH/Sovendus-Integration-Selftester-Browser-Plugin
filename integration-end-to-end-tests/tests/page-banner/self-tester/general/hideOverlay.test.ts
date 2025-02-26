import {
  sovAppConsumerAllValidData,
  sovAppIFramesAllValidData,
  sovTestTrafficMediumNumbers,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

const executeHideOverlayBannersScript = `
    return (async () =>{
      return await window.sovSelfTester.hideOverlayBanners(true)
    })();`;

executeOverlayTests({
  testName: "hideOverlay",
  tests: [
    {
      testName: "VNInline",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.VNInline.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
    {
      testName: "VNSticky",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: true,
          hideStickyBannerSuccess: true,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
    {
      testName: "CBOverlay",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBOverlay.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "CBVNOverlay",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBVNOverlay.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "CBVNInline",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBVNInline.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
    {
      testName: "CBInline",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBInline.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
    {
      testName: "CBInlineVNSticky",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBInlineVNSticky.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: true,
          hideStickyBannerSuccess: true,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
    {
      testName: "CBOverlayVNInline",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBOverlayVNInline.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "CBOverlayVNSticky",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBOverlayVNSticky.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: true,
          hideStickyBannerSuccess: true,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "CBInOverlayCollapsed",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBInOverlayCollapsed
              .trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "CBInOverlayCloseable",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.CBInOverlayCloseable
              .trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: false,
          hideStickyBannerSuccess: false,
          foundOverlayBanner: true,
          hideOverlayBannerSuccess: true,
        });
      },
    },
    {
      testName: "VNStickyCloseable",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIFramesAllValidData,
          trafficMediumNumber:
            sovTestTrafficMediumNumbers.VNStickyCloseable.trafficMediumNumber,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        const hideOverlayBanners = await driver.executeScript(
          executeHideOverlayBannersScript,
        );
        expect(hideOverlayBanners).toStrictEqual({
          foundStickyBanner: true,
          hideStickyBannerSuccess: true,
          foundOverlayBanner: false,
          hideOverlayBannerSuccess: false,
        });
      },
    },
  ],
});
