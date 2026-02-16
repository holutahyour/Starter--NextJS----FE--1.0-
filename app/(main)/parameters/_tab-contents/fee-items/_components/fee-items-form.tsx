"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VStack,
  Input,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { Field } from "@/components/ui/chakra-field";
import AppDrawer from "@/components/app/app-drawer";
import { toaster } from "@/components/ui/chakra-toaster";
import { useQuery } from "@/hooks/use-query";
import { APP_DRAWER, APP_FEE_ITEM_DIALOG } from "@/lib/routes";
import { useModifyQuery } from "@/hooks/use-modify-query";
import apiHandler from "@/data/api/ApiHandler";
import { IFeeItem } from "@/data/interface/IFeeItem";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { IFeeCategory } from "@/data/interface/IFeeCategory";

const feeItemSchema = z.object({
  feeItemName: z.string().min(1, { message: "Fee name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  feeCategoryCode: z.string().min(1, { message: "Fee category code is required" }),
  description: z.string(),
  reOccurrent: z.boolean().optional(),
  code: z.string(),
  feeItemCode: z.string(),
  feeItemCounter: z.string(),
});

type FeeItemValues = z.infer<typeof feeItemSchema>;

const FeeItemForm = ({ feeItem }: { feeItem?: IFeeItem }) => {
  const pathName = usePathname();
  const { router, searchParams, open } = useQuery(APP_DRAWER, "true");
  const [feeCategories, setFeeCategories] = useState<IFeeCategory[]>([]);

  const redirectUri = useModifyQuery(null, searchParams, [
    { key: APP_DRAWER, value: "true" },
  ]);
  const cancelDialogUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_FEE_ITEM_DIALOG, value: "true" }],
    "set"
  );
  const discardChange = () => {
    router.push(pathName.split("?")[0]);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeeItemValues>({
    resolver: zodResolver(feeItemSchema),
    defaultValues: {
      feeItemName: "",
      accountNumber: "",
      feeCategoryCode: "",
      description: "",
      reOccurrent: false,
      code: "",
      feeItemCode: "",
      feeItemCounter: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const id = feeItem?.id ?? 0;
    const updated = {
      ...feeItem,
      ...values,
    };

    const promise = apiHandler.feeItem
      .update(id, updated)
      .then((response) => {
        const { message, isSuccess, hasError, errorMessage } = response as any;

        if (isSuccess && hasError === false) {
          toaster.success({
            title: "Successfully updated",
            description: message,
          });
          discardChange();
        }

        if (hasError) {
          toaster.error({
            title: "Failed to update",
            description: errorMessage || "Something went wrong with the update",
          });
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
        const errorMessage =
          error.response?.data?.value?.errorMessage ||
          error.message ||
          "Something went wrong with the update";
        toaster.error({
          title: "Failed to update",
          description: errorMessage,
        });
      });

    toaster.promise(promise, {
      loading: { title: "Updating...", description: "Please wait" },
    });
  });

  useEffect(() => {
    if (feeItem) {
      reset({
        feeItemName: feeItem.feeItemName,
        accountNumber: feeItem.accountNumber,
        feeCategoryCode: feeItem.feeCategoryCode,
        description: feeItem.description,
        reOccurrent: feeItem.reOccurrent,
        code: feeItem.code,
        feeItemCode: feeItem.feeItemCode,
        feeItemCounter: feeItem.feeItemCounter,
      });
    }
  }, [feeItem, reset]);

  useEffect(() => {
    const fetchFeeCategories = async () => {
      try {
        const response = await apiHandler.feeCategory.list();
        if (response.content) {
          setFeeCategories(response.content);
        }
      } catch (error) {
        console.error("Failed to fetch fee categories", error);
      }
    };

    fetchFeeCategories();
  }, []);

  return (
    <AppDrawer
      title={`${!feeItem ? "Create " : "Edit "}Fee Item`}
      placement="end"
      size="md"
      open={open}
      redirectUri={redirectUri}
      cancelQueryKey={APP_FEE_ITEM_DIALOG}
      onSubmit={onSubmit}
      hasFooter
    >
      <VStack gap={6} align="stretch">
        <Field
          required
          label="Fee Name"
          invalid={!!errors.feeItemName}
          errorText={errors.feeItemName?.message}
          flex="1"
        >
          <Controller
            name="feeItemName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
        <Field
          required
          label="Revenue Account Number"
          invalid={!!errors.accountNumber}
          errorText={errors.accountNumber?.message}
          flex="1"
        >
          <Controller
            name="accountNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
        {/* <Field
          required
          label="Fee Category Code"
          invalid={!!errors.feeCategoryCode}
          errorText={errors.feeCategoryCode?.message}
          flex="1"
        >
          <Controller
            name="feeCategoryCode"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select Fee Category">
                {feeCategories.map((category) => (
                  <option key={category.code} value={category.code}>
                    {category.itemName}
                  </option>
                ))}
              </Select>
            )}
          />
        </Field> */}
        <Field label="Description" flex="1">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
        {/* <Field label="Re-occurrent" flex="1">
          <Controller
            name="reOccurrent"
            control={control}
            render={({ field }) => (
              <Checkbox
                isChecked={field.value}
                onChange={field.onChange}
              >
                Re-occurrent
              </Checkbox>
            )}
          />
        </Field> */}
        <Field label="Code" flex="1">
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
        <Field label="Fee Item Code" flex="1">
          <Controller
            name="feeItemCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
        <Field label="Fee Item Counter" flex="1">
          <Controller
            name="feeItemCounter"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Field>
      </VStack>
    </AppDrawer>
  );
};

export default FeeItemForm;
