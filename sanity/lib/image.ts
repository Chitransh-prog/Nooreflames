import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from './client';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'demo',
  dataset: dataset || 'production',
});

export const urlForImage = (source: any) => {
  return imageBuilder.image(source);
};
