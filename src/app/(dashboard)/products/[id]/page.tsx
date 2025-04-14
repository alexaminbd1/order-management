import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <h1>This my single product edit page id is {id}</h1>
}
