import { decorateCustomEventGlobalWithAccessibilityInformation } from "./analytics.js";

function decorateGtagWithAccessibilityInformation() {
  decorateCustomEventGlobalWithAccessibilityInformation({
    getGlobal: () => {
      return window.gtag;
    },
    setGlobal: (value) => {
      window.gtag = value;
    },
    translateArguments: (
      { originalArguments, accessibilityEventParameters },
    ) => {
      const translatedArguments = [...originalArguments]; // TODO - replace with structuredClone for a true deep copy once it has better browser support

      if (originalArguments.length >= 3) {
        const originalParameters = originalArguments[2];

        const eventName = originalArguments[1];
        const disambiguatedAccessibilityEventParameters = Object.fromEntries(
          Object.entries(accessibilityEventParameters).map(([key, value]) => {
            return [`${key} [${eventName}]`, value];
          }),
        );

        const translatedParameters = {
          ...originalParameters,
          ...disambiguatedAccessibilityEventParameters,
        };

        translatedArguments[2] = translatedParameters;
      }

      return translatedArguments;
    },
    onResolutionCallback: ({ name, data: { resolvedValue } }) => {
      window.gtag("event", "resolvedAccessibilityData", {
        [`${name} [resolvedAccessibilityData]`]: resolvedValue,
      });
    },
  });
}

decorateGtagWithAccessibilityInformation();
