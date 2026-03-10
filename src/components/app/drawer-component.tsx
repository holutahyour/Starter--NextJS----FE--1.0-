"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/sdcn-drawer";
import { Button } from "@/components/ui/sdcn-button";

interface DrawerComponentProps {
  drawerTrigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
  isOpen?: boolean;
  onClose?: () => void;
  cancelQueryKey?: string;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({
  drawerTrigger,
  children,
  title,
  description,
  isOpen,
  onClose,
  cancelQueryKey,
}) => {
  return (
    <Drawer
      direction="right"
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
      }}
    >
      <DrawerTrigger asChild>{drawerTrigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="p-4">
            {children}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
