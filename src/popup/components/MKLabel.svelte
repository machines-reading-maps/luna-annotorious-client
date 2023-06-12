<script type="ts">
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import FaSolidRobot from 'svelte-icons-pack/fa/FaSolidRobot';
  import type { Transcription } from '../utils';
  import type { LunaPluginOpts } from '../../LunaPluginOpts';

  const DEFAULT_MODEL_TABLE = [{
    creatorName: 'mapKurator:ocr',
    displayLabel: 'mapKurator',
    displayTooltip: 'mapKurator AI text recognition model'
  }, {
    creatorName: 'mapKurator:post-ocr-correction',
    displayLabel: 'mapKurator+',
    displayTooltipo: 'mapKurator AI text recognition model with Post-OCR correction'
  }];

  export let opts: LunaPluginOpts;

  export let transcription: Transcription;

  const models = opts.models ? [
    ...opts.models,
    ...DEFAULT_MODEL_TABLE.filter(info => !opts.models.find(i => i.creatorName === info.creatorName))
  ] : DEFAULT_MODEL_TABLE;

  $: model = models.find(i => i.creatorName === transcription.creator.name);

  $: console.log(transcription, 'got', model);

  const onClick = () => {

  }
</script>

<Icon src={FaSolidRobot} /> <a class="model-info" href={'#'} on:click={onClick}>{model?.displayLabel || transcription.creator.name}</a>

<style>
  a.model-info {
    color: var(--darkgrey-font);
    text-decoration: none;
    border-bottom: 1px dashed var(--darkgrey-font);;
  }
</style>