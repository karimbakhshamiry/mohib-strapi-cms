export default async function deleteWriterAndMagazineHyperlinks(
  writer_or_magazine_document_ids: string[]
) {
  for (const id of writer_or_magazine_document_ids) {
    const existing_draft_document = await strapi
      .documents("api::hyperlink.hyperlink")
      .findFirst({
        filters: {
          unique_identifier: { $eq: id },
        },
      });

    if(existing_draft_document) {
        await strapi
          .documents("api::hyperlink.hyperlink")
          .delete({ documentId: existing_draft_document.documentId });
    }
  }
}
