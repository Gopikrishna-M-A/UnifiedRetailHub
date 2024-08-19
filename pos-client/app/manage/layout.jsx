import ManagementLayout from "@/components/ManagementLayout";

export const metadata = {
  title: "POS Billing System",
  description: "An efficient Point of Sale (POS) billing system for managing transactions and inventory.",
};

export default function ManageLayout({ children }) {
  return (
    <ManagementLayout>
        { children }
    </ManagementLayout>
  );
}
