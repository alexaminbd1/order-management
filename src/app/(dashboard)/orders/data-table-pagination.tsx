import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DataTablePagination({
  setPagination,
  pagination,
  totalOrder,
}: {
  totalOrder: number
  pagination: { pageIndex: number; pageSize: number }
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >
}) {
  return (
    <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0">
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>

          <Select
            value={pagination.pageSize.toLocaleString()}
            onValueChange={(value) => {
              setPagination({
                pageIndex: pagination.pageIndex,
                pageSize: Number(value),
              })
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[50, 100, 150, 200, 300].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {pagination.pageIndex + 1} of{" "}
          {Math.round(totalOrder / pagination.pageSize)}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              })
            }
            disabled={pagination.pageIndex >= 0 ? false : true}
          >
            <span className="sr-only">Go to first page</span>

            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={pagination.pageIndex >= 0 ? false : true}
          >
            <span className="sr-only">Go to previous page</span>

            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.pageIndex >
              Math.round(totalOrder / pagination.pageSize)
                ? true
                : false
            }
          >
            <span className="sr-only">Go to next page</span>

            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                pageIndex: Math.round(totalOrder / pagination.pageSize),
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.pageIndex >
              Math.round(totalOrder / pagination.pageSize)
                ? true
                : false
            }
          >
            <span className="sr-only">Go to last page</span>

            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
