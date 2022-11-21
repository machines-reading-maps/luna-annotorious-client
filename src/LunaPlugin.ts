import type { Annotorious } from '@annotorious/openseadragon';
import type { WebAnnotation } from '@annotorious/formats';
import { LunaPopup } from './popup';

export class LunaPlugin {

  popup: LunaPopup;

  viewer: OpenSeadragon.Viewer;

  constructor(anno: Annotorious, viewer: OpenSeadragon.Viewer) {
    this.viewer = viewer;

    anno.on('mouseEnterAnnotation', (annotation, evt) => {
      this.showPopup(annotation, evt);
    });

    anno.on('mouseLeaveAnnotation', () => {
      this.hidePopup();
    });
  }

  showPopup = (annotation: WebAnnotation, originalEvent: PointerEvent) => {
    this.popup = new LunaPopup({
      target: document.body,
      props: { 
        annotation,
        originalEvent,
        viewer: this.viewer
      }
    });
  }

  hidePopup = () => {
    this.popup.$destroy();
    this.popup = null;
  }

}