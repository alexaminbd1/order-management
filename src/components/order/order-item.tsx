import React from "react"
import { ICart } from "./order-create"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"

export default function OrderItem({
  cart,
  removeCard,
}: {
  cart: ICart
  removeCard: React.Dispatch<React.SetStateAction<ICart[]>>
}) {
  const { price, profit, quantity, title, id } = cart
  const removeFromCart = (id: number) => {
    removeCard((prev) => prev.filter((item) => item.id !== id))
  }
  return (
    <div className="p-3">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">{title}</h4>
          <p className="text-sm text-muted-foreground">
            Total Quantity - {quantity}
          </p>
        </div>
        <Trash2
          size={28}
          onClick={() => removeFromCart(id)}
          className="cursor-pointer"
        />
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <h3>Sell - {cart.sell}</h3>
        <Separator orientation="vertical" />
        <div>Const - {price * quantity}</div>
        <Separator orientation="vertical" />
        <div>Profit - {profit}</div>
      </div>
    </div>
  )
}
