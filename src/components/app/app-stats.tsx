import { HStack, Icon, Stack, Stat } from "@chakra-ui/react";
import { LuDollarSign } from "react-icons/lu";
interface AppStatsProps {
    title: string,
    icon: any,
    value: any,
}
function AppStats({ title, icon, value }: AppStatsProps) {
    return (
        <Stat.Root minW="240px" maxW="240px" borderWidth="1px" p="4" rounded="md">
            <HStack justify="space-between">
                <Stat.Label textWrap='nowrap'>{title ?? 'Title'}</Stat.Label>
                {icon ?? <Icon color="fg.muted">
                    <LuDollarSign />
                </Icon>}
            </HStack>
            <Stat.ValueText>{value ?? '$0k'}</Stat.ValueText>
        </Stat.Root>
    )
}

export default AppStats