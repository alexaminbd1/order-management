"use client"

import EditUser from "@/components/user/edit-user"
import { updateUserType } from "@/lib/schema/users-schema"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "lucide-react"

interface Idata {
  message: string
  details: updateUserType
}

const getData = async (id: string): Promise<Idata> => {
  const data = await axios.get(`/api/v1/user/edit/${id}`)
  return data.data
}

export default function UserEditIndex({ id }: { id: string }) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["users", id],
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
    <EditUser id={id} details={data.details} />
  ) : (
    <h2>Some thing is Getting error ...</h2>
  )
}
