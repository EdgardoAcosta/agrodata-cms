import { getLabel } from '../../utils/cmsRepo'

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  return { data: getLabel(id) }
})
