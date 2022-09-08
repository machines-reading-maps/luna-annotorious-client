export interface IiifV2Annotation {

  '@context': string,

  '@id': string;

  '@type': string;

  motivation: string,

  on: {

    '@type': string | Array<string>, 

    selector: {

      '@type': string,

      value: string

    }

  }

  resource: IiifV2Resource

}

export interface IiifV2Resource {

  '@type': string | Array<string>

  format: string
  
  chars?: string

}