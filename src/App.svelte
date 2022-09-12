<script type="ts">
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import LunaAuth from '@/luna/auth/LunaAuth.svelte';
  import { OSDViewer, OSDPixiImageAnnotationLayer }  from '@/openseadragon';
  import { Store } from '@/state';
  import { LunaStorageAdapter } from '@/storage';
  import { parseAnnotations } from '@/formats/iiif2';
  import { LUNA_LOGIN_URL, LUNA_LOGOUT_URL, LUNA_TOKEN_URL } from '@/Config';

  let hovered: any;

  let loaded: boolean;

  let user: { id: string };

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
  const fLoad = fetch(annotationUrl).then(res => res.json()).then(data => {
    console.log('Loading annotations from Luna');
    const { parsed } = parseAnnotations(data);
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
</script>

<OSDViewer class="viewer" config={config} let:viewer={viewer}>

  <OSDPixiImageAnnotationLayer 
    viewer={viewer} 
    on:enterShape={onEnterShape} 
    on:leaveShape={onLeaveShape} />

  {#if hovered}
    <LunaPopup 
      viewer={viewer}
      user={user}
      shape={hovered.shape}
      offsetX={hovered.originalEvent.offsetX}
      offsetY={hovered.originalEvent.offsetY} 
      viewportPoint={hovered.viewportPoint} />
  {/if}

</OSDViewer>

<LunaAuth
  tokenUrl={LUNA_TOKEN_URL}
  loginUrl={LUNA_LOGIN_URL}
  logoutUrl={LUNA_LOGOUT_URL}
  on:authenticated={onAuth} />sd