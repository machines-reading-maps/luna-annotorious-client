import { parseAnnotations } from '@/formats/iiif2';
import type { Store } from '@/core/state';

export const loadPaginated = (annotationUrl: string, store: typeof Store): Promise<void> => 
  new Promise((resolve, reject) => {
    
    const loadOnePage = (url: string) => {
      fetch(url, {
        // credentials: 'include'
      }).then(res => res.json()).then(data => {
        const { parsed } = parseAnnotations(data.resources);
        store.set(parsed, false);

        // Recursion if there's a 'next' property
        if (data.next)
          loadOnePage(data.next);
        else
          resolve();
      }).catch(error => reject(error));
    }

    store.clear();

    loadOnePage(annotationUrl);
  });
