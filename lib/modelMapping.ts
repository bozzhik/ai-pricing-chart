export const modelToId: {[key: string]: string} = {
  'Gemini 2.0 Flash-Lite': 'gem2fl',
  'Mistral 3.1 Small': 'mis3s',
  'Gemini 2.0 Flash': 'gem2f',
  'ChatGPT 4.1-nano': 'gpt4n',
  'DeepSeek v3 (old)': 'deep3o',
  'ChatGPT 4o-mini': 'gpt4om',
  'DeepSeek v3': 'deep3',
  'Grok 3-mini': 'grok3m',
  'ChatGPT 4.1-mini': 'gpt41m',
  'DeepSeek r1': 'deepr1',
  'ChatGPT o3-mini': 'gpto3m',
  'Gemini 2.5 Pro': 'gem25p',
  'ChatGPT 4.1': 'gpt41',
  'ChatGPT 4o': 'gpt4o',
  'Claude 3.5 Sonnet': 'clau35',
  'Grok 3': 'grok3',
  'ChatGPT o1': 'gpto1',
  'ChatGPT 4.5': 'gpt45',
  'O1 Pro': 'o1pro',
}

export const idToModel: {[key: string]: string} = Object.entries(modelToId).reduce(
  (acc, [model, id]) => ({
    ...acc,
    [id]: model,
  }),
  {},
)

export const encodeModels = (models: string[]): string => {
  // Use custom separator instead of comma
  return models.map((model) => modelToId[model] || model).join('-')
}

export const decodeModels = (encoded: string): string[] => {
  // Split by the same custom separator
  return encoded.split('-').map((id) => idToModel[id] || id)
}
