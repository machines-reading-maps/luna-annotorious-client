export interface WebAnnotation {
  
  id: string;

  body: Object | Array<Object>

  target: AnnotationTarget | Array<AnnotationTarget>

}

export interface AnnotationTarget {

  source: string

  selector: Selector | Array<Selector>

}

export interface Selector {

  type: string

  conformsTo: string

  value: string

}

export * from './parseW3C';
export * from './W3CUtils';
