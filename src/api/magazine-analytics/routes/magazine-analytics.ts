export default {
  routes: [
    {
      method: "GET",
      path: "/magazine-analytics",
      handler: "magazine-analytics.getMagazineDownloadAnalytics",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/magazine-analytics-countries",
      handler: "magazine-analytics.getMagazineDownloadCountryAnalytics",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/magazine-analytics-continents",
      handler: "magazine-analytics.getMagazineDownloadContinentAnalytics",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
