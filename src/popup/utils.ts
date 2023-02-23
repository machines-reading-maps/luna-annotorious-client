import type { WebAnnotation, WebAnnotationBody } from '@annotorious/formats';

interface Transcription extends WebAnnotationBody {

  creator: {

    id: string
    
    type: string,

    name: string
  
  }

}

/** Returns all transcription bodies from this annotation **/
export const getTranscriptions = (annotation: WebAnnotation): Transcription[] => {
  const bodies = annotation.body ?
    Array.isArray(annotation.body) ? annotation.body : [ annotation.body ] : [];

  const transcriptions = bodies.filter(body =>  (!body.purpose || body.purpose === 'transcribing'));

  // Return sorted by time of creation
  return transcriptions.slice().sort((a, b) => a.created < b.created ? 1 : -1);
}

/** 
 * Gets the 'best' transcription from the list. The best transcription 
 * is the most recent one from a Person. If there is no transcription 
 * from a Person, we'll fall back to the original mapKurator one (type 
 * 'Software', name 'mapKurator:ocr'). If there is none, we'll fall back 
 * to the first in the list.
 */
export const getBestTranscription = (bodies: Transcription[]) => {
  let best: Transcription;

  // Sort by timestamp
  const sorted = bodies.slice().sort((a, b) => a.created < b.created ? 1 : -1);

  const byPerson = sorted.filter(body => body.creator?.type === 'Person'); 
  if (byPerson.length > 0) {
    best = byPerson[0];
  } else {
    const byMK = sorted.find(body => body.creator?.type === 'Software' && body.creator?.name === 'mapKurator:ocr');
    if (byMK) {
      best = byMK;
    } else {
      best = sorted.length > 0 ? sorted[0] : null;
    }
  }

  return best;
}

/** Tests if this body represents an OCR transcription **/
export const isOCR = (transcription: Transcription): boolean =>
  transcription.creator?.type === 'Software' && transcription.creator?.name == 'mapKurator:ocr';