export const Annotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'http://www.example.com/annotation/95f9044c-73f5-4cef-82fb-2b3452bb75b9',
  type: 'Annotation',
  body: [{
    type: 'TextualBody',
    purpose: 'transcribing',
    value: 'First transcription',
    created: '2022-07-28T14:37:47.582Z',
    creator: {
      id: 'Alice'
    }
  }, {
    type: 'TextualBody',
    purpose: 'transcribing',
    value: 'Second transcription',
    created: '2022-07-28T14:47:47.582Z',
    creator: {
      id: 'Bob'
    }
  }, {
    type: 'TextualBody',
    purpose: 'anecdote',
    value: 'A story...',
    created: '2022-07-28T14:47:47.582Z',
    creator: {
      id: 'Charlie'
    }
  }],
  target: {
    selector: {
      type: 'SvgSelector',
      value: '<svg><polygon points=\"-3.3391678328504297,55.981986729065156 -3.3385026450445885,55.98198072676713 -3.3385002412005096,55.982064106273576 -3.339165429006351,55.98207010855867\"/></svg>'
    }
  }
}