<script type="ts">
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import LunaAuth from '@/luna/auth/LunaAuth.svelte';
  import { OSDViewer, WMTSPixiAnnotationLayer, WMTSTileSource }  from '@/openseadragon';
  import { parseW3C } from '@/formats/w3c';
  import { Store } from '@/state';
  import { LunaStorageAdapter } from '@/storage';

  let hovered: any;

  // OSD viewer config
  const config = {
    gestureSettingsTouch: {
      pinchRotate: true
    }
  }

  // WMTS tile URL
  // const url = 'https://maps.georeferencer.com/georeferences/3d5c7e1c-1771-56bc-adf2-c7178a14b1ca/2020-09-16T21:50:03.264834Z/wmts?key=DfHCmpUePzYdkPYnbvIl&SERVICE=WMTS&REQUEST=GetCapabilities'
  const url = 'https://geo.nls.uk/mapdata3/os/25_inch/edinburgh_west/wmts.xml';

  // Load data
  fetch('/hgnswtqypvcrtl.json').then(res => res.json()).then(data => {
    Store.set(parseW3C(data, true).parsed);

    // Init the storage adapter
    LunaStorageAdapter({
      store: Store,
      source: null
    });
  });

  const onEnterShape = ({ detail }) => hovered = detail;

  const onLeaveShape = () => hovered = null;

  var clientAppHostUrl = 'https://anno1.davidrumsey.com/anno';
  var lunaUrl = 'https://clone.davidrumsey.com/luna/servlet';
  const loginUrl = lunaUrl + "/login?origin="+clientAppHostUrl+"/callback.htm";
  const getTokenUrl = lunaUrl + "/token?messageId=1&origin="+clientAppHostUrl+"/token_test.html";
</script>

<OSDViewer class="viewer" config={config} let:viewer={viewer}>

  <WMTSTileSource viewer={viewer} url={url} let:map={map}>

    <WMTSPixiAnnotationLayer 
      viewer={viewer} 
      map={map} 
      on:enterShape={onEnterShape} 
      on:leaveShape={onLeaveShape} />

    {#if hovered}
      <LunaPopup 
        viewer={viewer}
        shape={hovered.shape}
        user={{ id: 'dumy', name: 'dummy '}}
        offsetX={hovered.originalEvent.offsetX}
        offsetY={hovered.originalEvent.offsetY} 
        viewportPoint={hovered.viewportPoint} />
    {/if}
      
  </WMTSTileSource>

</OSDViewer>

<LunaAuth
  loginUrl="https://clone.davidrumsey.com/luna/servlet/login?origin=http://127.0.0.1:5173/public/auth_callback.html"
  tokenUrl="https://clone.davidrumsey.com/luna/servlet/token?messageId=1&origin=https://127.0.0.1:5173" />