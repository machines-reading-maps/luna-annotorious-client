<script type="ts">
  import { onMount } from 'svelte';
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import LunaAuth from '@/luna/auth/LunaAuth.svelte';
  import { OSDViewer, OSDPixiImageAnnotationLayer , OSDSVGDrawingLayer}  from '@/openseadragon';
  import { Store } from '@/state';
  import { LunaStorageAdapter } from '@/storage';
  import { parseAnnotations } from '@/formats/iiif2';
  import { API_BASE, LUNA_LOGIN_URL, LUNA_LOGOUT_URL, LUNA_TOKEN_URL } from '@/Config';

  let hovered: any;

  let selected: any;

  let loaded: boolean;

  let user: { id: string };

  let serverTimeDifference = 0;

  const urlParams = new URLSearchParams(window.location.search);

  const imageId = urlParams.get('img')  || 'RUMSEY~8~1~272964~90046789';

  const manifestUrl = 
    `https://www.davidrumsey.com/luna/servlet/iiif/m/${imageId}/manifest`;
  
  const imageUrl =
    `https://www.davidrumsey.com/luna/servlet/iiif/${imageId}/info.json`;
  
  const annotationUrl = 
    `https://www.davidrumsey.com/luna/servlet/iiif/m/${imageId}/list/luna`;

  // OSD viewer config
  const config = {
    tileSources: imageUrl,
    gestureSettingsTouch: {
      pinchRotate: true
    }
  }

  // Load manifest for metadata
  fetch(manifestUrl).then(res => res.json()).then(metadata =>
    document.title = `${metadata.label} - David Rumsey Historical Map Collection | Annotation`); 

  // Load data  
  const fLoad = fetch(annotationUrl).then(res => res.json()).then(data => {
    console.log('Loading annotations from Luna');
    const { parsed } = parseAnnotations(data.resources);
    Store.set(parsed);
  }).then(() => loaded = true);
  
  const onAuth = (evt: CustomEvent) => {
    const initStorageAdapter = () => {
      console.log('Authorization successful - fetching personal corrections');
      
      user = { id: evt.detail };

      // Init the storage adapter
      LunaStorageAdapter({
        store: Store,
        source: imageUrl
      });
    }

    if (loaded)
      initStorageAdapter();
    else
      fLoad.then(() => initStorageAdapter());
  }

  const onEnterShape = ({ detail }) => hovered = detail;

  const onLeaveShape = () => hovered = null;

  onMount(() => {
    // Clock sync
    fetch(`${API_BASE}/time`).then(res => res.json()).then(({ timestamp }) =>
      serverTimeDifference = timestamp - Date.now());
  });
</script>

<OSDViewer class="viewer" config={config} let:viewer={viewer}>

  <OSDPixiImageAnnotationLayer 
    viewer={viewer}
    selected={selected}
    on:enterShape={onEnterShape} 
    on:leaveShape={onLeaveShape} />

  <OSDSVGDrawingLayer 
    viewer={viewer}
    selected={selected} />

  {#if hovered && !selected}
    <LunaPopup 
      viewer={viewer}
      user={user}
      serverTimeDifference={serverTimeDifference}
      shape={hovered.shape}
      offsetX={hovered.originalEvent.offsetX}
      offsetY={hovered.originalEvent.offsetY} 
      viewportPoint={hovered.viewportPoint} 
      on:editShape={evt => selected = evt.detail}/>
  {/if}

</OSDViewer>

<LunaAuth
  tokenUrl={LUNA_TOKEN_URL}
  loginUrl={LUNA_LOGIN_URL}
  logoutUrl={LUNA_LOGOUT_URL}
  on:authenticated={onAuth} />