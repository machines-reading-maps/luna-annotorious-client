<script type="ts">
  import { Hover, Selection, Store } from '@/core/state';
  import { parseW3C } from '@/formats/w3c';
  import { LunaPopup } from '@/luna';
  import { 
    OSDViewer, 
    WMTSTileSource,
    WMTSPixiAnnotationLayer, 
    WMTSSVGDrawingLayer 
  } from '@/core/openseadragon';

  const osdConfig = {
    gestureSettingsTouch: {
      pinchRotate: true
    }
  }

  const wmtsUrl = 'https://geo.nls.uk/mapdata3/os/25_inch/edinburgh_west/wmts.xml';

  fetch('/hgnswtqypvcrtl.json').then(res => res.json()).then(data => {
    Store.set(parseW3C(data, true).parsed);
  });
</script>

<OSDViewer class="viewer" config={osdConfig} let:viewer={viewer}>

  <WMTSTileSource viewer={viewer} url={wmtsUrl} let:map={map}>

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