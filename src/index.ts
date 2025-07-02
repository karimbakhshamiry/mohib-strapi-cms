import type { Core } from "@strapi/strapi";
import {
  createOrUpdateWriterAndMagazineHyperlinks,
  deleteWriterAndMagazineHyperlinks,
} from "./middlewares";
import { slugify } from "./utils";

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
          await createOrUpdateWriterAndMagazineHyperlinks({
            documentId: context.params.documentId,
            resourceType,
            slug: result?.slug,
            status: "published",
            updatedById: result?.updatedBy?.id,
            createdById: result?.createdBy?.id,
          });

          return result;
        } else if (context.action == "update") {
          (context.params.data as any).slug = slugify(
            (context.params.data as any)?.slug
          );
          const result: any = await next();

          await createOrUpdateWriterAndMagazineHyperlinks({
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
