import { updateLabel } from '../../utils/cmsRepo'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody<Partial<{ name: string; description: string }>>(event)
  const updated = updateLabel(id, body)
  return { data: updated }
})
