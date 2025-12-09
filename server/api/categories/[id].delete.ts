import { deleteCategory } from '../../utils/cmsRepo'

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  deleteCategory(id)
  return { data: { ok: true } }
})
