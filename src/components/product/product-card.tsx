import { Info, ShoppingBag } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { ICart } from "../order/order-create"
import Image from "next/image"

interface IProductCart {
  id: number
  image: string | null
  price: number
  suggestPrice: number | 1
  maxPrice?: number | 1
  title: string
  about?: string
  tag: string
  setCart: React.Dispatch<React.SetStateAction<ICart[]>>
}

export default function ProductCard({
  id,
  price,
  tag,
  title,
  about,
  maxPrice,
  suggestPrice,
  setCart,
  image
}: IProductCart) {
  const [quantity, setQuantity] = useState<number>(1)
  const [sellPrice, setSellPrice] = useState<number>(suggestPrice)

  const onClickHandler = () => {
    if (maxPrice && maxPrice < sellPrice / quantity) {
      toast(
        `The price of the ${quantity} products you selected is too high at ${
          maxPrice * quantity
        } taka. You should set it at less than ${maxPrice * quantity}.`,
        { type: "warning" }
      )
      return
    }
    if (price > sellPrice / quantity) {
      toast(
        `The price of the ${quantity} products you selected is too low at ${
          quantity * sellPrice
        } taka. You should set it at more than ${price * quantity}.`,
        { type: "warning" }
      )
      return
    }
    setCart((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === id)
      if (itemIndex !== -1) {
        // If the item exists, update it
        const updatedItems = [...prevItems]
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          id,
          price,
          profit: sellPrice - price * quantity,
          quantity,
          sell: sellPrice,
          title,
        }
        return updatedItems
      } else {
        // If the item doesn't exist, add it
        return [
          ...prevItems,
          {
            id,
            price,
            title,
            profit: sellPrice - price * quantity,
            quantity,
            sell: sellPrice,
          },
        ]
      }
    })
    toast("Product add success!", { type: "success" })
  }

  return (
    <AlertDialog>
      <div className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
          <Image
            className="object-cover h-[200px]"
            src={image? image : "/dome-imaeg.jpeg"}
            alt="product image"
            width={200}
            height={200}
          />
          <div className="absolute flex justify-between w-full p-2">
            <Badge className="bg-green-600">{tag}</Badge>
            <AlertDialogTrigger asChild>
              <Info />
            </AlertDialogTrigger>
          </div>

        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl tracking-tight text-slate-900">{title}</h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <h2 className="text-xl font-medium">
                PRICE : <span className="font-bold">{price} ৳</span>
              </h2>
            </div>
            <div className="flex gap-2 items-center">
              <h2 className="text-xl font-medium">
                MAX :{" "}
                <span className="font-bold">
                  {maxPrice ? `${maxPrice} ৳` : "Unlimited"}{" "}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              type="number"
              min={1}
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.valueAsNumber)
                setSellPrice(e.target.valueAsNumber * suggestPrice)
              }}
            />
            <Input
              type="number"
              placeholder="Sell price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.valueAsNumber)}
            />
          </div>
          <Button
            onClick={() => onClickHandler()}
            className="w-full my-3 hover:cursor-pointer"
          >
            <ShoppingBag />
            Add to order
          </Button>
        </div>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {about ? about : "No product data found at this time!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// 01948096182