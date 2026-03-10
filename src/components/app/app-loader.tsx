import { Box, Heading, Spinner, VStack } from "@chakra-ui/react";

function AppLoader({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const borderSize = (size === 'lg') ? '4px' : (size === 'sm') ? '2px' : '4px'
  const headingSize = (size === 'lg') ? '2xl' : (size === 'sm') ? 'md' : '2xl'
  return (
    <Box display='flex' className="h-full justify-center items-center">
      <VStack>
        <Spinner className="text-primary-100" borderWidth={borderSize} size={size} />
        <Heading size={headingSize} color="text-primary-100">Loading...</Heading>
      </VStack>
    </Box>
    );
}

export default AppLoader;
