// app/(dashboard)/layout.tsx

const DashboardLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav>Dashboard</nav>
      {children}
    </section>
  );
};

export default DashboardLayout;
