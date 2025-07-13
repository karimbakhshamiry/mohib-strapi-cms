import type { Core } from "@strapi/strapi";
import {
  createOrUpdateWriterAndMagazineHyperlinks,
  deleteWriterAndMagazineHyperlinks,
} from "./middlewares";
import { slugify } from "./utils";
import { errors } from "@strapi/utils";
import lookup from "country-code-lookup";
import { isDefined } from "class-validator";
import { UAParser } from "ua-parser-js";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      // target the 'create' action on articles
      const collection_uids: string[] = [
        "api::guest-writer.guest-writer",
        "api::magazine.magazine",
      ];

      const actions: string[] = ["create", "update", "publish", "delete"];

      if (
        collection_uids.includes(context.uid) &&
        actions.includes(context.action)
      ) {
        let resourceType: "magazine" | "writer" = "magazine";
        if (context.uid === "api::guest-writer.guest-writer") {
          resourceType = "writer";
        }

        if (context.action == "create") {
          (context.params.data as any).slug = slugify(
            (context.params.data as any)?.slug
          );
          const result: any = await next();

          await createOrUpdateWriterAndMagazineHyperlinks({
            name:
              result?.title ??
              `${result?.name} - Issue ${result?.magaine_issue_no}`,
            documentId: result?.documentId,
            resourceType,
            slug: result?.slug,
            status: "draft",
            updatedById: result?.updatedBy?.id,
            createdById: result?.createdBy?.id,
          });

          return result;
        } else if (context.action == "publish") {
          const result: any = await next();
          const data = result?.entries?.[0];
          await createOrUpdateWriterAndMagazineHyperlinks({
            name:
              data?.title ?? `${data?.name} - Issue ${data?.magaine_issue_no}`,
            documentId: context.params.documentId,
            resourceType,
            slug: data?.slug,
            status: "published",
            updatedById: data?.updatedBy?.id,
            createdById: data?.createdBy?.id,
          });
          return result;
        } else if (context.action == "update") {
          (context.params.data as any).slug = slugify(
            (context.params.data as any)?.slug
          );
          const result: any = await next();

          await createOrUpdateWriterAndMagazineHyperlinks({
            name:
              result?.title ??
              `${result?.name} - Issue ${result?.magaine_issue_no}`,
            documentId: result?.documentId,
            resourceType,
            slug: result?.slug,
            status: "draft",
            updatedById: result?.updatedBy?.id,
            createdById: result?.createdBy?.id,
          });

          return result;
        } else if (context.action == "delete") {
          const result: any = await next();
          await deleteWriterAndMagazineHyperlinks([context.params.documentId]);

          return result;
        }
      }

      if (
        context.uid === "api::subscriber.subscriber" &&
        context.action === "create"
      ) {
        // if a subscriber with provided email already exists, then dont add anything
        const lower_email: string = context.params.data?.email?.toLowerCase();
        context.params.data["email"] = lower_email;

        if (!isDefined(lower_email)) {
          throw new errors.ValidationError(
            "email must not be empty and must be a valid email address.",
            {
              errors: [
                {
                  path: ["email"],
                  message: "email must be provided",
                  name: "ValidationError",
                  value: lower_email,
                },
              ],
            }
          );
        }

        const existing_subscriber = await strapi
          .documents("api::subscriber.subscriber")
          .findFirst({
            filters: { email: { $eq: lower_email } },
          });

        if (existing_subscriber) {
          // if there is already someone with this email, return it, and not create any new one
          return existing_subscriber;
        }

        // add country and continent
        const country = context.params.data?.country?.toUpperCase();
        if (!country) {
          throw new errors.ValidationError(
            "country must be either ISO2 or ISO3 country code.",
            {
              errors: [
                {
                  path: ["country"],
                  message: "country must be provided",
                  name: "ValidationError",
                  value: country,
                },
              ],
            }
          );
        }

        try {
          const lookup_result = lookup.byIso(country);

          context.params.data["country"] = lookup_result.country;
          context.params.data["continent"] = lookup_result.continent;
        } catch (error) {
          throw new errors.ValidationError(
            "country must be ISO2 or ISO3 country code.",
            {
              errors: [
                {
                  path: ["country"],
                  message: "Invalid country code provided",
                  name: "ValidationError",
                  value: country,
                },
              ],
            }
          );
        }
      }

      // handle adding analytics details to download
      if (
        context.uid ===
          "api::magazine-download-analytic.magazine-download-analytic" &&
        context.action === "create"
      ) {
        // validating magazine issue_number
        const issue_number = context.params.data?.issue_number;
        const existing_magazine = await strapi
          .documents("api::magazine.magazine")
          .findFirst({
            filters: { issue_number: { $eq: issue_number } },
          });

        if (!existing_magazine) {
          throw new errors.NotFoundError(
            `Magazine with issue number ${issue_number} not found.`,
            {
              errors: [
                {
                  path: ["issue_number"],
                  message: "Invalid issue_number",
                  name: "NotFoundError",
                  value: issue_number,
                },
              ],
            }
          );
        }

        // getting device info from the user agent
        const user_agent: string = context.params.data?.user_agent;

        const parsed_user_agent = UAParser(user_agent);

        context.params.data["browser"] = parsed_user_agent.browser.name;
        context.params.data["device_model"] = parsed_user_agent.device.model;
        context.params.data["device_type"] = parsed_user_agent.device.type;
        context.params.data["device_vendor"] = parsed_user_agent.device.vendor;
        context.params.data["os_name"] = parsed_user_agent.os.name;
        context.params.data["os_version"] = parsed_user_agent.os.version;

        // add country and continent
        const country = context.params.data?.country?.toUpperCase();
        if (!isDefined(country)) {
          throw new errors.ValidationError(
            "country must be either ISO2 or ISO3 country code.",
            {
              errors: [
                {
                  path: ["country"],
                  message: "Invalid country code provided",
                  name: "ValidationError",
                  value: country,
                },
              ],
            }
          );
        }

        try {
          const lookup_result = lookup.byIso(country);

          context.params.data["country"] = lookup_result.country;
          context.params.data["continent"] = lookup_result.continent;
        } catch (error) {
          throw new errors.ValidationError(
            "country must be ISO2 or ISO3 country code.",
            {
              errors: [
                {
                  path: ["country"],
                  message: "Invalid country code provided",
                  name: "ValidationError",
                  value: country,
                },
              ],
            }
          );
        }
      }

      // always return next()
      const result = await next();
      return result;
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
