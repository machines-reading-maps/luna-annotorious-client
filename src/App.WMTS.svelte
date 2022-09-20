<script type="ts">
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import { OSDViewer, WMTSPixiAnnotationLayer, WMTSTileSource, WMTSSVGDrawingLayer }  from '@/openseadragon';
  import { parseW3C } from '@/formats/w3c';
  import { Hover, Selection, Store } from '@/state';

  const osdConfig = {
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
  });
</script>

<OSDViewer class="viewer" config={osdConfig} let:viewer={viewer}>

  <WMTSTileSource viewer={viewer} url={url} let:map={map}>

    <WMTSPixiAnnotationLayer 
      viewer={viewer} 
      map={map} />

    <WMTSSVGDrawingLayer
      viewer={viewer}
      map={map} />

    {#if $Hover && $Selection.length === 0}
      <LunaPopup 
        viewer={viewer}
        user={{ id: 'dumy', name: 'dummy '}}
        hover={$Hover} />
    {/if}
      
  </WMTSTileSource>

</OSDViewer>