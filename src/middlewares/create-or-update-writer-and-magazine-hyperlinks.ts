export default async function createOrUpdateWriterAndMagazineHyperlinks(data: {
  documentId: string;
  slug: string;
  status: "published" | "draft";
  resourceType: "writer" | "magazine";
  createdById?: string;
  updatedById?: string;
  name?: string;
}) {
  const {
    documentId,
    slug,
    status,
    createdById,
    updatedById,
    resourceType,
    name,
  } = data;

  let url = "";
  switch (resourceType) {
    case "writer":
      url = `/writer/${slug}`;
      break;
    case "magazine":
      url = `/magazine/${slug}`;
      break;
    default:
      throw Error("Invalid Resource type for creating hyperlink");
  }

  // finding existing document
  const existing_draft_document = await strapi
    .documents("api::hyperlink.hyperlink")
    .findFirst({
      filters: { unique_identifier: { $eq: documentId } },
      status: "draft",
    });

  if (existing_draft_document && status === "draft") {
    await strapi.documents("api::hyperlink.hyperlink").update({
      documentId: existing_draft_document.documentId,
      data: {
        name,
        url,
        updated_by_id: updatedById,
      },
    });
  } else if (existing_draft_document && status === "published") {
    await strapi
      .documents("api::hyperlink.hyperlink")
      .publish({ documentId: existing_draft_document.documentId });
  } else {
    await strapi.documents("api::hyperlink.hyperlink").create({
      data: {
        name,
        url,
        unique_identifier: documentId,
        updated_by_id: updatedById,
        created_by_id: createdById,
      },
      status,
    });
  }
}
