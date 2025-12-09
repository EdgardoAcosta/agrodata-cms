import { updateProduct } from '../../utils/cmsRepo'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody<
    Partial<{
      name: string
      slug: string
      description: string
      shortDescription: string
      price: number
      currency: string
      inStock: boolean
      featured: boolean
      image: string
      categoryIds: number[]
      labelIds: number[]
    }>
  >(event)

  const updated = updateProduct(id, body)
  return { data: updated }
})
