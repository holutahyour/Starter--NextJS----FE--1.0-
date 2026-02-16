"use client"

import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { Input, VStack } from "@chakra-ui/react"
import { Select } from "@chakra-ui/select"
import { Field } from "@/components/ui/chakra-field"
import AppDrawer from "@/components/app/app-drawer"
import { toaster } from "@/components/ui/chakra-toaster"
import { useQuery } from "@/hooks/use-query"
import { APP_MISC_FEES_DIALOG } from "@/lib/routes"
import apiHandler from "@/data/api/ApiHandler"
import { z } from "zod"
import { IFeeCategory } from "@/data/interface/IFeeCategory"

const miscellaneousFeeSchema = z.object({
  miscellaneousFeeName: z.string().min(1, "Name is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  revenueAccount: z.string().min(1, "Revenue account is required"),
  feeCategoryCode: z.string().min(1, "Fee category is required"),
  studentType: z.number().min(0, "Student type is required"),
})

type MiscellaneousFeeValues = z.infer<typeof miscellaneousFeeSchema>

const MiscellaneousFeeForm = () => {
  const pathName = usePathname()
  const { router, searchParams, open } = useQuery(APP_MISC_FEES_DIALOG, "true")

  const discardChange = () => {
    router.push(pathName.split("?")[0])
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MiscellaneousFeeValues>({
    resolver: zodResolver(miscellaneousFeeSchema),
    defaultValues: {
      feeCategoryCode: "KSYVHRNDYF",
      miscellaneousFeeName: "",
      studentType: 0,
      amount: 0,
      revenueAccount: "",
    },
  })

  useEffect(() => {
    if (!open) reset() // Reset form when drawer closes
  }, [open, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload = { ...values, feeCategoryCode: "KSYVHRNDYF" };
    const promise = apiHandler.miscellaneousFee.create(payload)
    toaster.promise(promise, {
      loading: { title: "Saving..." },
      success: () => {
        discardChange()
        router.push(pathName.split("?")[0])
        return { title: "Miscellaneous fee item created successfully" }
      },
      error: (error: any) => error.message || "Failed to create item",
    })
    return promise
  })

  return (
    <AppDrawer
      title="Create Miscellaneous Fee Item"
      placement="end"
      size="md"
      open={open}
      cancelQueryKey={APP_MISC_FEES_DIALOG}
      onSubmit={onSubmit}
      hasFooter
    >
      <VStack gap={6} align="stretch">


        <Field
          required
          label="Name"
          invalid={!!errors.miscellaneousFeeName}
          errorText={errors.miscellaneousFeeName?.message}
        >
          <Controller
            name="miscellaneousFeeName"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Field>

        <Field
          required
          label="Amount"
          invalid={!!errors.amount}
          errorText={errors.amount?.message}
        >
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            )}
          />
        </Field>

        <Field
          required
          label="Revenue Account"
          invalid={!!errors.revenueAccount}
          errorText={errors.revenueAccount?.message}
        >
          <Controller
            name="revenueAccount"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Field>

        {/* <Field
          required
          label="Student Type"
          invalid={!!errors.studentType}
          errorText={errors.studentType?.message}
        >
          <Controller
            name="studentType"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            )}
          />
        </Field> */}
      </VStack>
    </AppDrawer>
  )
}

export default MiscellaneousFeeForm