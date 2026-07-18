import { ShoppingBagRemoveIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useIsMobile } from "@/hooks/use-mobile"

import { Controls } from "./controls"
import { Button } from "./ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty"

export default function Header() {
  const isMobile = useIsMobile()
  return (
    <header className="absolute z-10 flex w-full max-w-5xl items-center justify-between gap-4 p-4">
      <Link href={"/"}>
        <Image
          alt=""
          width={200}
          height={200}
          src="/hex-logo.svg"
          fetchPriority="high"
          loading="eager"
          className="h-20 invert dark:invert-0"
        />
      </Link>
      <NavigationMenu align="center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem href="/docs" title="DROPS">
                  Limited time drops
                </ListItem>
                <ListItem href="/docs/installation" title="SHOP">
                  Our shop
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Info</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem href="/info/faq" title="FAQ">
                  Frequently Asked Questions
                </ListItem>
                <ListItem href="/info/privacy" title="Privacy Policy">
                  See our Privacy Policy
                </ListItem>
                <ListItem href="/info/support" title="Support">
                  See our Support page
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <Drawer
            showSwipeHandle={isMobile}
            swipeDirection={isMobile ? "down" : "right"}
          >
            <NavigationMenuItem>
              <NavigationMenuLink
                render={
                  <DrawerTrigger className={navigationMenuTriggerStyle()} />
                }
              >
                Cart
              </NavigationMenuLink>
            </NavigationMenuItem>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Pick a delivery time</DrawerTitle>
                <DrawerDescription>
                  We&apos;ll prepare your order as soon as possible.
                </DrawerDescription>
              </DrawerHeader>
              <div className="scroll-fade flex-1 overflow-y-auto p-4">
                <Empty className="bg-secondary">
                  <EmptyHeader>
                    <EmptyMedia variant="default">
                      <HugeiconsIcon icon={ShoppingBagRemoveIcon} />
                    </EmptyMedia>
                    <EmptyTitle>No items yet</EmptyTitle>
                    <EmptyDescription>Your cart is empty.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <DrawerClose render={<Button>Continue Shopping</Button>} />
                  </EmptyContent>
                </Empty>
              </div>
              <DrawerFooter>
                <DrawerClose
                  render={<Button variant="outline">Cancel</Button>}
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </NavigationMenuList>
      </NavigationMenu>
      <Controls />
    </header>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  )
}
