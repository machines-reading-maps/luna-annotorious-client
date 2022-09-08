import type { IiifV2Annotation, IiifV2Resource } from '.';
import { type Shape, ShapeType } from '../shapes';
import { parseMediaFragment } from '../w3c/selector/MediaFragment';

const toW3CBody = (resource: IiifV2Resource) => ({
  purpose: 'commenting',
  value: resource.chars
})

export const parseAnnotations = (annotations: IiifV2Annotation[]): ({ parsed: Shape[], failed: IiifV2Annotation[] }) =>
  annotations.reduce((result, annotation) => {

    const { on, resource } = annotation;

    let shape: Shape;

    if (on.selector['@type'] === 'oa:FragmentSelector') {
      shape = {
        id: annotation['@id'],
        type: ShapeType.RECTANGLE,
        data: { body: toW3CBody(resource) },
        geometry: parseMediaFragment(on.selector.value),
        state: {}  
      }
    }

    return shape ? {
      parsed: [...result.parsed, shape],
      failed: result.failed
    } : {
      parsed: result.parsed,
      failed: [...result.failed, annotation]
    }
  }, { parsed: [], failed: [] });