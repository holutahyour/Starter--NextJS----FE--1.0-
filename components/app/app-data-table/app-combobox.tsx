"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

interface AppComboboxProps {
  label: string
  data: { label: string; value: string }[]
  size?: "xs" | "sm" | "md" | "lg"
  value: string
  onChange: (value: string) => void
  placeholder?: string
   isDisabled?: boolean
}

export function AppCombobox({ 
  label, 
  data, 
  size = "sm",
  value,
  onChange,
  placeholder
}: AppComboboxProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: data,
    filter: contains,
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      filter("")
    }
  }, [isOpen, filter])

  return (
    <Combobox.Root
      collection={collection}
      openOnClick
      size={size}
      value={value ? [value] : []}
      onOpenChange={(details) => setIsOpen(details.open)}
      onInputValueChange={(e) => {
        if (e.inputValue && e.inputValue.length > 0) {
          filter(e.inputValue)
        } else {
          filter("")
        }
      }}
      onValueChange={({ value }) => {
        if (Array.isArray(value)) {
          onChange(value[0] || "")
        } else {
          onChange(value || "")
        }
      }}
    >
      <Combobox.Control>
        <Combobox.Input placeholder={placeholder || "Type to search"} />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            {collection.items.length === 0
              ? data.map((item) => (
                  <Combobox.Item item={item} key={item.value}>
                    {item.label}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))
              : collection.items.map((item) => (
                  <Combobox.Item item={item} key={item.value}>
                    {item.label}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}