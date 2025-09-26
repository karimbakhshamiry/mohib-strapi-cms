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

  async getMagazineDownloadCountryAnalytics(ctx) {
    try {
      // get max magazine issue number
      const result: Array<{ name: string; value: number }> = [];
      const resultMap: Map<string, { name: string; value: number }> = new Map();
      // const downloadCount = await strapi
      //   .documents("api::magazine-download-analytic.magazine-download-analytic")
      //   .count({
      //     status: "published",
      //   });

      const pageSize = 100;
      let offset = 0;
      while (true) {
        const downloads = await strapi
          .documents(
            "api::magazine-download-analytic.magazine-download-analytic"
          )
          .findMany({
            status: "published",
            fields: ["id", "country"],
            limit: pageSize,
            start: pageSize * offset,
          });

        if (downloads.length) {
          for (const item of downloads) {
            if (item.country) {
              const currentCountryCount = resultMap.get(item.country);
              if (currentCountryCount) {
                resultMap.set(item.country, {
                  name: item.country,
                  value: currentCountryCount.value + 1,
                });
              } else {
                resultMap.set(item.country, { name: item.country, value: 1 });
              }
            } else {
              const currentCountryCount = resultMap.get("Unknown");
              if (currentCountryCount) {
                resultMap.set("Unknown", {
                  name: "Unknown",
                  value: currentCountryCount.value + 1,
                });
              } else {
                resultMap.set("Unknown", { name: "Unknown", value: 1 });
              }
            }
          }
        } else {
          break;
        }

        offset++;
      }

      ctx.body = Array.from(resultMap.values());
    } catch (err) {
      ctx.body = {
        error:
          "An error occurred while fetching the magazine download analytics data",
        details: err instanceof Error ? err.message : "Unknown error",
      };
      ctx.status = 500; // Set the HTTP status code to 500 to indicate a server error
    }
  },

  async getMagazineDownloadContinentAnalytics(ctx) {
    try {
      // get max magazine issue number
      const result: Array<{ name: string; value: number }> = [];
      const resultMap: Map<string, { name: string; value: number }> = new Map();

      const pageSize = 100;
      let offset = 0;
      while (true) {
        const downloads = await strapi
          .documents(
            "api::magazine-download-analytic.magazine-download-analytic"
          )
          .findMany({
            status: "published",
            fields: ["id", "continent"],
            limit: pageSize,
            start: pageSize * offset,
          });

        if (downloads.length) {
          for (const item of downloads) {
            if (item.continent) {
              const currentCountryCount = resultMap.get(item.continent);
              if (currentCountryCount) {
                resultMap.set(item.continent, {
                  name: item.continent,
                  value: currentCountryCount.value + 1,
                });
              } else {
                resultMap.set(item.continent, {
                  name: item.continent,
                  value: 1,
                });
              }
            } else {
              const currentCountryCount = resultMap.get("Unknown");
              if (currentCountryCount) {
                resultMap.set("Unknown", {
                  name: "Unknown",
                  value: currentCountryCount.value + 1,
                });
              } else {
                resultMap.set("Unknown", { name: "Unknown", value: 1 });
              }
            }
          }
        } else {
          break;
        }

        offset++;
      }

      ctx.body = Array.from(resultMap.values());
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
