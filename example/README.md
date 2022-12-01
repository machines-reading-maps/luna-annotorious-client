# Machines Reading Maps: Luna/Annotorious

This guide shows how to use the alpha build of [Annotorious OpenSeadragon v3](https://github.com/recogito/annotorious-3/tree/main/packages/openseadragon), along with the LunaAnnotorious plugin (the project in this repository).

## About Annotorious 3

[Annotorious 3](https://github.com/recogito/annotorious-3) will be the next major release of the [Annotorious](https://annotorious.com) JavaScript image annotation library. Annotorious 3 is work in progress, and will be a full rewrite from scratch. It provides support for WebGL rendering and uses [YJS](https://github.com/yjs/yjs) to prepare for future offline and collaborative annotation scenarios.

## About the LunaAnnotorious Client Plugin

The __LunaAnnotorious__ plugin adds a mouseover popup widget for displaying the transcription and editing the annotation.

##  Usage

To use the plugin in your own Web page, include

- OpenSeadragon v3.x
- The alpha build of Annotorious OpenSeadragon 3 (JS + stylesheet)
- This plugin (JS + stylesheet)

```html
<!-- add this to your HTML <head> -->
<script src="https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/openseadragon.min.js"></script>
<script src="annotorious-openseadragon.js"></script>
<script src="luna-annotorious.js"></script>
<link rel="stylesheet" href="annotorious-openseadragon.css">
<link rel="stylesheet" href="luna-annotorious.css">
```

To initialize the plugin

- create your OpenSeadragon viewer
- initialize Annotorious OpenSeadragon
- initialize the plugin

```js
// Init OpenSeadragon
var viewer = OpenSeadragon({
  id: 'openseadragon',
  tileSources: {
    type: 'image',
    url: '1280px-Hallstatt.jpg'
  }
});

// Init Annotorious on the viewer
var anno = new Annotorious(viewer);

// Init the LunaAnnotorious plugin on the anno instance
var luna = new LunaAnnotorious(anno);
```

The `anno` Annotorious instance provides the following API methods:

```js
// Load annotations via HTTP
anno.loadAnnotations('annotations.w3c.json');

// Set annotations from a JS array
anno.setAnnotations(annotations);

// Add one annotation from a JS object (W3C Web Annotation format)
anno.addAnnotation(annotation);

// Clear all annotations
anno.clearAnnotations();

// Remove one annotation
anno.removeAnnotation(annotationOrId);

// Set user auth info, according to the original Annotorious API
// See https://recogito.github.io/annotorious/api-docs/annotorious/#setauthinfo
anno.setAuthInfo(user);
```

The `anno` Annotorious instance emits the following events:

```js
anno.on('createAnnotation', annotation => {
  // A new annotation was created
});

anno.on('deleteAnnotation', annotation => {
  // An annotatino was deleted 
});

anno.on('updateAnnotation', (annotation, previous) => {
  // The existing previous annotation was updated with a new version
});
```

Annotorious 3 is work in progress. See [this overview issue](https://github.com/recogito/annotorious-3/issues/2) for the most recent state of supported API features and events.
