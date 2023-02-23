import type Annotorious from '@annotorious/openseadragon';
import type { WebAnnotation } from '@annotorious/formats';
import { LunaPopup } from './popup';

export class LunaPlugin {

  anno: Annotorious;

  viewer: OpenSeadragon.Viewer;

  popup: LunaPopup;
  
  constructor(anno: Annotorious, viewer: OpenSeadragon.Viewer) {
    this.anno = anno;
    
    this.viewer = viewer;

    anno.on('clickAnnotation', (annotation, evt) => {
      this.showPopup(annotation, evt);
    });
  }

  showPopup = (annotation: WebAnnotation, originalEvent: PointerEvent) => {
    if (this.popup)
      this.hidePopup();
  
    this.popup = new LunaPopup({
      target: document.body,
      props: { 
        annotation,
        originalEvent,
        env: this.anno.env
      }
    });

    this.popup.$on('save', (evt: CustomEvent<WebAnnotation>) => {
      this.hidePopup();

      // Merge modified annotation bodies from the popup with
      // latest target from the annotation layer
      const latestState = this.anno.getAnnotationById(annotation.id);

      const updated = {
        ...evt.detail,
        target: {
          ...latestState.target
        }
      }

      this.anno.updateAnnotation(evt.detail.id, updated);
    });

    this.popup.$on('edit', () =>
      this.anno.selectAnnotation(annotation));

    this.popup.$on('delete', () => {
      this.hidePopup();

      this.anno.removeAnnotation(annotation);
    });
  }

  hidePopup = () => {
    this.popup.$destroy();
    this.popup = null;
  }

}