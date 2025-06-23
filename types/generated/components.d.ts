import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCover extends Struct.ComponentSchema {
  collectionName: 'components_shared_covers';
  info: {
    description: '';
    displayName: 'Cover Image';
  };
  attributes: {
    cover_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface SharedDynamicBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_dynamic_blocks';
  info: {
    description: '';
    displayName: 'Dynamic Block';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<
      [
        'Magazine Grid',
        'Subscription',
        'Magazine Card',
        'Team',
        'Media Coverage',
      ]
    >;
  };
}

export interface SharedGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    gallery: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
  };
}

export interface SharedHoritizintalLine extends Struct.ComponentSchema {
  collectionName: 'components_shared_horitizintal_lines';
  info: {
    displayName: 'Horitizintal Line';
  };
  attributes: {
    color: Schema.Attribute.String;
    hidden: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedMetadata extends Struct.ComponentSchema {
  collectionName: 'components_shared_metadata';
  info: {
    displayName: 'Metadata';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    tags: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedMultipleButtons extends Struct.ComponentSchema {
  collectionName: 'components_shared_multiple_buttons';
  info: {
    displayName: 'Multiple Buttons';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'shared.single-button', true>;
  };
}

export interface SharedPageTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_titles';
  info: {
    displayName: 'Page Title';
  };
  attributes: {
    page_title: Schema.Attribute.Text;
  };
}

export interface SharedSecondaryTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_secondary_titles';
  info: {
    displayName: 'Secondary Title';
  };
  attributes: {
    secondary_title: Schema.Attribute.Text;
  };
}

export interface SharedSingleButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_single_buttons';
  info: {
    description: '';
    displayName: 'Single Button';
  };
  attributes: {
    link: Schema.Attribute.String;
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary']>;
  };
}

export interface SharedSubtitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_subtitles';
  info: {
    displayName: 'subtitle';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
  };
}

export interface SharedText extends Struct.ComponentSchema {
  collectionName: 'components_shared_texts';
  info: {
    description: '';
    displayName: 'Text';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.cover': SharedCover;
      'shared.dynamic-block': SharedDynamicBlock;
      'shared.gallery': SharedGallery;
      'shared.horitizintal-line': SharedHoritizintalLine;
      'shared.metadata': SharedMetadata;
      'shared.multiple-buttons': SharedMultipleButtons;
      'shared.page-title': SharedPageTitle;
      'shared.secondary-title': SharedSecondaryTitle;
      'shared.single-button': SharedSingleButton;
      'shared.subtitle': SharedSubtitle;
      'shared.text': SharedText;
    }
  }
}
