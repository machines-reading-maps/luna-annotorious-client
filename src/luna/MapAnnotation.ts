interface MapAnnotation {

  id: string

  transcriptions: Transcription[]

  stories: Story[]

}

interface Transcription {

  value: string

  by?: string

  at?: Date

}

interface Story {

  text: string

  by: string

  at: Date

}

export const toW3C = (annotation: MapAnnotation): object => {

  return {};

}

// export const fromW3C = (w3c: object): MapAnnotation => {
// 
// }