import { type Shape, ShapeType } from '@/core/shapes';
import { parseMediaFragment } from '@/formats/mediafrags/mediaFragmentSelector';
import type { IIIFAnnotation } from '.';

export const parseAnnotations = (annotations: IIIFAnnotation[]): ({ parsed: Shape[], failed: IIIFAnnotation[] }) =>
  annotations.reduce((result, annotation) => {

    const { on, resource } = annotation;

    let shape: Shape;

    if (on.selector['@type'] === 'oa:FragmentSelector') {
      shape = {
        id: annotation['@id'],

        type: ShapeType.RECTANGLE,
        
        // Bit of a hard-wired hack, assuming Luna data
        data: { 
          body: [{
            purpose: 'transcribing',
            value: resource.chars
          }] 
        },
        
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