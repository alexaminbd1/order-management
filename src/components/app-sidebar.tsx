"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Gauge,
  Landmark,
  PackageSearch,
  ShoppingBasket,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const data = {
    user: {
      name: session?.user?.name as string,
      email: session?.user?.phone as string,
      avatar: "/shikder-seeds-logo.jpg",
    },
    teams: [
      {
        name: "Sikder Seeds",
        logo: GalleryVerticalEnd,
        plan: "shikderseeds@gmail.com",
      },
      {
        name: "Faysal Molla",
        logo: GalleryVerticalEnd,
        plan: "shikderseeds@gmail.com",
      },
    ],
    navMain: [
      {
        title: "Users",
        url: "#",
        icon: Users,
        isActive: true,
        items:
          session?.user?.role === "ADMIN"
            ? [
                {
                  title: "All Users",
                  url: "/users",
                },
                {
                  title: "Create User",
                  url: "/create-user",
                },
              ]
            : [],
      },
      {
        title: "Products",
        url: "#",
        icon: PackageSearch,
        items:
          session?.user?.role === "ADMIN"
            ? [
                {
                  title: "All Products",
                  url: "/products",
                },
                {
                  title: "Create Products",
                  url: "/create-product",
                },
              ]
            : [],
      },
      {
        title: "Order",
        url: "#",
        icon: ShoppingBasket,
        items: [
          {
            title: "Create Order",
            url: "/create-order",
          },
          {
            title: "All Orders",
            url: "/orders",
          },
        ],
      },
      {
        title: "Withdrawals",
        url: "#",
        icon: Landmark,
        items: [
          {
            title: "All Payout Requests",
            url: "/payout-requests",
          },
          {
            title: "Approve Requests",
            url: "/payout-requests?status=APPROVE",
          },
          {
            title: "Reject Request",
            url: "/payout-requests?status=REJECT",
          },
        ],
      },
      // {
      //   title: "Tickets",
      //   url: "#",
      //   icon: Ticket,
      //   items: [
      //     {
      //       title: "All Tickets",
      //       url: "/tickets",
      //     },
      //     {
      //       title: "Pending Tickets",
      //       url: "/pending-tickets",
      //     },
      //     {
      //       title: "Answer Tickets",
      //       url: "/answer-tickets",
      //     },
      //     {
      //       title: "Closed Tickets",
      //       url: "/closed-tickets",
      //     },
      //   ],
      // },
    ],
    projects: [
      {
        name: "Report",
        url: "/dashboard",
        icon: Gauge,
      },
      // {
      //   name: "Courier",
      //   url: "/courier",
      //   icon: Package,
      // },
      // {
      //   name: "Transaction",
      //   url: "/transaction",
      //   icon: ArrowLeftRight,
      // },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
