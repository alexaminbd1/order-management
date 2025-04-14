"use client"

import EditProduct from "@/components/product/edit-product"
import { productType } from "@/lib/schema/products-schema"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "lucide-react"

interface Idata {
  message: string
  details: productType
}

const getData = async (id: number): Promise<Idata> => {
  const data = await axios.get(`/api/v1/products/${id}`)
  return data.data
}

export default function ProductEditIndex({ id }: { id: number }) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getData(id),
  })
  return isLoading ? (
    <>
      <div className="h-screen flex justify-center items-center">
        <Loader size={48} className="animate-spin" />
      </div>
    </>
  ) : isError ? (
    <>Getting error</>
  ) : data?.details ? (
    <EditProduct id={Number(id)} details={data?.details} />
  ) : (
    <h2>Some thing is Getting error ...</h2>
  )
}
