import { createLabel } from '../../utils/cmsRepo'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<{ name: string; description: string }>>(event)
  const label = createLabel(body)
  return { data: label }
})
