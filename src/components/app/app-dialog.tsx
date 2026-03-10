'use client'
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/chakra-dialog"
import { useQuery } from "@/hooks/use-query"
import { useModifyQuery } from "@/hooks/use-modify-query"
import { APP_CANCEL_DIALOG, APP_DEFAULT_PAGE } from "@/lib/routes"
import { Button, ConditionalValue, DialogContentProps } from "@chakra-ui/react"
import { useParams } from "next/navigation"

interface AppDialogProps extends DialogContentProps {
    trigger?: React.ReactNode,
    title?: string,
    body?: React.ReactNode,
    size?: "sm" | "md" | "lg" | "xl" | "xs" | "full" | undefined,
    placement?: ConditionalValue<"bottom" | "top" | "center" | undefined>
    onSubmit?: ((e?: React.BaseSyntheticEvent) => Promise<void>) | (() => void),
    isDiscardChange?: boolean,
    onDiscardChange?: () => void
    open?: boolean,
    redirectUri?: string,
    hasFooter?: boolean
    asCancel?: boolean
    cancelQueries: { key: string, value: string }[]
}

function AppDialog({ trigger, title, body, size = 'sm', children, placement, onSubmit, isDiscardChange, onDiscardChange, open, redirectUri, hasFooter = true, asCancel, cancelQueries, ...rest }: AppDialogProps) {
    const { user_id } = useParams();
    const { router, searchParams, open: cancelOpen } = useQuery(APP_CANCEL_DIALOG, 'true')
    const cancelRedirectUrl = useModifyQuery(null, searchParams, [{ key: APP_CANCEL_DIALOG }]);
    const cancelDialogUrl = useModifyQuery(null, searchParams, cancelQueries, 'set');

    const handleClose = () => {
        router.push(redirectUri ?? APP_DEFAULT_PAGE());
    };

    return (
        <DialogRoot
            lazyMount
            open={open}
            placement={placement}
            // onOpenChange={handleClose}
            motionPreset="slide-in-bottom"
            size={size}
        >
            {trigger && (<DialogTrigger asChild>
                {trigger ?? <Button>Open</Button>}
            </DialogTrigger>)}

            <DialogContent className="pb-4" {...rest}>
                {title && <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>}
                <DialogBody >
                    {body ?? children}
                </DialogBody>
                {hasFooter && (
                    <DialogFooter>
                        {asCancel && <Button onClick={() => router.push(cancelDialogUrl)} variant="outline">Cancel</Button>}
                        {asCancel ? (<AppDialog
                            title="Are you sure you want to leave the page?"
                            body="You can save your changes, discard your changes, or cancel to continue editing."
                            onSubmit={onSubmit}
                            open={cancelOpen}
                            isDiscardChange
                            onDiscardChange={handleClose}
                            placement='center'
                            redirectUri={cancelRedirectUrl}
                            asCancel={false}
                            cancelQueries={[]}
                        />) : <Button variant="outline" onClick={handleClose}>Cancel</Button>}
                        {isDiscardChange && <Button color='fg.error' borderColor='border.error' variant='outline' onClick={onDiscardChange}>Discard Changes</Button>}
                        <Button bg='fg.success' color='fg.inverted' className="" onClick={(e) => {
                            if (onSubmit) onSubmit(e)
                            if (onDiscardChange) onDiscardChange()
                        }}>Save Changes</Button>
                    </DialogFooter>
                )}
                <DialogCloseTrigger onClick={handleClose} />
            </DialogContent>
        </DialogRoot>
    )
}

export default AppDialog