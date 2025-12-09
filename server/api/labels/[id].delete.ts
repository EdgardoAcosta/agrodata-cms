import { deleteLabel } from '../../utils/cmsRepo'

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  deleteLabel(id)
  return { data: { ok: true } }
})
