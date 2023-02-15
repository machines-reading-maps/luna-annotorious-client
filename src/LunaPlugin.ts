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
        env: this.anno.env
      }
    });

    this.popup.$on('transcriptionChanged', (evt: CustomEvent<WebAnnotation>) =>
      this.anno.updateAnnotation(evt.detail.id, evt.detail));

    this.popup.$on('editShape', (evt: CustomEvent<WebAnnotation>) =>
      this.anno.selectAnnotation(evt.detail.id));
  }

  hidePopup = () => {
    this.popup.$destroy();
    this.popup = null;
  }

}