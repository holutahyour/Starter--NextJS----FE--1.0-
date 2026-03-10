'use client'
import { Box, For, Span, Tabs } from "@chakra-ui/react";
import { LucideProps } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

function AppTabs({ tabs, defaultValue, route }: {
    tabs: {
        label: string;
        value: string;
        Icon: React.ElementType<LucideProps> | ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
        content: React.ReactNode
    }[],
    route: string,
    defaultValue: string
}) {
    const SEARCH_PARAM = 'tab'
    const router = useRouter();
    const searchParams = useSearchParams()
    const searchParamValue = searchParams.get(SEARCH_PARAM)

   const currentTab = searchParamValue ?? defaultValue

    return (
        <Tabs.Root value={currentTab} variant='line'>
            <Box className="custom-scrollbar p-1 w-full" overflow='auto'>
                <Tabs.List minW='fit-content' w='full'>
                    <For each={tabs}>
                        {(tab, index) => (
                            <Tabs.Trigger onClick={() => router.push(`${route}?tab=${tab.value}`)} key={index} value={tab.value}>
                                <tab.Icon />
                                <Span textWrap='nowrap'>{tab.label}</Span>
                            </Tabs.Trigger>
                        )}
                    </For>
                </Tabs.List>
            </Box>
            <For each={tabs}>
                {({ value, content }, index) => (
                    <Tabs.Content key={index} value={value}>
                        {currentTab === value && content}
                    </Tabs.Content>
                )}
            </For>
        </Tabs.Root>
    )
}

export default AppTabs