export interface WebAnnotation {
  
  id: string;

  body: Object | Array<Object>

  target: AnnotationTarget | Array<AnnotationTarget>

}

interface AnnotationTarget {

  selector: Selector | Array<Selector>

}

interface Selector {

  type: string

  value: string

}

export * from './parseW3C';

export { default as StorageAdapter } from './W3CStorageAdapter';

