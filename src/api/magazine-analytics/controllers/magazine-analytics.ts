export default {
  async getMagazineDownloadAnalytics(ctx) {
    try {
      // get max magazine issue number
      const result: Array<{ name: string; Persian: number; English: number }> =
        [];
      let max = 0;
      while (true) {
        const existingMagazineNumber = await strapi
          .documents("api::magazine.magazine")
          .findFirst({ filters: { issue_number: { $eq: max + 1 } } });

        if (existingMagazineNumber) {
          max++;
        } else {
          break;
        }
      }

      for (let i = 1; i <= max; i++) {
        const persianCount = await strapi
          .documents(
            "api::magazine-download-analytic.magazine-download-analytic"
          )
          .count({
            filters: { issue_number: { $eq: i }, language: { $eq: "Persian" } },
            status: "published",
          });

        const englishCount = await strapi
          .documents(
            "api::magazine-download-analytic.magazine-download-analytic"
          )
          .count({
            filters: { issue_number: { $eq: i }, language: { $eq: "English" } },
            status: "published",
          });

        result.push({
          name: `Issue #${i}`,
          Persian: persianCount,
          English: englishCount,
        });
      }

      ctx.body = result;
    } catch (err) {
      ctx.body = {
        error:
          "An error occurred while fetching the magazine download analytics data",
        details: err instanceof Error ? err.message : "Unknown error",
      };
      ctx.status = 500; // Set the HTTP status code to 500 to indicate a server error
    }
  },
};
