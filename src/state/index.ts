import { ShapeState } from './ShapeState';

export { default as Store } from './store/Store';

export const Selection = ShapeState('isSelected');
export const Hover = ShapeState('isHovered');