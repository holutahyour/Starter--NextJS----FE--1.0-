import { Button, ButtonGroup, EmptyState, VStack } from "@chakra-ui/react"
import { HiColorSwatch } from "react-icons/hi"

interface AppEmptyStateProps {
    onPrimaryButtonClick?: () => void,
    onSecondaryButtonClick?: () => void,
    primaryButtonText?: string,
    secondaryButtonText?: string,
    heading: string,
    description: string,

}

function AppEmptyState(
    {
        heading,
        description,
        primaryButtonText,
        secondaryButtonText,
        onPrimaryButtonClick,
        onSecondaryButtonClick
    }: AppEmptyStateProps) {
    return (
        <EmptyState.Root size='lg'>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>{heading}</EmptyState.Title>
                    <EmptyState.Description>
                        {description}
                    </EmptyState.Description>
                </VStack>
                {(onPrimaryButtonClick || onSecondaryButtonClick) && (<ButtonGroup>
                    {onPrimaryButtonClick && <Button onClick={onPrimaryButtonClick}>{primaryButtonText}</Button>}
                    {onSecondaryButtonClick && <Button onClick={onSecondaryButtonClick} variant="outline">{secondaryButtonText}</Button>}
                </ButtonGroup>)}
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default AppEmptyState