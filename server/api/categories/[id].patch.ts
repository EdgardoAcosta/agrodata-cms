import { updateCategory } from '../../utils/cmsRepo'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody<Partial<{ name: string; description: string }>>(event)
  const updated = updateCategory(id, body)
  return { data: updated }
})
