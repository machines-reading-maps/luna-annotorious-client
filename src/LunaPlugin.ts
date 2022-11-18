import type { Annotorious } from '@annotorious/openseadragon';
import { LunaPopup } from './popup';

export class LunaPlugin {

  popup: LunaPopup;

  constructor(anno: Annotorious) {
    anno.on('mouseEnterAnnotation', (annotation) => {
      this.showPopup();
    });

    anno.on('mouseLeaveAnnotation', (annotation) => {
      this.hidePopup();
    });
  }

  showPopup = () => {
    this.popup = new LunaPopup({
      target: document.body,
      props: { }
    });
  }

  hidePopup = () => {
    this.popup.$destroy();
    this.popup = null;
  }

}