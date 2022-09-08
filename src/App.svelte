<script type="ts">
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  // import LunaAuth from '@/luna/auth/LunaAuth.svelte';
  import { OSDViewer, OSDPixiAnnotationLayer }  from '@/openseadragon';
  import { StorageAdapter } from '@/w3c';
  import { Store } from '@/store';
  import { parseAnnotations } from './iiifv2/parseAnnotations';

  let hovered: any;

  const urlParams = new URLSearchParams(window.location.search);
  
  const imageUrl = urlParams.get('img') || 
    'https://www.davidrumsey.com/luna/servlet/iiif/RUMSEY~8~1~272964~90046789';
  
  const annotationUrl = urlParams.get('annotations') ||
    'https://www.davidrumsey.com/luna/servlet/iiif/annotation/oa/search?uri=https%3A%2F%2Fwww.davidrumsey.com%2Fluna%2Fservlet%2Fiiif%2Fm%2FRUMSEY~8~1~272964~90046789%2Fcanvas%2Fc1&media=image&limit=10000&_=1654013978941';

  // OSD viewer config
  const config = {
    tileSources: imageUrl,
    gestureSettingsTouch: {
      pinchRotate: true
    }
  }

  // Load data  
  fetch(annotationUrl).then(res => res.json()).then(data => {
    const { parsed } = parseAnnotations(data);
    Store.set(parsed);

    // Init the storage adapter
    StorageAdapter({
      store: Store,
      source: imageUrl
    });
  });
  
  const onEnterShape = ({ detail }) => hovered = detail;

  const onLeaveShape = () => hovered = null;
</script>

<OSDViewer class="viewer" config={config} let:viewer={viewer}>

  <OSDPixiAnnotationLayer 
    viewer={viewer} 
    on:enterShape={onEnterShape} 
    on:leaveShape={onLeaveShape} />

  {#if hovered}
    <LunaPopup 
      viewer={viewer}
      shape={hovered.shape}
      offsetX={hovered.originalEvent.offsetX}
      offsetY={hovered.originalEvent.offsetY} 
      viewportPoint={hovered.viewportPoint} />
  {/if}

</OSDViewer>