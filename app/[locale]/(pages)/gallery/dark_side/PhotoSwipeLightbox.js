import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';

import { useEffect } from 'react';

const usePhotoSwipeLightbox = (gallerySelector) => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: gallerySelector,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();

    return () => lightbox.destroy();
  }, [gallerySelector]);
};

export default usePhotoSwipeLightbox;
