import { deleteProduct } from '../../utils/cmsRepo'

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  deleteProduct(id)
  return { data: { ok: true } }
})
