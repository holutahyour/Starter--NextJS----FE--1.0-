"use client";

import React, { useEffect, useState } from "react";
import { Control, Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  VStack,
  Input,
  Textarea,
  Separator,
  Heading,
  For,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/chakra-field";
import AppDrawer from "@/components/app/app-drawer";
import { toaster } from "@/components/ui/chakra-toaster";
import {
  erpSettingSchema,
  ErpSettingsValues,
} from "@/data/schema/erp-settings";
import { useQuery } from "@/hooks/use-query";
import { APP_DEFAULT_PAGE, APP_DRAWER, APP_ERP_SETTINGS_DIALOG } from "@/lib/routes";
import { useModifyQuery } from "@/hooks/use-modify-query";
import apiHandler from "@/data/api/ApiHandler";
import { IErpSettings } from "@/data/interface/IErpSettings";
import { Label } from "@/components/ui/sdcn-label";
import { usePathname } from "next/navigation";

const ErpSettingsForm = ({ erpSetting }: { erpSetting?: IErpSettings }) => {
  const [erpDefaultSettings, setErpDefaultSettings] = useState<any[] | null>(
    []
  );
      const pathName = usePathname();
  
  const { router, searchParams, open } = useQuery(APP_DRAWER, "true");

  const redirectUri = useModifyQuery(null, searchParams, [
    { key: APP_DRAWER, value: "true" },
  ]);
      const cancelDialogUrl = useModifyQuery(
        null,
        searchParams,
        [{ key: APP_ERP_SETTINGS_DIALOG, value: "true" }],
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
  } = useForm<ErpSettingsValues>({
    resolver: zodResolver(erpSettingSchema),
    defaultValues: {
      name: "",
      baseUrl: "",
      description: "",
    },
  });

 const onSubmit = handleSubmit(async (values) => {
   const id = erpSetting?.id ?? 0;
   const updated = {
     ...erpSetting,
     name: values.name,
     baseUrl: values.baseUrl,
     description: values.description,
   };

   const promise = apiHandler.erpSettings.update(id, updated);

   toaster.promise(promise, {
     loading: { title: "Updating...", description: "Please wait" },
     success: (response: any) => {
       const { message } = response;
       discardChange();
       return message;
     },
     error: (error: any) => {
       return error.message || "Something went wrong with the update";
     },
   });

   return promise;
 });


  useEffect(() => {
    if (erpSetting) {
      apiHandler.erpSettings
        .defaultSettings(erpSetting.code as string)
        .then((d) => {
          setErpDefaultSettings(d?.content);
        });
      reset({
        name: erpSetting.name,
        baseUrl: erpSetting.baseUrl,
        description: erpSetting.description,
      });
    }
  }, [erpSetting, reset]);

  return (
    <AppDrawer
      title={`${!erpSetting ? "Create " : ""}Erp Settings`}
      placement="end"
      size="md"
      open={open}
      redirectUri={redirectUri}
      cancelQueryKey={APP_ERP_SETTINGS_DIALOG}
      onSubmit={onSubmit}
      hasFooter
    >
      <VStack gap={6} align="stretch">
        <Field
          required
          label="Name"
          invalid={!!errors.name}
          errorText={errors.name?.message}
          flex="1"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                disabled={field.disabled}
                name={field.name}
                value={field.value || ""} // Ensure value is never undefined
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Field>
        <Field
          required
          label="Base URL"
          invalid={!!errors.baseUrl}
          errorText={errors.baseUrl?.message}
          flex="1"
        >
          <Controller
            name="baseUrl"
            control={control}
            render={({ field }) => (
              <Textarea
                disabled={field.disabled}
                name={field.name}
                value={field.value || ""} // Ensure value is never undefined
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Field>
        <Field label="Description" flex="1">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                disabled={field.disabled}
                name={field.name}
                value={field.value || ""} // Ensure value is never undefined
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Field>
        {erpDefaultSettings?.length !== 0 && (
          <>
            <Separator />
            <Heading size="md" fontWeight="semibold">
              Default Settings
            </Heading>
            {Array.isArray(erpDefaultSettings) &&
              erpDefaultSettings.map((setting, index) => (
                <React.Fragment key={index}>
                  <Field label={setting.key} flex="1">
                    <Input
                      placeholder=""
                      defaultValue={setting.value}
                      //onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </Field>
                  <Label>{setting.key}</Label>
                  <Input
                    placeholder=""
                    defaultValue={setting.value}
                    //onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </React.Fragment>
              ))}
          </>
        )}
      </VStack>
    </AppDrawer>
  );
};

export default ErpSettingsForm;
