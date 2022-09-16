<script type="ts">
  import LunaPopup from '@/luna/popup/LunaPopup.svelte';
  import { OSDViewer, OSDSVGDrawingLayer, WMTSPixiAnnotationLayer, WMTSTileSource }  from '@/openseadragon';
  import { parseW3C } from '@/formats/w3c';
  import { Store } from '@/state';

  let hovered: any;

  let selected: any;

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
  });

  const onEnterShape = ({ detail }) => hovered = detail;

  const onLeaveShape = () => hovered = null;
</script>

<OSDViewer class="viewer" config={config} let:viewer={viewer}>

  <WMTSTileSource viewer={viewer} url={url} let:map={map}>

    <WMTSPixiAnnotationLayer 
      viewer={viewer} 
      selected={selected}
      map={map} 
      on:enterShape={onEnterShape} 
      on:leaveShape={onLeaveShape} />

    <OSDSVGDrawingLayer 
      viewer={viewer}
      selected={selected} />

    {#if hovered}
      <LunaPopup 
        viewer={viewer}
        shape={hovered.shape}
        user={{ id: 'dumy', name: 'dummy '}}
        offsetX={hovered.originalEvent.offsetX}
        offsetY={hovered.originalEvent.offsetY} 
        viewportPoint={hovered.viewportPoint} 
        on:editShape={evt => selected = evt.detail} />
    {/if}
      
  </WMTSTileSource>

</OSDViewer>