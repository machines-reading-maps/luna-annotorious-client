<script type="ts">
  import { onMount } from 'svelte';
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import LunaAuth from '@/luna/auth/LunaAuth.svelte';
  import { OSDViewer, OSDPixiImageAnnotationLayer , OSDSVGDrawingLayer}  from '@/openseadragon';
  import { Hover, Store, Selection } from '@/state';
  import { LunaStorageAdapter } from '@/storage';
  import { parseAnnotations } from '@/formats/iiif2';
  import { API_BASE, LUNA_LOGIN_URL, LUNA_LOGOUT_URL, LUNA_TOKEN_URL } from '@/config';

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

  const osdConfig = {
    tileSources: imageUrl,
    gestureSettingsTouch: {
      pinchRotate: true
    }
  };

  // Load manifest for metadata
  fetch(manifestUrl).then(res => res.json()).then(metadata =>
    document.title = `${metadata.label} - David Rumsey Historical Map Collection | Annotation`); 

  // Load annotation list  
  const fLoad = fetch(annotationUrl).then(res => res.json()).then(data => {
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

  onMount(() => {
    // Clock sync
    fetch(`${API_BASE}/time`).then(res => res.json()).then(({ timestamp }) =>
      serverTimeDifference = timestamp - Date.now());
  });
</script>

<OSDViewer class="viewer" config={osdConfig} let:viewer={viewer}>

  <OSDPixiImageAnnotationLayer 
    viewer={viewer} />

  <OSDSVGDrawingLayer viewer={viewer} />

  {#if $Hover && $Selection.length === 0}
    <LunaPopup 
      viewer={viewer}
      user={user}
      serverTimeDifference={serverTimeDifference}
      hover={$Hover} />
  {/if}

</OSDViewer>

<LunaAuth
  tokenUrl={LUNA_TOKEN_URL}
  loginUrl={LUNA_LOGIN_URL}
  logoutUrl={LUNA_LOGOUT_URL}
  on:authenticated={onAuth} />