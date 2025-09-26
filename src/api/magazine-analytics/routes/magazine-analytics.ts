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
  ],
};
