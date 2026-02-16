import PageLayout from "../_components/page-layout";
interface PageLayoutProps extends React.PropsWithChildren<{}> {}


export default function MainLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageLayout>
          {children}
      </PageLayout>
    </>
  );
}





