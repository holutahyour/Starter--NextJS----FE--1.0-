import { Heading, HStack } from "@chakra-ui/react"
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

function AppPageHeader({ title, Icon }: {
    title: string, Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}) {
    return (
        <HStack justify='space-between' mx='4'>
            <HStack>
                <Icon />
                <Heading className="capitalize" size="xl" fontWeight='bolder'>{title}</Heading>
            </HStack>

        </HStack>
    )
}

export default AppPageHeader