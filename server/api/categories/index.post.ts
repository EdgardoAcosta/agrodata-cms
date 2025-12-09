import { createCategory } from '../../utils/cmsRepo'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<{ name: string; description: string }>>(event)
  const category = createCategory(body)

  return {
    data: category,
  }
})
