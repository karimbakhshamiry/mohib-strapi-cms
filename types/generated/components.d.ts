import type { Schema, Struct } from '@strapi/strapi';

export interface SharedDynamicBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_dynamic_blocks';
  info: {
    displayName: 'Dynamic Block';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<
      ['magazines slider', 'magazines detailed block', 'media coverage', 'team']
    >;
  };
}

export interface SharedHeading1 extends Struct.ComponentSchema {
  collectionName: 'components_shared_heading_1s';
  info: {
    displayName: 'Heading 1';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
  };
}

export interface SharedHeading2Cover extends Struct.ComponentSchema {
  collectionName: 'components_shared_heading_2_covers';
  info: {
    displayName: 'Heading 2 - Cover';
  };
  attributes: {
    content: Schema.Attribute.Text;
    cover_photo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
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

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
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

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedTitleDescriptionPlain extends Struct.ComponentSchema {
  collectionName: 'components_shared_title_description_plain_s';
  info: {
    displayName: 'Title -  Description (plain)';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.dynamic-block': SharedDynamicBlock;
      'shared.heading-1': SharedHeading1;
      'shared.heading-2-cover': SharedHeading2Cover;
      'shared.horitizintal-line': SharedHoritizintalLine;
      'shared.media': SharedMedia;
      'shared.multiple-buttons': SharedMultipleButtons;
      'shared.single-button': SharedSingleButton;
      'shared.slider': SharedSlider;
      'shared.title-description-plain': SharedTitleDescriptionPlain;
    }
  }
}
