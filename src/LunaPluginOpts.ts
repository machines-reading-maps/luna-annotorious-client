export interface LunaPluginOpts {

  readOnly?: boolean

  crowdsourcePrompt?: string

  deletePromptHeading?: string

  deletePromptText?: string

  models?: ModelInfo[];

}

export interface ModelInfo {

  creatorName: string;

  displayLabel: string;

  displayTooltip: string

}
